const { test } = require('node:test');
const assert = require('node:assert/strict');
const { selectReviewPR, approved } = require('./netlify-policy.cjs');

const sha = 'a'.repeat(40);
const pr = { number: 12, state: 'open', base: { ref: 'develop', repo: { id: 9 } }, head: { sha, ref: 'feature', repo: { id: 5 } } };
const run = { event: 'pull_request_review', workflow_id: 7, head_sha: sha, head_branch: 'feature', head_repository: { id: 9 } };

test('selects only the uniquely linked current fork PR', () => {
  assert.equal(selectReviewPR(run, 7, [pr]).number, 12);
  assert.throws(() => selectReviewPR(run, 7, [{ ...pr, head: { ...pr.head, sha: 'c'.repeat(40) }, merge_commit_sha: null }]));
  assert.throws(() => selectReviewPR(run, 7, [pr, { ...pr, number: 13 }]));
  assert.throws(() => selectReviewPR({ ...run, event: 'push' }, 7, [pr]));
  assert.equal(selectReviewPR({ ...run, head_repository: { id: 5 } }, 7, [pr]).number, 12);
  assert.throws(() => selectReviewPR({ ...run, head_repository: { id: 6 } }, 7, [pr]));
  assert.throws(() => selectReviewPR({ ...run, head_branch: 'other' }, 7, [pr]));
});

test('requires the latest review from an authorized maintainer on this exact head', () => {
  const review = { user: { login: 'maintainer' }, state: 'APPROVED', commit_id: sha };
  assert.equal(approved([review], sha, { maintainer: 'write' }), true);
  assert.equal(approved([review], 'c'.repeat(40), { maintainer: 'write' }), false);
  assert.equal(approved([review], sha, { maintainer: 'read' }), false);
  assert.equal(approved([review, { ...review, state: 'CHANGES_REQUESTED' }], sha, { maintainer: 'write' }), false);
  assert.equal(approved([{ ...review, state: 'DISMISSED' }], sha, { maintainer: 'admin' }), false);
  assert.equal(approved([review, { ...review, state: 'COMMENTED' }], sha, { maintainer: 'write' }), true);
});
