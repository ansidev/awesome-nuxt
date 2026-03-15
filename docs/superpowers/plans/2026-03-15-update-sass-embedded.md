# Update sass-embedded Dependency Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the `sass-embedded` package range pin from `^1.83.0` to `^1.98.0` in a dedicated git worktree and open a PR targeting `develop`.

**Architecture:** Create an isolated git worktree from `develop`, bump the version range in `package.json`, reinstall dependencies, verify with lint and build, commit, and open a PR.

**Tech Stack:** git worktrees, pnpm, VuePress 2, Sass

---

## Task 1: Create the Git Worktree

A git worktree lets you check out a second branch of the same repository into a separate directory, without disturbing your main working copy. All commands in this task run from the **main repo root**.

- [ ] Ensure you are on the `develop` branch in the main repo and it is up to date:

  ```sh
  # Run from: /Users/ansidev/projects/personal/awesome-nuxt
  git checkout develop
  git pull origin develop
  ```

  Expected output: `Already on 'develop'` (or a fast-forward merge summary) followed by `Already up to date.`

- [ ] Create the worktree directory parent if it does not already exist:

  ```sh
  # Run from: /Users/ansidev/projects/personal/awesome-nuxt
  mkdir -p /Users/ansidev/git-worktrees/awesome-nuxt
  ```

  Expected output: (none — the command succeeds silently)

- [ ] Add the worktree, creating a new branch `chore/update-sass-embedded` based on `develop`:

  ```sh
  # Run from: /Users/ansidev/projects/personal/awesome-nuxt
  git worktree add -b chore/update-sass-embedded \
    /Users/ansidev/git-worktrees/awesome-nuxt/update-sass \
    develop
  ```

  Expected output:

  ```
  Preparing worktree (new branch 'chore/update-sass-embedded')
  HEAD is now at <commit-hash> <most-recent-commit-message>
  ```

- [ ] Verify the worktree was created correctly:

  ```sh
  # Run from: /Users/ansidev/projects/personal/awesome-nuxt
  git worktree list
  ```

  Expected output should include two entries — the main repo and the new worktree — for example:

  ```
  /Users/ansidev/projects/personal/awesome-nuxt           <hash> [develop]
  /Users/ansidev/git-worktrees/awesome-nuxt/update-sass   <hash> [chore/update-sass-embedded]
  ```

---

## Task 2: Update `package.json`

All remaining commands (Tasks 2–8) run from inside the **worktree directory** unless stated otherwise.

- [ ] Change to the worktree directory:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  ```

- [ ] Open `package.json` and update the `sass-embedded` version range. The file is at:

  `/Users/ansidev/git-worktrees/awesome-nuxt/update-sass/package.json`

  Find the line (line 42):

  ```json
  "sass-embedded": "^1.83.0",
  ```

  Change it to:

  ```json
  "sass-embedded": "^1.98.0",
  ```

  The surrounding `devDependencies` block should look like this after the edit:

  ```json
  "devDependencies": {
    "@vuepress/bundler-vite": "^2.0.0-rc.19",
    "@vuepress/client": "^2.0.0-rc.19",
    "@vuepress/plugin-docsearch": "^2.0.0-rc.67",
    "@vuepress/plugin-git": "^2.0.0-rc.66",
    "@vuepress/plugin-google-analytics": "^2.0.0-rc.66",
    "@vuepress/plugin-pwa": "^2.0.0-rc.66",
    "@vuepress/theme-default": "^2.0.0-rc.66",
    "markdownlint-cli2": "^0.18.0",
    "sass-embedded": "^1.98.0",
    "vue": "^3.5.13",
    "vuepress": "^2.0.0-rc.19"
  },
  ```

- [ ] Confirm the change is correct before proceeding:

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  grep "sass-embedded" package.json
  ```

  Expected output:

  ```
      "sass-embedded": "^1.98.0",
  ```

---

## Task 3: Run `pnpm install`

Installing dependencies with the updated range causes pnpm to resolve `sass-embedded` to its latest compatible version (1.98.0) and update the lockfile accordingly.

- [ ] Run the install:

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  pnpm install
  ```

  Expected output ends with something like:

  ```
  Packages: +1 -1
  Progress: resolved <N>, reused <N>, downloaded 1, added 1, done
  ```

- [ ] Confirm the lockfile now resolves `sass-embedded` to `1.98.0`:

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  grep "sass-embedded" pnpm-lock.yaml | head -5
  ```

  Expected output should contain a line like:

  ```
  sass-embedded@1.98.0:
  ```

  (The exact surrounding context will vary, but `1.97.3` should no longer appear for the primary resolved version.)

---

## Task 4: Run `pnpm lint`

The lint command runs `markdownlint-cli2` against all Markdown files in `content/`. The baseline is 0 errors; the dependency bump should not affect Markdown content.

- [ ] Run the linter:

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  pnpm lint
  ```

  Expected output:

  ```
  markdownlint-cli2 v<version> (markdownlint v<version>)
  Finding: ./content/**/*.md
  Linting: <N> file(s)
  Summary: 0 error(s)
  ```

  If any errors appear, they are pre-existing issues unrelated to this change. Do not modify Markdown files as part of this task — stop and investigate before continuing.

---

## Task 5: Run `pnpm build`

The build command runs `vuepress build content`, which compiles the entire static site. A successful build confirms that `sass-embedded` at `1.98.0` is fully compatible with the project's Sass usage.

- [ ] Run the build:

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  pnpm build
  ```

  Expected output ends with something like:

  ```
  ✓ Initializing and preparing data - done in <N>s
  ✓ Compiling with vite
  ✓ Rendering pages - done in <N>s
  ```

  The command must exit with code 0. If the build fails with Sass-related errors, check the [sass-embedded 1.98.0 release notes](https://github.com/sass/dart-sass/releases) for any breaking changes and address them before continuing.

---

## Task 6: Commit the Changes

- [ ] Stage the two modified files (`package.json` and `pnpm-lock.yaml`):

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  git add package.json pnpm-lock.yaml
  ```

- [ ] Verify only those two files are staged (no unintended changes):

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  git status
  ```

  Expected output:

  ```
  On branch chore/update-sass-embedded
  Changes to be committed:
    (use "git restore --staged <file>..." to unstage)
          modified:   package.json
          modified:   pnpm-lock.yaml
  ```

- [ ] Create the commit:

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  git commit -m "chore(deps): update dependency sass-embedded to v1.98.0"
  ```

  Expected output:

  ```
  [chore/update-sass-embedded <hash>] chore(deps): update dependency sass-embedded to v1.98.0
   2 files changed, <N> insertions(+), <N> deletions(-)
  ```

---

## Task 7: Push the Branch and Open a Pull Request

- [ ] Push the branch to the remote:

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  git push -u origin chore/update-sass-embedded
  ```

  Expected output:

  ```
  Enumerating objects: <N>, done.
  ...
  To https://github.com/ansidev/awesome-nuxt.git
   * [new branch]      chore/update-sass-embedded -> chore/update-sass-embedded
  Branch 'chore/update-sass-embedded' set up to track remote branch 'chore/update-sass-embedded' from 'origin'.
  ```

- [ ] Open the pull request targeting `develop`:

  ```sh
  # Run from: /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  gh pr create \
    --title "chore(deps): update dependency sass-embedded to v1.98.0" \
    --base develop \
    --body "## Summary

  Bumps the \`sass-embedded\` dev dependency range pin from \`^1.83.0\` to \`^1.98.0\`.

  The lockfile now resolves \`sass-embedded\` to \`1.98.0\` (previously \`1.97.3\`).

  ## Verification

  - \`pnpm lint\`: 0 errors (unchanged baseline)
  - \`pnpm build\`: completes successfully

  ## Release notes

  See the [sass-embedded / dart-sass releases](https://github.com/sass/dart-sass/releases) for the full changelog between 1.83.0 and 1.98.0."
  ```

  Expected output:

  ```
  https://github.com/ansidev/awesome-nuxt/pull/<number>
  ```

  Copy the PR URL for review.

---

## Task 8: Teardown After the PR is Merged

Once the PR has been reviewed, approved, and merged into `develop`, clean up the local worktree and branch.

- [ ] Remove the worktree (run from the **main repo root**, not the worktree itself):

  ```sh
  # Run from: /Users/ansidev/projects/personal/awesome-nuxt
  git worktree remove /Users/ansidev/git-worktrees/awesome-nuxt/update-sass
  ```

  Expected output: (none — the command succeeds silently)

- [ ] Delete the local branch:

  ```sh
  # Run from: /Users/ansidev/projects/personal/awesome-nuxt
  git branch -d chore/update-sass-embedded
  ```

  Expected output:

  ```
  Deleted branch chore/update-sass-embedded (was <hash>).
  ```

- [ ] Optionally delete the remote tracking branch if it was not deleted automatically by GitHub:

  ```sh
  # Run from: /Users/ansidev/projects/personal/awesome-nuxt
  git remote prune origin
  ```

- [ ] Pull the merged changes into your local `develop`:

  ```sh
  # Run from: /Users/ansidev/projects/personal/awesome-nuxt
  git checkout develop
  git pull origin develop
  ```
