import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '../store';

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { reduced, setCursor } = useStore.getState();

  useEffect(() => {
    if (reduced) return;
    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    const onMove = (e: MouseEvent) => {
      gsap.set(dot,  { x: e.clientX, y: e.clientY });
      gsap.to(ring,  { x: e.clientX, y: e.clientY, duration: 0.22, ease: 'power2.out' });
      setCursor(
        (e.clientX / window.innerWidth)  * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };

    const onEnter = () => ring.classList.add('active');
    const onLeave = () => ring.classList.remove('active');

    const attach = () => {
      document.querySelectorAll<HTMLElement>('a,button,.btn,.chip,.proj-card,.contact-link,[data-mag]')
        .forEach(el => {
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      obs.disconnect();
    };
  }, [reduced, setCursor]);

  if (reduced) return null;
  return (
    <>
      <div ref={dotRef}  className="c-dot"  aria-hidden />
      <div ref={ringRef} className="c-ring" aria-hidden />
    </>
  );
}
