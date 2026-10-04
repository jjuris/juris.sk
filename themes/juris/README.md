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
the homepage. The introductory profile photo is the only image displayed on the site.
Projects are automatically sorted by their content dates, newest
first. Projects, career, and education use the same disclosure cards: titles, metadata,
and dates in the top right corner, with full text opened by a circular plus.
The circular plus next to each project title opens its article; a tooltip
explains the action on hover or keyboard focus. The control has a 44px touch target.
All disclosure text rolls open and closed smoothly, with native instant disclosure
when JavaScript is unavailable or reduced motion is requested.
An open card automatically closes once it leaves the visible
viewport. Closing a card above the viewport preserves the reader's position.
The opening screen fills the viewport with the introduction. The homepage
header appears after scrolling down and hides again at the top; projects begin
below the opening screen. With JavaScript disabled the header stays available.
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
