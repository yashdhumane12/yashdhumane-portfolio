# Void Architect — Yash Dhumane's 3D Portfolio

A fully immersive, 3D-first single-page portfolio built from scratch with React Three Fiber, GSAP, and Vite.

## Visual identity

| Token | Value | Usage |
|---|---|---|
| `--void`  | `#050A12` | Page background |
| `--cyan`  | `#00D4FF` | Primary accent — electric cyan |
| `--amber` | `#FFB547` | Secondary — phosphor amber |
| `--green` | `#00FF88` | Online / ok states |
| Display   | Space Grotesk | Headings, body |
| Mono      | JetBrains Mono | Code, labels, nav, chips |

**Theme:** *Deep-space orbital station.* The hero shows a rotating torus ring (orbital station) with a wireframe icosahedron control hub at its centre, particle streams orbiting the ring, and 3D skill-module slabs in the skills section. A star-field with faint nebula planes covers the background canvas.

## Project structure

```
void-architect/
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # root: scroll tracking, section observer
│   ├── store.ts                   # Zustand: section, cursor, scroll, webGL flag
│   ├── content.ts                 # ← EDIT ALL COPY HERE
│   ├── styles/
│   │   └── globals.css            # full design system
│   └── components/
│       ├── Cursor.tsx             # custom cursor dot + ring (GSAP)
│       ├── Nav.tsx                # sticky top nav with magnetic links
│       ├── Magnetic.tsx           # GSAP magnetic pull/snap wrapper
│       ├── scenes/
│       │   ├── StarField.tsx      # fixed background: star sphere + nebula
│       │   ├── StationRing.tsx    # hero 3D scene: orbital torus station
│       │   └── SkillsViz.tsx      # floating 3D skill module panels
│       └── sections/
│           ├── Hero.tsx           # hero copy + StationRing
│           ├── About.tsx          # bio paragraphs + facts grid
│           ├── Experience.tsx     # timeline cards with CSS tilt
│           ├── Skills.tsx         # SkillsViz + chip listing
│           ├── Projects.tsx       # glassmorphism project cards
│           ├── Homelab.tsx        # terminal-style incident log
│           ├── Contact.tsx        # contact link grid
│           └── Footer.tsx
```

## Editing content

**All copy, jobs, projects, skills, and logs live in `src/content.ts`.**
No 3D or animation code needs to change when you update text.

## Setup & run

```bash
cd void-architect
npm install
npm run dev        # → http://localhost:5173
```

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview locally
```

## Deploy

`dist/` is a static site. Drop it anywhere:

**Vercel / Netlify**
- Build command: `npm run build`
- Publish directory: `dist`
- No environment variables required

**GitHub Pages**
```bash
npm run build
# push dist/ to gh-pages branch, or use vite-plugin-gh-pages
```

**Nginx**
```nginx
server {
  root /var/www/void-architect/dist;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
  gzip on;
  gzip_types text/javascript application/javascript text/css;
}
```

## Performance

- Three.js background canvas: DPR fixed at 1, `antialias: false`
- Hero/skills canvases: DPR capped at 1.5
- Stars: single `<Points>` draw call (1800 instances)
- Particles: `<InstancedMesh>` per loop, capped at 50+20
- `prefers-reduced-motion` disables all GSAP animations and R3F `useFrame` motion
- No WebGL → 3D sections simply hide their canvas, text/chips remain readable
- GSAP `ScrollTrigger` animations fire once (`once: true`) and clean up

## Customising the 3D scenes

| Scene | File | Key params |
|---|---|---|
| Star field | `scenes/StarField.tsx` | `STAR_COUNT`, nebula slab positions/colors |
| Station ring | `scenes/StationRing.tsx` | Torus `args`, `DockingPorts count`, ring particle `count`/`speed` |
| Skill modules | `scenes/SkillsViz.tsx` | `positions[]` array, `COLORS[]` array |
