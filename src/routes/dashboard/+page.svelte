<script lang="ts">
	let { data } = $props();

	const ranges = [
		{ value: '7d', label: '7 days' },
		{ value: '30d', label: '30 days' },
		{ value: '90d', label: '90 days' },
		{ value: 'all', label: 'All time' }
	];

	const maxCount = $derived(Math.max(...data.viewsOverTime.map((d) => d.count), 1));

	const siteLabels: Record<string, string> = {
		portfolio: 'Portfolio',
		keycrack: 'KeyCrack',
		'math-phenomena': 'Math-Phenomena',
		gesturemute: 'GestureMute'
	};
</script>

<div class="max-w-5xl mx-auto">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-semibold">Dashboard</h1>
		<div class="flex gap-1">
			{#each ranges as r}
				<a
					href="/dashboard?range={r.value}"
					class="px-3 py-1 text-xs rounded-md transition-colors {data.range === r.value
						? 'bg-[var(--color-accent)] text-white'
						: 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface)]'}"
				>
					{r.label}
				</a>
			{/each}
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<!-- Total views -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Total views</p>
			<p class="text-4xl font-semibold mt-2">{data.totalViews}</p>
		</div>

		<!-- Views by site -->
		<div class="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Views by site</p>
			<div class="flex gap-6">
				{#each Object.entries(data.bySite) as [site, count]}
					<div>
						<p class="text-2xl font-semibold">{count}</p>
						<p class="text-xs text-[var(--color-text-muted)] mt-1">{siteLabels[site] || site}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Views over time chart -->
		<div class="md:col-span-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Views over time</p>
			<div class="h-32 flex items-end gap-px">
				{#each data.viewsOverTime as day}
					<div class="group relative flex-1 flex flex-col items-center justify-end h-full">
						<div
							class="w-full rounded-sm bg-[var(--color-accent)] transition-opacity opacity-60 hover:opacity-100"
							style="height: {day.count ? (day.count / maxCount) * 100 : 0}%"
						></div>
						{#if day.count > 0}
							<div class="absolute -top-6 bg-[var(--color-surface)] border border-[var(--color-border)] px-1.5 py-0.5 rounded text-[10px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
								{day.date.slice(5)}: {day.count}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Top pages -->
		<div class="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Top pages</p>
			{#if data.topPages.length}
				<div class="space-y-2">
					{#each data.topPages as page}
						<div class="flex items-center justify-between text-sm">
							<span class="text-[var(--color-text-muted)] truncate mr-4">{page.path}</span>
							<span class="font-medium tabular-nums">{page.count}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-[var(--color-text-muted)]">No data yet.</p>
			{/if}
		</div>

		<!-- Top referrers -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Top referrers</p>
			{#if data.topReferrers.length}
				<div class="space-y-2">
					{#each data.topReferrers as ref}
						<div class="flex items-center justify-between text-sm">
							<span class="text-[var(--color-text-muted)] truncate mr-4">{ref.referrer}</span>
							<span class="font-medium tabular-nums">{ref.count}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-[var(--color-text-muted)]">No referrer data yet.</p>
			{/if}
		</div>
	</div>
</div>
