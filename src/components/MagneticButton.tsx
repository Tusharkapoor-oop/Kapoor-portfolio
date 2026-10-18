import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';
import { gsap } from 'gsap';
import { isFine } from '../engine/hooks';

interface MagProps {
  children: string;
  variant?: 'red' | 'outline';
  href?: string;
  external?: boolean;
  cursor?: string;
  onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

/**
 * Pill button (58px) with magnetic motion (elastic, strength 0.35),
 * sliding fill on hover, and the duplicated "roll" label.
 */
export function Mag({ children, variant = 'red', href, external, cursor, onClick, className }: MagProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFine()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <a
      ref={ref}
      className={`btn btn-${variant} ${className ?? ''}`}
      href={href}
      onClick={onClick}
      data-cursor={cursor}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <span className="btn-fill" aria-hidden="true" />
      <span className="btn-roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </a>
  );
}
