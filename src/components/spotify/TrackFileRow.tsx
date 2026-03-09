import type { SpotifyTrack } from '../../types/spotify';
import { cn } from '../../utils/ui';

interface TrackFileRowProps {
  track: SpotifyTrack;
  selected: boolean;
  onSelect: () => void;
}

function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function TrackFileRow({ track, selected, onSelect }: TrackFileRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={() => {
        if (track.externalUrl) {
          window.open(track.externalUrl, '_blank', 'noopener,noreferrer');
        }
      }}
      className={cn(
        'grid w-full grid-cols-[28px_minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_72px] items-center gap-2 px-2 py-1 text-left text-[12px]',
        selected ? 'bg-[#000080] text-white' : 'text-black hover:bg-[#d8d8d8]',
      )}
    >
      <img src="/CD_small.png" alt="" className="h-4 w-4" />
      <span className="truncate">{track.name}</span>
      <span className="truncate">{track.artists.map((artist) => artist.name).join(', ')}</span>
      <span className="truncate">{track.album?.name ?? '-'}</span>
      <span className="justify-self-end">{formatDuration(track.durationMs)}</span>
    </button>
  );
}
