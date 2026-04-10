import { supabase } from '$lib/supabase';
import { getRecentActivity, getRepos, getContributionCalendar } from '$lib/github';

export async function load({ url }) {
	const range = url.searchParams.get('range') || '30d';

	const daysMap: Record<string, number | null> = {
		'7d': 7,
		'30d': 30,
		'90d': 90,
		all: null
	};
	const days = daysMap[range] ?? 30;

	const since = days
		? new Date(Date.now() - days * 86400000).toISOString()
		: null;

	let query = supabase.from('page_views').select('*');
	if (since) query = query.gte('created_at', since);

	const [{ data: views }, activity, repos, calendar] = await Promise.all([
		query.order('created_at', { ascending: false }),
		getRecentActivity(10),
		getRepos(),
		getContributionCalendar()
	]);
	const rows = views ?? [];

	// Total views
	const totalViews = rows.length;

	// Views by site
	const bySite: Record<string, number> = {};
	for (const row of rows) {
		bySite[row.site] = (bySite[row.site] || 0) + 1;
	}

	// Views over time (group by date)
	const byDate: Record<string, number> = {};
	for (const row of rows) {
		const date = new Date(row.created_at).toISOString().split('T')[0];
		byDate[date] = (byDate[date] || 0) + 1;
	}
	// Fill in missing dates
	const chartDays = days ?? 30;
	const viewsOverTime: { date: string; count: number }[] = [];
	for (let i = chartDays - 1; i >= 0; i--) {
		const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
		viewsOverTime.push({ date: d, count: byDate[d] || 0 });
	}

	// Top pages
	const byPage: Record<string, number> = {};
	for (const row of rows) {
		byPage[row.path] = (byPage[row.path] || 0) + 1;
	}
	const topPages = Object.entries(byPage)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([path, count]) => ({ path, count }));

	// Top referrers
	const byReferrer: Record<string, number> = {};
	for (const row of rows) {
		if (row.referrer) {
			byReferrer[row.referrer] = (byReferrer[row.referrer] || 0) + 1;
		}
	}
	const topReferrers = Object.entries(byReferrer)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([referrer, count]) => ({ referrer, count }));

	// Active repos (pushed in last 30 days)
	const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
	const activeRepos = repos.filter((r) => r.pushedAt > thirtyDaysAgo);

	// Top languages
	const langCount: Record<string, number> = {};
	for (const repo of repos) {
		if (repo.language) {
			langCount[repo.language] = (langCount[repo.language] || 0) + 1;
		}
	}
	const topLanguages = Object.entries(langCount)
		.sort((a, b) => b[1] - a[1])
		.map(([language, count]) => ({ language, count }));

	return {
		totalViews,
		bySite,
		viewsOverTime,
		topPages,
		topReferrers,
		range,
		activity,
		activeReposCount: activeRepos.length,
		topLanguages,
		calendar
	};
}
