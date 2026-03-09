import { portfolioFileSystem } from '../../data/filesystem';
import { findNode, isFile } from '../../utils/filesystemHelpers';

interface ImageViewerProps {
  path: string;
}

export function ImageViewer({ path }: ImageViewerProps) {
  const node = findNode(portfolioFileSystem, path);

  if (!isFile(node)) {
    return <div className="p-5 text-sm text-accent-red">Image not found: {path}</div>;
  }

  return (
    <div className="flex h-full flex-col gap-3 bg-[#c0c0c0] p-4 text-black">
      <div className="border border-black bg-[#dfdfdf] px-3 py-1 text-xs shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
        {node.name}
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center border border-[#808080] bg-white p-3 shadow-[inset_-1px_-1px_0_#dfdfdf,inset_1px_1px_0_#808080]">
        <img src={node.content} alt={node.name} className="max-h-full max-w-full object-contain" />
      </div>
    </div>
  );
}
