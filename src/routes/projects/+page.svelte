<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Projects — PK Lauvstad</title>
</svelte:head>

<div class="max-w-5xl mx-auto">
	<h1 class="text-2xl font-semibold mb-8 tracking-tight">Projects</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		{#each data.projects as project}
			<a
				href="/projects/{project.slug}"
				class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30"
			>
				<div class="flex items-center justify-between">
					<h2 class="font-medium group-hover:text-[var(--color-accent)] transition-colors">{project.title}</h2>
					<span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full {project.status === 'active'
						? 'bg-green-500/10 text-green-400'
						: 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'}">{project.status}</span>
				</div>
				<p class="text-sm text-[var(--color-text-muted)] mt-2">{project.description}</p>
				<div class="flex flex-wrap gap-2 mt-4">
					{#each project.tech as t}
						<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">{t}</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>
</div>
