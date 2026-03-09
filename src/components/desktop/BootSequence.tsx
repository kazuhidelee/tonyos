import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';

const bootLines = [
  'Booting TonyOS...',
  'Initializing system modules...',
  'Mounting portfolio filesystem...',
  'Starting desktop environment...',
  'Launching window manager...',
];

export function BootSequence() {
  const { bootStarted, startBoot, setBootCompleted } = useDesktopStore();
  const [visibleCount, setVisibleCount] = useState(0);
  const [titleArt, setTitleArt] = useState('');
  const done = visibleCount >= bootLines.length;
  const progress = Math.min(visibleCount / bootLines.length, 1);
  const barWidth = 24;
  const filled = Math.round(progress * barWidth);
  const loadingBar = `[${'#'.repeat(filled)}${'.'.repeat(barWidth - filled)}] ${Math.round(progress * 100)}%`;

  useEffect(() => {
    let cancelled = false;

    fetch('/tonyOS.txt')
      .then((response) => response.text())
      .then((text) => {
        if (!cancelled) {
          setTitleArt(text);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTitleArt('TonyOS');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!bootStarted) {
      return;
    }
    if (done) {
      const timeout = window.setTimeout(() => setBootCompleted(), 650);
      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => setVisibleCount((count) => count + 1), 420);
    return () => window.clearTimeout(timeout);
  }, [bootStarted, done, setBootCompleted, visibleCount]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (bootStarted) {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        startBoot();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bootStarted, startBoot]);

  const visibleLines = useMemo(() => bootLines.slice(0, visibleCount), [visibleCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#000080] px-6 text-white"
      onClick={() => {
        if (!bootStarted) {
          startBoot();
        }
      }}
    >
      <div className="flex w-full max-w-4xl flex-col items-center justify-center text-center">
        <div className="mb-6 w-full">
          <pre className="overflow-x-auto whitespace-pre text-center font-mono text-[10px] leading-[1.15] text-white sm:text-[12px]">
            {titleArt || 'TonyOS'}
          </pre>
          <p className="mt-4 text-[18px] text-white">Tony Lee&apos;s Portfolio</p>
        </div>

        {!bootStarted ? (
          <div className="w-full max-w-2xl text-left font-mono text-[16px] leading-7 text-white">
            <div>System ready.</div>
            <div className="mt-4">Press Enter or Space to start booting.</div>
            <div className="mt-4 inline-block h-4 w-2 animate-blink bg-white align-middle" />
          </div>
        ) : (
          <div className="w-full max-w-2xl text-left font-mono text-[16px] leading-7 text-white">
            {visibleLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
            <div className="mt-4">{loadingBar}</div>
            {!done && <div className="inline-block h-4 w-2 animate-blink bg-white align-middle" />}
          </div>
        )}
      </div>
    </motion.div>
  );
}
