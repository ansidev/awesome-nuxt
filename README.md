# Awesome Nuxt.js [![Build Status][badge]][ci]

[badge]: https://travis-ci.org/ansidev/awesome-nuxt.svg?branch=master
[ci]: https://travis-ci.org/ansidev/awesome-nuxt

> A curated list of awesome things related to Nuxt.js

This project does not aim to replace the [Community Nuxt.js Awesome List](https://github.com/nuxt-community/awesome-nuxt) but rather to provide a nicer experience when browsing the content.

## Instructions

To run this application on your machine, first clone the repository and install
the required dependencies:

```bash
git clone https://github.com/ansidev/awesome-nuxt.git
cd awesome-nuxt
yarn install
```

Run the `dev` script to compile the content and spawn a local server to serve
the compiled code. While this script is running, any changes made to the
markdown files will automatically be updated on the locally served pages.

```bash
yarn dev
```

To prepare the application for deployment, first run `yarn build` to compile
the application in production mode. This will generate a directory in
`content/.vuepress` called `dist`.

```bash
yarn install -g serve
yarn build
cd content/.vuepress/dist
serve .
```

## Scripts

| Script  | Description                                             |
|---------|---------------------------------------------------------|
| `dev`   | Compiles content and serves bundled code                |
| `build` | Compiles content and other static assets for deployment |
| `lint`  | Runs markdown linter to check lint errors               |
| `test`  | Runs `lint` script                                      |

## Contributing

Please refer to the [Contributing Guide](.github/CONTRIBUTING.md).

## License

This is free and unencumbered software released into the public domain.

For more information, please refer to <https://opensource.org/licenses/MIT>
