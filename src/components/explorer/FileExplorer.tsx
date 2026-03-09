import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { portfolioFileSystem } from '../../data/filesystem';
import { findNode, getBreadcrumbs, isDirectory } from '../../utils/filesystemHelpers';
import { useWindowStore } from '../../store/useWindowStore';
import type { FileSystemDirectory, FileSystemNode } from '../../types/filesystem';
import { cn } from '../../utils/ui';

interface FileExplorerProps {
  initialPath?: string;
  compact?: boolean;
}

export function FileExplorer({ initialPath = '/home/tony', compact = false }: FileExplorerProps) {
  const { openPathWindow } = useWindowStore();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState(1);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const currentNode = findNode(portfolioFileSystem, initialPath);
  const directory = isDirectory(currentNode) ? currentNode : portfolioFileSystem;
  const breadcrumbs = getBreadcrumbs(directory.path);
  const homeNode = findNode(portfolioFileSystem, '/home/tony');

  useEffect(() => {
    if (!directory.children.some((node) => node.path === selectedPath)) {
      setSelectedPath(directory.children[0]?.path ?? null);
    }
  }, [directory.children, selectedPath]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateColumns = () => {
      const styles = window.getComputedStyle(grid);
      const templateColumns = styles.gridTemplateColumns.split(' ').filter(Boolean);
      setColumnCount(Math.max(templateColumns.length, 1));
    };

    updateColumns();
    const observer = new ResizeObserver(updateColumns);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const openNode = (node: FileSystemNode) => {
    if (node.kind === 'directory') {
      openPathWindow(`${node.path}/`);
      return;
    }
    openPathWindow(node.path);
  };

  const getNodeIcon = (node: FileSystemNode) => {
    if (node.kind === 'directory') {
      return node.path === '/home/tony/artwork' ? '/Paint_big.png' : '/Folder_big.png';
    }

    if (node.extension === 'png' || node.extension === 'jpg' || node.extension === 'jpeg') {
      return '/Paint_big.png';
    }

    return '/Notepad_big.png';
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
        <div
          ref={gridRef}
          tabIndex={0}
          onKeyDown={(event) => {
            const currentIndex = directory.children.findIndex((node) => node.path === selectedPath);
            if (currentIndex === -1) {
              return;
            }

            let nextIndex = currentIndex;
            if (event.key === 'ArrowRight') {
              nextIndex = Math.min(currentIndex + 1, directory.children.length - 1);
            } else if (event.key === 'ArrowLeft') {
              nextIndex = Math.max(currentIndex - 1, 0);
            } else if (event.key === 'ArrowDown') {
              nextIndex = Math.min(currentIndex + columnCount, directory.children.length - 1);
            } else if (event.key === 'ArrowUp') {
              nextIndex = Math.max(currentIndex - columnCount, 0);
            } else if (event.key === 'Enter') {
              event.preventDefault();
              openNode(directory.children[currentIndex]);
              return;
            } else {
              return;
            }

            event.preventDefault();
            setSelectedPath(directory.children[nextIndex]?.path ?? selectedPath);
          }}
          className="grid gap-x-6 gap-y-4 outline-none sm:grid-cols-2 xl:grid-cols-3"
        >
          {directory.children.map((node) => {
            const iconSrc = compact ? getNodeIcon(node) : getNodeIcon(node);
            const isSelected = selectedPath === node.path;
            return (
              <button
                key={node.path}
                type="button"
                onDoubleClick={() => openNode(node)}
                onClick={() => setSelectedPath(node.path)}
                className={cn(
                  'group flex w-[92px] flex-col items-center gap-2 border border-transparent p-1 text-center focus:outline-none',
                  isSelected
                    ? 'bg-[#000080]'
                    : 'bg-transparent hover:bg-[#000080]',
                )}
              >
                <img src={iconSrc} alt="" className="h-8 w-8" />
                <div>
                  <div
                    className={cn(
                      'text-[12px] leading-tight',
                      isSelected ? 'text-white' : 'text-black group-hover:text-white',
                    )}
                  >
                    {node.name}
                  </div>
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
  const branchPrefix = depth === 0 ? '' : `${'| '.repeat(Math.max(depth - 1, 0))}|- `;

  return (
    <div>
      <button
        type="button"
        onClick={() => onOpenPath(`${node.path}/`)}
        className={cn(
          'flex w-full items-center gap-2 px-2 py-1 text-left',
          isActive ? 'bg-[#000080] text-white' : 'text-black',
        )}
      >
        <span className="shrink-0 whitespace-pre font-mono text-[11px] leading-none">
          {branchPrefix}
        </span>
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
