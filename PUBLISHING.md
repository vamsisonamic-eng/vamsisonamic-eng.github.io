# Publishing

The editable React source lives on `main`. GitHub Pages serves the built production files from `gh-pages` at its root. The prior single-file deployment workflow is disabled because it cannot publish this bundled React site correctly.

Run `npm ci` and `npm run build`, then publish the contents of `dist/` to the `gh-pages` branch (for example, `npx gh-pages -d dist`). Include `.nojekyll` in the production root. GitHub Pages automatically deploys updates pushed to that branch.

The public site is https://vamsisonamic-eng.github.io/ .
