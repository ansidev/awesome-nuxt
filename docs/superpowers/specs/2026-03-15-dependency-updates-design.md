# Dependency Updates Design

**Date:** 2026-03-15

## Goal

Update all outdated npm dependencies in the awesome-nuxt project using parallel git worktrees — one worktree per logical dependency group — to allow independent, reviewable updates.

## Context

The project is a VuePress-based static site (`pnpm` workspace) with 11 `devDependencies`. Currently on branch `develop`. Renovate has been handling updates historically (see commit history); this plan mirrors that style manually.

**Current outdated packages:**

| Package | Installed | Target |
|---|---|---|
| `vue` | 3.5.13 | 3.5.30 |
| `sass-embedded` | 1.87.0 | 1.98.0 |
| `vuepress` | 2.0.0-rc.22 | 2.0.0-rc.26 |
| `@vuepress/bundler-vite` | 2.0.0-rc.22 | 2.0.0-rc.26 |
| `@vuepress/client` | 2.0.0-rc.22 | 2.0.0-rc.26 |
| `@vuepress/plugin-docsearch` | 2.0.0-rc.99 | 2.0.0-rc.125 |
| `@vuepress/plugin-git` | 2.0.0-rc.99 | 2.0.0-rc.125 |
| `@vuepress/plugin-google-analytics` | 2.0.0-rc.98 | 2.0.0-rc.125 |
| `@vuepress/plugin-pwa` | 2.0.0-rc.99 | 2.0.0-rc.125 |
| `@vuepress/theme-default` | 2.0.0-rc.101 | 2.0.0-rc.125 |
| `markdownlint-cli2` | 0.17.2 | 0.21.0 |

## Architecture

Four parallel git worktrees are created under `/Users/ansidev/git-worktrees/awesome-nuxt/`, each branched from `develop`. Each worktree handles one logical group of packages, installs dependencies, verifies with `pnpm lint`, and produces a PR targeting `develop`.

The `@vuepress/*` packages and `vuepress` are updated together in a single worktree because they are tightly coupled and must stay in sync.

## Worktree Map

| Worktree path | Branch | Packages |
|---|---|---|
| `.../update-vue` | `chore/update-vue` | `vue` → 3.5.30 |
| `.../update-sass` | `chore/update-sass-embedded` | `sass-embedded` → 1.98.0 |
| `.../update-vuepress` | `chore/update-vuepress` | `vuepress` + all `@vuepress/*` → latest rc |
| `.../update-markdownlint` | `chore/update-markdownlint-cli2` | `markdownlint-cli2` → 0.21.0 |

## Per-Worktree Workflow

Each worktree follows the same steps:

1. Create worktree with a dedicated branch from `develop`
2. Edit `package.json` — bump the target package version(s)
3. Run `pnpm install` to regenerate `pnpm-lock.yaml`
4. Run `pnpm lint` to verify no regressions
   - If `markdownlint-cli2` update introduces new rule violations, fix the affected markdown files in the same commit or a follow-up commit in the same worktree
5. Commit using the project's established style: `chore(deps): update dependency <name> to <version>`
6. Open a PR targeting `develop`

## GitHub Actions

No workflow file changes are required. All workflows already use `actions/checkout@v6`. The build/deploy workflow delegates to `ghacts/static-site@main`, which dynamically resolves Node.js and pnpm versions — no pins to update.

## Verification

- **`pnpm lint`** — the only test in this project (`markdownlint-cli2 ./content/**/*.md`)
- Current baseline: 0 errors
- Each worktree must pass lint before committing

## Commit Style

Matches existing Renovate-generated history:

```
chore(deps): update dependency vue to v3.5.30
chore(deps): update dependency sass-embedded to v1.98.0
chore(deps): update vuepress
chore(deps): update dependency markdownlint-cli2 to v0.21.0
```

## Out of Scope

- GitHub Actions workflow version bumps (already current)
- Node.js or pnpm engine version changes
- Any content changes unrelated to lint fixes
