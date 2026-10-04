# Juris

A custom Hugo portfolio theme. Cream, ink, and blue; editorial typography;
a single scrolling homepage; sticky introductions; progressive scroll reveals. No npm build step or
external font dependency is required. Hugo processes and fingerprints the CSS,
JavaScript, and preview images.

## Develop

Run `hugo server` from the repository root. Build with `hugo --minify`.
The previous Blowfish submodule is retained, but the active theme is `juris`.

## Customize

- `data/portfolio.toml`: homepage copy, project selection and summaries,
  and contact email.
- `themes/juris/assets/css/juris.css`: palette variables and responsive layouts.
- `themes/juris/layouts/`: templates and compatible timeline shortcodes.
- `content/`: existing articles and page bundles, with their original URLs.

All seven projects, the complete career timeline, education, and contact are on
the homepage. Projects are automatically sorted by their content dates, newest
first. Native disclosure controls open full project articles inline.
The menu links to homepage sections, with deliberate 1–2.2 second transitions;
wheel and touch scrolling remain native and can interrupt a transition.
Existing detail URLs still work for incoming links.

Desktop introductions remain visible while their content scrolls.
Mobile uses a single column. All content works without JavaScript; motion is
disabled when the visitor requests reduced motion. GoatCounter continues to
load from the existing project-level `extend-head.html` partial.

For a build without changing generated output in the repository:

```sh
hugo --minify --destination /tmp/juris-preview
```
