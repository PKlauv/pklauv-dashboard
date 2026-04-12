import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const modules = import.meta.glob('/content/projects/*.md');
	const path = `/content/projects/${params.slug}.md`;

	if (!modules[path]) {
		error(404, 'Project not found');
	}

	const module = (await modules[path]()) as {
		default: import('svelte').Component;
		metadata: {
			title: string;
			description: string;
			tech: string[];
			source: 'open' | 'closed';
			github: string;
			live?: string;
			image?: string;
			poster?: string;
			firstCommit: string;
		};
	};

	return {
		content: module.default,
		...module.metadata
	};
}
