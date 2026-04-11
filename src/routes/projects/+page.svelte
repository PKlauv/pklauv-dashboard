<script lang="ts">
	import { getTechColor } from '$lib/projects';
	let { data } = $props();
</script>

<svelte:head>
	<title>Projects — PK Lauvstad</title>
</svelte:head>

<div class="max-w-5xl mx-auto">
	<h1 class="text-2xl font-semibold mb-8 tracking-tight">Projects</h1>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		{#each data.projects as project}
			<a
				href="/projects/{project.slug}"
				class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30"
			>
				{#if project.image}
					<div class="aspect-video overflow-hidden bg-[var(--color-bg)]">
						<img
							src={project.image}
							alt={project.title}
							loading="lazy"
							class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
				{:else}
					<div class="aspect-video bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] flex items-center justify-center">
						<span class="text-3xl font-bold text-[var(--color-border)]">{project.title[0]}</span>
					</div>
				{/if}
				<div class="p-4">
					<div class="flex items-center justify-between">
						<h2 class="text-sm font-medium group-hover:text-[var(--color-accent)] transition-colors">{project.title}</h2>
						<span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full {project.status === 'active'
							? 'bg-green-500/10 text-green-400'
							: 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'}">{project.status}</span>
					</div>
					<p class="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2">{project.description}</p>
					<div class="flex flex-wrap gap-1.5 mt-3">
						{#each project.tech as t}
							<span class="text-[11px] px-2 py-0.5 rounded border {getTechColor(t)}">{t}</span>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
