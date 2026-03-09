import type { SpotifyPlaylistSnapshot, SpotifyPlaylistTracksResult, SpotifySnapshotFile } from '../types/spotify';

async function fetchSpotifyJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  const payload = (await response.json()) as T | { error?: string };

  if (!response.ok) {
    const error = typeof payload === 'object' && payload && 'error' in payload ? payload.error : null;
    throw new Error(error || 'Spotify request failed.');
  }

  return payload as T;
}

export async function fetchSpotifySnapshot(): Promise<SpotifySnapshotFile> {
  return fetchSpotifyJson<SpotifySnapshotFile>('/spotify-playlists.json');
}

export async function fetchPublicSpotifyPlaylists(): Promise<SpotifyPlaylistSnapshot[]> {
  const payload = await fetchSpotifySnapshot();
  return payload.playlists;
}

export async function fetchPublicSpotifyPlaylistTracks(playlistId: string): Promise<SpotifyPlaylistTracksResult> {
  const snapshot = await fetchSpotifySnapshot();
  const playlist = snapshot.playlists.find((entry) => entry.id === playlistId);

  if (!playlist) {
    throw new Error('Playlist not found in cached Spotify snapshot.');
  }

  return {
    items: playlist.tracks,
    total: playlist.tracks.length,
  };
}
