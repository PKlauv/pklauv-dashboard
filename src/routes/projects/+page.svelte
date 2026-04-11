<script lang="ts">
	import { getTechColor } from '$lib/projects';
	let { data } = $props();

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Projects — PK Lauvstad</title>
</svelte:head>

<div class="max-w-5xl mx-auto">
	<h1 class="text-2xl font-semibold mb-8 tracking-tight">Projects</h1>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		{#each data.projects as project}
			<div class="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
				<div class="p-4 flex items-center justify-between">
					<h2 class="font-medium">{project.title}</h2>
					<a href={project.github} target="_blank" rel="noopener" class="text-[11px] px-2 py-0.5 rounded border hover:-translate-y-0.5 transition-all {project.source === 'open'
						? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/5 hover:bg-emerald-400/15'
						: 'text-[var(--color-text-muted)] border-[var(--color-border)]'}">{project.source} source</a>
				</div>

				{#if project.image}
					<div class="aspect-video overflow-hidden bg-[var(--color-bg)]">
						<img
							src={project.image}
							alt={project.title}
							loading="lazy"
							class="w-full h-full object-cover"
						/>
					</div>
				{:else}
					<div class="aspect-video bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] flex items-center justify-center">
						<span class="text-3xl font-bold text-[var(--color-border)]">{project.title[0]}</span>
					</div>
				{/if}

				<div class="p-4">
					<p class="text-sm text-[var(--color-text-muted)]">{project.description}</p>

					<p class="text-xs text-[var(--color-text-muted)] mt-4">
						First commit: {formatDate(project.firstCommit)}
					</p>

					<div class="flex flex-wrap gap-1.5 mt-4">
						{#each project.tech as t}
							<span class="text-[11px] px-2 py-0.5 rounded border {getTechColor(t)}">{t}</span>
						{/each}
					</div>

					<div class="flex flex-wrap gap-1.5 mt-4">
						{#if project.live}
							<a
								href={project.live}
								target="_blank"
								rel="noopener"
								class="text-[11px] px-2 py-0.5 rounded border text-emerald-400 border-emerald-400/40 bg-emerald-400/5 hover:bg-emerald-400/15 hover:-translate-y-0.5 transition-all"
							>
								Visit Site
							</a>
						{/if}
						<a
							href={project.github}
							target="_blank"
							rel="noopener"
							class="text-[11px] px-2 py-0.5 rounded border text-[var(--color-text-muted)] border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[var(--color-surface-hover)] hover:-translate-y-0.5 transition-all"
						>
							GitHub
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
