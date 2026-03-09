export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images?: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  durationMs: number;
  artists: SpotifyArtist[];
  album?: SpotifyAlbum;
  externalUrl?: string;
  uri?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  trackCount: number;
  ownerName?: string;
  ownerId?: string;
  externalUrl?: string;
  itemsHref?: string;
}

export interface SpotifyPlaylistSnapshot extends SpotifyPlaylist {
  tracks: SpotifyTrack[];
}

export interface SpotifyPlaylistTracksResult {
  items: SpotifyTrack[];
  total: number;
}

export interface SpotifySnapshotFile {
  exportedAt: string;
  playlists: SpotifyPlaylistSnapshot[];
}

export interface SpotifyWindowPayload {
  view?: 'home' | 'playlist';
  playlistId?: string;
  title?: string;
}
