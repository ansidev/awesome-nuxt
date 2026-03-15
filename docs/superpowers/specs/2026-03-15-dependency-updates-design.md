# Dependency Updates Design

**Date:** 2026-03-15

## Goal

Update all outdated npm dependencies in the awesome-nuxt project using parallel git worktrees — one worktree per logical dependency group — to allow independent, reviewable updates.

## Context

The project is a VuePress-based static site (`pnpm` workspace) with 11 `devDependencies`. Currently on branch `develop`. Renovate has been handling updates historically (see commit history); this plan mirrors that style manually.

**Current package state** (resolved versions from `pnpm-lock.yaml`):

| Package | `package.json` range | Installed | Target |
|---|---|---|---|
| `vue` | `^3.5.13` | 3.5.29 | 3.5.30 |
| `sass-embedded` | `^1.83.0` | 1.97.3 | 1.98.0 |
| `vuepress` | `^2.0.0-rc.19` | 2.0.0-rc.26 | already at rc.26 — update range pin |
| `@vuepress/bundler-vite` | `^2.0.0-rc.19` | 2.0.0-rc.26 | update range pin |
| `@vuepress/client` | `^2.0.0-rc.19` | 2.0.0-rc.26 | update range pin |
| `@vuepress/plugin-docsearch` | `^2.0.0-rc.67` | 2.0.0-rc.125 | update range pin |
| `@vuepress/plugin-git` | `^2.0.0-rc.66` | 2.0.0-rc.125 | update range pin |
| `@vuepress/plugin-google-analytics` | `^2.0.0-rc.66` | 2.0.0-rc.125 | update range pin |
| `@vuepress/plugin-pwa` | `^2.0.0-rc.66` | 2.0.0-rc.125 | update range pin |
| `@vuepress/theme-default` | `^2.0.0-rc.66` | 2.0.0-rc.125 | update range pin |
| `markdownlint-cli2` | `^0.18.0` | 0.18.1 | 0.21.0 |

> **Note on `@vuepress/*` packages:** The lockfile already resolves all `@vuepress/*` packages to rc.125/rc.26 because the semver ranges already satisfy those versions. The `package.json` range pins (e.g. `^2.0.0-rc.66`) need to be updated to reflect the actual installed baseline, preventing future installs from resolving to older versions.

## Architecture

Four parallel git worktrees are created under `/Users/ansidev/git-worktrees/awesome-nuxt/` (this is the author's local path — substitute your own base directory). Each worktree branches from `develop`, updates its package group, verifies, and opens a PR targeting `develop`.

The `@vuepress/*` packages and `vuepress` are updated together in a single worktree because they are tightly coupled and must stay in sync.

**Merge order:** Since all four worktrees modify `pnpm-lock.yaml`, merge them one at a time. After each PR merges into `develop`, rebase the remaining open branches onto the updated `develop`. `pnpm-lock.yaml` will have a merge conflict that git cannot auto-resolve — resolve it by deleting the conflicted lockfile and running `pnpm install` to regenerate it cleanly, then stage the result and continue the rebase. Re-run `pnpm lint` (and `pnpm build` for the vuepress branch) after each rebase before pushing. The `rebase.yaml` workflow supports `/rebase` comments on PRs for convenience (automated rebase still requires manual lockfile regeneration if conflicts arise).

## Worktree Map

| Worktree path | Branch | Packages |
|---|---|---|
| `.../update-vue` | `chore/update-vue` | `vue` → 3.5.30 |
| `.../update-sass` | `chore/update-sass-embedded` | `sass-embedded` → 1.98.0 |
| `.../update-vuepress` | `chore/update-vuepress` | `vuepress` + all `@vuepress/*` range pins |
| `.../update-markdownlint` | `chore/update-markdownlint-cli2` | `markdownlint-cli2` → 0.21.0 |

## Per-Worktree Workflow

Each worktree follows the same steps:

1. Create worktree with a dedicated branch from `develop`:
   ```bash
   git worktree add /Users/ansidev/git-worktrees/awesome-nuxt/<name> -b <branch>
   ```
2. Edit `package.json` — bump the target package version range(s)
3. Run `pnpm install` to regenerate `pnpm-lock.yaml`
4. Run `pnpm lint` to verify no regressions
5. Commit — see **Commit Style** below
6. Open a PR targeting `develop`
7. After PR merges: remove the worktree and local branch:
   ```bash
   git worktree remove /Users/ansidev/git-worktrees/awesome-nuxt/<name>
   git branch -d <branch>
   ```

### If `pnpm lint` fails (markdownlint violations)

- Fix the offending markdown files in a **separate commit** from the version bump, so reviewers can distinguish lint fixes from the dependency change
- Include in the PR description which markdown rules changed and which files were fixed
- There is no limit on the number of files to fix — the `content/` directory has only 16 markdown files, so scope is bounded
- To diagnose *why* rules changed, consult the [markdownlint-cli2 changelog](https://github.com/DavidAnson/markdownlint-cli2/blob/main/CHANGELOG.md) and the [markdownlint changelog](https://github.com/DavidAnson/markdownlint/blob/main/CHANGELOG.md). New violations may require either fixing content files or updating rules in `.markdownlint-cli2.cjs`

### Build verification for VuePress group

In the `update-vuepress` worktree, also run `pnpm build` after `pnpm lint` to catch any VuePress API breakage that lint cannot detect. If `pnpm build` fails, investigate the VuePress changelog before proceeding.

## GitHub Actions

No workflow file changes are required. All workflows already use `actions/checkout@v6`. The build/deploy workflow delegates to `ghacts/static-site@main`, which dynamically resolves Node.js and pnpm versions — no pins to update.

## Verification

| Worktree | Commands |
|---|---|
| `update-vue` | `pnpm lint` |
| `update-sass` | `pnpm lint` |
| `update-vuepress` | `pnpm lint` && `pnpm build` |
| `update-markdownlint` | `pnpm lint` |

Current baseline: `pnpm lint` passes with 0 errors.

## Commit Style

Matches existing Renovate-generated history. Each commit message uses the format:
```
chore(deps): update dependency <name> to v<version>
```

For the vuepress group (multiple packages in one commit), list all updated packages in the commit body:
```
chore(deps): update vuepress monorepo

- vuepress: ^2.0.0-rc.19 → ^2.0.0-rc.26
- @vuepress/bundler-vite: ^2.0.0-rc.19 → ^2.0.0-rc.26
- @vuepress/client: ^2.0.0-rc.19 → ^2.0.0-rc.26
- @vuepress/plugin-docsearch: ^2.0.0-rc.67 → ^2.0.0-rc.125
- @vuepress/plugin-git: ^2.0.0-rc.66 → ^2.0.0-rc.125
- @vuepress/plugin-google-analytics: ^2.0.0-rc.66 → ^2.0.0-rc.125
- @vuepress/plugin-pwa: ^2.0.0-rc.66 → ^2.0.0-rc.125
- @vuepress/theme-default: ^2.0.0-rc.66 → ^2.0.0-rc.125
```

## Out of Scope

- GitHub Actions workflow version bumps (already current)
- Node.js or pnpm engine version changes
- Any content changes unrelated to lint fixes triggered by the `markdownlint-cli2` update
