import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { director } from '../engine/director';
import { SCENES, type SceneId } from '../data';
import { isFine } from '../engine/hooks';

/** Preloader: two red halves, Anton counter 000→100, lines slide up, halves split, intro fires. */
export function Preloader() {
  const [gone, setGone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const aboveRef = useRef<HTMLDivElement>(null);
  const belowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counter = counterRef.current;
    const above = aboveRef.current;
    const below = belowRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!counter || !above || !below || !top || !bottom) return;
    const digits = Array.from(counter.querySelectorAll<HTMLElement>('i'));

    document.documentElement.classList.add('locked');
    let fontsReady = false;
    void document.fonts.ready.then(() => {
      fontsReady = true;
      centerRef.current?.classList.add('lit');
    });
    const ready = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2200))]);

    const state = { v: 0 };
    const tl = gsap.timeline({ paused: true });
    tl.to(state, {
      v: 100,
      duration: 1.15,
      ease: 'power1.inOut',
      onUpdate: () => {
        const v = fontsReady ? state.v : Math.min(state.v, 96);
        const label = String(Math.max(0, Math.floor(v))).padStart(3, '0');
        for (let k = 0; k < 3; k++) {
          const d = digits[k];
          if (d && d.textContent !== label.charAt(k)) d.textContent = label.charAt(k);
        }
      },
    });
    tl.to([above, below], { y: -44, opacity: 0, duration: 0.4, ease: 'power2.in', stagger: 0.05 }, '+=0.05');
    tl.to(top, { yPercent: -101, duration: 1.0, ease: 'expo.inOut' }, '-=0.05');
    tl.to(bottom, { yPercent: 101, duration: 1.0, ease: 'expo.inOut' }, '<');
    tl.to(counter, { opacity: 0, scale: 0.94, duration: 0.5, ease: 'power2.in' }, '<');
    // The intro fires only once the curtain has fully cleared (the page is kept
    // hidden by html.locked until then), so no text is ever presented under a
    // partially open curtain — readable at every instant, not just at rest.
    tl.call(() => {
      document.documentElement.classList.remove('locked');
      director.start();
      setGone(true);
    });

    void ready.then(() => tl.play());

    return () => {
      tl.kill();
      document.documentElement.classList.remove('locked');
    };
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <div ref={topRef} className="pre-half pre-top" />
      <div ref={bottomRef} className="pre-half pre-bottom" />
      <div ref={centerRef} className="pre-center">
        <div ref={aboveRef} className="pre-line mono">
          TUSHAR KAPOOR — APPLIED AI
        </div>
        <div ref={counterRef} className="pre-count">
          <i>0</i>
          <i>0</i>
          <i>0</i>
        </div>
        <div ref={belowRef} className="pre-line mono">
          SYSTEMS THAT REASON · PORTFOLIO 2026
        </div>
      </div>
    </div>
  );
}

/**
 * Fixed HUD: first-name logo + ®, blurred pill nav, bottom-right progress rail.
 * Each element flips to white individually as the contact red sweep covers it,
 * so ink and paper never sit on top of each other.
 */
export function Hud() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Partial<Record<SceneId, HTMLButtonElement | null>>>({});
  const pctRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const entries: Array<{ key: string; el: HTMLElement | null }> = [
      { key: 'invert-logo', el: logoRef.current },
      { key: 'invert-nav', el: navRef.current },
      { key: 'invert-prog', el: progRef.current },
    ];
    const rects = new Map<string, { top: number; right: number; height: number; width: number }>();
    let pctBox: { top: number; height: number } | null = null;
    const measure = () => {
      for (const en of entries) {
        if (!en.el) continue;
        const r = en.el.getBoundingClientRect();
        rects.set(en.key, { top: r.top, right: r.right, height: r.height, width: r.width });
      }
      const p = pctRef.current?.getBoundingClientRect();
      pctBox = p && p.width > 0 ? { top: p.top, height: p.height } : null;
    };
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    const unsub = director.subscribe((f) => {
      for (const s of SCENES) {
        const el = pillRefs.current[s.id];
        if (!el) continue;
        const on = f.active === s.id;
        if (el.classList.contains('on') !== on) el.classList.toggle('on', on);
      }
      const pct = Math.round(f.progress * 100);
      const label = `${String(pct).padStart(3, '0')}%`;
      if (pctRef.current && pctRef.current.textContent !== label) pctRef.current.textContent = label;
      if (railRef.current) railRef.current.style.transform = `scaleY(${f.progress.toFixed(4)})`;

      const cs = f.scenes.contact;
      const root = rootRef.current;
      if (!cs || !root) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const skew = 0.2 * vh;
      const e = -skew + (vw + 2 * skew) * cs.p;
      for (const en of entries) {
        const r = rects.get(en.key);
        let on =
          !!r &&
          r.width > 0 &&
          e + skew - (2 * skew) / vh * (r.top + r.height / 2) >= r.right - 24;
        if (en.key === 'invert-prog' && pctBox) {
          // The skills marquee tape is a rotated, full-width red band pinned to
          // the scene bottom; while it sits under the progress readout, flip
          // the rail to paper as well (same language as the contact sweep).
          const sk = f.scenes.skills;
          const compact = vw < 820;
          const topOff = compact ? 0.89 : 0.855; // 1 − tape bottom − its height
          const lift = Math.sin((2 * Math.PI) / 180) * (vw / 2 - (compact ? vw * 0.06 : 28));
          const tapeTop = (1 - sk.enter) * vh - sk.exit * vh + vh * topOff - lift;
          const tapeBottom = tapeTop + vh * (compact ? 0.08 : 0.1);
          if (tapeTop < pctBox.top + pctBox.height && tapeBottom > pctBox.top) on = true;
        }
        if (root.classList.contains(en.key) !== on) root.classList.toggle(en.key, on);
      }
    });

    return () => {
      unsub();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="hud" ref={rootRef}>
      <header className="hud-top">
        <button
          ref={logoRef}
          className="hud-logo"
          onClick={() => director.scrollTop()}
          data-cursor="Go"
          aria-label="TUSHAR — back to top"
        >
          TUSHAR
          <span className="hud-reg" aria-hidden="true">®</span>
        </button>
        <nav ref={navRef} className="hud-nav" aria-label="Sections">
          {SCENES.map((s) => (
            <button
              key={s.id}
              ref={(el) => {
                pillRefs.current[s.id] = el;
              }}
              className="hud-pill"
              onClick={() => director.scrollTo(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>
      <div ref={progRef} className="hud-progress" aria-hidden="true">
        <span ref={pctRef} className="mono hud-pct">
          000%
        </span>
        <span className="hud-rail">
          <i ref={railRef} />
        </span>
      </div>
    </div>
  );
}

/** Custom cursor: 8px red dot + 42px ring that lerps behind at 0.16 and grows to 92px. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label || !isFine()) return;

    document.body.classList.add('has-cursor');
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickSetter(dot, 'x', 'px');
    const dotY = gsap.quickSetter(dot, 'y', 'px');
    const ringX = gsap.quickSetter(ring, 'x', 'px');
    const ringY = gsap.quickSetter(ring, 'y', 'px');
    dotX(mx);
    dotY(my);
    ringX(rx);
    ringY(ry);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dotX(mx);
      dotY(my);
    };
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      if (t) {
        const text = t.getAttribute('data-cursor') ?? '';
        if (label.textContent !== text) label.textContent = text;
        ring.classList.add('grow');
      } else {
        ring.classList.remove('grow');
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ringX(rx);
      ringY(ry);
    };
    gsap.ticker.add(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cur-dot" aria-hidden="true" />
      <div ref={ringRef} className="cur-ring" aria-hidden="true">
        <span ref={labelRef} className="cur-label mono" />
      </div>
    </>
  );
}
