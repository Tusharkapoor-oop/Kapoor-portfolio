import { useEffect, useRef } from 'react';
import { applyReveals, prefersReduced, useFrame } from '../engine/hooks';
import { SECTION_LABELS, SKILLS, sceneHeight } from '../data';

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function fibPoint(i: number, n: number): [number, number, number] {
  const y = n <= 1 ? 0 : 1 - (i / (n - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = i * GOLDEN;
  return [Math.cos(theta) * r, y, Math.sin(theta) * r];
}

const POINTS = SKILLS.map((_, i) => fibPoint(i, SKILLS.length));

export function Skills() {
  const innerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLSpanElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerChipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tapeRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((f) => {
    const s = f.scenes.skills;
    const orbit = orbitRef.current;
    if (!s || !orbit) return;

    mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;

    const reduced = prefersReduced();
    const spin = (reduced ? 0 : f.time * 0.12) + s.p * 5 + mouse.current.x * 0.4;
    const tilt = -0.28 + mouse.current.y * 0.12;

    if (stageRef.current) {
      stageRef.current.style.opacity = s.vis.toFixed(3);
    }
    orbit.style.transform = `rotateX(${tilt.toFixed(4)}rad) rotateY(${spin.toFixed(4)}rad)`;
    if (coreRef.current) {
      coreRef.current.style.opacity = s.vis.toFixed(3);
    }

    const mobile = window.innerWidth < 820;
    const R = Math.min(window.innerWidth * (mobile ? 0.36 : 0.27), window.innerHeight * 0.46);
    const cos = Math.cos(spin);
    const sin = Math.sin(spin);

    for (let i = 0; i < SKILLS.length; i++) {
      const chip = chipRefs.current[i];
      const inner = innerChipRefs.current[i];
      if (!chip || !inner) continue;
      const [x0, y0, z0] = POINTS[i];
      const z1 = -x0 * sin + z0 * cos;
      chip.classList.toggle('zback', z1 < 0);
      chip.style.transform = `translate3d(${(x0 * R).toFixed(1)}px, ${(y0 * 0.78 * R).toFixed(1)}px, ${(z0 * R).toFixed(1)}px)`;
      inner.style.transform = `translate(-50%, -50%) rotateY(${(-spin).toFixed(4)}rad) rotateX(${(-tilt).toFixed(4)}rad)`;
    }

    if (tapeRef.current) {
      tapeRef.current.style.transform = `translate3d(${(-s.p * 30).toFixed(2)}%, 0, 0)`;
    }

    applyReveals(innerRef.current, s.enter, s.exit);
  });

  return (
    <section id="skills" data-scene="skills" className="scene" style={{ height: sceneHeight('skills') }}>
      <div className="scene-inner" ref={innerRef}>
        <div className="skills-head">
          <p className="slabel rv" data-rv="0">
            <b>({SECTION_LABELS.skills?.n})</b> — {SECTION_LABELS.skills?.name}
          </p>
          <h2 className="skills-title rv" data-rv="1">
            <span className="jt-line">EVERYTHING</span>
            <span className="jt-line red">IN ORBIT.</span>
          </h2>
        </div>
        <span className="orbit-core" ref={coreRef} aria-hidden="true" />
        <div className="orbit-stage" ref={stageRef} aria-hidden="true">
          <div className="orbit" ref={orbitRef}>
            {SKILLS.map((sk, i) => (
              <div
                className="orbit-chip"
                key={sk}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
              >
                <span
                  className="orbit-chip-in mono"
                  ref={(el) => {
                    innerChipRefs.current[i] = el;
                  }}
                >
                  {sk}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="tape" aria-hidden="true">
          <div className="tape-track" ref={tapeRef}>
            {[...SKILLS, ...SKILLS].map((sk, i) => (
              <span className="tape-item" key={`${sk}-${i}`}>
                {sk}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>
        <ul className="sr-only">
          {SKILLS.map((sk) => (
            <li key={sk}>{sk}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
