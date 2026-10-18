import { Fragment, useRef } from 'react';
import { applyReveals, clamp01, easeOutCubic, useScene } from '../engine/hooks';
import { Odometer, type OdometerHandle } from '../components/Odometer';
import { TiltCard } from '../components/TiltCard';
import { MANIFESTO, SCENES, SECTION_LABELS, STATS, sceneHeight } from '../data';

export function About() {
  const innerRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const odo0 = useRef<OdometerHandle>(null);
  const odo1 = useRef<OdometerHandle>(null);
  const odo2 = useRef<OdometerHandle>(null);
  const odos = [odo0, odo1, odo2];

  useScene('about', (s) => {
    const shade = shadeRef.current;
    if (shade) {
      const e = easeOutCubic(s.enter);
      shade.style.opacity = (e * clamp01(1 - s.exit * 1.6)).toFixed(3);
      shade.style.transform = `translate3d(${((1 - e) * -36).toFixed(1)}px, 0, 0)`;
    }

    const words = wordsRef.current?.querySelectorAll<HTMLElement>('.mf-w');
    if (words && words.length) {
      const n = words.length;
      words.forEach((w, i) => {
        const q = Math.round(clamp01(s.p * (n + 8) - i) * 40) / 40;
        const el = w as HTMLElement & { __q?: string };
        if (el.__q === String(q)) return;
        el.__q = String(q);
        w.style.opacity = (0.1 + 0.9 * q).toFixed(3);
        w.style.transform = `translate3d(0, ${((1 - q) * 0.25).toFixed(3)}em, 0)`;
        w.style.filter = q >= 0.98 ? '' : `blur(${((1 - q) * 4).toFixed(2)}px)`;
      });
    }

    const roll = easeOutCubic(clamp01((s.p - 0.3) / 0.45));
    STATS.forEach((st, i) => {
      odos[i].current?.set(st.value * roll);
    });

    applyReveals(innerRef.current, s.enter, s.exit);
  });

  return (
    <section id="about" data-scene="about" className="scene" style={{ height: sceneHeight('about') }}>
      <div className="scene-inner" ref={innerRef}>
        <div className="about-shade" ref={shadeRef} aria-hidden="true" />
        <div className="about-col">
          <h2 className="slabel rv" data-rv="0">
            <b>({SECTION_LABELS.about?.n})</b> — {SECTION_LABELS.about?.name}
          </h2>
          <div className="manifesto" ref={wordsRef}>
            {MANIFESTO.map((line, li) => (
              <p key={li} className="mf-line">
                {line.map((tok, ti) => (
                  <Fragment key={ti}>
                    {tok.t
                      .split(' ')
                      .filter(Boolean)
                      .map((w, wi) => (
                        <Fragment key={wi}>
                          <span className={tok.red ? 'mf-w red' : 'mf-w'}>{w}</span>{' '}
                        </Fragment>
                      ))}
                  </Fragment>
                ))}
              </p>
            ))}
          </div>
          <div className="about-stats">
            {STATS.map((st, i) => (
              <div className="stat-wrap rv" data-rv={i + 1} key={st.label}>
                <TiltCard className="stat-card">
                  <Odometer ref={odos[i]} value={st.value} decimals={st.decimals} className="stat-num" />
                  <span className="stat-label mono">{st.label}</span>
                  <span className="stat-caption mono">{st.caption}</span>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">{SCENES.find((x) => x.id === 'about')?.label}</span>
      </div>
    </section>
  );
}
