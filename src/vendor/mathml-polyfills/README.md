# MathML polyfills

This directory contains vendored MathML polyfill bundle files.

## Source

- Upstream repository: https://github.com/w3c/mathml-polyfills
- Fork used to generate the bundle in this project: https://github.com/akhuoa/mathml-polyfills/tree/rolldown

The upstream `w3c/mathml-polyfills` repository provides polyfills for MathML features using MathML Core and browser-native web technologies. For this project, the files here were generated from the `rolldown` branch in the fork above so the polyfills can be imported locally as an ESM bundle.

## Vendored files

- `all-polyfills-bundle.js`: minified ESM bundle
- `all-polyfills-bundle.d.ts`: generated TypeScript declarations for the bundle

## Update process

To refresh these vendored files:

1. Clone or open `https://github.com/akhuoa/mathml-polyfills`.
2. Check out the `rolldown` branch.
3. Install dependencies.
4. Run `npm run build`.
5. Copy `dist/all-polyfills-bundle.js` and `dist/all-polyfills-bundle.d.ts` into this directory.

If the fork, branch, or build pipeline changes, update this README so future maintainers can trace where these files came from and how they were produced.
