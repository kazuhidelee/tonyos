import type { ReactNode } from 'react';

interface TitleBarProps {
  icon?: ReactNode;
  title: string;
  meta?: string;
  actions?: ReactNode;
}

export function TitleBar({ icon, title, meta, actions }: TitleBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border border-[#808080] bg-[#c0c0c0] px-2 py-1 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
      <div className="flex min-w-0 items-center gap-2">
        {icon ? <div className="flex h-8 w-8 items-center justify-center">{icon}</div> : null}
        <div className="min-w-0">
          <div className="truncate text-[12px] font-bold text-black">{title}</div>
          {meta ? <div className="truncate text-[11px] text-black/70">{meta}</div> : null}
        </div>
      </div>
      {actions}
    </div>
  );
}
