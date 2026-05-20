export interface Post {
	slug: string;
	title: string;
	navTitle?: string;
	date: string;
	excerpt: string;
	published: boolean;
	tags: string[];
}

export async function getPosts(): Promise<Post[]> {
	const modules = import.meta.glob('/content/blog/*.md', { eager: true });

	const posts: Post[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const { metadata } = module as { metadata: Omit<Post, 'slug'> };
		const slug = path.split('/').pop()!.replace('.md', '');

		if (metadata.published) {
			posts.push({ ...metadata, slug, tags: metadata.tags ?? [] });
		}
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
