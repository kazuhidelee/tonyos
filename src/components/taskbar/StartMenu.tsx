import { useMemo, useState } from 'react';
import { portfolioFileSystem } from '../../data/filesystem';
import type { FileSystemDirectory } from '../../types/filesystem';
import { findNode, isDirectory } from '../../utils/filesystemHelpers';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { cn } from '../../utils/ui';

interface StartMenuProps {
  onClose: () => void;
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { openWindow, openPathWindow, resetWindows } = useWindowStore();
  const { restartSession } = useDesktopStore();
  const documentsRoot = useMemo(() => {
    const node = findNode(portfolioFileSystem, '/home/tony');
    return isDirectory(node) ? node : null;
  }, []);

  const shutdown = () => {
    resetWindows();
    restartSession();
    onClose();
  };

  return (
    <div className="absolute bottom-[22px] left-0 z-[160] flex">
      <div className="flex border border-black bg-[#c0c0c0] shadow-[-1px_-1px_0_#ffffff,inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff,1px_1px_0_#000000]">
        <div className="flex w-7 items-end justify-center bg-[#808080] px-1 py-2">
          <div className="origin-bottom-left -rotate-90 whitespace-nowrap text-[12px] font-bold tracking-wide text-white">
            TonyOS
          </div>
        </div>
        <div className="min-w-[210px] py-3">
          {documentsRoot ? (
            <StartMenuDirectoryItem
              label="Documents"
              icon="/Documents_small.png"
              directory={documentsRoot}
              onOpenPath={(path) => {
                openPathWindow(path);
                onClose();
              }}
            />
          ) : null}
          <StartMenuAction
            label="Search"
            icon="/Search_small.png"
            onClick={() => {
              openWindow('search', { singleton: true, title: 'Search' });
              onClose();
            }}
          />
          <StartMenuAction
            label="Help"
            icon="/Help_small.png"
            onClick={() => {
              openWindow('help', { singleton: true, title: 'Help' });
              onClose();
            }}
          />
          <div className="h-9" />
          <div className="mx-2 my-1 h-px bg-[#808080] shadow-[0_1px_0_#ffffff]" />
          <StartMenuAction
            label="Shut Down..."
            icon="/shutdown.png"
            onClick={shutdown}
          />
        </div>
      </div>
    </div>
  );
}

function StartMenuAction({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn(
        'flex w-full items-center gap-2 px-2 py-[6px] text-left text-[12px]',
        active ? 'bg-[#000080] text-white' : 'text-black',
      )}
    >
      <img src={icon} alt="" className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function StartMenuDirectoryItem({
  label,
  icon,
  directory,
  onOpenPath,
}: {
  label: string;
  icon: string;
  directory: FileSystemDirectory;
  onOpenPath: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={cn(
        'flex w-full items-center gap-2 px-2 py-[6px] text-left text-[12px]',
        open ? 'bg-[#000080] text-white' : 'text-black',
      )}
    >
      <img src={icon} alt="" className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      <img
        src={open ? '/triangle_white.png' : '/triangle_black.png'}
        alt=""
        className="h-[10px] w-[10px] shrink-0"
      />
    </button>
      {open ? (
        <div
          className="absolute left-full top-0 min-w-[210px] border border-black bg-[#c0c0c0] py-3 shadow-[-1px_-1px_0_#ffffff,inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff,1px_1px_0_#000000]"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {directory.children.map((child) =>
            child.kind === 'directory' ? (
              <StartMenuDirectoryItem
                key={child.path}
                label={child.name}
                icon="/Folder_small.png"
                directory={child}
                onOpenPath={onOpenPath}
              />
            ) : (
              <StartMenuLeafItem
                key={child.path}
                label={child.name}
                icon={child.extension === 'pdf' ? '/Notepad_small.png' : '/Notepad_small.png'}
                onClick={() => onOpenPath(child.path)}
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

function StartMenuLeafItem({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn(
        'flex w-full items-center gap-2 px-2 py-[6px] text-left text-[12px]',
        active ? 'bg-[#000080] text-white' : 'text-black',
      )}
    >
      <img src={icon} alt="" className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}
