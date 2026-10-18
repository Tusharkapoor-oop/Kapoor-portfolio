import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

// If the 3D layer never reports progress (no WebGL, blocked asset, failed chunk),
// reveal the site anyway instead of leaving a permanent black screen.
const MAX_WAIT_MS = 4000;
const HIDE_DELAY_MS = 500;

const Loader = () => {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Progress comes from Background3D via CustomEvents so that this eagerly
    // loaded component never imports three.js/drei (keeps them off the critical path).
    const onProgress = (e: Event) => {
      const value = (e as CustomEvent<number>).detail;
      if (typeof value === 'number') setProgress(value);
    };
    const onReady = () => setReady(true);

    window.addEventListener('bg3d-progress', onProgress);
    window.addEventListener('bg3d-ready', onReady);
    const maxWait = window.setTimeout(() => setReady(true), MAX_WAIT_MS);

    return () => {
      window.removeEventListener('bg3d-progress', onProgress);
      window.removeEventListener('bg3d-ready', onReady);
      window.clearTimeout(maxWait);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setShow(false), HIDE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [ready]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground"
        >
          <div className="relative flex flex-col items-center gap-6">
            <div className="flex items-center gap-1 font-mono text-2xl font-semibold tracking-wider text-muted">
              <span>TK</span>
              <span className="text-accent animate-pulse">_</span>
            </div>

            <div className="h-1 w-48 overflow-hidden rounded-full bg-cardBorder">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="font-mono text-xs text-muted/60 absolute -bottom-8">
              {Math.round(progress)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
