# QA report · 5 October 2026

Production build passed. Browser checks passed at 1440×1000, 390×844, 360×640 and desktop with reduced motion. No JavaScript errors or horizontal page/modal overflow were detected.

## Verified behavior

- 29 platform dialogs per viewport (116 checks), all five category filters, and hands-on Looker Studio / GA4 / GTM priority.
- Python, SQL and Tableau absent from the platform explorer and moving strip.
- Six career chapters per viewport (24 checks), including Dentsu's July 2026 promotion, responsibilities, outcomes and recognition.
- Three animated case studies per viewport (12 checks).
- Native modal focus containment, focus restoration, Escape, close button, backdrop close, footer return, body scroll lock and persistent close control while scrolling.
- Six credentials and education dialog; moving strip contains all 29 technologies, supports pause/resume and keyboard activation.
- Hero network selection, pointer-responsive glass cards, motion toggle, reduced motion, responsive navigation and project carousel.
- WebGL-unavailable fallback loads the poster captured from the actual scene.
- Resume download byte-identical to the requested master PDF: 275,722 bytes, two pages, selectable text.
- Required/email validation and complete encoded email draft creation. The user explicitly opens and sends the draft from their email app.

Desktop and mobile hero, toolkit, career popup, popup end, engine, experience, projects, contact and fallback screenshots were inspected. A focus-return defect discovered during testing was repaired and the full dialog suite rerun successfully.

## Practical limits

Phone dimensions are browser emulation; no physical-device test was performed. Contact delivery depends on the user's configured email application. ProgrammaticOS and Myvash screens are clearly marked interface concepts; verified live project destinations were not supplied. Inquiry links are functional email links. No public GitHub deployment or vendor-specific ATS scoring was performed. The WebGL module is lazy-loaded and approximately 243 KB gzipped.

Reproduce with `npm run build`, `npm run preview`, `node scripts/verify-details.mjs`, `node scripts/verify-controls.mjs`, `node scripts/verify-interactions.mjs`, and `npm run check` (set TEST_URL to the preview URL).

Testimonials update: 12 excerpts from six colleagues/stakeholders were checked against the recognition screenshots. Five featured cards and expandable collection passed at desktop, mobile, compact mobile and reduced motion. Expansion/collapse and absence of horizontal overflow verified. Source screenshot files remain private.
