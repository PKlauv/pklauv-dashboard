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
	<title>Projects // PK Lauvstad</title>
</svelte:head>

<div class="max-w-5xl mx-auto">
	<h1 class="text-2xl font-semibold mb-8 tracking-tight">Projects</h1>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		{#each data.projects as project}
			{@const primaryHref = project.live ?? project.github}
			<div class="border border-[var(--color-border)] hover:border-emerald-400 transition-colors rounded-xl overflow-hidden bg-[var(--color-surface)] flex md:block">
				<div class="w-32 shrink-0 md:w-auto md:px-4 md:pt-4">
					{#if primaryHref}
						<a
							href={primaryHref}
							target="_blank"
							rel="noopener"
							class="block h-full md:border-2 md:border-[var(--color-border)] md:hover:border-emerald-400 md:rounded-lg md:overflow-hidden md:transition-colors"
						>
							{#if project.image}
								<div class="aspect-square md:aspect-[16/10] overflow-hidden bg-[var(--color-bg)]">
									<ProjectMedia
										src={project.image}
										poster={project.poster}
										alt={project.title}
										class="w-full h-full object-cover"
									/>
								</div>
							{:else}
								<div class="aspect-square md:aspect-[16/10] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] flex items-center justify-center">
									<span class="text-3xl font-bold text-[var(--color-border)]">{project.title[0]}</span>
								</div>
							{/if}
						</a>
					{:else}
						<div class="block h-full md:border-2 md:border-[var(--color-border)] md:rounded-lg md:overflow-hidden">
							<div class="aspect-square md:aspect-[16/10] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] flex items-center justify-center">
								<span class="text-3xl font-bold text-[var(--color-border)]">{project.title[0]}</span>
							</div>
						</div>
					{/if}
				</div>

				<div class="flex-1 min-w-0 p-3 md:p-0">
					<div class="flex items-center justify-between gap-2 md:px-4 md:pt-4 md:pb-3">
						{#if project.github}
							<a href={project.github} target="_blank" rel="noopener" class="hover:underline min-w-0">
								<h2 class="text-sm md:text-base font-medium truncate">{project.title}</h2>
							</a>
							<a href={project.github} target="_blank" rel="noopener" class="shrink-0 text-[11px] px-2 py-0.5 rounded border hover:-translate-y-0.5 transition-all {project.source === 'open'
								? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/5 hover:bg-emerald-400/15'
								: 'text-[var(--color-text-muted)] border-[var(--color-border)]'}">{project.source} source</a>
						{:else}
							<h2 class="text-sm md:text-base font-medium truncate min-w-0">{project.title}</h2>
						{/if}
					</div>

					<div class="mt-2 md:mt-0 md:p-4">
						<p class="text-xs md:text-sm text-[var(--color-text-muted)] line-clamp-3 md:line-clamp-none">{project.description}</p>

						{#if project.subprojects}
							<ul class="hidden md:block mt-4 space-y-1.5 border-l border-[var(--color-border)] pl-3">
								{#each project.subprojects as sub}
									<li class="text-xs leading-snug">
										<a href={sub.github} target="_blank" rel="noopener" class="text-emerald-400 hover:underline">{sub.title}</a>
										{#if sub.description}
											<span class="text-[var(--color-text-muted)]"> — {sub.description}</span>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}

						<p class="hidden md:block text-xs text-[var(--color-text-muted)] mt-4">
							First commit: {formatDate(project.firstCommit)}
						</p>

						<div class="flex flex-wrap gap-1 md:gap-1.5 mt-2 md:mt-4">
							{#each project.tech as t, i}
								<span class="text-[11px] px-2 py-0.5 rounded border {getTechColor(t)} {i >= 2 ? 'hidden md:!flex' : ''}">{t}</span>
							{/each}
						</div>

						{#if project.live || project.github}
							<div class="flex flex-wrap gap-1.5 mt-2 md:mt-4">
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
								{#if project.github}
									<a
										href={project.github}
										target="_blank"
										rel="noopener"
										class="text-[11px] px-2 py-0.5 rounded border text-[var(--color-text-muted)] border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[var(--color-surface-hover)] hover:-translate-y-0.5 transition-all"
									>
										GitHub
									</a>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
