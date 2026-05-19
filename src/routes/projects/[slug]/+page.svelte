<script lang="ts">
	import { getTechColor } from '$lib/projects';
	import ProjectMedia from '$lib/components/ProjectMedia.svelte';
	let { data } = $props();

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>{data.title} // PK Lauvstad</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<a href="/projects" class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">&larr; Back to projects</a>

	<article class="mt-8">
		{#if data.image}
			{#if data.live || data.github}
				<a
					href={data.live ?? data.github}
					target="_blank"
					rel="noopener"
					class="block mb-8"
				>
					<div class="rounded-xl overflow-hidden border-2 border-[var(--color-border)] hover:border-emerald-400 transition-colors">
						<ProjectMedia src={data.image} poster={data.poster} alt={data.title} class="w-full max-h-[420px] object-contain mx-auto" />
					</div>
				</a>
			{:else}
				<div class="rounded-xl overflow-hidden border-2 border-[var(--color-border)] mb-8">
					<ProjectMedia src={data.image} poster={data.poster} alt={data.title} class="w-full max-h-[420px] object-contain mx-auto" />
				</div>
			{/if}
		{/if}
		<header class="mb-8">
			<div class="flex items-center gap-3">
				{#if data.github}
					<a href={data.github} target="_blank" rel="noopener" class="hover:underline">
						<h1 class="text-2xl font-semibold tracking-tight">{data.title}</h1>
					</a>
					<a href={data.github} target="_blank" rel="noopener" class="text-[11px] px-2 py-0.5 rounded border hover:-translate-y-0.5 transition-all {data.source === 'open'
						? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/5 hover:bg-emerald-400/15'
						: 'text-[var(--color-text-muted)] border-[var(--color-border)]'}">{data.source} source</a>
				{:else}
					<h1 class="text-2xl font-semibold tracking-tight">{data.title}</h1>
				{/if}
			</div>
			<p class="text-[var(--color-text-muted)] mt-2">{data.description}</p>
			<p class="text-xs text-[var(--color-text-muted)] mt-3">
				First commit: {formatDate(data.firstCommit)}
			</p>
			<div class="flex flex-wrap gap-1.5 mt-4">
				{#each data.tech as t}
					<span class="text-[11px] px-2 py-0.5 rounded border {getTechColor(t)}">{t}</span>
				{/each}
			</div>
			{#if data.live || data.github}
				<div class="flex flex-wrap gap-1.5 mt-4">
					{#if data.live}
						<a href={data.live} target="_blank" rel="noopener" class="text-[11px] px-2 py-0.5 rounded border text-emerald-400 border-emerald-400/40 bg-emerald-400/5 hover:bg-emerald-400/15 hover:-translate-y-0.5 transition-all">Visit Site</a>
					{/if}
					{#if data.github}
						<a href={data.github} target="_blank" rel="noopener" class="text-[11px] px-2 py-0.5 rounded border text-[var(--color-text-muted)] border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[var(--color-surface-hover)] hover:-translate-y-0.5 transition-all">GitHub</a>
					{/if}
				</div>
			{/if}
		</header>

		{#if data.subprojects}
			<section class="mb-8">
				<h2 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">Modules</h2>
				<ul class="space-y-3 border-l border-[var(--color-border)] pl-4">
					{#each data.subprojects as sub}
						<li class="text-sm leading-snug">
							<a href={sub.github} target="_blank" rel="noopener" class="text-emerald-400 hover:underline font-medium">{sub.title}</a>
							{#if sub.description}
								<p class="text-[var(--color-text-muted)] mt-1">{sub.description}</p>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<div class="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-a:no-underline prose-a:hover:underline">
			<data.content />
		</div>
	</article>
</div>
