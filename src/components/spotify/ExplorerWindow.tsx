import type { ReactNode } from 'react';
import { StatusBar } from './StatusBar';
import { TitleBar } from './TitleBar';

interface ExplorerWindowProps {
  title: string;
  meta?: string;
  toolbarActions?: ReactNode;
  children: ReactNode;
  statusLeft: string;
  statusRight?: string;
}

export function ExplorerWindow({
  title,
  meta,
  toolbarActions,
  children,
  statusLeft,
  statusRight,
}: ExplorerWindowProps) {
  return (
    <div className="flex h-full flex-col gap-2 bg-[#c0c0c0] text-black">
      <TitleBar
        icon={<img src="/CD_small.png" alt="" className="h-4 w-4" />}
        title={title}
        meta={meta}
        actions={toolbarActions}
      />
      <div className="min-h-0 flex-1 border border-[#808080] bg-white p-2 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
        {children}
      </div>
      <StatusBar left={statusLeft} right={statusRight} />
    </div>
  );
}
