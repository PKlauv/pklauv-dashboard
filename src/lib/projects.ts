const techColors: Record<string, string> = {
	JavaScript: 'text-yellow-400 border-yellow-400/30',
	TypeScript: 'text-blue-400 border-blue-400/30',
	Python: 'text-green-400 border-green-400/30',
	Swift: 'text-orange-400 border-orange-400/30',
	Rust: 'text-orange-300 border-orange-300/30',
	Svelte: 'text-red-400 border-red-400/30',
	Canvas: 'text-purple-400 border-purple-400/30',
	Plotly: 'text-cyan-400 border-cyan-400/30',
	Supabase: 'text-emerald-400 border-emerald-400/30',
	macOS: 'text-gray-300 border-gray-300/30',
	HTML: 'text-orange-500 border-orange-500/30',
	CSS: 'text-blue-500 border-blue-500/30',
	Tailwind: 'text-cyan-300 border-cyan-300/30',
	'Node.js': 'text-green-500 border-green-500/30',
	Postgres: 'text-blue-300 border-blue-300/30',
	React: 'text-sky-400 border-sky-400/30'
};

export function getTechColor(tech: string): string {
	return techColors[tech] || 'text-[var(--color-text-muted)] border-[var(--color-border)]';
}

export interface Project {
	slug: string;
	title: string;
	description: string;
	tech: string[];
	source: 'open' | 'closed';
	github: string;
	live?: string;
	image?: string;
	firstCommit: string;
}

export async function getProjects(): Promise<Project[]> {
	const modules = import.meta.glob('/content/projects/*.md', { eager: true });

	const projects: Project[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const { metadata } = module as { metadata: Omit<Project, 'slug'> };
		const slug = path.split('/').pop()!.replace('.md', '');
		projects.push({ slug, ...metadata });
	}

	return projects.sort((a, b) => a.title.localeCompare(b.title));
}
