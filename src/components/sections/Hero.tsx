import { useRef, useEffect, useState } from 'react';
import { PERSON } from '../../content';
import { useStore } from '../../store';
import Magnetic from '../Magnetic';
import StationRing from '../scenes/StationRing';

const TYPED_LINE = 'operator console — yash@homelab';

export default function Hero() {
  const reduced = useStore(s => s.reduced);
  const [typedText, setTypedText] = useState(reduced ? TYPED_LINE : '');
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;

    let frame = 0;
    const step = () => {
      frame += 1;
      setTypedText(TYPED_LINE.slice(0, frame));
      if (frame < TYPED_LINE.length) {
        window.setTimeout(step, 70);
      }
    };

    const timer = window.setTimeout(step, 250);
    return () => {
      window.clearTimeout(timer);
    };
  }, [reduced]);

  useEffect(() => {
    const root = statsRef.current;
    if (!root) return;

    const counters = Array.from(root.querySelectorAll('[data-counter]')) as HTMLElement[];
    if (!counters.length) return;

    const supportsReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (supportsReduced) {
      counters.forEach((el) => {
        const target = Number(el.dataset.target || 0);
        const suffix = el.dataset.suffix || '';
        el.textContent = `${target}${suffix}`;
      });
      return;
    }

    const animateCounter = (el: HTMLElement) => {
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = `${Math.round(value)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counters.forEach((counter) => animateCounter(counter));
        observer.disconnect();
      });
    }, { threshold: 0.35 });

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          {/* ── copy ── */}
          <div>
            <div className="hero-badge" data-reveal>
              <span className="hero-badge-dot" />
              available for opportunities
            </div>
            <p className="hero-terminal" data-reveal aria-live="polite">
              <span className="hero-terminal-prefix">$</span>
              <span className="hero-terminal-text">{typedText}</span>
              {!reduced && <span className="hero-terminal-cursor" aria-hidden="true" />}
            </p>
            <h1 className="hero-name" data-reveal>
              {PERSON.name.split(' ')[0]}{' '}
              <span>{PERSON.name.split(' ')[1]}</span>
            </h1>
            <p className="hero-title" data-reveal>
              {PERSON.title} · {PERSON.location}
            </p>
            <p className="hero-bio" data-reveal>{PERSON.bio[0]}</p>
            <div className="hero-cta" data-reveal>
              <Magnetic strength={0.35}>
                <a href={`mailto:${PERSON.email}`} className="btn btn-primary">
                  Get in touch
                </a>
              </Magnetic>
              <Magnetic strength={0.28}>
                <a href="#projects" className="btn">
                  View work ↓
                </a>
              </Magnetic>
            </div>
            <div className="hero-stats" ref={statsRef} data-reveal>
              <div className="hero-stat">
                <span className="hero-stat-val" data-counter data-target="3">0</span>
                Production apps
              </div>
              <div className="hero-stat">
                <span className="hero-stat-val" data-counter data-target="9">0</span>
                K8s workers
              </div>
              <div className="hero-stat">
                <span className="hero-stat-val" data-counter data-target="1">0</span>
                Bare-metal cluster
              </div>
              <div className="hero-stat">
                <span className="hero-stat-val" data-counter data-target="2" data-suffix="+">0</span>
                Years ops
              </div>
            </div>
          </div>

          {/* ── 3D station ring ── */}
          <div data-reveal style={{ opacity: reduced ? 1 : 0 }}>
            <StationRing height={440} />
          </div>
        </div>
      </div>
    </section>
  );
}
