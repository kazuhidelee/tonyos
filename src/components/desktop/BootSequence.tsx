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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black px-4 py-6 text-white"
      onClick={() => {
        if (!bootStarted) {
          startBoot();
        }
      }}
    >
      <div className="relative w-full max-w-[1100px]">
        <img src="/bigcomputer.png" alt="" className="mx-auto w-full select-none" />

        <div className="absolute left-[29.8%] top-[6.7%] h-[43%] w-[40.7%] overflow-hidden bg-[#000080] px-[4.2%] py-[4.4%] shadow-[inset_0_0_32px_rgba(120,255,255,0.24)]">
          <div className="flex h-full flex-col text-left">
            <div className="mb-4">
              <pre className="overflow-hidden whitespace-pre text-center font-mono text-[5px] leading-[1.15] text-white sm:text-[7px] md:text-[9px] lg:text-[10px]">
                {titleArt || 'TonyOS'}
              </pre>
              <p className="mt-3 text-center text-[9px] text-white sm:text-[12px] md:text-[14px]">
                Tony Lee&apos;s Portfolio
              </p>
            </div>

            {!bootStarted ? (
              <div className="text-left font-mono text-[8px] leading-[1.65] text-white sm:text-[10px] md:text-[13px]">
                <div>System ready.</div>
                <div className="mt-3">Press Enter or Space to start booting.</div>
                <div className="mt-3 inline-block h-3 w-1.5 animate-blink bg-white align-middle md:h-4 md:w-2" />
              </div>
            ) : (
              <div className="font-mono text-[8px] leading-[1.65] text-white sm:text-[10px] md:text-[13px]">
                {visibleLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
                <div className="mt-3">{loadingBar}</div>
                {!done && <div className="inline-block h-3 w-1.5 animate-blink bg-white align-middle md:h-4 md:w-2" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
