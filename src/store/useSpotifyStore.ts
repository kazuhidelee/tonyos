import { create } from 'zustand';
import { fetchPublicSpotifyPlaylistTracks, fetchPublicSpotifyPlaylists } from '../lib/spotify';
import type { SpotifyPlaylistSnapshot, SpotifyTrack } from '../types/spotify';

interface PlaylistTracksState {
  items: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
}

interface SpotifyState {
  playlists: SpotifyPlaylistSnapshot[];
  playlistsLoading: boolean;
  playlistsLoaded: boolean;
  playlistsError: string | null;
  tracksByPlaylist: Record<string, PlaylistTracksState | undefined>;
  initialize: () => Promise<void>;
  loadPlaylists: (force?: boolean) => Promise<void>;
  loadPlaylistTracks: (playlistId: string, force?: boolean) => Promise<void>;
}

function getDefaultTrackState(): PlaylistTracksState {
  return { items: [], isLoading: false, error: null };
}

export const useSpotifyStore = create<SpotifyState>((set, get) => ({
  playlists: [],
  playlistsLoading: false,
  playlistsLoaded: false,
  playlistsError: null,
  tracksByPlaylist: {},
  initialize: async () => {
    await get().loadPlaylists();
  },
  loadPlaylists: async (force = false) => {
    if (get().playlistsLoading || (get().playlistsLoaded && !force)) {
      return;
    }

    set({ playlistsLoading: true, playlistsError: null });
    try {
      const playlists = await fetchPublicSpotifyPlaylists();
      set({
        playlists,
        playlistsLoading: false,
        playlistsLoaded: true,
      });
    } catch (error) {
      set({
        playlistsLoading: false,
        playlistsError: error instanceof Error ? error.message : 'Failed to load public Spotify playlists.',
      });
    }
  },
  loadPlaylistTracks: async (playlistId, force = false) => {
    const existing = get().tracksByPlaylist[playlistId];
    if (existing?.isLoading || (existing?.items.length && !force)) {
      return;
    }

    set((state) => ({
      tracksByPlaylist: {
        ...state.tracksByPlaylist,
        [playlistId]: {
          ...(existing ?? getDefaultTrackState()),
          isLoading: true,
          error: null,
        },
      },
    }));

    try {
      const result = await fetchPublicSpotifyPlaylistTracks(playlistId);
      set((state) => ({
        playlists: state.playlists.map((entry) =>
          entry.id === playlistId
            ? {
                ...entry,
                trackCount: result.total || entry.trackCount,
                tracks: result.items,
              }
            : entry,
        ),
        tracksByPlaylist: {
          ...state.tracksByPlaylist,
          [playlistId]: {
            items: result.items,
            isLoading: false,
            error: null,
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        tracksByPlaylist: {
          ...state.tracksByPlaylist,
          [playlistId]: {
            ...(existing ?? getDefaultTrackState()),
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load Spotify playlist tracks.',
          },
        },
      }));
    }
  },
}));
