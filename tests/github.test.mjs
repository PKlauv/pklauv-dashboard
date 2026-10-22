import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/lib/github.ts', import.meta.url), 'utf8');
let moduleId = 0;
async function loadGitHub(token = 'test-token') {
 const code = stripTypeScriptTypes(source.replace("import { env } from '$env/dynamic/private';", `const env = { GITHUB_PAT: ${JSON.stringify(token)} };`));
 return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}#${moduleId++}`);
}
const empty = { totalContributions: 0, weeks: [] };

test('GitHub failures remain recoverable and successful responses are cached', async () => {
 const originalFetch = globalThis.fetch;
 const originalError = console.error;
 console.error = () => {};
 try {
  for (const response of [
   () => Response.json({ message: 'Bad credentials' }, { status: 401 }),
   () => Response.json({ errors: [{ message: 'Unavailable' }] }),
   () => Response.json({ data: { user: null } }),
   () => new Response('not json'),
   () => { throw new Error('Network failure'); }
  ]) {
   const github = await loadGitHub();
   globalThis.fetch = async () => response();
   assert.deepEqual(await github.getContributionCalendar(), empty);
  }
  const missingToken = await loadGitHub('');
  globalThis.fetch = async () => { throw new Error('Should not fetch'); };
  assert.deepEqual(await missingToken.getContributionCalendar(), empty);

  const github = await loadGitHub();
  let calls = 0;
  globalThis.fetch = async (_url, options) => {
   calls++;
   if (calls === 1) {
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    return Response.json({ message: 'Bad credentials' }, { status: 401 });
   }
   assert.equal(options.headers.Authorization, undefined);
   return Response.json([{ type: 'PushEvent', repo: { name: 'PKlauv/example' }, created_at: '2026-10-22', payload: { size: 1 } }]);
  };
  assert.equal((await github.getRecentActivity())[0].repo, 'example');
  await github.getRecentActivity();
  assert.equal(calls, 2);

  for (const method of ['getRecentActivity', 'getRepos']) {
   const client = await loadGitHub();
   globalThis.fetch = async () => Response.json({ message: 'Unavailable' }, { status: 503 });
   assert.deepEqual(await client[method](), []);
   globalThis.fetch = async () => Response.json([]);
   assert.deepEqual(await client[method](), []);
  }

  const calendarClient = await loadGitHub();
  globalThis.fetch = async () => Response.json({ errors: [{ message: 'Try again' }] });
  assert.deepEqual(await calendarClient.getContributionCalendar(), empty);
  calls = 0;
  globalThis.fetch = async () => {
   calls++;
   return Response.json({ data: { user: { contributionsCollection: { contributionCalendar: { totalContributions: 2, weeks: [{ contributionDays: [{ contributionCount: 2, date: '2026-10-22', weekday: 4 }] }] } } } } });
  };
  const expected = { totalContributions: 2, weeks: [{ days: [{ count: 2, date: '2026-10-22', weekday: 4 }] }] };
  assert.deepEqual(await calendarClient.getContributionCalendar(), expected);
  assert.deepEqual(await calendarClient.getContributionCalendar(), expected);
  assert.equal(calls, 1);
 } finally {
  globalThis.fetch = originalFetch;
  console.error = originalError;
 }
});
