import { useEffect, useRef, useState } from 'react';
import { Clock } from './Clock';
import { useWindowStore } from '../../store/useWindowStore';
import { cn } from '../../utils/ui';
import { getWindowIcon } from '../../utils/windowPresentation';
import { StartMenu } from './StartMenu';

export function Taskbar() {
  const { windows, focusedWindowId, openWindow, restoreWindow, focusWindow } = useWindowStore();
  const [startOpen, setStartOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setStartOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-x-0 bottom-0 z-[120]">
      {startOpen ? <StartMenu onClose={() => setStartOpen(false)} /> : null}
      <div
        className="flex h-[22px] items-center gap-1 pl-2 pr-0"
        style={{
          backgroundImage: "url('/Navbar.png')",
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 22px',
        }}
      >
        <button
          type="button"
          onClick={() => setStartOpen((open) => !open)}
          className="h-[22px] w-[60px] shrink-0"
          aria-label="Start"
        >
          <img src="/Start.png" alt="Start" className="h-[22px] w-[60px]" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          {windows.map((window) => {
            const active = focusedWindowId === window.id && !window.isMinimized;
            return (
              <button
                key={window.id}
                type="button"
                onClick={() => (window.isMinimized ? restoreWindow(window.id) : focusWindow(window.id))}
                className={cn(
                  'flex h-[22px] min-w-0 max-w-[180px] items-center gap-1 px-2 text-[12px] text-black',
                  active ? 'font-bold' : '',
                )}
                style={{
                  backgroundImage: "url('/Navbar Tab.png')",
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                  filter: active ? 'none' : 'grayscale(0.08)',
                }}
              >
                <img src={getWindowIcon(window.appType)} alt="" className="h-4 w-4 shrink-0" />
                <span className="block truncate">{window.title}</span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex h-[22px] items-center">
          <Clock />
        </div>
      </div>
    </div>
  );
}
