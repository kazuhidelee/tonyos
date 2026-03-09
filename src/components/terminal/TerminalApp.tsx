import { useEffect, useRef, useState } from 'react';
import { useTerminalStore } from '../../store/useTerminalStore';
import { useWindowStore } from '../../store/useWindowStore';
import { cn } from '../../utils/ui';

export function TerminalApp() {
  const { cwd, history, runCommand } = useTerminalStore();
  const { openPathWindow } = useWindowStore();
  const [value, setValue] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="flex h-full flex-col bg-black p-4 font-mono text-sm text-white"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-auto scrollbar-thin">
        {history.map((entry) => (
          <pre
            key={entry.id}
            className={cn(
              'whitespace-pre-wrap break-words font-mono leading-7',
              entry.type === 'error' ? 'text-[#ff8080]' : entry.type === 'input' ? 'text-[#ffff80]' : 'text-white',
            )}
          >
            {entry.content}
          </pre>
        ))}
      </div>
      <form
        className="mt-4 flex items-center gap-3 border border-white bg-black px-3 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!value.trim()) {
            return;
          }
          runCommand(value, openPathWindow);
          setValue('');
        }}
      >
        <span className="text-[#00ff00]">tony@tonyos:{cwd}$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="flex-1 bg-transparent text-white outline-none"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
