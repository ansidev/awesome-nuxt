# Awesome Nuxt

[![Release](https://img.shields.io/github/release/ansidev/awesome-nuxt.svg)](https://github.com/ansidev/awesome-nuxt/releases)
[![Deployment Status](https://github.com/ansidev/awesome-nuxt/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/ansidev/awesome-nuxt/actions/workflows/pages/pages-build-deployment)

**A curated list of awesome things related to Nuxt**

This project does not aim to replace the [Community Nuxt.js Awesome List](https://github.com/nuxt-community/awesome-nuxt) but rather to provide a nicer experience when browsing the content.

## Instructions

To run this application on your machine, first clone the repository and install
the required dependencies:

```bash
git clone https://github.com/ansidev/awesome-nuxt.git
cd awesome-nuxt
pnpm install
```

Run the `dev` script to compile the content and spawn a local server to serve
the compiled code. While this script is running, any changes made to the
markdown files will automatically be updated on the locally served pages.

```bash
pnpm run dev
```

To prepare the application for deployment, first run `pnpm run build` to compile
the application in production mode. This will generate a directory in
`content/.vuepress` called `dist`.

```bash
pnpm add -g serve
pnpm run build
cd content/.vuepress/dist
serve .
```

## Scripts

| Script  | Description                                             |
| ------- | ------------------------------------------------------- |
| `dev`   | Compiles content and serves bundled code                |
| `build` | Compiles content and other static assets for deployment |
| `lint`  | Runs markdown linter to check lint errors               |
| `test`  | Runs `lint` script                                      |

## Contributing

Please refer to the [Contributing Guide](.github/CONTRIBUTING.md).

## Contact

Le Minh Tri [@ansidev](https://ansidev.xyz/about).

## License

This source code is available under the [MIT License](/LICENSE).
