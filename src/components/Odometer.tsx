import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { smoothstep } from '../engine/hooks';

export interface OdometerHandle {
  set: (value: number) => void;
}

interface OdometerProps {
  value: number;
  decimals?: number;
  /** Snap the lowest digit (mechanical carry). Off = continuous roll. */
  snapLow?: boolean;
  className?: string;
}

const STRIP = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

/**
 * Mechanical odometer: digit columns 0–9,0 whose strips are translated
 * by an imperative `set()` call — driven from the scroll engine with no re-renders.
 */
export const Odometer = forwardRef<OdometerHandle, OdometerProps>(function Odometer(
  { value, decimals = 0, snapLow = true, className },
  ref,
) {
  const cols = useRef<(HTMLSpanElement | null)[]>([]);
  const finalDigits = String(Math.round(value * 10 ** decimals));
  const len = finalDigits.length;

  useImperativeHandle(
    ref,
    () => ({
      set(v: number) {
        const target = Math.max(0, v) * 10 ** decimals;
        for (let i = 0; i < len; i++) {
          const strip = cols.current[i];
          if (!strip) continue;
          /**
           * Mechanical carry: a column advances into its neighbour only in the
           * last 10% of that neighbour's roll (the 9→0 carry window), so every
           * column rests on exact integers. The lowest column rolls
           * continuously when snapLow is off.
           */
          const scaled = target / 10 ** i;
          const base = Math.floor(scaled) % 10;
          const frac = scaled - Math.floor(scaled);
          const pos = base + (i === 0 && !snapLow ? frac : smoothstep(0.9, 1, frac));
          const t = `translateY(${(-pos).toFixed(4)}em)`;
          const memo = strip as HTMLElement & { __t?: string };
          if (memo.__t === t) continue;
          memo.__t = t;
          strip.style.transform = t;
        }
      },
    }),
    [len, decimals, snapLow],
  );

  const digits: ReactNode[] = [];
  for (let pos = len - 1; pos >= 0; pos--) {
    digits.push(
      <span key={`c${pos}`} className="odo-col">
        <span
          className="odo-strip"
          ref={(el) => {
            cols.current[pos] = el;
          }}
        >
          {STRIP.map((d, di) => (
            <span key={di} className="odo-digit">
              {d}
            </span>
          ))}
        </span>
      </span>,
    );
    if (decimals > 0 && pos === decimals) {
      digits.push(
        <span key={`d${pos}`} className="odo-dot">
          .
        </span>,
      );
    }
  }

  return (
    <span className={`odo ${className ?? ''}`} aria-label={String(value)} role="text">
      {digits}
    </span>
  );
});
