import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, type Project } from '../../content';
import { useStore } from '../../store';
import Magnetic from '../Magnetic';

gsap.registerPlugin(ScrollTrigger);

function useCardTilt() {
  const ref     = useRef<HTMLDivElement>(null);
  const reduced = useStore.getState().reduced;
  useEffect(() => {
    if (reduced) return;
    const el = ref.current; if (!el) return;
    const mv = (e: MouseEvent) => {
      const r  = el.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      const px = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const py = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      el.style.transform = `perspective(800px) rotateY(${x*14}deg) rotateX(${-y*10}deg) translateY(-5px) scale(1.01)`;
      el.style.setProperty('--px', `${px}%`);
      el.style.setProperty('--py', `${py}%`);
    };
    const lv = () => gsap.to(el, { rotationX:0, rotationY:0, y:0, scale:1, duration:.6, ease:'elastic.out(1,.4)' });
    el.addEventListener('mousemove', mv);
    el.addEventListener('mouseleave', lv);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv); };
  }, [reduced]);
  return ref;
}

function ProjectCard({ p }: { p: Project }) {
  const tilt = useCardTilt();
  const tagClass = p.tag === 'production' ? 'tag-prod' : p.tag === 'staging' ? 'tag-staging' : 'tag-personal';

  return (
    <Magnetic strength={0.18} radius={100}>
      <div ref={tilt} className="proj-card" data-reveal>
        <div className="sheen" aria-hidden />
        <span className={`tag ${tagClass}`}>{p.tag}</span>
        <h3>{p.name}</h3>
        <p>{p.desc}</p>
        <div className="stack">{p.stack}</div>
      </div>
    </Magnetic>
  );
}

export default function Projects() {
  const ref     = useRef<HTMLElement>(null);
  const reduced = useStore(s => s.reduced);

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('[data-reveal]'),
      { y: 28, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.09, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 76%', once: true } }
    );
  }, [reduced]);

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <div className="section-eyebrow" data-reveal>Projects</div>
        <h2 className="section-title" data-reveal>Transmissions</h2>
        <p className="section-sub" data-reveal>
          Production systems, staging experiments, and side missions.
        </p>
        <div
          className="projects-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 18 }}
        >
          {PROJECTS.map((p, i) => <ProjectCard key={i} p={p} />)}
        </div>
      </div>
    </section>
  );
}
