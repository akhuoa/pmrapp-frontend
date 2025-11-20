# PMR - Frontend

The next-generation frontend web application for the [Physiome Model Repository](https://models.physiomeproject.org/), built with Vue 3, TypeScript, and Tailwind CSS v4.

## About

A modern, responsive web application for browsing and exploring computational models in the Physiome Model Repository. Built with Vue 3 and powered by [a Rust-based backend](https://github.com/Physiome/pmrplatform), this project represents the next generation of the platform.

**Features:**
- 🎨 Light/Dark theme with system preference support
- 📱 Responsive design with Tailwind CSS v4
- ⚡ Built with Vue 3 Composition API and TypeScript
- 🧩 Atomic design component structure

## Tech Stack

- **Framework:** Vue 3 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** Vue Router
- **Testing:** Vitest (unit) + Cypress (e2e)
- **Code Quality:** ESLint + TypeScript

## Project Structure

```
src/
├── assets/          # Global styles and CSS files
├── components/      # Vue components (atomic design)
│   ├── atoms/       # Basic building blocks
│   ├── molecules/   # Simple component groups
│   └── organisms/   # Complex components
├── composables/     # Vue composables
├── layouts/         # Layout components
├── router/          # Vue Router configuration
├── services/        # API service layer
├── types/           # TypeScript type definitions
└── views/           # Page-level components
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (LTS recommended)

### Installation

```sh
npm install
```

### Development

Start the development server with hot-reload:

```sh
npm run dev
```

The app will be available at `http://localhost:5173/pmrapp-frontend/`

### Build

Type-check, compile and minify for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Testing

### Unit Tests

Run unit tests with Vitest:

```sh
npm run test:unit
```

### End-to-End Tests

Run e2e tests in development mode:

```sh
npm run test:e2e:dev
```

Run e2e tests against production build:

```sh
npm run build
npm run test:e2e
```

## Code Quality

Lint and fix code:

```sh
npm run lint
```

## Development Tools

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension (disable Vetur if installed)

### Browser DevTools

**Chrome/Edge/Brave:**
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Enable Custom Object Formatters in DevTools settings

**Firefox:**
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## Related Projects

- **Backend:** [pmrplatform](https://github.com/Physiome/pmrplatform/) - Rust-powered backend platform
- **Rust Demo:** [pmr3.demo.physiomeproject.org](https://pmr3.demo.physiomeproject.org/) - Alternative frontend built with Leptos (Rust)
- **Current Production:** [models.physiomeproject.org](https://models.physiomeproject.org/) - Active Physiome Model Repository
