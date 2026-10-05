# Bharat Vamsi Reddy · Media × Intelligence

An interactive portfolio for enterprise programmatic, retail media and AI workflows. Built with React, Vite, Three.js, React Three Fiber and GSAP, with locally hosted fonts and responsive CSS.

## Development

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Node.js 22 or later is required. Production files are generated in `dist/`. Source is maintained on `main`; production is served from `gh-pages`. See `PUBLISHING.md` for the release process.

## Components

- `src/main.jsx`: semantic page, navigation, competency cards, projects and contact.
- `src/scene.jsx`: lazy-loaded interactive network globe, parallax and captured-poster fallback.
- `src/content.js`: 29 technologies, six career chapters, case studies and credentials.
- `src/details.jsx`: filtered toolkit, animated career progression, workflows and accessible dialogs.
- `src/testimonials.jsx`: 12 written-feedback excerpts from six colleagues and stakeholders; five featured cards and expandable collection.
- CSS files: shared glass surfaces, responsive layouts, keyboard focus and reduced-motion behavior.

## QA and behavior

The interface supports reduced motion, a global motion switch, paused platform animation, native modal focus containment and focus restoration. The static master PDF downloads directly. The contact form validates inputs and creates a draft that the visitor sends from their own email application. No server or external form service is required.

ProgrammaticOS and Myvash mockups are labeled interface concepts; inquiry links use the public email. The 3D network is illustrative rather than live DSP telemetry. Testimonials are faithful excerpts with context; original correspondence is not published.

See `QA.md` for tested viewports, controls and practical limits. Browser checks use Playwright and the installed Chrome executable; adapt its path for your machine.

