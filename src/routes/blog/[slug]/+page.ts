import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const modules = import.meta.glob('/content/blog/*.md');
	const path = `/content/blog/${params.slug}.md`;

	if (!modules[path]) {
		error(404, 'Post not found');
	}

	const module = (await modules[path]()) as {
		default: import('svelte').Component;
		metadata: { title: string; date: string; excerpt: string };
	};

	return {
		content: module.default,
		title: module.metadata.title,
		date: module.metadata.date
	};
}
