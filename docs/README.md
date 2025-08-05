# MonkeyJS Documentation

This directory contains the documentation website for the MonkeyJS library. The site is built with [Astro](https://astro.build/) and is deployed to GitHub Pages.

## Development

To run the documentation site locally:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## Building

To build the documentation site:

```bash
# Build the site
pnpm build
```

This will generate the static site in the `dist` directory.

## Deployment

The documentation site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment is handled by a GitHub Actions workflow defined in `.github/workflows/deploy-docs.yml`.

## Demo

The documentation site includes a demo of the MonkeyJS library. The demo files are built from the main library code and copied to the `public/demo` directory.

To build the demo files manually:

```bash
# From the root of the repository
bash scripts/build-demo.sh
```
