<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PK Lauvstad</title>
</svelte:head>

<div class="min-h-dvh flex flex-col">
	<nav class="flex items-center gap-6 px-6 py-4 text-sm border-b border-[var(--color-border)]">
		<a href="/" class="font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">
			Projects
		</a>
		<a href="/blog" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
			Blog
		</a>
		<a href="https://github.com/PKLauv" target="_blank" rel="noopener" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
			GitHub
		</a>
	</nav>

	<main class="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
		{@render children()}
	</main>

	<footer class="px-6 py-6 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
		Per Kristian Lauvstad &middot; CS &middot; D2 Athlete
	</footer>
</div>
