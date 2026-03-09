import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const OUTPUT_PATH = resolve(process.cwd(), 'public/spotify-playlists.json');
const ENV_PATH = resolve(process.cwd(), '.env');

async function loadDotEnv() {
  try {
    const raw = await readFile(ENV_PATH, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) {
        continue;
      }
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore missing .env and let requireEnv surface specific keys.
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }
  return value;
}

async function getUserAccessToken() {
  if (process.env.SPOTIFY_ACCESS_TOKEN) {
    return process.env.SPOTIFY_ACCESS_TOKEN;
  }

  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error('Missing SPOTIFY_ACCESS_TOKEN or SPOTIFY_REFRESH_TOKEN.');
  }

  const clientId = requireEnv('SPOTIFY_CLIENT_ID');
  const clientSecret = requireEnv('SPOTIFY_CLIENT_SECRET');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

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
    throw new Error(`Spotify refresh failed: ${text || response.status}`);
  }

  const payload = await response.json();
  return payload.access_token;
}

async function spotifyFetch(pathOrUrl, accessToken) {
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

async function getAllPages(pathOrUrl, accessToken) {
  const items = [];
  let next = pathOrUrl;

  while (next) {
    const page = await spotifyFetch(next, accessToken);
    items.push(...(page.items ?? []));
    next = page.next ?? null;
  }

  return items;
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
      durationMs: candidate.duration_ms,
      artists: Array.isArray(candidate.artists) ? candidate.artists : [],
      album: candidate.album,
      externalUrl: candidate.external_urls?.spotify,
      uri: candidate.uri,
    };
  }

  return null;
}

async function fetchPlaylistTracks(playlistId, accessToken) {
  const items = await getAllPages(`/playlists/${encodeURIComponent(playlistId)}/items?limit=100`, accessToken);
  return items.map(extractPlayableItem).filter(Boolean);
}

async function main() {
  await loadDotEnv();
  const accessToken = await getUserAccessToken();
  const userId = requireEnv('SPOTIFY_USER_ID');
  const playlists = await getAllPages('/me/playlists?limit=50', accessToken);

  const ownPublicPlaylists = playlists.filter(
    (playlist) => playlist?.owner?.id === userId && playlist?.public === true,
  );

  const snapshotPlaylists = [];
  for (const playlist of ownPublicPlaylists) {
    const tracks = await fetchPlaylistTracks(playlist.id, accessToken);
    snapshotPlaylists.push({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description ?? '',
      imageUrl: playlist.images?.[0]?.url,
      trackCount: tracks.length,
      ownerName: playlist.owner?.display_name,
      ownerId: playlist.owner?.id,
      externalUrl: playlist.external_urls?.spotify,
      tracks,
    });
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    playlists: snapshotPlaylists,
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${snapshotPlaylists.length} playlist(s) to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
