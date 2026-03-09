interface StatusBarProps {
  left: string;
  right?: string;
}

export function StatusBar({ left, right }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border border-[#808080] bg-[#c0c0c0] px-2 py-1 text-[11px] text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
      <div className="min-w-0 truncate">{left}</div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
