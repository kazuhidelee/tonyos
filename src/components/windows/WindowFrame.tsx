import type { PropsWithChildren, PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import type { AppWindow } from '../../types/window';
import { useWindowStore } from '../../store/useWindowStore';
import { portfolioFileSystem } from '../../data/filesystem';
import { findNode, isDirectory } from '../../utils/filesystemHelpers';

interface WindowFrameProps extends PropsWithChildren {
  window: AppWindow;
}

export function WindowFrame({ window, children }: WindowFrameProps) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, moveWindow, resizeWindow } = useWindowStore();
  const isFolderWindow = ['explorer', 'projects', 'experience'].includes(window.appType);
  const titleIcon = isFolderWindow ? '/Folder_small.png' : '/Notepad_small.png';
  const explorerPath = (window.payload as { path?: string } | undefined)?.path;
  const resolvedPath =
    window.appType === 'projects'
      ? '/home/tony/projects'
      : explorerPath
        ? explorerPath.replace(/\/$/, '')
        : null;
  const explorerNode = resolvedPath ? findNode(portfolioFileSystem, resolvedPath) : null;
  const statusText =
    (window.appType === 'explorer' || window.appType === 'projects') && isDirectory(explorerNode)
      ? `${explorerNode.children.length} item${explorerNode.children.length === 1 ? '' : 's'}`
      : null;
  const minWidth = 360;
  const minHeight = statusText ? 260 : 220;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.isMaximized) {
      return;
    }

    focusWindow(window.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startPosition = window.position;

    const onMove = (moveEvent: PointerEvent) => {
      moveWindow(window.id, {
        x: Math.max(24, startPosition.x + moveEvent.clientX - startX),
        y: Math.max(24, startPosition.y + moveEvent.clientY - startY),
      });
    };

    const onUp = () => {
      globalThis.window.removeEventListener('pointermove', onMove);
      globalThis.window.removeEventListener('pointerup', onUp);
    };

    globalThis.window.addEventListener('pointermove', onMove);
    globalThis.window.addEventListener('pointerup', onUp);
  };

  const style = window.isMaximized
    ? { inset: '8px 8px 30px 8px', width: 'auto', height: 'auto', zIndex: 200 + window.zIndex }
    : {
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: 200 + window.zIndex,
      };

  const startResize = (
    event: ReactPointerEvent<HTMLDivElement>,
    direction: 'right' | 'bottom' | 'corner',
  ) => {
    if (window.isMaximized) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    focusWindow(window.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startSize = window.size;

    const onMove = (moveEvent: PointerEvent) => {
      resizeWindow(window.id, {
        width:
          direction === 'bottom'
            ? startSize.width
            : Math.max(minWidth, startSize.width + moveEvent.clientX - startX),
        height:
          direction === 'right'
            ? startSize.height
            : Math.max(minHeight, startSize.height + moveEvent.clientY - startY),
      });
    };

    const onUp = () => {
      globalThis.window.removeEventListener('pointermove', onMove);
      globalThis.window.removeEventListener('pointerup', onUp);
    };

    globalThis.window.addEventListener('pointermove', onMove);
    globalThis.window.addEventListener('pointerup', onUp);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 12 }}
      transition={{ duration: 0.12 }}
      style={style}
      onMouseDown={() => focusWindow(window.id)}
      className="absolute overflow-hidden"
    >
      <img
        src="/window_outer.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none"
      />
      <div
        onPointerDown={handlePointerDown}
        className="absolute left-[4px] right-[4px] top-[3px] flex h-[20px] cursor-grab items-center justify-between px-1.5 active:cursor-grabbing"
        style={{
          backgroundImage: "url('/Titlebar.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <img src={titleIcon} alt="" className="h-4 w-4 shrink-0" />
          <div className="truncate text-[12px] font-bold text-white">{window.title}</div>
        </div>
        <div className="flex items-center gap-1">
          <WindowButton label="Minimize" iconSrc="/MinimizeButton.png" onClick={() => minimizeWindow(window.id)} />
          <WindowButton label="Maximize" iconSrc="/MaximizeButton.png" onClick={() => maximizeWindow(window.id)} />
          <WindowButton label="Close" iconSrc="/CloseButton.png" onClick={() => closeWindow(window.id)} />
        </div>
      </div>

      <div
        className="absolute left-[4px] right-[4px] top-[24px] overflow-hidden"
        style={{ bottom: statusText ? '22px' : '8px' }}
      >
        <img
          src="/window_inner.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full select-none"
        />
        <div className="relative h-full overflow-auto px-3 py-2 scrollbar-thin">{children}</div>
      </div>

      {statusText ? (
        <div
          className="absolute bottom-[4px] left-[4px] right-[4px] flex h-[18px] items-center px-2 text-[12px] text-black"
          style={{
            backgroundImage: "url('/Statusbar.png')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
          }}
        >
          {statusText}
        </div>
      ) : null}

      {!window.isMaximized ? (
        <>
          <div
            onPointerDown={(event) => startResize(event, 'right')}
            className="absolute right-0 top-[24px] bottom-[4px] w-3 cursor-ew-resize"
            title="Resize window width"
          />
          <div
            onPointerDown={(event) => startResize(event, 'bottom')}
            className="absolute bottom-0 left-[4px] right-[4px] h-3 cursor-ns-resize"
            title="Resize window height"
          />
          <div
            onPointerDown={(event) => startResize(event, 'corner')}
            className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize"
            title="Resize window"
          >
            <div className="absolute bottom-[3px] right-[3px] h-[2px] w-[2px] bg-[#808080]" />
            <div className="absolute bottom-[6px] right-[6px] h-[2px] w-[2px] bg-[#808080]" />
            <div className="absolute bottom-[9px] right-[9px] h-[2px] w-[2px] bg-[#808080]" />
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

interface WindowButtonProps {
  label: string;
  iconSrc: string;
  onClick: () => void;
}

function WindowButton({ label, onClick, iconSrc }: WindowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="h-4 w-4 shrink-0 bg-transparent p-0"
    >
      <img src={iconSrc} alt="" className="h-4 w-4" />
    </button>
  );
}
