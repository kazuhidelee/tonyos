import { useEffect, useMemo, useState } from 'react';
import { useSpotifyStore } from '../../store/useSpotifyStore';
import { useWindowStore } from '../../store/useWindowStore';
import type { SpotifyPlaylistSnapshot, SpotifyWindowPayload } from '../../types/spotify';
import { ExplorerWindow } from './ExplorerWindow';
import { PlaylistContentsWindow } from './PlaylistContentsWindow';
import { PlaylistIcon } from './PlaylistIcon';

interface SpotifyExplorerDesktopProps {
  payload?: SpotifyWindowPayload;
}

export function SpotifyExplorerDesktop({ payload }: SpotifyExplorerDesktopProps) {
  const { playlists, playlistsLoading, playlistsError, initialize, loadPlaylists } = useSpotifyStore();
  const { openWindow } = useWindowStore();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const selectedPlaylist = useMemo(
    () => playlists.find((playlist) => playlist.id === selectedPlaylistId) ?? null,
    [playlists, selectedPlaylistId],
  );

  useEffect(() => {
    if (selectedPlaylistId && playlists.some((playlist) => playlist.id === selectedPlaylistId)) {
      return;
    }

    if (playlists[0]) {
      setSelectedPlaylistId(playlists[0].id);
    }
  }, [playlists, selectedPlaylistId]);

  const openPlaylistWindow = (playlist: SpotifyPlaylistSnapshot) => {
    openWindow('spotify', {
      payload: { view: 'playlist', playlistId: playlist.id, title: playlist.name },
      title: playlist.name,
    });
  };

  if (payload?.view === 'playlist' && payload.playlistId) {
    const playlist = playlists.find((entry) => entry.id === payload.playlistId);

    if (!playlist) {
      return (
        <ExplorerWindow
          title={payload.title ?? 'Playlist'}
          meta="Public Spotify Playlist"
          statusLeft={playlistsLoading ? 'Loading playlist metadata...' : 'Playlist unavailable'}
          statusRight="Spotify Web API"
        >
          <div className="p-4 text-[12px]">
            {playlistsLoading
              ? 'Loading playlist metadata...'
              : 'That playlist is not available in the current public playlist list.'}
          </div>
        </ExplorerWindow>
      );
    }

    return <PlaylistContentsWindow playlist={playlist} />;
  }

  return (
    <ExplorerWindow
      title="Spotify Playlists"
      meta="Public Playlist Explorer"
      statusLeft={
        playlistsLoading
          ? 'Loading public playlists...'
          : playlistsError
            ? playlistsError
            : `${playlists.length} playlist${playlists.length === 1 ? '' : 's'}`
      }
      statusRight={selectedPlaylist ? `${selectedPlaylist.trackCount} tracks` : 'Spotify Web API'}
      toolbarActions={
        <button
          type="button"
          onClick={() => void loadPlaylists(true)}
          className="border border-black bg-[#dfdfdf] px-2 py-1 text-[11px] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
        >
          Refresh
        </button>
      }
    >
      {playlistsLoading ? (
        <div className="p-4 text-[12px]">Loading playlists...</div>
      ) : playlistsError ? (
        <div className="p-4 text-[12px] text-[#8b0000]">
          <p className="mb-3">{playlistsError}</p>
          <button
            type="button"
            onClick={() => void loadPlaylists(true)}
            className="border border-black bg-[#dfdfdf] px-2 py-1 text-[11px] text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
          >
            Retry
          </button>
        </div>
      ) : playlists.length === 0 ? (
        <div className="p-4 text-[12px]">No public playlists found for this Spotify account.</div>
      ) : (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center gap-2 border border-[#808080] bg-[#c0c0c0] px-2 py-1 text-[11px] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
            <img src="/CD_small.png" alt="" className="h-4 w-4" />
            <span>Single-click to select. Double-click to open the playlist folder.</span>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_220px] gap-3">
            <div className="min-h-0 overflow-auto border border-[#808080] bg-white p-3 scrollbar-thin">
              <div className="flex flex-wrap gap-x-4 gap-y-3">
                {playlists.map((playlist) => (
                  <PlaylistIcon
                    key={playlist.id}
                    playlist={playlist}
                    selected={selectedPlaylistId === playlist.id}
                    onClick={() => setSelectedPlaylistId(playlist.id)}
                    onDoubleClick={() => openPlaylistWindow(playlist)}
                  />
                ))}
              </div>
            </div>
            <div className="border border-[#808080] bg-[#c0c0c0] p-3 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
              {selectedPlaylist ? (
                <div className="space-y-3 text-[12px]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-16 w-16 items-center justify-center border border-[#808080] bg-white p-1 shadow-[inset_-1px_-1px_0_#dfdfdf,inset_1px_1px_0_#808080]">
                      {selectedPlaylist.imageUrl ? (
                        <img src={selectedPlaylist.imageUrl} alt="" className="h-full w-full border border-black object-cover" />
                      ) : (
                        <img src="/CD_big.png" alt="" className="h-8 w-8" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold">{selectedPlaylist.name}</div>
                      <div className="mt-1 text-[11px] text-black/70">
                        {selectedPlaylist.ownerName ?? 'Spotify'} · {selectedPlaylist.trackCount} tracks
                      </div>
                    </div>
                  </div>
                  <div className="border border-[#808080] bg-white p-2 leading-5 shadow-[inset_-1px_-1px_0_#dfdfdf,inset_1px_1px_0_#808080]">
                    {selectedPlaylist.description || 'No playlist description.'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openPlaylistWindow(selectedPlaylist)}
                      className="border border-black bg-[#dfdfdf] px-2 py-1 text-[11px] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
                    >
                      Open Folder
                    </button>
                    {selectedPlaylist.externalUrl ? (
                      <a
                        href={selectedPlaylist.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-black bg-[#dfdfdf] px-2 py-1 text-[11px] text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
                      >
                        Open in Spotify
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="text-[12px]">Select a playlist folder.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </ExplorerWindow>
  );
}
