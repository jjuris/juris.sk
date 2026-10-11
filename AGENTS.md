# AGENTS.md - Development Guidelines

## Build & Development Commands

**Hugo Server (Development)**
```bash
hugo server  # Start local Hugo server (default: :1313)
```

**Build for Production**
```bash
hugo --minify  # Build static site
```

The active theme is `juris`. Hugo processes its CSS, JavaScript, and images;
no npm build step is required. See [SEO.md](SEO.md) for validation and export
to `docs/` while preserving `docs/CNAME`.

## Code Style Guidelines

### Formatting & Linting
- Follow the formatting conventions below; no Prettier configuration is bundled
- **Print width**: 112 characters (HTML, JS/TS); default 80 (other)
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Double quotes for JavaScript/HTML; single quotes only in YAML
- **Semicolons**: Required
- **Trailing commas**: All (except JSON files where they're prohibited)

### Languages & File Types

**HTML/Go Templates** (.html, .go-template)
- Use spaces inside Go template delimiters
- Use standard HTML void elements

**JavaScript/TypeScript** (.js, .ts, .mjs, .mts)
- 2 space indentation, 112 character print width
- Always use semicolons and double quotes

**Markdown** (.md)
- Prose wrap: always (wraps text at line width)
- Preserve trailing whitespace in markdown files

**YAML** (.yml, .yaml)
- Single quotes for strings

### CSS & Styling
- Theme styles live in `themes/juris/assets/css/juris.css`
- Use the existing CSS custom properties for colors, fonts, and header height
- Preserve the light palette, responsive layouts, and reduced-motion support

### Project Structure
- `/content/` - Markdown content files
- `/config/` - Hugo configuration files
- `/themes/juris/` - Custom Hugo theme, including templates, CSS, and JavaScript
- `/assets/` - Images and icons processed by Hugo
- `/data/portfolio.toml` - Homepage copy and project selection
- `/static/` - Files copied directly into the generated site
- `/docs/` - Committed production export for GitHub Pages
- Archetypes in `/archetypes/` define content templates

## Additional Notes
- Minimum Hugo version: 0.152.2 (declared by `themes/juris/theme.toml`)
- No tests or linting CI configured
- Use UTF-8 and LF line endings
