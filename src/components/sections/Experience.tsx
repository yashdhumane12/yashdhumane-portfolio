import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JOBS } from '../../content';
import { useStore } from '../../store';

gsap.registerPlugin(ScrollTrigger);

function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useStore.getState().reduced;
  useEffect(() => {
    if (reduced) return;
    const el = ref.current; if (!el) return;
    const mv = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${x*strength}deg) rotateX(${-y*strength*.6}deg) translateY(-3px)`;
    };
    const lv = () => gsap.to(el, { rotationX:0, rotationY:0, y:0, duration:.55, ease:'elastic.out(1,.4)' });
    el.addEventListener('mousemove', mv);
    el.addEventListener('mouseleave', lv);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv); };
  }, [reduced, strength]);
  return ref;
}

function JobCard({ job, idx }: { job: typeof JOBS[number]; idx: number }) {
  const tilt = useTilt();
  return (
    <div
      className={`timeline-card${job.current ? ' active' : ''}`}
      data-reveal
      style={{ marginBottom: idx < JOBS.length - 1 ? 32 : 0 }}
    >
      <div className="timeline-dot" />
      <div
        ref={tilt}
        className="glass"
        style={{ padding: '22px 26px', transformStyle: 'preserve-3d', transition: 'border-color .2s, box-shadow .2s', willChange: 'transform',
          borderColor: job.current ? 'rgba(0,212,255,.28)' : undefined,
          boxShadow: job.current ? '0 0 24px rgba(0,212,255,.06)' : undefined }}
      >
        <div className={`timeline-period${job.current ? ' now' : ''}`}>{job.period}</div>
        <h3 className="timeline-title">{job.title}</h3>
        <span className="timeline-org">{job.org}</span>
        <ul className="timeline-bullets">
          {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default function Experience() {
  const ref     = useRef<HTMLElement>(null);
  const reduced = useStore(s => s.reduced);

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('[data-reveal]'),
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.14, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 76%', once: true } }
    );
  }, [reduced]);

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container-sm">
        <div className="section-eyebrow" data-reveal>Experience</div>
        <h2 className="section-title" data-reveal>Mission log</h2>
        <p className="section-sub" data-reveal>Where I've deployed, debugged, and shipped.</p>
        {JOBS.map((j, i) => <JobCard key={i} job={j} idx={i} />)}
      </div>
    </section>
  );
}
