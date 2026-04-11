import { getPosts } from '$lib/blog';
import { getProjects } from '$lib/projects';
import { getRecentActivity, getContributionCalendar } from '$lib/github';
import { supabase } from '$lib/supabase';

export async function load() {
	const [posts, projects, { count }, activity, contributions] = await Promise.all([
		getPosts(),
		getProjects(),
		supabase.from('page_views').select('*', { count: 'exact', head: true }),
		getRecentActivity(5),
		getContributionCalendar()
	]);

	return {
		latestPost: posts[0] ?? null,
		featuredProjects: projects.slice(0, 3),
		totalViews: count ?? 0,
		activity,
		calendar: contributions
	};
}
