import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PERSON } from '../../content';
import { useStore } from '../../store';
import Magnetic from '../Magnetic';
import StationRing from '../scenes/StationRing';

export default function Hero() {
  const copyRef = useRef<HTMLDivElement>(null);
  const reduced = useStore(s => s.reduced);

  useEffect(() => {
    if (reduced || !copyRef.current) return;
    const els = copyRef.current.querySelectorAll('[data-in]');
    gsap.fromTo(els,
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out', delay: 0.3 }
    );
  }, [reduced]);

  return (
    <section id="hero" className="hero-section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          {/* ── copy ── */}
          <div ref={copyRef}>
            <div className="hero-badge" data-in>
              <span className="hero-badge-dot" />
              available for opportunities
            </div>
            <h1 className="hero-name" data-in>
              {PERSON.name.split(' ')[0]}{' '}
              <span>{PERSON.name.split(' ')[1]}</span>
            </h1>
            <p className="hero-title" data-in>
              {PERSON.title} · {PERSON.location}
            </p>
            <p className="hero-bio" data-in>{PERSON.bio[0]}</p>
            <div className="hero-cta" data-in>
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
            <div className="hero-stats" data-in>
              <div>
                <span className="hero-stat-val">3</span>
                Production products
              </div>
              <div>
                <span className="hero-stat-val">9</span>
                K8s worker nodes
              </div>
              <div>
                <span className="hero-stat-val">1</span>
                Bare-metal cluster
              </div>
            </div>
          </div>

          {/* ── 3D station ring ── */}
          <div data-in style={{ opacity: reduced ? 1 : 0 }}>
            <StationRing height={440} />
          </div>
        </div>
      </div>
    </section>
  );
}
