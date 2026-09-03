import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PERSON } from '../../content';
import { useStore } from '../../store';
import Magnetic from '../Magnetic';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { icon: '✉', label: 'Email',    href: `mailto:${PERSON.email}`,  value: PERSON.email },
  { icon: '☎', label: 'Phone',    href: `tel:${PERSON.phone.replace(/\s/g,'')}`, value: PERSON.phone },
  { icon: '↗', label: 'LinkedIn', href: PERSON.linkedin, value: 'linkedin.com/in/yash-dhumane' },
  { icon: '◈', label: 'GitHub',   href: PERSON.github,   value: 'github.com/yashdhumane12' },
];

export default function Contact() {
  const ref     = useRef<HTMLElement>(null);
  const reduced = useStore(s => s.reduced);

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('[data-reveal]'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } }
    );
  }, [reduced]);

  return (
    <section id="contact" className="section" ref={ref} style={{ borderBottom: 'none' }}>
      <div className="container-sm">
        <div className="section-eyebrow" data-reveal>Contact</div>
        <h2 className="section-title" data-reveal>Open comms</h2>
        <p className="section-sub" data-reveal>
          Open to DevOps and infrastructure roles. Reach out directly.
        </p>

        <div className="contact-grid" data-reveal>
          {LINKS.map((l, i) => (
            <Magnetic key={i} strength={0.25} radius={70}>
              <a href={l.href} className="contact-link" target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                <span className="icon">{l.icon}</span>
                <span>
                  <span className="label">{l.label}</span>
                  <span className="value">{l.value}</span>
                </span>
              </a>
            </Magnetic>
          ))}
        </div>

        <div data-reveal style={{ marginTop: 32 }}>
          <Magnetic strength={0.32}>
            <a href={PERSON.resume} download className="btn btn-primary">
              Download Résumé ↓
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
