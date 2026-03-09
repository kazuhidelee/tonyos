import { getPublicSpotifyPlaylistTracks, getPublicSpotifyPlaylists } from './spotify.js';

function json(status, data) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
    body: JSON.stringify(data),
  };
}

export async function handleSpotifyPlaylistsRequest() {
  try {
    const playlists = await getPublicSpotifyPlaylists();
    return json(200, { playlists });
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : 'Failed to fetch public Spotify playlists.',
    });
  }
}

export async function handleSpotifyPlaylistTracksRequest(playlistId) {
  try {
    const tracks = await getPublicSpotifyPlaylistTracks(playlistId);
    return json(200, tracks);
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : 'Failed to fetch public Spotify playlist tracks.',
    });
  }
}
