import { getPosts } from '$lib/blog';
import { supabase } from '$lib/supabase';

export async function load() {
	const [posts, { count }] = await Promise.all([
		getPosts(),
		supabase.from('page_views').select('*', { count: 'exact', head: true })
	]);

	return {
		latestPost: posts[0] ?? null,
		totalViews: count ?? 0
	};
}
