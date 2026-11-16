const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const { selectReviewPR, approved } = require('./netlify-policy.cjs');
const repo = process.env.GITHUB_REPOSITORY;
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
function api(path, paginate = false) {
  const args = ['api', `repos/${repo}/${path}`];
  if (paginate) args.push('--paginate', '--slurp');
  const result = JSON.parse(execFileSync('gh', args, { encoding: 'utf8' }));
  return paginate ? result.flat() : result;
}
function verifyApproval(pr) {
  const reviews = api(`pulls/${pr.number}/reviews?per_page=100`, true);
  const permissions = {};
  for (const login of new Set(reviews.filter(r => r.state === 'APPROVED' && r.user?.login).map(r => r.user.login))) {
    permissions[login] = api(`collaborators/${encodeURIComponent(login)}/permission`).permission;
  }
  if (!approved(reviews, pr.head.sha, permissions)) throw new Error('No current approval on this exact head from a maintainer with write access. Request a new review.');
}
try {
  let pr;
  let sha;
  let target;
  if (process.env.RECHECK === 'true' || process.env.RECHECK_HEAD === 'true') {
    pr = api(`pulls/${process.env.PR_NUMBER}`);
    if (pr.state !== 'open' || pr.head.sha !== process.env.EXPECTED_SHA || pr.base.ref !== process.env.EXPECTED_BASE) throw new Error('PR closed, retargeted, or head changed during the build.');
    if (process.env.RECHECK === 'true') verifyApproval(pr);
  } else if (event.workflow_run) {
    const run = api(`actions/runs/${event.workflow_run.id}`);
    const workflow = api('actions/workflows/netlify_review_signal.yaml');
    pr = selectReviewPR(run, workflow.id, api('pulls?state=open&per_page=100', true));
    if (pr.head.repo.id === pr.base.repo.id) throw new Error('Review-triggered deployments are reserved for forks.');
    verifyApproval(pr);
    sha = pr.head.sha;
    target = pr.base.ref === 'main' ? 'staging' : `pr-${pr.number}`;
  } else {
    pr = event.pull_request;
    if (!pr || !['main', 'develop'].includes(pr.base.ref)) throw new Error('Unsupported PR event or target branch.');
    if (event.action === 'closed') throw new Error('Closed PRs are handled by the merge deployment workflow.');
    if (pr.head.repo.id !== pr.base.repo.id) throw new Error('Fork previews require an approval on the current head.');
    sha = pr.head.sha;
    target = pr.base.ref === 'main' ? 'staging' : `pr-${pr.number}`;
  }
  if (process.env.RECHECK !== 'true' && process.env.RECHECK_HEAD !== 'true') fs.appendFileSync(process.env.GITHUB_OUTPUT, `sha=${sha}\ntarget=${target}\npr=${pr.number}\nbase=${pr.base.ref}\nfork_review=${Boolean(event.workflow_run)}\n`);
} catch (error) {
  console.error(`::error::Netlify deployment gate: ${error.message}`);
  process.exit(1);
}
