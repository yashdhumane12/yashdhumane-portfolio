import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { useStore } from '../store';

export default function Magnetic({
  children,
  strength = 0.3,
  radius   = 80,
}: {
  children: ReactNode;
  strength?: number;
  radius?:   number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useStore.getState().reduced;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      if (Math.hypot(dx, dy) < radius + r.width / 2) {
        gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.35, ease: 'power2.out', overwrite: true });
        const bx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
        const by = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
        el.style.setProperty('--bx', `${bx}%`);
        el.style.setProperty('--by', `${by}%`);
      }
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,.4)', overwrite: true });

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced, strength, radius]);

  return (
    <div ref={ref} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
