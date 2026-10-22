import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			remarkPlugins: [remarkGfm]
		}),
		{
			// mdsvex generates legacy module scripts for Markdown frontmatter.
			name: 'modernize-mdsvex-module-scripts',
			markup: ({ content, filename }) => {
				if (!filename?.endsWith('.md')) return;
				return { code: content.replace(/<script context="module">/g, '<script module>') };
			}
		}
	],
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({ runtime: 'nodejs22.x' })
	}
};

export default config;
