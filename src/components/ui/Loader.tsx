import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

const Loader = () => {
  const { active, progress } = useProgress();
  const [show, setShow] = useState(true);

  // Keep loader visible for at least a minimum time to avoid flash,
  // and wait until progress is 100 or no longer active
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!active && progress === 100) {
      timeout = setTimeout(() => setShow(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [active, progress]);

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
                transition={{ ease: "linear" }}
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
