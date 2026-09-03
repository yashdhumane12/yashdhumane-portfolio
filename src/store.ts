import { create } from 'zustand';

interface Store {
  section: number;          // 0=hero 1=about 2=exp 3=skills 4=projects 5=homelab 6=contact
  setSection: (n: number) => void;

  cursorX: number;          // normalised -1..1
  cursorY: number;
  setCursor: (x: number, y: number) => void;

  scrollY: number;
  scrollVel: number;
  setScroll: (y: number, vel: number) => void;

  introComplete: boolean;
  setIntroComplete: (b: boolean) => void;

  webGL: boolean;
  reduced: boolean;
}

export const useStore = create<Store>((set) => ({
  section: 0,
  setSection: (n) => set({ section: n }),

  cursorX: 0,
  cursorY: 0,
  setCursor: (x, y) => set({ cursorX: x, cursorY: y }),

  scrollY: 0,
  scrollVel: 0,
  setScroll: (y, vel) => set({ scrollY: y, scrollVel: vel }),

  introComplete: false,
  setIntroComplete: (b) => set({ introComplete: b }),

  webGL: (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch { return false; }
  })(),

  reduced: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
}));
