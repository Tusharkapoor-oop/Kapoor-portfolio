import { useRef } from 'react';
import { applyReveals, clamp01, easeOutCubic, useScene } from '../engine/hooks';
import { CERTS, CODING, SECTION_LABELS, sceneHeight } from '../data';

export function Awards() {
  const innerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cylRef = useRef<HTMLDivElement>(null);

  useScene('awards', (s) => {
    CODING.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const t = easeOutCubic(clamp01((s.enter - i * 0.09) / 0.65));
      el.style.opacity = t.toFixed(3);
      el.style.transform = `perspective(900px) rotateX(${((1 - t) * -100).toFixed(1)}deg)`;
    });

    if (cylRef.current) {
      const deg = -s.p * (360 - 360 / CERTS.length);
      cylRef.current.style.transform = `translateZ(-360px) rotateX(-14deg) rotateY(${deg.toFixed(2)}deg)`;
    }

    applyReveals(innerRef.current, s.enter, s.exit);
  });

  return (
    <section id="awards" data-scene="awards" className="scene" style={{ height: sceneHeight('awards') }}>
      <div className="scene-inner" ref={innerRef}>
        <div className="awards-col">
          <h2 className="slabel rv" data-rv="0">
            <b>({SECTION_LABELS.awards?.n})</b> — {SECTION_LABELS.awards?.name}
          </h2>
          <div className="awards-row">
            {CODING.map((c, i) => (
              <div
                className={`award-card ${i % 2 === 0 ? 'red' : 'ink'}`}
                key={c.label}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <span className="award-num">
                  {c.value}
                  <i>{c.suffix}</i>
                </span>
                <span className="award-label mono">{c.label}</span>
                <span className="award-note mono">{c.note}</span>
              </div>
            ))}
          </div>
          <div className="cyl-zone rv" data-rv="1">
            <div className="cyl-scale">
              <div className="cyl" ref={cylRef}>
                {CERTS.map((c, i) => (
                  <div
                    className="cert"
                    key={c.title}
                    style={{ transform: `rotateY(${(360 / CERTS.length) * i}deg) translateZ(360px)` }}
                  >
                    <div className={`cert-face cert-front ${i % 3 === 0 ? 'red' : ''}`}>
                      <span className="cert-title">{c.title}</span>
                      <span className="cert-bottom">
                        <span className="cert-sub mono">{c.sub}</span>
                        <span className="cert-year mono">{c.year}</span>
                      </span>
                      <span className="cert-seal">✓</span>
                    </div>
                    <div className="cert-face cert-back">
                      <span className="cert-back-mark mono">TK · CERTIFIED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
