# Simple Landing Page Starter

## Folder Structure

```
project-root/
├── assets/
│   ├── js/
│   │   └── scripts.js          # Your main JS/ES6 file
│   ├── vendors/                # Third-party JS files (e.g., embla-carousel.umd.js)
│   └── scss/
│       ├── main.scss            # Main SCSS entry point
│       ├── abstracts/           # Variables, mixins, functions, placeholders
│       ├── base/                # Reset, typography, globals, helpers
│       ├── components/          # Buttons, cards, forms, modals
│       ├── layout/              # Header, footer, navigation
│       ├── pages/               # Page-specific styles
│       ├── sections/            # Section-specific styles
│       └── vendors/             # Third-party styles (e.g., Embla)
├── dist/                        # Compiled output (generated)
│   ├── css/
│   │   └── style.min.css        # Compiled CSS
│   └── js/
│       ├── scripts.min.js       # Compiled JS
│       └── embla-carousel.umd.js # Vendor JS files (copied as-is)
├── .vscode/
│   └── settings.json            # VS Code workspace settings (format on save, etc.)
├── .prettierrc                  # Prettier formatting configuration
├── .eslintrc.js                 # ESLint configuration (optional)
├── .eslintignore                # ESLint ignore patterns (optional)
├── index.html                   # Your HTML file
├── package.json
└── webpack.config.js
```

## Usage

- **HTML**: Edit `index.html` in the project root
- **SCSS**: Edit `assets/scss/main.scss` and import partials from subdirectories (abstracts, base, components, layout, pages, sections, vendors)
- **JS/ES6**: Edit `assets/js/scripts.js` (wp-scripts will compile it)
- **Third-party JS**: Place vendor JavaScript files (UMD bundles) in `assets/vendors/` - they will be copied to `dist/js/` as-is during build (not processed by webpack to preserve UMD format)

## Configuration

- **`.prettierrc`**: Code formatting rules (formats SCSS, CSS, and JS on save)
- **`.vscode/settings.json`**: VS Code workspace settings (enables format on save, configures formatters)
- **`.eslintrc.js`**: ESLint configuration for JavaScript linting (optional)
- **`.eslintignore`**: Files/folders to ignore during linting (optional)

## Commands

- `npm start` - Watch mode for development (runs both JS and SCSS, copies vendor files)
- `npm run build` - Build for production (copies vendor files automatically)
- `npm run build:js` - Build only JS (copies vendor files automatically)
- `npm run build:scss` - Build only SCSS
- `npm run start:js` - Watch mode for JS only
- `npm run start:scss` - Watch mode for SCSS only
- `npm run copy:vendors` - Manually copy vendor files from `assets/vendors/` to `dist/js/`
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS/SCSS files
- `npm run format` - Format code files

