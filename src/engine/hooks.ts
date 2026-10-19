import { useEffect, useRef } from 'react';
import { director, type DirectorFrame, type SceneId, type SceneState } from './director';

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;

export const easeOutQuart = (t: number): number => 1 - (1 - t) ** 4;

export const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const isFine = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const prefersReduced = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Subscribe to every director tick. The callback ref is kept fresh, so inline closures are safe. */
export function useFrame(cb: (frame: DirectorFrame) => void): void {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(
    () =>
      director.subscribe((f) => {
        ref.current(f);
      }),
    [],
  );
}

/**
 * Subscribe to a single scene's progress.
 *
 * Handlers are skipped entirely for scenes that are fully offscreen — either
 * not reached yet (`enter 0 · p 0 · exit 0`) or fully scrolled past
 * (`exit ≥ 1`) — so per-frame work stays proportional to what is on screen.
 * (Pre-existing versions of this hook ran every handler every tick.)
 */
export function useScene(id: SceneId, cb: (state: SceneState, frame: DirectorFrame) => void): void {
  useFrame((f) => {
    const s = f.scenes[id];
    if (!s) return;
    const offscreen = (s.enter === 0 && s.p === 0 && s.exit === 0) || s.exit >= 1;
    if (offscreen) return;
    cb(s, f);
  });
}

/**
 * Generic reveal for elements marked `.rv`: fades/translates in on enter,
 * fades out fast on exit (`1 - exit * 2.4`) so sections never overlap.
 * Stagger via `data-rv="i"`.
 * The `.rv` list is queried once per root and cached — tick handlers must not
 * run querySelectorAll every frame.
 */
const rvCache = new WeakMap<HTMLElement, HTMLElement[]>();

function rvList(root: HTMLElement): HTMLElement[] {
  let list = rvCache.get(root);
  if (!list) {
    list = Array.from(root.querySelectorAll<HTMLElement>('.rv'));
    rvCache.set(root, list);
  }
  return list;
}

export function applyReveals(root: HTMLElement | null | undefined, enter: number, exit: number): void {
  if (!root) return;
  const els = rvList(root);
  for (const el of els) {
    const i = Number(el.dataset.rv ?? 0);
    const e = easeOutCubic(clamp01((enter - i * 0.06) / 0.7));
    const o = e * clamp01(1 - exit * 2.4);
    const oStr = o.toFixed(3);
    if ((el as HTMLElement & { __o?: string }).__o === oStr) continue;
    (el as HTMLElement & { __o?: string }).__o = oStr;
    el.style.opacity = oStr;
    el.style.transform = `translate3d(0, ${((1 - e) * 30).toFixed(2)}px, 0)`;
  }
}

/** Identical-per-frame inline writes are skipped (style invalidation guard). */
export function put(el: HTMLElement | null, prop: string, value: string): void {
  if (!el) return;
  const memo = el as HTMLElement & { __pu?: string };
  const key = prop + '\u0000' + value;
  if (memo.__pu === key) return;
  memo.__pu = key;
  (el.style as unknown as Record<string, string>)[prop] = value;
}
