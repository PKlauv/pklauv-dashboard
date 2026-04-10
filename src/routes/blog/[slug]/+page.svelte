<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} — PK Lauvstad</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
<a href="/blog" class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">&larr; Back to blog</a>

<article class="mt-8">
	<header class="mb-8">
		<h1 class="text-2xl font-semibold tracking-tight">{data.title}</h1>
		<span class="text-sm text-[var(--color-text-muted)] mt-2 block">{data.date} &middot; {data.readTime} min read</span>
	</header>

	<div class="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline">
		<data.content />
	</div>
</article>
</div>
