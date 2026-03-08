import type { PointerEvent as ReactPointerEvent } from 'react';

interface DesktopIconProps {
  id: string;
  iconSrc: string;
  label: string;
  position: { x: number; y: number };
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onMove: (position: { x: number; y: number }) => void;
}

export function DesktopIcon({
  id,
  iconSrc,
  label,
  position,
  isSelected,
  onSelect,
  onOpen,
  onMove,
}: DesktopIconProps) {
  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onSelect();

    const startX = event.clientX;
    const startY = event.clientY;
    const startPosition = position;
    let dragging = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (!dragging && Math.abs(deltaX) + Math.abs(deltaY) < 4) {
        return;
      }

      dragging = true;
      onMove({
        x: Math.max(8, startPosition.x + deltaX),
        y: Math.max(48, startPosition.y + deltaY),
      });
    };

    const onPointerUp = () => {
      globalThis.window.removeEventListener('pointermove', onPointerMove);
      globalThis.window.removeEventListener('pointerup', onPointerUp);
    };

    globalThis.window.addEventListener('pointermove', onPointerMove);
    globalThis.window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <button
      type="button"
      data-icon-id={id}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onDoubleClick={onOpen}
      onPointerDown={handlePointerDown}
      className="group absolute flex w-24 flex-col items-center gap-2 px-2 py-3 text-center focus:outline-none"
      style={{ left: position.x, top: position.y }}
    >
      <img src={iconSrc} alt="" className="h-8 w-8" />
      <span
        className="max-w-full px-1 text-[12px] leading-tight text-white"
        style={{
          backgroundColor: isSelected ? '#000080' : 'transparent',
          color: '#ffffff',
        }}
      >
        {label}
      </span>
    </button>
  );
}
