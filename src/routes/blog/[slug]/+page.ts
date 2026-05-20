import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/blog';

export async function load({ params }) {
	const modules = import.meta.glob('/content/blog/*.md');
	const path = `/content/blog/${params.slug}.md`;

	if (!modules[path]) {
		error(404, 'Post not found');
	}

	const module = (await modules[path]()) as {
		default: import('svelte').Component;
		metadata: { title: string; date: string; excerpt: string; tags?: string[] };
	};

	const rawFiles = import.meta.glob('/content/blog/*.md', { query: '?raw', import: 'default' });
	const raw = rawFiles[path] ? (await rawFiles[path]()) as string : '';
	const body = raw.replace(/^---[\s\S]*?---/, '');
	const words = body.split(/\s+/).filter(Boolean).length;
	const readTime = Math.max(1, Math.ceil(words / 200));

	// Posts are sorted newest-first; previous = older (i+1), next = newer (i-1).
	const posts = await getPosts();
	const i = posts.findIndex((p) => p.slug === params.slug);
	const older = posts[i + 1];
	const newer = posts[i - 1];

	return {
		content: module.default,
		title: module.metadata.title,
		date: module.metadata.date,
		readTime,
		tags: module.metadata.tags ?? [],
		prev: older ? { slug: older.slug, title: older.navTitle ?? older.title } : null,
		next: newer ? { slug: newer.slug, title: newer.navTitle ?? newer.title } : null
	};
}
