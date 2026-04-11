export interface Post {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	published: boolean;
	readTime: number;
	tags: string[];
}

export async function getPosts(): Promise<Post[]> {
	const modules = import.meta.glob('/content/blog/*.md', { eager: true });
	const rawFiles = import.meta.glob('/content/blog/*.md', { eager: true, query: '?raw', import: 'default' });

	const posts: Post[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const { metadata } = module as { metadata: Omit<Post, 'slug' | 'readTime'> };
		const slug = path.split('/').pop()!.replace('.md', '');

		if (metadata.published) {
			const raw = (rawFiles[path] as string) ?? '';
			const body = raw.replace(/^---[\s\S]*?---/, '');
			const words = body.split(/\s+/).filter(Boolean).length;
			const readTime = Math.max(1, Math.ceil(words / 200));
			posts.push({ ...metadata, slug, readTime, tags: metadata.tags ?? [] });
		}
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
