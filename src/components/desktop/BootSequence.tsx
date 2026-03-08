import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';

const bootLines = [
  'Booting TonyOS...',
  'Initializing kernel modules...',
  'Mounting portfolio filesystem...',
  'Starting window manager...',
  'Launching desktop environment...',
];

export function BootSequence() {
  const { setBootCompleted, skipBoot } = useDesktopStore();
  const [visibleCount, setVisibleCount] = useState(0);
  const done = visibleCount >= bootLines.length;

  useEffect(() => {
    if (done) {
      const timeout = window.setTimeout(() => setBootCompleted(), 650);
      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => setVisibleCount((count) => count + 1), 420);
    return () => window.clearTimeout(timeout);
  }, [done, setBootCompleted, visibleCount]);

  const visibleLines = useMemo(() => bootLines.slice(0, visibleCount), [visibleCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-shell-950 px-6"
    >
      <div className="w-full max-w-3xl rounded-3xl border border-shell-500/20 bg-black/70 p-8 shadow-window backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-shell-400">TonyOS Boot Loader</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-100">Personal Portfolio Environment</h1>
          </div>
          <button
            type="button"
            onClick={skipBoot}
            className="rounded-full border border-white/15 px-4 py-2 text-xs text-slate-300 transition hover:border-shell-400/50 hover:text-white"
          >
            Skip boot
          </button>
        </div>
        <div className="rounded-2xl border border-white/10 bg-shell-950/80 p-5">
          {visibleLines.map((line) => (
            <div key={line} className="mb-2 text-sm text-accent-lime">
              {line}
            </div>
          ))}
          {!done && <div className="h-5 w-3 animate-blink rounded-sm bg-shell-400" />}
        </div>
      </div>
    </motion.div>
  );
}
