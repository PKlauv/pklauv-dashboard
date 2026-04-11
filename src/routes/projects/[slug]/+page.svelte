<script lang="ts">
	import { getTechColor } from '$lib/projects';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} — PK Lauvstad</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<a href="/projects" class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">&larr; Back to projects</a>

	<article class="mt-8">
		{#if data.image}
			<div class="rounded-xl overflow-hidden border border-[var(--color-border)] mb-8">
				<img src={data.image} alt={data.title} class="w-full" />
			</div>
		{/if}
		<header class="mb-8">
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-semibold tracking-tight">{data.title}</h1>
				<span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full {data.status === 'active'
					? 'bg-green-500/10 text-green-400'
					: 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'}">{data.status}</span>
			</div>
			<p class="text-[var(--color-text-muted)] mt-2">{data.description}</p>
			<div class="flex flex-wrap gap-1.5 mt-4">
				{#each data.tech as t}
					<span class="text-[11px] px-2 py-0.5 rounded border {getTechColor(t)}">{t}</span>
				{/each}
			</div>
			<div class="flex gap-4 mt-4">
				<a href={data.github} target="_blank" rel="noopener" class="text-sm text-[var(--color-accent)] hover:underline">GitHub</a>
				{#if data.live}
					<a href={data.live} target="_blank" rel="noopener" class="text-sm text-[var(--color-accent)] hover:underline">Live demo</a>
				{/if}
			</div>
		</header>

		<div class="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline">
			<data.content />
		</div>
	</article>
</div>
