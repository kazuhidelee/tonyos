import type { SpotifyPlaylist } from '../../types/spotify';
import { cn } from '../../utils/ui';

interface PlaylistIconProps {
  playlist: SpotifyPlaylist;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

export function PlaylistIcon({ playlist, selected, onClick, onDoubleClick }: PlaylistIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={cn(
        'flex w-[112px] flex-col items-center gap-2 border px-2 py-2 text-center focus:outline-none',
        selected
          ? 'border-[#808080] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="flex h-[54px] w-[54px] items-center justify-center border border-[#808080] bg-[#c0c0c0] p-1 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
        {playlist.imageUrl ? (
          <img src={playlist.imageUrl} alt="" className="h-full w-full border border-black object-cover" />
        ) : (
          <img src="/CD_big.png" alt="" className="h-8 w-8" />
        )}
      </div>
      <div className="w-full text-[12px] leading-tight text-black">
        {playlist.name}
      </div>
    </button>
  );
}
