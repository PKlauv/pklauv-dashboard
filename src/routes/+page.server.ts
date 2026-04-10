import { getPosts } from '$lib/blog';
import { getProjects } from '$lib/projects';
import { supabase } from '$lib/supabase';

export async function load() {
	const [posts, projects, { count }] = await Promise.all([
		getPosts(),
		getProjects(),
		supabase.from('page_views').select('*', { count: 'exact', head: true })
	]);

	return {
		latestPost: posts[0] ?? null,
		featuredProjects: projects.filter((p) => p.featured).slice(0, 3),
		totalViews: count ?? 0
	};
}
