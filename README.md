# VS://2026 — Interactive 3D Portfolio

**Orchestrating Scale. Engineering Intelligence.**

A single-page interactive 3D portfolio built with React Three Fiber, Vite, Tailwind CSS v4 and Framer Motion. One GPU-morphing particle system (6,000 points) transitions through three scenes as you scroll — quantum core → fiber-optic data pipelines → tech-matrix node lattice — with a glassmorphic overlay UI on a deep neon/dark aesthetic.

## Stack

- **Vite 5** + **React 18**
- **Three.js / @react-three/fiber / @react-three/drei** — all geometry is procedural (`<points>` + `<bufferGeometry>` + custom GLSL); zero 3D asset downloads
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Framer Motion** — scroll-triggered UI animation & spring counters

## Folder blueprint

```
src/
├── App.jsx                 # layout shell: fixed canvas + scrolling overlay
├── main.jsx
├── index.css               # Tailwind v4 theme tokens, glass/neon utilities
├── canvas/
│   └── DataCanvas.jsx      # R3F canvas, GPU morph shader, scene choreography
├── components/
│   ├── Nav.jsx             # floating glass navbar
│   ├── Hero.jsx            # Section 1 · The Core + impact counters
│   ├── CountUp.jsx         # in-view animated metric counter
│   ├── Experience.jsx      # Section 2 · Data Pipelines timeline
│   ├── TechMatrix.jsx      # Section 3 · Skills & certification trophy cards
│   └── Connect.jsx         # Section 4 · Contact footer
└── store/
    └── scrollState.js      # mutable scroll/pointer state read per-frame (no React re-renders)
```

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Ensure `base` in `vite.config.js` matches your repo name (`/` for this root user site).
2. In the repo: **Settings → Pages → Source → GitHub Actions**.
3. Push to `main` — `.github/workflows/deploy.yml` builds and deploys automatically.

## R3F performance on static GitHub Pages

Already applied in this codebase:

- **One draw call for the whole show** — a single `<points>` cloud morphs between all three scenes in the vertex shader (`mix()` between position attributes). No per-scene mount/unmount, no geometry re-uploads.
- **Zero heavy assets** — everything is procedural buffer geometry; nothing to download but ~200KB of gzipped JS. Code-split into `three` / `r3f` / `motion` chunks so the browser caches them independently.
- **Lazy canvas** — the 3D layer is `React.lazy`-loaded; text UI paints immediately while three.js streams in.
- **No React state in the render loop** — scroll/mouse live in a plain mutable object read inside `useFrame`; the canvas never re-renders.
- **`dpr={[1,2]}` + `<AdaptiveDpr>`** — caps devicePixelRatio and lowers resolution under load (retina phones are the usual frame-rate killer).
- **`antialias: false` + additive-blended point sprites** — MSAA is wasted on glowing particles; soft shader edges do the smoothing for free.
- **`depthWrite: false`, `frustumCulled: false`** on the particle pass — avoids depth-sort churn and needless culling checks for an always-visible field.
- **Damped (`MathUtils.damp`) camera/morph values** — frame-rate-independent easing with no tween library in the hot path.

Further options if you extend it: `<PerformanceMonitor>` from drei to auto-degrade particle count, `powerPreference: 'high-performance'` (set), and keeping postprocessing (bloom) off — the additive shader glow fakes it far cheaper.
