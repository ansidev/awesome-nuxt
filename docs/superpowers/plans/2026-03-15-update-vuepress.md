# Update VuePress Monorepo Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all `vuepress` and `@vuepress/*` package range pins in `package.json` to match their currently-installed versions, in a dedicated git worktree, and open a PR targeting `develop`.

**Architecture:** Create an isolated git worktree from `develop`, bump all 8 VuePress-related version ranges in `package.json`, reinstall dependencies, verify with lint and build, commit, and open a PR.

**Tech Stack:** git worktrees, pnpm, VuePress 2

---

## Task 1: Create the git worktree

A git worktree lets you check out a branch into a separate directory without disturbing your main working tree. All commands in this task run from the **main repo root**.

- [ ] Ensure the worktrees base directory exists:

  ```sh
  mkdir -p /Users/ansidev/git-worktrees/awesome-nuxt
  ```

- [ ] Create the worktree and a new branch `chore/update-vuepress` based on `develop`:

  ```sh
  cd /Users/ansidev/projects/personal/awesome-nuxt
  git worktree add /Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress -b chore/update-vuepress develop
  ```

  Expected output:

  ```
  Preparing worktree (new branch 'chore/update-vuepress')
  branch 'chore/update-vuepress' set up to track 'develop'.
  HEAD is now at <commit-hash> <latest commit message>
  ```

- [ ] Confirm the worktree was created and the branch is correct:

  ```sh
  git worktree list
  ```

  Expected: a line for `/Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress` showing branch `chore/update-vuepress`.

---

## Task 2: Update version ranges in `package.json`

All remaining commands run from **inside the worktree directory** unless stated otherwise.

```sh
cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress
```

Open `package.json` and apply the following 8 changes. The file is at:

```
/Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress/package.json
```

- [ ] Update `vuepress`:

  ```diff
  - "vuepress": "^2.0.0-rc.19"
  + "vuepress": "^2.0.0-rc.26"
  ```

- [ ] Update `@vuepress/bundler-vite`:

  ```diff
  - "@vuepress/bundler-vite": "^2.0.0-rc.19"
  + "@vuepress/bundler-vite": "^2.0.0-rc.26"
  ```

- [ ] Update `@vuepress/client`:

  ```diff
  - "@vuepress/client": "^2.0.0-rc.19"
  + "@vuepress/client": "^2.0.0-rc.26"
  ```

- [ ] Update `@vuepress/plugin-docsearch`:

  ```diff
  - "@vuepress/plugin-docsearch": "^2.0.0-rc.67"
  + "@vuepress/plugin-docsearch": "^2.0.0-rc.125"
  ```

- [ ] Update `@vuepress/plugin-git`:

  ```diff
  - "@vuepress/plugin-git": "^2.0.0-rc.66"
  + "@vuepress/plugin-git": "^2.0.0-rc.125"
  ```

- [ ] Update `@vuepress/plugin-google-analytics`:

  ```diff
  - "@vuepress/plugin-google-analytics": "^2.0.0-rc.66"
  + "@vuepress/plugin-google-analytics": "^2.0.0-rc.125"
  ```

- [ ] Update `@vuepress/plugin-pwa`:

  ```diff
  - "@vuepress/plugin-pwa": "^2.0.0-rc.66"
  + "@vuepress/plugin-pwa": "^2.0.0-rc.125"
  ```

- [ ] Update `@vuepress/theme-default`:

  ```diff
  - "@vuepress/theme-default": "^2.0.0-rc.66"
  + "@vuepress/theme-default": "^2.0.0-rc.125"
  ```

- [ ] Verify the diff looks correct before proceeding:

  ```sh
  git diff package.json
  ```

  Confirm all 8 version range changes are present and no other lines were modified.

---

## Task 3: Run `pnpm install`

Running `pnpm install` after a range-pin change updates the specifier recorded in `pnpm-lock.yaml` without actually changing the resolved versions (since the currently-installed versions already satisfy the new ranges).

- [ ] Run install from the worktree directory:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress
  pnpm install
  ```

  Expected output: pnpm reports the lockfile was updated. The resolved package versions for all 8 packages should remain unchanged (only the specifier fields in `pnpm-lock.yaml` will change to reflect the new ranges).

- [ ] Confirm the lockfile was updated with the new specifiers:

  ```sh
  git diff pnpm-lock.yaml | grep -E "^\+.*specifier"
  ```

  Expected: 8 lines showing the updated specifiers, e.g.:

  ```
  +    specifier: ^2.0.0-rc.26
  +    specifier: ^2.0.0-rc.125
  ```

  (The `version:` lines should be unchanged.)

---

## Task 4: Run `pnpm lint`

- [ ] Run the linter:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress
  pnpm lint
  ```

  This runs: `markdownlint-cli2 ./content/**/*.md`

  Expected output: The command exits with code 0 and reports 0 errors. Example:

  ```
  markdownlint-cli2 v0.x.x (markdownlint vX.X.X)
  Finding: ./content/**/*.md
  Linting: X file(s)
  Summary: 0 error(s) found
  ```

  If errors are reported: This is unexpected since no Markdown files were changed. Investigate whether any pre-existing lint issues exist before continuing.

---

## Task 5: Run `pnpm build`

- [ ] Run the VuePress build:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress
  pnpm build
  ```

  This runs: `vuepress build content`

  Expected output: Build completes successfully with no errors. The final lines should resemble:

  ```
  ✔ Initializing and preparing data - done
  ✔ Compiling with vite - client +Xs
  ✔ Compiling with vite - server +Xs
  ✔ Rendering pages - done
  ```

  If the build fails:
  1. Note the exact error message.
  2. Check the VuePress 2 changelog for breaking changes between `rc.19` and `rc.26` (or between the plugin versions): https://github.com/vuepress/vuepress-next/blob/main/CHANGELOG.md
  3. Apply any required configuration or code changes before continuing.
  4. Re-run `pnpm build` until it passes.

---

## Task 6: Commit the changes

- [ ] Stage both changed files:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress
  git add package.json pnpm-lock.yaml
  ```

- [ ] Verify the staged files are exactly `package.json` and `pnpm-lock.yaml` (no unintended files):

  ```sh
  git status
  ```

  Expected:

  ```
  On branch chore/update-vuepress
  Changes to be committed:
    (use "git restore --staged <file>..." to unstage)
          modified:   package.json
          modified:   pnpm-lock.yaml
  ```

- [ ] Create the commit with the exact message below:

  ```sh
  git commit -m "$(cat <<'EOF'
  chore(deps): update vuepress monorepo

  - vuepress: ^2.0.0-rc.19 → ^2.0.0-rc.26
  - @vuepress/bundler-vite: ^2.0.0-rc.19 → ^2.0.0-rc.26
  - @vuepress/client: ^2.0.0-rc.19 → ^2.0.0-rc.26
  - @vuepress/plugin-docsearch: ^2.0.0-rc.67 → ^2.0.0-rc.125
  - @vuepress/plugin-git: ^2.0.0-rc.66 → ^2.0.0-rc.125
  - @vuepress/plugin-google-analytics: ^2.0.0-rc.66 → ^2.0.0-rc.125
  - @vuepress/plugin-pwa: ^2.0.0-rc.66 → ^2.0.0-rc.125
  - @vuepress/theme-default: ^2.0.0-rc.66 → ^2.0.0-rc.125
  EOF
  )"
  ```

  Expected output:

  ```
  [chore/update-vuepress <hash>] chore(deps): update vuepress monorepo
   2 files changed, X insertions(+), X deletions(-)
  ```

---

## Task 7: Push the branch and open a pull request

- [ ] Push the branch to the remote:

  ```sh
  cd /Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress
  git push -u origin chore/update-vuepress
  ```

  Expected output:

  ```
  To https://github.com/ansidev/awesome-nuxt.git
   * [new branch]      chore/update-vuepress -> chore/update-vuepress
  branch 'chore/update-vuepress' set up to track 'origin/chore/update-vuepress'.
  ```

- [ ] Open a pull request targeting `develop` using the GitHub CLI:

  ```sh
  gh pr create \
    --base develop \
    --head chore/update-vuepress \
    --title "chore(deps): update vuepress monorepo" \
    --body "$(cat <<'EOF'
  ## Summary

  - Updates all `vuepress` and `@vuepress/*` package range pins in `package.json` to prevent future installs from resolving to older versions.
  - The resolved versions in the lockfile are unchanged; only the range specifiers are updated.

  ## Changes

  | Package | Old range | New range |
  |---|---|---|
  | `vuepress` | `^2.0.0-rc.19` | `^2.0.0-rc.26` |
  | `@vuepress/bundler-vite` | `^2.0.0-rc.19` | `^2.0.0-rc.26` |
  | `@vuepress/client` | `^2.0.0-rc.19` | `^2.0.0-rc.26` |
  | `@vuepress/plugin-docsearch` | `^2.0.0-rc.67` | `^2.0.0-rc.125` |
  | `@vuepress/plugin-git` | `^2.0.0-rc.66` | `^2.0.0-rc.125` |
  | `@vuepress/plugin-google-analytics` | `^2.0.0-rc.66` | `^2.0.0-rc.125` |
  | `@vuepress/plugin-pwa` | `^2.0.0-rc.66` | `^2.0.0-rc.125` |
  | `@vuepress/theme-default` | `^2.0.0-rc.66` | `^2.0.0-rc.125` |

  ## Test plan

  - [ ] `pnpm lint` passes with 0 errors
  - [ ] `pnpm build` completes successfully
  EOF
  )"
  ```

  Expected output: a URL to the newly opened pull request, e.g.:

  ```
  https://github.com/ansidev/awesome-nuxt/pull/XXX
  ```

---

## Task 8: Teardown after merge

Once the pull request has been merged into `develop`, clean up the worktree and local branch. These commands run from the **main repo root**.

- [ ] Switch to the main repo root:

  ```sh
  cd /Users/ansidev/projects/personal/awesome-nuxt
  ```

- [ ] Fetch the latest remote state to confirm the merge:

  ```sh
  git fetch origin
  git log origin/develop --oneline -5
  ```

  Confirm the merge commit for `chore/update-vuepress` appears in the log.

- [ ] Remove the worktree directory:

  ```sh
  git worktree remove /Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress
  ```

  Expected output: no output (silent success). The directory `/Users/ansidev/git-worktrees/awesome-nuxt/update-vuepress` will be deleted.

- [ ] Delete the local branch:

  ```sh
  git branch -d chore/update-vuepress
  ```

  Expected output:

  ```
  Deleted branch chore/update-vuepress (was <hash>).
  ```

  Note: `-d` (lowercase) is safe — it refuses to delete the branch if it has not been fully merged. If you see an error about the branch not being merged, verify the PR was actually merged (not just closed) before forcing with `-D`.

- [ ] Optionally prune the remote-tracking reference:

  ```sh
  git remote prune origin
  ```
