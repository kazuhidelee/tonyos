import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BootSequence } from './components/desktop/BootSequence';
import { Desktop } from './components/desktop/Desktop';
import { useDesktopStore } from './store/useDesktopStore';

export default function App() {
  const { showBoot } = useDesktopStore();

  return (
    <>
      <AnimatePresence>{showBoot ? <BootSequence /> : null}</AnimatePresence>
      <Desktop />
    </>
  );
}
