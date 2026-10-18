import Lenis from 'lenis';
import { gsap } from 'gsap';
import { SCENES, type SceneId } from '../data';

export type { SceneId };

export interface SceneState {
  id: SceneId;
  top: number;
  height: number;
  enter: number;
  p: number;
  exit: number;
  vis: number;
  active: boolean;
}

export interface DirectorFrame {
  y: number;
  progress: number;
  active: SceneId;
  time: number;
  scenes: Record<SceneId, SceneState>;
}

type FrameListener = (frame: DirectorFrame) => void;
type IntroListener = () => void;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Active-scene lead, in viewport heights. */
const LEAD = 0.78;

const emptyScene = (id: SceneId): SceneState => ({
  id,
  top: Number.MAX_SAFE_INTEGER,
  height: 1,
  enter: 0,
  p: 0,
  exit: 0,
  vis: 0,
  active: false,
});

class Director {
  private lenis: Lenis | null = null;
  private ticker: ((time: number) => void) | null = null;
  private listeners = new Set<FrameListener>();
  private introListeners = new Set<IntroListener>();
  private introDone = false;
  private els = new Map<SceneId, HTMLElement>();
  private cache = new Map<SceneId, { top: number; height: number }>();
  private ro: ResizeObserver | null = null;
  private frame: DirectorFrame = {
    y: 0,
    progress: 0,
    active: 'hero',
    time: 0,
    scenes: Object.fromEntries(SCENES.map((s) => [s.id, emptyScene(s.id)])) as Record<SceneId, SceneState>,
  };

  init(): void {
    if (this.lenis) return;
    history.scrollRestoration = 'manual';

    this.lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });
    this.lenis.stop();

    this.scan();
    this.ro = new ResizeObserver(() => this.measure());
    this.els.forEach((el) => this.ro?.observe(el));
    window.addEventListener('resize', this.measure);

    this.ticker = (time: number) => {
      this.lenis?.raf(time * 1000);
      this.update(time);
    };
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(this.ticker);
    this.update(0);
  }

  destroy(): void {
    if (this.ticker) gsap.ticker.remove(this.ticker);
    this.ticker = null;
    this.lenis?.destroy();
    this.lenis = null;
    this.ro?.disconnect();
    this.ro = null;
    window.removeEventListener('resize', this.measure);
    this.listeners.clear();
    this.introListeners.clear();
    this.introDone = false;
  }

  /** Collect scene elements from the DOM. Safe to call again if sections mount late. */
  scan(): void {
    this.els.clear();
    for (const s of SCENES) {
      const el = document.querySelector<HTMLElement>(`[data-scene="${s.id}"]`);
      if (el) this.els.set(s.id, el);
    }
    this.measure();
  }

  /** Cache each section's top and height. */
  private measure = (): void => {
    const y = window.scrollY;
    this.els.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      this.cache.set(id, { top: r.top + y, height: r.height });
    });
  };

  private update(time: number): void {
    const vh = window.innerHeight || 1;
    const y = window.scrollY;
    const docH = Math.max(1, document.documentElement.scrollHeight - vh);
    let active: SceneId = SCENES[0].id;

    const scenes = {} as Record<SceneId, SceneState>;
    for (const s of SCENES) {
      const c = this.cache.get(s.id) ?? { top: Number.MAX_SAFE_INTEGER, height: 1 };
      const travel = Math.max(1, c.height - vh);
      const enter = clamp01((y - (c.top - vh)) / vh);
      const p = clamp01((y - c.top) / travel);
      const exit = clamp01((y - (c.top + c.height - vh)) / vh);
      const vis = clamp01(Math.min(enter * 1.6, 1 - exit * 2.2));
      scenes[s.id] = { id: s.id, top: c.top, height: c.height, enter, p, exit, vis, active: false };
      if (y >= c.top - LEAD * vh) active = s.id;
    }
    scenes[active].active = true;

    this.frame = { y, progress: clamp01(y / docH), active, time, scenes };
    this.listeners.forEach((fn) => {
      fn(this.frame);
    });
  }

  subscribe(fn: FrameListener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  onIntro(fn: IntroListener): () => void {
    if (this.introDone) {
      fn();
      return () => {};
    }
    this.introListeners.add(fn);
    return () => {
      this.introListeners.delete(fn);
    };
  }

  /** Called by the preloader when it finishes: fires intro, starts scroll. */
  start(): void {
    if (this.introDone) return;
    this.introDone = true;
    this.lenis?.start();
    this.introListeners.forEach((fn) => {
      fn();
    });
    this.introListeners.clear();
  }

  scrollTo(id: SceneId): void {
    const el = this.els.get(id);
    if (!el || !this.lenis) return;
    this.lenis.scrollTo(el, { duration: 2.2, easing: (t) => 1 - (1 - t) ** 4 });
  }

  scrollTop(): void {
    this.lenis?.scrollTo(0, { duration: 1.6, easing: (t) => 1 - (1 - t) ** 4 });
  }

  get started(): boolean {
    return this.introDone;
  }
}

export const director = new Director();
