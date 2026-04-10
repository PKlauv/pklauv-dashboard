<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog — PK Lauvstad</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
<h1 class="text-2xl font-semibold mb-8 tracking-tight">Blog</h1>

{#if data.posts.length === 0}
	<p class="text-[var(--color-text-muted)]">No posts yet — check back soon.</p>
{:else}
	<div class="flex flex-col">
		{#each data.posts as post, i}
			{#if i > 0}
				<hr class="border-[var(--color-border)]" />
			{/if}
			<a href="/blog/{post.slug}" class="group block py-5 -mx-3 px-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors">
				<span class="text-xs text-[var(--color-text-muted)]">{post.date} &middot; {post.readTime} min read</span>
				<h2 class="font-medium mt-1 group-hover:text-[var(--color-accent)] transition-colors">{post.title}</h2>
				<p class="text-sm text-[var(--color-text-muted)] mt-1">{post.excerpt}</p>
			</a>
		{/each}
	</div>
{/if}
</div>
