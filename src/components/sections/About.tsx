import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PERSON } from '../../content';
import { useStore } from '../../store';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const ref     = useRef<HTMLElement>(null);
  const reduced = useStore(s => s.reduced);

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('[data-reveal]'),
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } }
    );
  }, [reduced]);

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <div className="section-eyebrow" data-reveal>About</div>
        <h2 className="section-title" data-reveal>Who's behind the terminal</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56 }} className="about-grid">
          {/* bio */}
          <div>
            {PERSON.bio.map((p, i) => (
              <p key={i} data-reveal style={{ color: 'var(--text-2)', marginBottom: 18, lineHeight: 1.8, fontSize: 15 }}>
                {p}
              </p>
            ))}
          </div>

          {/* facts */}
          <div data-reveal>
            <div className="facts-grid">
              {PERSON.facts.map(f => (
                <div key={f.key} className="fact-item">
                  <div className="fact-key">{f.key}</div>
                  <div className="fact-val">{f.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
