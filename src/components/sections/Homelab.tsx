import { useRef, useEffect } from 'react';
import { HOMELAB_LOGS } from '../../content';
import { useStore } from '../../store';

export default function Homelab() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useStore(s => s.reduced);

  useEffect(() => {
    if (!ref.current) return;
    const lines = Array.from(ref.current.querySelectorAll('.log-line')) as HTMLElement[];
    if (!lines.length) return;

    if (reduced) {
      lines.forEach((line) => line.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        const delay = Number(target.dataset.delay || 0);
        window.setTimeout(() => target.classList.add('is-visible'), delay);
        observer.unobserve(target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    lines.forEach((line, index) => {
      line.dataset.delay = String(index * 90);
      observer.observe(line);
    });

    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section id="homelab" className="section" ref={ref}>
      <div className="container-sm">
        <div className="section-eyebrow" data-reveal>Homelab</div>
        <h2 className="section-title" data-reveal>Incident reports</h2>
        <p className="section-sub" data-reveal>
          Recurring failures traced and fixed on the self-hosted stack.
          Kept here as a running log rather than buried in tickets.
        </p>

        <div className="log-terminal" data-reveal>
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
              <div className="log-line" key={i} data-delay={i * 90}>
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
