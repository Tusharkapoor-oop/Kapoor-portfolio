import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { isFine } from '../engine/hooks';

/** Glass card that tilts toward the cursor (±14°) with a moving radial glare. */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFine()) return;
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / Math.max(1, r.width);
      const py = (e.clientY - r.top) / Math.max(1, r.height);
      ry((px - 0.5) * 28);
      rx((0.5 - py) * 28);
      el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div ref={ref} className={`tilt ${className ?? ''}`}>
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  );
}
