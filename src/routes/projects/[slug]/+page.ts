import { error } from '@sveltejs/kit';
import type { Project } from '$lib/projects';

export async function load({ params }) {
	const modules = import.meta.glob('/content/projects/*.md');
	const path = `/content/projects/${params.slug}.md`;

	if (!modules[path]) {
		error(404, 'Project not found');
	}

	const module = (await modules[path]()) as {
		default: import('svelte').Component;
		metadata: Omit<Project, 'slug'>;
	};

	return {
		content: module.default,
		...module.metadata
	};
}
