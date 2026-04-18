import { getPosts } from '$lib/blog';
import { getProjects } from '$lib/projects';
import { getRecentActivity, getContributionCalendar } from '$lib/github';

export async function load() {
	const [posts, projects, activity, contributions] = await Promise.all([
		getPosts(),
		getProjects(),
		getRecentActivity(5),
		getContributionCalendar()
	]);

	return {
		latestPost: posts[0] ?? null,
		featuredProjects: projects.slice(0, 3),
		activity,
		calendar: contributions
	};
}
