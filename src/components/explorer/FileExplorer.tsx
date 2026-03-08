import { ChevronRight } from 'lucide-react';
import { portfolioFileSystem } from '../../data/filesystem';
import { findNode, getBreadcrumbs, isDirectory, isFile } from '../../utils/filesystemHelpers';
import { useWindowStore } from '../../store/useWindowStore';
import type { FileSystemDirectory, FileSystemNode } from '../../types/filesystem';
import { cn } from '../../utils/ui';

interface FileExplorerProps {
  initialPath?: string;
  compact?: boolean;
}

export function FileExplorer({ initialPath = '/home/tony', compact = false }: FileExplorerProps) {
  const { openPathWindow } = useWindowStore();
  const currentNode = findNode(portfolioFileSystem, initialPath);
  const directory = isDirectory(currentNode) ? currentNode : portfolioFileSystem;
  const breadcrumbs = getBreadcrumbs(directory.path);
  const homeNode = findNode(portfolioFileSystem, '/home/tony');

  const openNode = (node: FileSystemNode) => {
    if (node.kind === 'directory') {
      openPathWindow(`${node.path}/`);
      return;
    }
    openPathWindow(node.path);
  };

  return (
    <div className="grid h-full grid-cols-[180px_1fr] bg-[#c0c0c0] text-black">
      <aside className="border-r border-[#808080] bg-[#c0c0c0] p-3">
        <div className="mb-3 text-sm font-bold">Filesystem</div>
        {isDirectory(homeNode) ? (
          <div className="space-y-1 text-[12px]">
            <TreeNode
              node={homeNode}
              currentPath={directory.path}
              onOpenPath={openPathWindow}
            />
          </div>
        ) : null}
      </aside>
      <div className="min-h-0 h-full overflow-auto bg-white p-4 scrollbar-thin">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          {breadcrumbs.map((crumb, index) => (
            <button
              key={crumb}
              type="button"
              onClick={() => openPathWindow(crumb === '/' ? '/' : `${crumb}/`)}
              className="flex items-center gap-1 border border-black bg-[#dfdfdf] px-2 py-1 text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
            >
              {index > 0 && <ChevronRight className="h-3 w-3 text-black" />}
              {crumb.split('/').filter(Boolean).pop() ?? '/'}
            </button>
          ))}
        </div>
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
          {directory.children.map((node) => {
            const iconSrc = compact ? '/Notepad_big.png' : node.kind === 'directory' ? '/Folder_big.png' : '/Notepad_big.png';
            return (
              <button
                key={node.path}
                type="button"
                onDoubleClick={() => openNode(node)}
                onClick={() => undefined}
                className={cn('flex w-[92px] flex-col items-center gap-2 bg-transparent p-1 text-center focus:outline-none', 'focus:bg-[#000080]')}
              >
                <img src={iconSrc} alt="" className="h-8 w-8" />
                <div>
                  <div className="text-[12px] leading-tight text-black">{node.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TreeNode({
  node,
  currentPath,
  onOpenPath,
  depth = 0,
}: {
  node: FileSystemDirectory;
  currentPath: string;
  onOpenPath: (path: string) => void;
  depth?: number;
}) {
  const isActive = currentPath === node.path;

  return (
    <div>
      <button
        type="button"
        onClick={() => onOpenPath(`${node.path}/`)}
        className={cn(
          'flex w-full items-center gap-2 px-2 py-1 text-left',
          isActive ? 'bg-[#000080] text-white' : 'text-black',
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <img src="/Folder_small.png" alt="" className="h-4 w-4 shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
      {node.children
        .filter((child): child is FileSystemDirectory => child.kind === 'directory')
        .map((child) => (
          <TreeNode
            key={child.path}
            node={child}
            currentPath={currentPath}
            onOpenPath={onOpenPath}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
