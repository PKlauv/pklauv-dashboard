<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} // PK Lauvstad</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
<a href="/blog" class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">&larr; Back to blog</a>

<article class="mt-8">
	<header class="mb-8">
		<h1 class="text-2xl font-semibold tracking-tight">{data.title}</h1>
		<span class="text-sm text-[var(--color-text-muted)] mt-2 block">{data.date} &middot; {data.readTime} min read</span>
	</header>

	<div class="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-a:no-underline prose-a:hover:underline">
		<data.content />
	</div>
</article>

<nav class="flex justify-between gap-4 mt-12 pt-8 border-t border-[var(--color-border)]">
	{#if data.prev}
		<a href="/blog/{data.prev.slug}" class="group min-w-0 flex-1 flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
			<span class="shrink-0">&larr;</span>
			<span class="truncate group-hover:underline">{data.prev.title}</span>
		</a>
	{:else}
		<span class="flex-1"></span>
	{/if}

	{#if data.next}
		<a href="/blog/{data.next.slug}" class="group min-w-0 flex-1 flex items-center justify-end gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
			<span class="truncate group-hover:underline">{data.next.title}</span>
			<span class="shrink-0">&rarr;</span>
		</a>
	{:else}
		<span class="flex-1"></span>
	{/if}
</nav>
</div>
