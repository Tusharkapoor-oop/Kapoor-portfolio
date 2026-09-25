import { useEffect, useRef } from 'react';

type P = { x: number; y: number; r: number; a: number; s: number; o: number };

/**
 * HeroBackground — meditative scholar + cosmic breath.
 * Layer 1: static warm-gold lamplight (CSS radial gradients).
 * Layer 2: faint sacred-geometry line texture (inline SVG, ~4% opacity).
 * Layer 3: slow gold dust drifting inward (tiny canvas, heavily guarded).
 * All layers aria-hidden; text always sits above on a scrim.
 */
const HeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const COUNT = coarse ? 18 : 45;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const parts: P[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      parts.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = (0.35 + Math.random() * 0.65) * Math.max(w, h);
        parts.push({
          x: w * 0.42 + Math.cos(ang) * dist,
          y: h * 0.42 + Math.sin(ang) * dist,
          r: 0.6 + Math.random() * 1.4,
          a: 0.05 + Math.random() * 0.16,
          s: 0.08 + Math.random() * 0.22,
          o: Math.random() * Math.PI * 2,
        });
      }
    };

    let t = 0;
    const tick = () => {
      if (!running) return;
      t += 1 / 60;
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.42;
      const cy = h * 0.42;
      for (const p of parts) {
        // slow inward drift + gentle shimmer
        const dx = cx - p.x;
        const dy = cy - p.y;
        const d = Math.hypot(dx, dy) || 1;
        p.x += (dx / d) * p.s;
        p.y += (dy / d) * p.s;
        p.o += 0.008;
        if (d < 60) {
          const ang = Math.random() * Math.PI * 2;
          const dist = (0.5 + Math.random() * 0.5) * Math.max(w, h);
          p.x = cx + Math.cos(ang) * dist;
          p.y = cy + Math.sin(ang) * dist;
        }
        const tw = p.a * (0.7 + 0.3 * Math.sin(p.o));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 163, 61, ${tw.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVis = (entries: IntersectionObserverEntry[]) => {
      const vis = entries[0]?.isIntersecting ?? true;
      if (vis && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!vis && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(onVis, { threshold: 0 });
    io.observe(canvas);

    resize();
    seed();
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', () => {
      resize();
      seed();
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
      {/* Layer 1 — lamplight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(52rem 30rem at 12% 8%, rgba(232,163,61,0.10), transparent 62%), radial-gradient(40rem 24rem at 45% 78%, rgba(232,93,42,0.06), transparent 65%)',
        }}
      />
      {/* Layer 2 — geometry, dissolves before the text */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{
          opacity: 0.05,
          willChange: 'transform',
          transform: 'translateZ(0)',
          maskImage: 'radial-gradient(46rem 30rem at 38% 42%, black 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(46rem 30rem at 38% 42%, black 30%, transparent 78%)',
        }}
      >
        <g fill="none" stroke="#E8A33D" strokeWidth="1">
          {[70, 130, 200, 280, 370, 470].map((r) => (
            <circle key={r} cx="460" cy="340" r={r} />
          ))}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * Math.PI) / 12;
            return (
              <line
                key={i}
                x1={460 - 470 * Math.cos(a)}
                y1={340 - 470 * Math.sin(a)}
                x2={460 + 470 * Math.cos(a)}
                y2={340 + 470 * Math.sin(a)}
                opacity={i % 2 === 0 ? 0.9 : 0.45}
              />
            );
          })}
          <circle cx="460" cy="340" r="10" />
        </g>
      </svg>
      {/* Layer 3 — breath */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 h-full w-full" 
        style={{ willChange: 'transform', transform: 'translateZ(0)' }} 
      />
      {/* Scrim — text always wins */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(14,14,12,0.25), transparent 35%, transparent 65%, rgba(14,14,12,0.45))',
        }}
      />
    </div>
  );
};

export default HeroBackground;
