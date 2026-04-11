import { env } from '$env/dynamic/private';

const USERNAME = 'PKlauv';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
	data: T;
	expires: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

async function fetchGitHub<T>(path: string): Promise<T> {
	const cached = cache.get(path);
	if (cached && cached.expires > Date.now()) {
		return cached.data as T;
	}

	const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
	if (env.GITHUB_PAT) {
		headers.Authorization = `Bearer ${env.GITHUB_PAT}`;
	}

	const res = await fetch(`https://api.github.com${path}`, { headers });
	const data = (await res.json()) as T;

	cache.set(path, { data, expires: Date.now() + CACHE_TTL });
	return data;
}

async function fetchGraphQL<T>(query: string): Promise<T> {
	const cacheKey = `graphql:${query}`;
	const cached = cache.get(cacheKey);
	if (cached && cached.expires > Date.now()) {
		return cached.data as T;
	}

	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.GITHUB_PAT}`
		},
		body: JSON.stringify({ query })
	});

	const json = (await res.json()) as { data: T };
	cache.set(cacheKey, { data: json.data, expires: Date.now() + CACHE_TTL });
	return json.data;
}

// Types
interface GitHubEvent {
	type: string;
	repo: { name: string };
	created_at: string;
	payload: {
		action?: string;
		ref?: string;
		ref_type?: string;
		size?: number;
		commits?: { message: string }[];
	};
}

interface GitHubRepo {
	name: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	html_url: string;
	homepage: string | null;
	pushed_at: string;
	fork: boolean;
}

export interface Activity {
	type: string;
	repo: string;
	description: string;
	date: string;
}

export interface Repo {
	name: string;
	description: string | null;
	language: string | null;
	stars: number;
	url: string;
	homepage: string | null;
	pushedAt: string;
}

export interface ContributionDay {
	count: number;
	date: string;
	weekday: number;
}

export interface ContributionCalendar {
	totalContributions: number;
	weeks: { days: ContributionDay[] }[];
}

function describeEvent(event: GitHubEvent): string {
	const repo = event.repo.name.replace(`${USERNAME}/`, '');
	switch (event.type) {
		case 'PushEvent': {
			const count = event.payload.size ?? event.payload.commits?.length;
			if (count) {
				return `Pushed ${count} commit${count !== 1 ? 's' : ''} to ${repo}`;
			}
			return `Pushed to ${repo}`;
		}
		case 'CreateEvent':
			return `Created ${event.payload.ref_type ?? 'repository'} ${event.payload.ref ? `${event.payload.ref} in ` : ''}${repo}`;
		case 'PullRequestEvent':
			return `${event.payload.action ?? 'Opened'} PR in ${repo}`;
		case 'IssuesEvent':
			return `${event.payload.action ?? 'Opened'} issue in ${repo}`;
		case 'WatchEvent':
			return `Starred ${repo}`;
		case 'ForkEvent':
			return `Forked ${repo}`;
		default:
			return `${event.type.replace('Event', '')} in ${repo}`;
	}
}

export async function getRecentActivity(limit = 10): Promise<Activity[]> {
	const events = await fetchGitHub<GitHubEvent[]>(`/users/${USERNAME}/events?per_page=30`);

	return events.slice(0, limit).map((e) => ({
		type: e.type,
		repo: e.repo.name.replace(`${USERNAME}/`, ''),
		description: describeEvent(e),
		date: e.created_at
	}));
}

export async function getRepos(): Promise<Repo[]> {
	const repos = await fetchGitHub<GitHubRepo[]>(`/users/${USERNAME}/repos?sort=pushed&per_page=10`);

	return repos
		.filter((r) => !r.fork)
		.map((r) => ({
			name: r.name,
			description: r.description,
			language: r.language,
			stars: r.stargazers_count,
			url: r.html_url,
			homepage: r.homepage,
			pushedAt: r.pushed_at
		}));
}

export async function getContributionCalendar(): Promise<ContributionCalendar> {
	if (!env.GITHUB_PAT) {
		return { totalContributions: 0, weeks: [] };
	}

	const data = await fetchGraphQL<{
		user: {
			contributionsCollection: {
				contributionCalendar: {
					totalContributions: number;
					weeks: {
						contributionDays: {
							contributionCount: number;
							date: string;
							weekday: number;
						}[];
					}[];
				};
			};
		};
	}>(`{
		user(login: "${USERNAME}") {
			contributionsCollection {
				contributionCalendar {
					totalContributions
					weeks {
						contributionDays {
							contributionCount
							date
							weekday
						}
					}
				}
			}
		}
	}`);

	const cal = data.user.contributionsCollection.contributionCalendar;
	return {
		totalContributions: cal.totalContributions,
		weeks: cal.weeks.map((w) => ({
			days: w.contributionDays.map((d) => ({
				count: d.contributionCount,
				date: d.date,
				weekday: d.weekday
			}))
		}))
	};
}
