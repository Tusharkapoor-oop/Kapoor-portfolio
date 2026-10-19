import { Suspense, lazy, useEffect, useState } from 'react';
import { director } from './engine/director';
import { SCENES } from './data';
import { Cursor, Hud, Preloader } from './components/Chrome';
import { Hero } from './scenes/Hero';

/**
 * Only the hero is critical for the first paint. The other six scenes are
 * identical-size CSS-composed sections with inline heights; their chunks are
 * requested during the (fullscreen) preloader intro and mount before the user
 * can scroll (lenis stays locked until director.start()). This keeps the
 * render-blocking script small (deferred parse cost) while preserving geometry:
 * each scene's own section carries its data-scene marker and height.
 */
const About = lazy(() => import('./scenes/About').then((m) => ({ default: m.About })));
const Work = lazy(() => import('./scenes/Work').then((m) => ({ default: m.Work })));
const Journey = lazy(() => import('./scenes/Journey').then((m) => ({ default: m.Journey })));
const Skills = lazy(() => import('./scenes/Skills').then((m) => ({ default: m.Skills })));
const Awards = lazy(() => import('./scenes/Awards').then((m) => ({ default: m.Awards })));
const Contact = lazy(() => import('./scenes/Contact').then((m) => ({ default: m.Contact })));

const idle = (fn: () => void): (() => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    const h = window.requestIdleCallback(fn);
    return () => window.cancelIdleCallback(h);
  }
  const h = window.setTimeout(fn, 0);
  return () => window.clearTimeout(h);
};

export default function App() {
  const [scenesMounted, setScenesMounted] = useState(false);

  useEffect(() => {
    director.init();
    return () => director.destroy();
  }, []);

  // Ask for the scene chunks in an idle slot so the hero/preloader first paint
  // is not competing with module fetch + evaluation.
  useEffect(() => idle(() => setScenesMounted(true)), []);

  // Re-scan once the deferred scenes are actually in the DOM (the director
  // measured the hero at init; scene tops/heights change when these arrive).
  useEffect(() => {
    if (!scenesMounted) return;
    let raf = 0;
    let tries = 0;
    const settle = () => {
      const missing = SCENES.some((s) => !document.querySelector(`[data-scene="${s.id}"]`));
      if (!missing) {
        director.scan();
        return;
      }
      if (++tries < 120) raf = requestAnimationFrame(settle);
    };
    raf = requestAnimationFrame(settle);
    return () => cancelAnimationFrame(raf);
  }, [scenesMounted]);

  return (
    <>
      <Preloader />
      <Cursor />
      <Hud />
      <main>
        <Hero />
        <Suspense fallback={null}>
          {scenesMounted && (
            <>
              <About />
              <Work />
              <Journey />
              <Skills />
              <Awards />
              <Contact />
            </>
          )}
        </Suspense>
      </main>
    </>
  );
}
