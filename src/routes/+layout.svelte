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
	<nav class="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 text-sm border-b border-[var(--color-border)]">
		<a href="/" class="font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors shrink-0">
			PK
		</a>
		<div class="flex items-center gap-3 sm:gap-5 ml-auto overflow-x-auto">
			<a href="/projects" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				Projects
			</a>
			<a href="/blog" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				Blog
			</a>
			<a href="/dashboard" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				Dashboard
			</a>
			<a href="/about" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				About
			</a>
			<a href="https://github.com/PKLauv" target="_blank" rel="noopener" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				GitHub
			</a>
		</div>
	</nav>

	<main class="flex-1 px-4 sm:px-6 py-10 sm:py-12 mx-auto w-full">
		{@render children()}
	</main>

	<footer class="px-4 sm:px-6 py-6 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
		Per Kristian Lauvstad &middot; Computer Science &middot; NCAA Soccer
	</footer>
</div>
