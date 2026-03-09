const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }
  return value;
}

function getSpotifyConfig() {
  return {
    clientId: requireEnv('SPOTIFY_CLIENT_ID'),
    clientSecret: requireEnv('SPOTIFY_CLIENT_SECRET'),
    userId: requireEnv('SPOTIFY_USER_ID'),
  };
}

async function fetchSpotifyToken() {
  if (cachedToken && cachedTokenExpiresAt > Date.now() + 60_000) {
    return cachedToken;
  }

  const { clientId, clientSecret } = getSpotifyConfig();
  const body = new URLSearchParams({ grant_type: 'client_credentials' });
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spotify token request failed: ${text || response.status}`);
  }

  const payload = await response.json();
  cachedToken = payload.access_token;
  cachedTokenExpiresAt = Date.now() + (payload.expires_in ?? 3600) * 1000;
  return cachedToken;
}

async function spotifyFetch(pathOrUrl) {
  const accessToken = await fetchSpotifyToken();
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${SPOTIFY_API_BASE}${pathOrUrl}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spotify API request failed: ${text || response.status}`);
  }

  return response.json();
}

async function getAllPages(pathOrUrl) {
  const items = [];
  let next = pathOrUrl;

  while (next) {
    const page = await spotifyFetch(next);
    items.push(...(page.items ?? []));
    next = page.next ?? null;
  }

  return items;
}

function mapPlaylist(playlist) {
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description ?? '',
    imageUrl: playlist.images?.[0]?.url,
    trackCount: playlist.items?.total ?? playlist.tracks?.total ?? 0,
    ownerName: playlist.owner?.display_name,
    ownerId: playlist.owner?.id,
    externalUrl: playlist.external_urls?.spotify,
    itemsHref: playlist.items?.href ?? playlist.tracks?.href,
  };
}

function extractPlayableItem(item) {
  const candidates = [item?.item, item?.track, item?.episode, item];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') {
      continue;
    }
    if (typeof candidate.name !== 'string' || typeof candidate.duration_ms !== 'number') {
      continue;
    }
    if (candidate.type === 'episode') {
      continue;
    }

    return {
      id: candidate.id ?? null,
      name: candidate.name,
      duration_ms: candidate.duration_ms,
      artists: Array.isArray(candidate.artists) ? candidate.artists : [],
      album: candidate.album,
      external_urls: candidate.external_urls,
      uri: candidate.uri,
    };
  }

  return null;
}

export async function getPublicSpotifyPlaylists() {
  const { userId } = getSpotifyConfig();
  const items = await getAllPages(`${SPOTIFY_API_BASE}/users/${encodeURIComponent(userId)}/playlists?limit=50`);
  return items.filter((playlist) => playlist?.public === true).map(mapPlaylist);
}

export async function getPublicSpotifyPlaylistTracks(playlistId) {
  let items;
  try {
    items = await getAllPages(`${SPOTIFY_API_BASE}/playlists/${encodeURIComponent(playlistId)}/items?limit=100`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('"status": 403')) {
      throw new Error('Spotify denied access to this playlist. It is likely not public.');
    }
    throw error;
  }
  const tracks = items
    .map((item) => extractPlayableItem(item))
    .filter(Boolean)
    .map((track) => ({
      id: track.id ?? track.uri ?? `${track.name}-${track.duration_ms}`,
      name: track.name,
      durationMs: track.duration_ms,
      artists: track.artists,
      album: track.album,
      externalUrl: track.external_urls?.spotify,
      uri: track.uri,
    }));

  return {
    items: tracks,
    total: tracks.length,
  };
}
