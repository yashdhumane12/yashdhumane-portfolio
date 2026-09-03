import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SKILLS } from '../../content';
import { useStore } from '../../store';
import Magnetic from '../Magnetic';
import SkillsViz from '../scenes/SkillsViz';

gsap.registerPlugin(ScrollTrigger);

const CAT_COLORS = ['#00D4FF', '#FFB547', '#00FF88', '#B47FFF', '#FF6B6B'];

export default function Skills() {
  const ref     = useRef<HTMLElement>(null);
  const reduced = useStore(s => s.reduced);

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('[data-reveal]'),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } }
    );
  }, [reduced]);

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <div className="section-eyebrow" data-reveal>Skills</div>
        <h2 className="section-title" data-reveal>Systems online</h2>
        <p className="section-sub" data-reveal>Tools and technologies I operate across the stack.</p>

        {/* 3D floating module vis */}
        <SkillsViz height={360} />

        {/* 2D chip listing (always visible — accessible reference) */}
        <div style={{ marginTop: 8 }}>
          {SKILLS.map((g, gi) => (
            <div key={gi} className="skill-group" data-reveal>
              <div className="skill-group-header">
                <span className="skill-group-icon" style={{ color: CAT_COLORS[gi] }}>{g.icon}</span>
                {g.category}
              </div>
              <div className="chips-row">
                {g.chips.map((c, ci) => (
                  <Magnetic key={ci} strength={0.2} radius={40}>
                    <span className="chip">{c}</span>
                  </Magnetic>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
