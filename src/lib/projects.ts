export interface Project {
	slug: string;
	title: string;
	description: string;
	tech: string[];
	status: string;
	github: string;
	live?: string;
	featured: boolean;
}

export async function getProjects(): Promise<Project[]> {
	const modules = import.meta.glob('/content/projects/*.md', { eager: true });

	const projects: Project[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const { metadata } = module as { metadata: Omit<Project, 'slug'> };
		const slug = path.split('/').pop()!.replace('.md', '');
		projects.push({ slug, ...metadata });
	}

	// Featured first, then alphabetical
	return projects.sort((a, b) => {
		if (a.featured !== b.featured) return a.featured ? -1 : 1;
		return a.title.localeCompare(b.title);
	});
}
