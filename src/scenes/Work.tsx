import { useRef } from 'react';
import { applyReveals, clamp01, easeInOutSine, easeOutCubic, smoothstep, useScene } from '../engine/hooks';
import { IDENTITY, PROJECTS, SECTION_LABELS, sceneHeight } from '../data';

export function Work() {
  const innerRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const chatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const needleRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  useScene('work', (s) => {
    const p = s.p;
    const vh = window.innerHeight;

    if (floorRef.current) {
      floorRef.current.style.backgroundPositionY = `${Math.round(p * 180)}px`;
    }

    if (deckRef.current) {
      const e = easeOutCubic(clamp01(s.enter * 1.2));
      deckRef.current.style.transform = `translate3d(0, ${((1 - e) * 18).toFixed(2)}vh, 0) rotateY(${((1 - e) * -25).toFixed(2)}deg)`;
      deckRef.current.style.opacity = (clamp01(s.enter * 1.4) * clamp01(1 - s.exit * 2.2)).toFixed(3);
    }

    const N = PROJECTS.length;
    const p1 = Math.min(N - 1, p * (N - 1));
    const j = Math.min(N - 2, Math.floor(p1));
    const f = easeInOutSine(clamp01(p1 - j));
    /** crossfade key — cards swap only in the last quarter of each card's window */
    const k = smoothstep(0.72, 1, f);
    const activeIdx = f > 0.845 && j + 1 < N ? j + 1 : j;

    for (let i = 0; i < N; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      let o = 0;
      let y = 0;
      let z = 0;
      let rx = 0;
      if (i === j) {
        o = 1 - k;
        y = -0.12 * f * vh;
        z = 900 * f;
        rx = 28 * f;
      } else if (i === j + 1) {
        o = k;
        const d = f - 1;
        y = 0.032 * d * vh;
        z = 300 * d;
        rx = 12 * d;
      }
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, ${z.toFixed(0)}px) rotateX(${rx.toFixed(2)}deg)`;
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o <= 0.002 ? 'hidden' : 'visible';
      el.style.pointerEvents = i === activeIdx ? 'auto' : 'none';
    }

    if (counterRef.current) {
      const label = `${String(activeIdx + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
      if (counterRef.current.textContent !== label) counterRef.current.textContent = label;
    }
    if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;

    chatRefs.current.forEach((b, i) => {
      if (!b) return;
      const t = easeOutCubic(clamp01((p - 0.16 - i * 0.13) / 0.2));
      b.style.opacity = (0.15 + 0.85 * t).toFixed(3);
      b.style.transform = `translate3d(0, ${((1 - t) * 14).toFixed(1)}px, 0)`;
    });
    if (needleRef.current) {
      needleRef.current.style.transform = `rotate(${(-150 + easeOutCubic(p) * 240).toFixed(1)}deg)`;
    }
    if (arcRef.current) {
      const deg = Math.round(easeOutCubic(p) * 240);
      arcRef.current.style.background = `conic-gradient(from 210deg, rgba(255,255,255,.95) ${deg}deg, rgba(255,255,255,.16) ${deg}deg 240deg, transparent 240deg)`;
    }
    if (scanRef.current) {
      scanRef.current.style.transform = `translate3d(${(-40 + clamp01(p * 1.25) * 280).toFixed(0)}%, 0, 0)`;
    }

    applyReveals(innerRef.current, s.enter, s.exit);
  });

  return (
    <section id="work" data-scene="work" className="scene" style={{ height: sceneHeight('work') }}>
      <div className="scene-inner" ref={innerRef}>
        <div className="grid-floor" ref={floorRef} aria-hidden="true" />
        <div className="work-head">
          <h2 className="slabel rv" data-rv="0">
            <b>({SECTION_LABELS.work?.n})</b> — {SECTION_LABELS.work?.name}
          </h2>
          <div className="work-meta rv" data-rv="1">
            <span className="work-counter" ref={counterRef}>
              01 / 03
            </span>
            <span className="work-bar">
              <i ref={barRef} />
            </span>
          </div>
        </div>
        <div className="work-left">
          <div className="work-deck" ref={deckRef}>
            {PROJECTS.map((pr, i) => (
              <article
                className="work-card"
                key={pr.num}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <div className="work-info">
                  <p className="work-num mono">
                    <b>{pr.num}</b> — {pr.category}
                  </p>
                  <h3 className="work-name">{pr.name}</h3>
                  <p className="work-desc">{pr.desc}</p>
                  <ul className="work-chips">
                    {pr.chips.map((c) => (
                      <li key={c} className="chip mono">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <a
                    className="work-link"
                    data-cursor="Open"
                    href={pr.repo ?? IDENTITY.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    VIEW ON GITHUB ↗
                  </a>
                </div>
                <div className="work-visual" aria-hidden="true">
                  {pr.visual === 'chat' && (
                    <div className="mock-chat">
                      <div
                        className="bubble right"
                        ref={(el) => {
                          chatRefs.current[0] = el;
                        }}
                      >
                        I train 5×/week and eat vegetarian — what should I eat today?
                      </div>
                      <div
                        className="bubble"
                        ref={(el) => {
                          chatRefs.current[1] = el;
                        }}
                      >
                        Checking Delhi weather: 38°C, humid. Adjusting for your run.
                      </div>
                      <div
                        className="bubble"
                        ref={(el) => {
                          chatRefs.current[2] = el;
                        }}
                      >
                        High-protein thali, skip heavy curries, add 3L water.
                      </div>
                    </div>
                  )}
                  {pr.visual === 'gauge' && (
                    <div className="mock-gauge">
                      <div className="gauge-arc" ref={arcRef} />
                      <div className="gauge-needle" ref={needleRef} />
                      <div className="gauge-hub" />
                      <span className="gauge-read mono">SIGNAL — NOMINAL</span>
                    </div>
                  )}
                  {pr.visual === 'heatmap' && (
                    <div className="mock-heat">
                      {Array.from({ length: 60 }).map((_, ci) => (
                        <i
                          key={ci}
                          className="heat-cell"
                          style={{ opacity: 0.12 + (((ci * 37) % 7) / 10) * 0.65 }}
                        />
                      ))}
                      <span className="heat-scan" ref={scanRef} />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
