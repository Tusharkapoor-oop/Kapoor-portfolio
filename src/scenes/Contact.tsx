import { useRef } from 'react';
import { director } from '../engine/director';
import { clamp01, useScene } from '../engine/hooks';
import { CONTACT, IDENTITY, SECTION_LABELS, sceneHeight } from '../data';

/**
 * Contact: the red curtain sweeps left → right with a skewed blade edge
 * (white 3px line + glow + trail). Each element reveals as the edge passes
 * over it, so white-on-white and ink-on-red never fight.
 */
export function Contact() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const bladeRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLElement>(null);
  const glowWideRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const footLeftRef = useRef<HTMLSpanElement>(null);
  const footRightRef = useRef<HTMLButtonElement>(null);

  useScene('contact', (s) => {
    const t = clamp01(s.p);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const skew = 0.2 * vh;
    const e = -skew + (vw + 2 * skew) * t;
    /** x-position of the blade edge at viewport height y */
    const edge = (yv: number): number => e + skew - (2 * skew) / vh * yv;

    if (curtainRef.current) {
      curtainRef.current.style.clipPath = `polygon(0 0, ${(e + skew).toFixed(1)}px 0, ${(e - skew).toFixed(1)}px 100%, 0 100%)`;
    }

    /** blade = three stacked diagonal stripes (line + two halos) cut out of
     *  full white layers with clip-path — the same machinery as the curtain,
     *  which repaints reliably every frame. */
    const visible = t > 0.002 && t < 0.998;
    const bl = visible ? clamp01(6 * t * (1 - t)) : 0;
    const stripe = (el: HTMLElement | null, hw: number) => {
      if (!el) return;
      el.style.clipPath =
        `polygon(${(e + skew - hw).toFixed(1)}px 0, ${(e + skew + hw).toFixed(1)}px 0, ` +
        `${(e - skew + hw).toFixed(1)}px 100%, ${(e - skew - hw).toFixed(1)}px 100%)`;
    };
    stripe(glowWideRef.current, 34);
    stripe(glowRef.current, 13);
    stripe(bladeRef.current, 1.5);
    if (glowWideRef.current) glowWideRef.current.style.opacity = (bl * 0.22).toFixed(3);
    if (glowRef.current) glowRef.current.style.opacity = (bl * 0.5).toFixed(3);
    if (bladeRef.current) bladeRef.current.style.opacity = bl.toFixed(3);

    /** 0 → 1 as the edge passes from (right − lead) past the element. */
    const reveal = (el: Element | null, lead: number, ramp: number): number => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return clamp01((edge(r.top + 6) - (r.right - lead)) / ramp);
    };

    const head = headRef.current;
    if (head) {
      const o = reveal(titleRef.current, 40, 150);
      head.style.opacity = o.toFixed(3);
      head.style.transform = `translate3d(0, ${((1 - o) * 30).toFixed(1)}px, 0)`;
    }
    if (emailRef.current) {
      const o = reveal(emailRef.current, 40, 150);
      emailRef.current.style.opacity = o.toFixed(3);
      emailRef.current.style.transform = `translate3d(0, ${((1 - o) * 30).toFixed(1)}px, 0)`;
    }
    if (linksRef.current) {
      linksRef.current.style.opacity = reveal(linksRef.current, 170, 190).toFixed(3);
    }
    if (footLeftRef.current) {
      // Ramp tight enough that the mobile resting distance still clamps to 1 —
      // a 94%-white © line over red only reaches 4.16:1, below the 4.5 minimum.
      footLeftRef.current.style.opacity = reveal(footLeftRef.current, 40, 120).toFixed(3);
    }
    if (footRightRef.current) {
      footRightRef.current.style.opacity = reveal(footRightRef.current, 170, 150).toFixed(3);
    }
  });

  return (
    <section id="contact" data-scene="contact" className="scene" style={{ height: sceneHeight('contact') }}>
      <div className="scene-inner">
        <div className="curtain" ref={curtainRef} aria-hidden="true" />
        <i className="blade-glow-wide" ref={glowWideRef} aria-hidden="true" />
        <i className="blade-glow" ref={glowRef} aria-hidden="true" />
        <i className="blade" ref={bladeRef} aria-hidden="true" />
        <div className="contact-head" ref={headRef}>
          <h2 className="contact-title" ref={titleRef}>
            <span>{CONTACT.headline1}</span>
            <span>{CONTACT.headline2}</span>
          </h2>
        </div>
        <div className="contact-body">
          <a className="contact-email" ref={emailRef} href={`mailto:${IDENTITY.email}`} data-cursor="Write">
            <span className="ce-user">{IDENTITY.emailUser}</span>
            <span className="ce-domain">{IDENTITY.emailDomain}</span>
          </a>
          <ul className="contact-links" ref={linksRef}>
            {CONTACT.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" data-cursor={l.cursor}>
                  {l.label}
                  <i aria-hidden="true">↗</i>
                </a>
              </li>
            ))}
          </ul>
          <footer className="contact-foot">
            <span ref={footLeftRef} className="mono">
              © {new Date().getFullYear()} {IDENTITY.name.toUpperCase()} — {IDENTITY.location.toUpperCase()}
            </span>
            <button ref={footRightRef} className="mono to-top" onClick={() => director.scrollTop()} data-cursor="Go">
              BACK TO TOP ↑
            </button>
          </footer>
        </div>
        <span className="sr-only">
          {SECTION_LABELS.contact?.name} — {IDENTITY.email}
        </span>
      </div>
    </section>
  );
}
