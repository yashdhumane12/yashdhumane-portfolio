import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/globals.css';

import { useStore } from './store';
import Cursor      from './components/Cursor';
import Nav         from './components/Nav';
import StarField   from './components/scenes/StarField';

import Hero       from './components/sections/Hero';
import About      from './components/sections/About';
import Experience from './components/sections/Experience';
import Skills     from './components/sections/Skills';
import Projects   from './components/sections/Projects';
import Homelab    from './components/sections/Homelab';
import Contact    from './components/sections/Contact';
import Footer     from './components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = ['hero','about','experience','skills','projects','homelab','contact'];

export default function App() {
  const { setSection, setScroll } = useStore();
  const lastY = useRef(0);
  const velBuf = useRef(0);

  /* scroll progress + velocity */
  useEffect(() => {
    const onScroll = () => {
      const y   = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      const vel = y - lastY.current;
      velBuf.current = velBuf.current * 0.6 + vel * 0.4;
      setScroll(max > 0 ? y / max : 0, velBuf.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setScroll]);

  /* active section observer */
  useEffect(() => {
    const els = SECTIONS.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setSection(SECTIONS.indexOf(e.target.id));
      });
    }, { threshold: 0.35 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [setSection]);

  return (
    <>
      <Cursor />
      <StarField />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Homelab />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
