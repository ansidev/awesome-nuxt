function selectReviewPR(run, workflowId, prs) {
  if (run.event !== 'pull_request_review' || run.workflow_id !== workflowId || !run.head_repository?.id || !run.head_branch || !/^[a-f0-9]{40}$/.test(run.head_sha || '')) {
    throw new Error('Review run identity is invalid; rerun a submitted PR review.');
  }
  const matches = prs.filter(pr => pr.state === 'open' && ['main', 'develop'].includes(pr.base.ref) && [pr.base.repo?.id, pr.head.repo?.id].includes(run.head_repository.id) && pr.head.ref === run.head_branch && pr.head.sha === run.head_sha);
  if (matches.length !== 1) throw new Error('Could not uniquely match the run to a current open or merged PR; retry after checking its branch and head commit.');
  return matches[0];
}

function approved(reviews, sha, permissions) {
  const latest = new Map();
  for (const review of reviews) {
    if (review.user?.login && ['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) latest.set(review.user.login, review);
  }
  return [...latest].some(([login, review]) => review.state === 'APPROVED' && review.commit_id === sha && ['write', 'maintain', 'admin'].includes(permissions[login]));
}
module.exports = { selectReviewPR, approved };
