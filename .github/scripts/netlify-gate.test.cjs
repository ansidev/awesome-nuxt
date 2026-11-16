const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const gate = path.join(__dirname, 'netlify-gate.cjs');
const sha = 'a'.repeat(40);
const pr = { number: 17, merged: true, merge_commit_sha: sha, base: { ref: 'main', repo: { id: 1 } }, head: { sha: 'b'.repeat(40), repo: { id: 2 } } };

function run(event, extra = {}, answers = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'netlify-test-'));
  try {
    fs.writeFileSync(path.join(dir, 'event.json'), JSON.stringify(event));
    fs.writeFileSync(path.join(dir, 'output'), '');
    fs.writeFileSync(path.join(dir, 'gh'), '#!/usr/bin/env node\nconst a=JSON.parse(process.env.ANSWERS); const x=a[process.argv[3]]; if(!x) process.exit(1); console.log(JSON.stringify(x));\n', { mode: 0o755 });
    const result = spawnSync(process.execPath, [gate], { encoding: 'utf8', env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, GITHUB_REPOSITORY: 'owner/repo', GITHUB_EVENT_PATH: path.join(dir, 'event.json'), GITHUB_OUTPUT: path.join(dir, 'output'), ANSWERS: JSON.stringify(answers), ...extra } });
    return { ...result, output: fs.readFileSync(path.join(dir, 'output'), 'utf8') };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

test('PR branch gate rejects closed PRs, including merged PRs', () => {
  assert.notEqual(run({ action: 'closed', pull_request: pr }).status, 0);
  assert.notEqual(run({ action: 'closed', pull_request: { ...pr, merged: false } }).status, 0);
});

test('fork recheck rejects a changed head or dismissed approval', () => {
  const env = { RECHECK: 'true', PR_NUMBER: '17', EXPECTED_SHA: sha, EXPECTED_BASE: 'main' };
  const current = { ...pr, state: 'open', head: { ...pr.head, sha } };
  const review = { user: { login: 'maintainer' }, state: 'APPROVED', commit_id: sha };
  const answers = {
    'repos/owner/repo/pulls/17': current,
    'repos/owner/repo/pulls/17/reviews?per_page=100': [[review]],
    'repos/owner/repo/collaborators/maintainer/permission': { permission: 'write' },
  };
  assert.equal(run({}, env, answers).status, 0);
  review.state = 'DISMISSED';
  assert.notEqual(run({}, env, answers).status, 0);
  review.state = 'APPROVED';
  current.head.sha = 'c'.repeat(40);
  assert.notEqual(run({}, env, answers).status, 0);
});

test('same-repository recheck rejects stale, closed, and retargeted PRs', () => {
  const env = { RECHECK_HEAD: 'true', PR_NUMBER: '17', EXPECTED_SHA: sha, EXPECTED_BASE: 'main' };
  const current = { ...pr, state: 'open', base: { ...pr.base }, head: { ...pr.head, sha } };
  const answers = { 'repos/owner/repo/pulls/17': current };
  assert.equal(run({}, env, answers).status, 0);
  current.head.sha = 'c'.repeat(40);
  assert.notEqual(run({}, env, answers).status, 0);
  current.head.sha = sha;
  current.state = 'closed';
  assert.notEqual(run({}, env, answers).status, 0);
  current.state = 'open';
  current.base.ref = 'develop';
  assert.notEqual(run({}, env, answers).status, 0);
});
