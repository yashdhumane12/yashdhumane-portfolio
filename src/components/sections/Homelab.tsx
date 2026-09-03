import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HOMELAB_LOGS } from '../../content';
import { useStore } from '../../store';

gsap.registerPlugin(ScrollTrigger);

export default function Homelab() {
  const ref     = useRef<HTMLElement>(null);
  const reduced = useStore(s => s.reduced);

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('.log-line'),
      { x: -14, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } }
    );
  }, [reduced]);

  return (
    <section id="homelab" className="section" ref={ref}>
      <div className="container-sm">
        <div className="section-eyebrow">Homelab</div>
        <h2 className="section-title">Incident reports</h2>
        <p className="section-sub">
          Recurring failures traced and fixed on the self-hosted stack.
          Kept here as a running log rather than buried in tickets.
        </p>

        <div className="log-terminal">
          {/* title bar */}
          <div className="log-titlebar">
            <span className="log-dot" style={{ background:'#FF5F57' }} />
            <span className="log-dot" style={{ background:'#FEBC2E' }} />
            <span className="log-dot" style={{ background:'#28C840' }} />
            <span style={{ marginLeft: 10, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '.06em' }}>
              yash@homelab — postmortems
            </span>
          </div>

          {/* log body */}
          <div style={{ padding: '8px 0' }}>
            {HOMELAB_LOGS.map((l, i) => (
              <div className="log-line" key={i}>
                <span className="log-ts">{l.ts}</span>
                <span className="log-entry">
                  <span className="log-prompt">$</span>
                  {l.entry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
