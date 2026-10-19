import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { director } from '../engine/director';
import { clamp01, prefersReduced, useScene } from '../engine/hooks';
import { Mag } from '../components/MagneticButton';
import { HERO, IDENTITY, sceneHeight } from '../data';

export function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const name = nameRef.current;
    const copy = copyRef.current;
    if (!name || !copy) return;
    const letters = name.querySelectorAll<HTMLElement>('.hero-letter-i');
    const lines = copy.querySelectorAll<HTMLElement>('.line-i');
    const fades = copy.querySelectorAll<HTMLElement>('.hero-fade');

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      letters,
      { yPercent: 115, rotateX: -80, opacity: 0 },
      { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.6, ease: 'expo.out', stagger: 0.07 },
      0,
    );
    tl.fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 }, 0.15);
    tl.fromTo(fades, { y: 30 }, { y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 0.4);

    if (prefersReduced()) {
      tl.progress(1);
      return;
    }
    return director.onIntro(() => tl.play());
  }, []);

  useScene('hero', (s) => {
    const name = nameRef.current;
    if (name) {
      const y = Math.sin(s.p * Math.PI * 2) * 12;
      name.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      name.style.opacity = clamp01(1 - s.exit * 2.2).toFixed(3);
    }
    if (copyRef.current) copyRef.current.style.opacity = clamp01(1 - s.exit * 2.4).toFixed(3);
    if (underlineRef.current) {
      underlineRef.current.style.width = `${(clamp01(s.p * 1.15) * 100).toFixed(1)}%`;
    }
  });

  return (
    <section id="hero" data-scene="hero" className="scene" style={{ height: sceneHeight('hero') }}>
      <div className="scene-inner hero-inner">
        <div className="hero-name" ref={nameRef} aria-hidden="true">
          {IDENTITY.first.split('').map((ch, i) => (
            <span className="hero-letter" key={i}>
              <span className="hero-letter-i">{ch}</span>
            </span>
          ))}
        </div>
        <div className="hero-copy" ref={copyRef}>
          <p className="hero-greet mask">
            <span className="line">
              <span className="line-i">
                {HERO.greetPre} <span className="ink">{IDENTITY.name}</span> {HERO.greetPost}
              </span>
            </span>
          </p>
          <h1 className="hero-title">
            <span className="mask">
              <span className="line">
                <span className="line-i">{IDENTITY.role1}</span>
              </span>
            </span>
            <span className="mask">
              <span className="line red">
                <span className="line-i">{IDENTITY.role2}</span>
              </span>
            </span>
          </h1>
          <div className="hero-fade">
            <p className="hero-desc">
              {HERO.desc}
              <span className="hero-underline" ref={underlineRef} aria-hidden="true" />
            </p>
            <div className="hero-ctas">
              <Mag
                variant="red"
                cursor="Go"
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  director.scrollTo('work');
                }}
              >
                {HERO.primaryCta}
              </Mag>
              <Mag variant="outline" cursor="PDF" href={IDENTITY.resumeUrl} external>
                {HERO.secondaryCta}
              </Mag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
