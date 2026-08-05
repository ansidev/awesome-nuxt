# Update markdownlint-cli2 Dependency Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the `markdownlint-cli2` package range pin from `^0.18.0` to `^0.21.0` in a dedicated git worktree, fix any new lint violations introduced by the version bump, and open a PR targeting `develop`.

**Architecture:** Create an isolated git worktree from `develop`, bump the version range in `package.json`, reinstall dependencies, run lint to detect new violations, fix any violations in a separate commit from the version bump, verify build, and open a PR.

**Tech Stack:** git worktrees, pnpm, markdownlint-cli2, VuePress 2

---

## Task 1: Create the git worktree

All worktree creation commands run from the **main repo root**: `/Users/ansidev/projects/personal/awesome-nuxt`.

- [ ] Ensure you are on the `develop` branch and it is up to date:

  ```sh
  cd /Users/ansidev/projects/personal/awesome-nuxt
  git checkout develop
  git pull origin develop
  ```

  Expected output: `Already up to date.` (or a list of pulled commits if behind).

- [ ] Ensure the worktree base directory exists:

  ```sh
  mkdir -p /Users/ansidev/git-worktrees/awesome-nuxt
  ```

- [ ] Create the worktree and new branch in one step:

  ```sh
  git worktree add /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint -b chore/update-markdownlint-cli2 develop
  ```

  Expected output:
  ```
  Preparing worktree (new branch 'chore/update-markdownlint-cli2')
  HEAD is now at <commit-hash> <last-commit-message>
  ```

- [ ] Confirm the worktree was created and the branch is correct:

  ```sh
  git worktree list
  ```

  Expected output includes a line like:
  ```
  /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint  <hash>  [chore/update-markdownlint-cli2]
  ```

> **From this point forward, ALL commands run from inside the worktree directory:**
> `/Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint`

---

## Task 2: Update `package.json`

- [ ] Open `/Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint/package.json` and update the `markdownlint-cli2` version range. The exact change is:

  **Before:**
  ```json
  "markdownlint-cli2": "^0.18.0",
  ```

  **After:**
  ```json
  "markdownlint-cli2": "^0.21.0",
  ```

  The relevant section in `devDependencies` (around line 41) should look like:
  ```json
  "devDependencies": {
    ...
    "markdownlint-cli2": "^0.21.0",
    ...
  }
  ```

- [ ] Verify the change with a quick inspection:

  ```sh
  grep markdownlint-cli2 /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint/package.json
  ```

  Expected output:
  ```
      "markdownlint-cli2": "^0.21.0",
  ```

---

## Task 3: Reinstall dependencies

- [ ] Run `pnpm install` to update the lockfile and install the new version:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint
  pnpm install
  ```

  Expected output: pnpm resolves and installs packages. The lockfile (`pnpm-lock.yaml`) will be updated. Look for a line indicating `markdownlint-cli2` is updated, e.g.:

  ```
  Packages: +X -Y
  Progress: resolved NNN, reused NNN, downloaded N, added N, removed N, done
  ```

- [ ] Confirm the lockfile now resolves `markdownlint-cli2` to `0.21.0`:

  ```sh
  grep -A2 "markdownlint-cli2" /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint/pnpm-lock.yaml | head -10
  ```

  Expected output includes:
  ```
  markdownlint-cli2@0.21.0:
  ```

---

## Task 4: Run lint and fix violations (if any)

### 4a. Run `pnpm lint` and check for errors

- [ ] Run the linter:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint
  pnpm lint
  ```

  The lint command expands to:
  ```sh
  markdownlint-cli2 ./content/**/*.md
  ```

  This checks all 16 markdown files: `content/index.md` plus the 15 files under `content/resources/` (`blogs.md`, `books.md`, `community-examples.md`, `community.md`, `docker.md`, `mention-of-nuxt.md`, `modules.md`, `official-examples.md`, `official-resources.md`, `open-source-projects-using-nuxt.md`, `projects-using-nuxt.md`, `showcase.md`, `starter-template.md`, `tools.md`, `tutorials.md`).

  **If output ends with `0 errors` and exit code is 0:** skip to Task 5 (build).

  **If errors are reported:** continue with steps 4b–4d below.

### 4b. Diagnose which rules changed between 0.18.x and 0.21.0

- [ ] Consult the changelogs to understand which new rules or rule-behavior changes were introduced:

  - markdownlint-cli2 changelog: https://github.com/DavidAnson/markdownlint-cli2/blob/main/CHANGELOG.md
    - Look at entries for versions `0.19.0`, `0.20.0`, and `0.21.0`.
  - markdownlint (the underlying rule engine) changelog: https://github.com/DavidAnson/markdownlint/blob/main/CHANGELOG.md
    - Cross-reference the `markdownlint` version bundled with each `markdownlint-cli2` release to identify any new default rules.

  Common sources of new violations after a minor bump:
  - New rules enabled by `default: true` that did not exist before.
  - Existing rules with stricter defaults (e.g., tighter line-length handling, new list-indent rules).

- [ ] Review the lint output to identify which rule IDs are triggering (e.g., `MD001`, `MD047`, `MD055`). Each error line follows the format:
  ```
  content/resources/modules.md:42:3 MD007/ul-indent Unordered list indentation [Expected: 2; Actual: 4]
  ```

### 4c. Fix the violations

Decide on a fix strategy for each rule:

**Option A — Fix the content files** (preferred when the markdown is genuinely malformed):

  - Edit the offending lines in the relevant files under `content/` to satisfy the rule.
  - Re-run `pnpm lint` after each batch of fixes to track progress.

**Option B — Relax the rule in `.markdownlint-cli2.cjs`** (appropriate when the rule change is overly strict for this project's content style):

  The config file is at:
  `/Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint/.markdownlint-cli2.cjs`

  Its current contents:
  ```js
  module.exports = {
    ignores: [
      '**/.git',
      '**/.idea',
      '**/.vscode',
      '**/node_modules',
    ],
    config: {
      default: true,
      MD013: {
        line_length: 1000,
      },
    },
  }
  ```

  To disable a new rule (e.g., `MD055`), add it to the `config` block:
  ```js
  config: {
    default: true,
    MD013: {
      line_length: 1000,
    },
    MD055: false,
  },
  ```

  To configure a rule instead of disabling it, pass an options object instead of `false`.

### 4d. Confirm lint is clean after fixes

- [ ] Re-run `pnpm lint` and confirm zero errors:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint
  pnpm lint
  ```

  Expected output:
  ```
  markdownlint-cli2 v0.21.0 (markdownlint vX.Y.Z)
  Finding: ./content/**/*.md
  Linting: 16 file(s)
  Summary: 0 error(s)
  ```

- [ ] Stage and commit lint fixes in a **separate commit** (this commit must come BEFORE the version bump commit):

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint
  git add content/ .markdownlint-cli2.cjs
  git commit -m "fix: fix markdownlint violations after updating to markdownlint-cli2 v0.21.0"
  ```

  Only include files that were actually changed. Do not stage `package.json` or `pnpm-lock.yaml` in this commit.

---

## Task 5: Verify the build

- [ ] Run the VuePress build to confirm the site builds successfully with the updated dependencies:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint
  pnpm build
  ```

  The build command expands to:
  ```sh
  vuepress build content
  ```

  Expected: the command exits with code 0. The final lines of output should resemble:
  ```
  ✔ Compiling with vite - done
  ✔ Rendering pages - done
  ```

  If the build fails, investigate the error output. Build failures at this stage are typically unrelated to the markdownlint bump (they may be pre-existing issues), but confirm by checking `git stash` behaviour if needed.

---

## Task 6: Commit the version bump

- [ ] Stage the `package.json` and `pnpm-lock.yaml` changes:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint
  git add package.json pnpm-lock.yaml
  ```

- [ ] Commit with the conventional commit message:

  ```sh
  git commit -m "chore(deps): update dependency markdownlint-cli2 to v0.21.0"
  ```

- [ ] Verify the commit log shows the correct order of commits (lint fixes first, version bump second):

  ```sh
  git log --oneline -5
  ```

  Expected (if lint fixes were needed):
  ```
  <hash> chore(deps): update dependency markdownlint-cli2 to v0.21.0
  <hash> fix: fix markdownlint violations after updating to markdownlint-cli2 v0.21.0
  <hash> <previous develop commit>
  ...
  ```

  Expected (if no lint fixes were needed):
  ```
  <hash> chore(deps): update dependency markdownlint-cli2 to v0.21.0
  <hash> <previous develop commit>
  ...
  ```

---

## Task 7: Push and open a pull request

- [ ] Push the branch to the remote:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint
  git push -u origin chore/update-markdownlint-cli2
  ```

  Expected output:
  ```
  To github.com:ansidev/awesome-nuxt.git
   * [new branch]      chore/update-markdownlint-cli2 -> chore/update-markdownlint-cli2
  Branch 'chore/update-markdownlint-cli2' set up to track remote branch 'chore/update-markdownlint-cli2' from 'origin'.
  ```

- [ ] Open a PR targeting `develop`.

  **If no lint fixes were needed**, use this command:

  ```sh
  gh pr create \
    --base develop \
    --title "chore(deps): update dependency markdownlint-cli2 to v0.21.0" \
    --body "## Summary

  - Bumps \`markdownlint-cli2\` range pin from \`^0.18.0\` to \`^0.21.0\`
  - Lockfile updated: resolves from 0.18.1 → 0.21.0
  - No new lint violations introduced by the version bump

  ## Test plan

  - [ ] \`pnpm lint\` exits with 0 errors
  - [ ] \`pnpm build\` completes successfully"
  ```

  **If lint fixes were needed**, include a note about which rules changed. Adapt the body template:

  ```sh
  gh pr create \
    --base develop \
    --title "chore(deps): update dependency markdownlint-cli2 to v0.21.0" \
    --body "## Summary

  - Bumps \`markdownlint-cli2\` range pin from \`^0.18.0\` to \`^0.21.0\`
  - Lockfile updated: resolves from 0.18.1 → 0.21.0
  - Fixed lint violations introduced by new/changed rules: <list rule IDs here, e.g. MD055, MD058>
  - See the fix commit for details on which files and rules were affected

  ## Rule changes (0.18.x → 0.21.0)

  <Summarise the relevant CHANGELOG entries here, e.g.:>
  - **MD055** (table-pipe-style): new rule added in markdownlint vX.Y, requires consistent pipe style in tables
  - Content files updated / rule disabled in \`.markdownlint-cli2.cjs\` as appropriate

  ## Test plan

  - [ ] \`pnpm lint\` exits with 0 errors
  - [ ] \`pnpm build\` completes successfully"
  ```

- [ ] Note the PR URL printed by `gh pr create` and confirm the PR is visible on GitHub with the correct base branch (`develop`).

---

## Task 8: Teardown after the PR is merged

Run these commands after the PR has been merged into `develop`.

- [ ] Switch back to the main repo and fetch the updated `develop` branch:

  ```sh
  cd /Users/ansidev/projects/personal/awesome-nuxt
  git checkout develop
  git pull origin develop
  ```

- [ ] Remove the worktree:

  ```sh
  git worktree remove /Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint
  ```

  Expected output: no output (silent success). The directory `/Users/ansidev/git-worktrees/awesome-nuxt/update-markdownlint` will no longer exist.

- [ ] Delete the local branch:

  ```sh
  git branch -d chore/update-markdownlint-cli2
  ```

  Expected output:
  ```
  Deleted branch chore/update-markdownlint-cli2 (was <hash>).
  ```

- [ ] Optionally delete the remote tracking branch:

  ```sh
  git push origin --delete chore/update-markdownlint-cli2
  ```

- [ ] Verify the worktree list is clean:

  ```sh
  git worktree list
  ```

  Expected output: only the main worktree entry remains, with no reference to `update-markdownlint`.
