# AGENTS.md - Development Guidelines

## Build & Development Commands

**Hugo Server (Development)**
```bash
cd themes/blowfish && npm run dev  # Watch CSS in development mode
hugo server                         # Start local Hugo server (default: :1313)
```

**Build for Production**
```bash
cd themes/blowfish && npm run build  # Minify Tailwind CSS
hugo                                 # Build static site
```

## Code Style Guidelines

### Formatting & Linting
- **Prettier** is configured for all file types
- **Print width**: 112 characters (HTML, JS/TS); default 80 (other)
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Double quotes for JavaScript/HTML; single quotes only in YAML
- **Semicolons**: Required
- **Trailing commas**: All (except JSON files where they're prohibited)

### Languages & File Types

**HTML/Go Templates** (.html, .go-template)
- Bracket spacing enabled (`goTemplateBracketSpacing: true`)
- Void elements configured via `prettier-plugin-void-html`

**JavaScript/TypeScript** (.js, .ts, .mjs, .mts)
- 2 space indentation, 112 character print width
- Always use semicolons and double quotes

**Markdown** (.md)
- Prose wrap: always (wraps text at line width)
- Preserve trailing whitespace in markdown files

**YAML** (.yml, .yaml)
- Single quotes for strings

### Tailwind CSS & Styling
- Use Tailwind utility classes; avoid custom CSS when possible
- Color variables use CSS custom properties (e.g., `--color-primary-500`)
- Dark mode uses `class` strategy
- Refer to `tailwind.config.js` for available screens/colors

### Project Structure
- `/content/` - Markdown content files
- `/config/` - Hugo configuration files
- `/themes/blowfish/` - Blowfish theme (separate repo, Git submodule)
- `/assets/` - Static assets and compiled CSS
- Archetypes in `/archetypes/` define content templates

## Additional Notes
- Minimum Hugo version: 0.87.0 (current: v0.152.2)
- No tests or linting CI configured
- EditorConfig enforces consistent whitespace (charset: utf-8, LF line endings)
