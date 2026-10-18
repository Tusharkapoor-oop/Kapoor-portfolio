import { useRef } from 'react';
import { applyReveals, clamp01, easeInOutSine, easeOutCubic, useScene } from '../engine/hooks';
import { Odometer, type OdometerHandle } from '../components/Odometer';
import { JOURNEY, SECTION_LABELS, sceneHeight } from '../data';

export function Journey() {
  const innerRef = useRef<HTMLDivElement>(null);
  const yearOdo = useRef<OdometerHandle>(null);
  const pathRef = useRef<SVGLineElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);

  useScene('journey', (s) => {
    const draw = easeOutCubic(clamp01((s.p - 0.08) / 0.55));

    yearOdo.current?.set(JOURNEY.fromYear + easeInOutSine(s.p) * (JOURNEY.toYear - JOURNEY.fromYear));

    if (pathRef.current) {
      pathRef.current.style.strokeDashoffset = String(1 - draw);
    }

    JOURNEY.items.forEach((_, i) => {
      const el = itemRefs.current[i];
      const node = nodeRefs.current[i];
      const threshold = 0.14 + i * 0.27;
      const t = easeOutCubic(clamp01((draw - threshold) / 0.22));
      if (el) {
        el.style.opacity = t.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - t) * 18).toFixed(1)}px, 0) rotateY(${((1 - t) * -55).toFixed(1)}deg)`;
      }
      node?.classList.toggle('on', draw >= threshold);
    });

    applyReveals(innerRef.current, s.enter, s.exit);
  });

  return (
    <section id="journey" data-scene="journey" className="scene" style={{ height: sceneHeight('journey') }}>
      <div className="scene-inner" ref={innerRef}>
        <span className="journey-year" aria-hidden="true">
          <Odometer ref={yearOdo} value={JOURNEY.toYear} snapLow={false} />
        </span>
        <div className="journey-col">
          <p className="slabel rv" data-rv="0">
            <b>({SECTION_LABELS.journey?.n})</b> — {SECTION_LABELS.journey?.name}
          </p>
          <h2 className="journey-title rv" data-rv="1">
            <span className="jt-line">LEARNING</span>
            <span className="jt-line red">OUT LOUD.</span>
          </h2>
          <ul className="jtl">
            <svg className="jtl-svg" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="2" y1="0" x2="2" y2="100" pathLength={1} ref={pathRef} className="jtl-line" />
            </svg>
            {JOURNEY.items.map((it, i) => (
              <li
                key={it.year}
                className="jtl-item"
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
              >
                <span
                  className="jtl-node"
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                />
                <span className="jtl-year mono">{it.year}</span>
                <h3 className="jtl-title">{it.title}</h3>
                <p className="jtl-org">{it.org}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
