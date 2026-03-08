import { portfolioFileSystem } from '../../data/filesystem';
import { findNode, isFile } from '../../utils/filesystemHelpers';

interface TextViewerProps {
  path: string;
}

export function TextViewer({ path }: TextViewerProps) {
  const node = findNode(portfolioFileSystem, path);

  if (!isFile(node)) {
    return <div className="p-5 text-sm text-accent-red">File not found: {path}</div>;
  }

  return (
    <div className="h-full bg-white p-4">
      <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-black">{node.content}</pre>
    </div>
  );
}
