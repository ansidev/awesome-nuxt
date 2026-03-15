# Update vue Dependency Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the `vue` package range pin from `^3.5.13` to `^3.5.30` in a dedicated git worktree and open a PR targeting `develop`.

**Architecture:** Create an isolated git worktree from `develop`, bump the version range in `package.json`, reinstall dependencies, verify with lint and build, commit, and open a PR.

**Tech Stack:** git worktrees, pnpm, VuePress 2

---

## Background

This plan updates the `vue` devDependency in the `awesome-nuxt` project. The project is a VuePress 2 static site managed with pnpm. The lockfile already resolves `vue` to `3.5.29`; after this bump the lockfile will resolve to `3.5.30`.

All work happens inside a dedicated git worktree to keep the main checkout clean and allow parallel work on other branches. The worktree is a separate directory on disk that shares the same underlying git object store as the main repository.

---

## Task 1: Create the Git Worktree

A git worktree is an additional working tree linked to the same repository. This lets you check out a different branch in a separate directory without disturbing the main checkout.

- [ ] From the main repository directory, create the worktree and branch in one command:

  ```sh
  cd /Users/ansidev/projects/personal/awesome-nuxt
  git worktree add -b chore/update-vue /Users/ansidev/git-worktrees/awesome-nuxt/update-vue develop
  ```

  Expected output:

  ```
  Preparing worktree (new branch 'chore/update-vue')
  HEAD is now at <commit-hash> <last commit message on develop>
  ```

- [ ] Verify the worktree was created and is on the correct branch:

  ```sh
  git worktree list
  ```

  Expected output includes a line like:

  ```
  /Users/ansidev/git-worktrees/awesome-nuxt/update-vue  <commit-hash>  [chore/update-vue]
  ```

- [ ] Switch into the worktree directory. All remaining commands in Tasks 2–7 are run from this directory:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vue
  ```

---

## Task 2: Update `package.json`

Edit `package.json` to raise the `vue` version range pin from `^3.5.13` to `^3.5.30`.

- [ ] Open `/Users/ansidev/git-worktrees/awesome-nuxt/update-vue/package.json` in your editor (or use a tool) and change line 43:

  Before:

  ```json
  "vue": "^3.5.13",
  ```

  After:

  ```json
  "vue": "^3.5.30",
  ```

  No other lines should change.

- [ ] Confirm the change is correct:

  ```sh
  grep '"vue"' /Users/ansidev/git-worktrees/awesome-nuxt/update-vue/package.json
  ```

  Expected output:

  ```
      "vue": "^3.5.30",
  ```

---

## Task 3: Install Dependencies

Run `pnpm install` to update the lockfile so it resolves `vue` to `3.5.30`.

- [ ] Run the install from inside the worktree directory:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vue
  pnpm install
  ```

  Expected output ends with something like:

  ```
  Packages: +1 -1
  Progress: resolved N, reused N, downloaded 1, added 1, done
  ```

- [ ] Confirm the lockfile now resolves vue to `3.5.30`:

  ```sh
  grep -A2 "^vue@" /Users/ansidev/git-worktrees/awesome-nuxt/update-vue/pnpm-lock.yaml | head -6
  ```

  Expected: the resolved version shown is `3.5.30`, not `3.5.29`.

---

## Task 4: Lint Verification

Run the project's lint command to ensure no markdown errors have been introduced (baseline is 0 errors).

- [ ] Run lint from inside the worktree directory:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vue
  pnpm lint
  ```

  This runs: `markdownlint-cli2 ./content/**/*.md`

  Expected output: the command exits with code 0 and reports no errors. Example:

  ```
  markdownlint-cli2 v0.x.x (markdownlint vX.X.X)
  Finding: ./content/**/*.md
  Linting: N file(s)
  Summary: 0 error(s)
  ```

- [ ] If any errors are reported, investigate and fix them before continuing. A dependency version bump should not affect markdown content, so errors here likely indicate a pre-existing issue or an environmental problem.

---

## Task 5: Build Verification

Run the VuePress build to confirm the site compiles without errors after the dependency update.

- [ ] Run the build from inside the worktree directory:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vue
  pnpm build
  ```

  This runs: `vuepress build content`

  Expected: the build completes successfully. The final lines of output look similar to:

  ```
  ✓ Compiling with vite - done
  ✓ Rendering pages - done
  ```

  The command exits with code 0.

- [ ] If the build fails, check the error output carefully. A failure here after a minor vue patch bump is unexpected — verify that `pnpm install` completed cleanly in Task 3 and that there are no conflicting peer dependency issues.

---

## Task 6: Commit the Changes

Commit the two changed files (`package.json` and `pnpm-lock.yaml`) with the conventional commit message matching the project style.

- [ ] Stage the two changed files explicitly (do not use `git add .` to avoid accidentally staging unintended files):

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vue
  git add package.json pnpm-lock.yaml
  ```

- [ ] Verify only the expected files are staged:

  ```sh
  git status
  ```

  Expected output:

  ```
  On branch chore/update-vue
  Changes to be committed:
    (use "git restore --staged <file>..." to unstage)
          modified:   package.json
          modified:   pnpm-lock.yaml
  ```

- [ ] Create the commit:

  ```sh
  git commit -m "chore(deps): update dependency vue to v3.5.30"
  ```

  Expected output:

  ```
  [chore/update-vue <commit-hash>] chore(deps): update dependency vue to v3.5.30
   2 files changed, N insertions(+), N deletions(-)
  ```

---

## Task 7: Push Branch and Open Pull Request

Push the branch to the remote and open a PR targeting `develop` using the GitHub CLI (`gh`).

- [ ] Push the branch to the remote:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vue
  git push -u origin chore/update-vue
  ```

  Expected output:

  ```
  To https://github.com/ansidev/awesome-nuxt.git
   * [new branch]      chore/update-vue -> chore/update-vue
  Branch 'chore/update-vue' set up to track remote branch 'chore/update-vue' from 'origin'.
  ```

- [ ] Open the pull request using `gh pr create`:

  ```sh
  gh pr create \
    --title "chore(deps): update dependency vue to v3.5.30" \
    --base develop \
    --body "$(cat <<'EOF'
  ## Summary

  Bumps the `vue` devDependency range pin from `^3.5.13` to `^3.5.30`.

  | Package | From    | To      |
  |---------|---------|---------|
  | vue     | ^3.5.13 | ^3.5.30 |

  The lockfile now resolves `vue` to `3.5.30` (previously `3.5.29`).

  ## Verification

  - `pnpm lint` — 0 errors (matches baseline)
  - `pnpm build` — VuePress build completes successfully
  EOF
  )"
  ```

  Expected output: a URL to the newly created pull request, e.g.:

  ```
  https://github.com/ansidev/awesome-nuxt/pull/NNN
  ```

- [ ] Open the PR URL in a browser and confirm:
  - Title is `chore(deps): update dependency vue to v3.5.30`
  - Base branch is `develop`
  - The diff shows only `package.json` and `pnpm-lock.yaml`
  - CI checks pass (if configured)

---

## Task 8: Teardown After Merge

Once the PR is merged into `develop`, clean up the local worktree and branch.

- [ ] Confirm the PR has been merged (check GitHub UI or run):

  ```sh
  gh pr view --web
  ```

- [ ] Remove the worktree from the filesystem. Run this from the **main repo directory** (not from inside the worktree being removed):

  ```sh
  cd /Users/ansidev/projects/personal/awesome-nuxt
  git worktree remove /Users/ansidev/git-worktrees/awesome-nuxt/update-vue
  ```

  Expected output: no output (silent success). The directory `/Users/ansidev/git-worktrees/awesome-nuxt/update-vue` is deleted.

- [ ] Delete the local tracking branch:

  ```sh
  git branch -d chore/update-vue
  ```

  Expected output:

  ```
  Deleted branch chore/update-vue (was <commit-hash>).
  ```

  If git refuses with "not fully merged", double-check the PR was actually merged. If it was merged via squash or rebase, use `-D` instead of `-d` and confirm intentionally:

  ```sh
  git branch -D chore/update-vue
  ```

- [ ] Optionally, prune the remote tracking reference:

  ```sh
  git fetch --prune
  ```

- [ ] Verify the worktree list no longer shows the removed entry:

  ```sh
  git worktree list
  ```

  Expected output: only the main worktree is listed.
