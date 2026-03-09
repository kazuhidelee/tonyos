import { useEffect, useState } from 'react';
import { useSpotifyStore } from '../../store/useSpotifyStore';
import type { SpotifyPlaylist } from '../../types/spotify';
import { ExplorerWindow } from './ExplorerWindow';
import { TrackFileRow } from './TrackFileRow';

interface PlaylistContentsWindowProps {
  playlist: SpotifyPlaylist;
}

export function PlaylistContentsWindow({ playlist }: PlaylistContentsWindowProps) {
  const { tracksByPlaylist, loadPlaylistTracks } = useSpotifyStore();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const trackState = tracksByPlaylist[playlist.id];

  useEffect(() => {
    void loadPlaylistTracks(playlist.id);
  }, [loadPlaylistTracks, playlist.id]);

  const tracks = trackState?.items ?? [];
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) ?? null;

  return (
    <ExplorerWindow
      title={playlist.name}
      meta={`${playlist.trackCount} track${playlist.trackCount === 1 ? '' : 's'}`}
      statusLeft={
        trackState?.isLoading
          ? 'Loading tracks...'
          : trackState?.error
            ? trackState.error
            : selectedTrack
              ? `${selectedTrack.name} - ${selectedTrack.artists.map((artist) => artist.name).join(', ')}`
              : `${tracks.length} file${tracks.length === 1 ? '' : 's'}`
      } 
      statusRight={selectedTrack?.album?.name ?? 'Spotify Web API'}
    >
      <div className="flex h-full flex-col">
        <div className="grid grid-cols-[28px_minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_72px] gap-2 border-b border-[#808080] bg-[#c0c0c0] px-2 py-1 text-[11px] font-bold shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
          <span />
          <span>Name</span>
          <span>Artist</span>
          <span>Album</span>
          <span className="justify-self-end">Length</span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto border-x border-b border-[#808080] bg-white scrollbar-thin">
          {trackState?.isLoading ? (
            <div className="p-4 text-[12px]">Loading playlist contents...</div>
          ) : trackState?.error ? (
            <div className="p-4 text-[12px] text-[#8b0000]">{trackState.error}</div>
          ) : tracks.length === 0 ? (
            <div className="p-4 text-[12px]">This playlist is empty.</div>
          ) : (
            tracks.map((track) => (
              <TrackFileRow
                key={track.id}
                track={track}
                selected={selectedTrackId === track.id}
                onSelect={() => setSelectedTrackId(track.id)}
              />
            ))
          )}
        </div>
      </div>
    </ExplorerWindow>
  );
}
