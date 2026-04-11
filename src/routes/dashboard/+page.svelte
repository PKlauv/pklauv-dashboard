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

	function countryFlag(code: string): string {
		const offset = 0x1F1E6;
		const A = 'A'.charCodeAt(0);
		return String.fromCodePoint(
			offset + code.charCodeAt(0) - A,
			offset + code.charCodeAt(1) - A
		);
	}

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	function contribLevel(count: number): string {
		if (count === 0) return 'bg-[var(--color-border)]';
		if (count <= 3) return 'bg-green-900';
		if (count <= 6) return 'bg-green-700';
		if (count <= 9) return 'bg-green-500';
		return 'bg-green-400';
	}

	let graphScroll: HTMLDivElement;
	$effect(() => {
		if (graphScroll) graphScroll.scrollLeft = graphScroll.scrollWidth;
	});

	const monthLabels = $derived.by(() => {
		const labels: { label: string; col: number }[] = [];
		let lastMonth = -1;
		for (let i = 0; i < data.calendar.weeks.length; i++) {
			const firstDay = data.calendar.weeks[i].days[0];
			if (firstDay) {
				const month = new Date(firstDay.date).getMonth();
				if (month !== lastMonth) {
					labels.push({ label: months[month], col: i });
					lastMonth = month;
				}
			}
		}
		return labels;
	});
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

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-card">
		<!-- Total views -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Total views</p>
			<p class="text-4xl font-semibold mt-2">{data.totalViews}</p>
		</div>

		<!-- Unique visitors -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Unique visitors</p>
			<p class="text-4xl font-semibold mt-2">{data.uniqueVisitors}</p>
			<p class="text-xs text-[var(--color-text-muted)] mt-2">Distinct sessions</p>
		</div>

		<!-- Views by site -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Views by site</p>
			<div class="space-y-2">
				{#each Object.entries(data.bySite) as [site, count]}
					<div class="flex items-center justify-between text-sm">
						<span class="text-[var(--color-text-muted)]">{siteLabels[site] || site}</span>
						<span class="font-medium tabular-nums">{count}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Views over time chart -->
		<div class="md:col-span-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Views over time</p>
			<div class="h-36 flex items-end gap-px">
				{#each data.viewsOverTime as day, i}
					<div class="group relative flex-1 flex flex-col items-center justify-end h-full">
						<div
							class="w-full rounded-sm bg-[var(--color-accent)] transition-opacity opacity-60 hover:opacity-100"
							style="height: {day.count ? Math.max((day.count / maxCount) * 100, 4) : 0}%"
						></div>
						<div class="absolute -top-7 bg-[var(--color-bg)] border border-[var(--color-border)] px-1.5 py-0.5 rounded text-[10px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
							{day.date.slice(5)}: {day.count} view{day.count !== 1 ? 's' : ''}
						</div>
					</div>
				{/each}
			</div>
			<div class="flex mt-2">
				{#each data.viewsOverTime as day, i}
					{@const step = data.viewsOverTime.length <= 14 ? 2 : data.viewsOverTime.length <= 31 ? 5 : 10}
					<div class="flex-1 text-center">
						{#if i % step === 0}
							<span class="text-[9px] text-[var(--color-text-muted)]">{day.date.slice(5)}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Top pages -->
		<div class="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
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
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
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

		<!-- Countries -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Top countries</p>
			{#if data.topCountries.length}
				<div class="space-y-2">
					{#each data.topCountries as c}
						<div class="flex items-center justify-between text-sm">
							<span class="text-[var(--color-text-muted)]">{countryFlag(c.country)} {c.country}</span>
							<span class="font-medium tabular-nums">{c.count}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-[var(--color-text-muted)]">No country data yet.</p>
			{/if}
		</div>

		<!-- Device types -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Devices</p>
			{#if data.devices.length}
				<div class="space-y-2">
					{#each data.devices as d}
						<div class="flex items-center justify-between text-sm">
							<span class="text-[var(--color-text-muted)] capitalize">{d.device}</span>
							<span class="font-medium tabular-nums">{d.count}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-[var(--color-text-muted)]">No device data yet.</p>
			{/if}
		</div>

		<!-- Active repos -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Active repos</p>
			<p class="text-4xl font-semibold mt-2">{data.activeReposCount}</p>
			<p class="text-xs text-[var(--color-text-muted)] mt-2">Pushed in last 30 days</p>
		</div>

		<!-- Top languages -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Top languages</p>
			<div class="space-y-2">
				{#each data.topLanguages as lang}
					<div class="flex items-center justify-between text-sm">
						<span class="text-[var(--color-text-muted)]">{lang.language}</span>
						<span class="font-medium tabular-nums">{lang.count} {lang.count === 1 ? 'repo' : 'repos'}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- GitHub contribution graph -->
		<div class="md:col-span-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<div class="flex items-center justify-between mb-3">
				<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">GitHub contributions</p>
				<p class="text-xs text-[var(--color-text-muted)]">{data.calendar.totalContributions} public contributions in the last year</p>
			</div>
			<div class="overflow-x-auto" bind:this={graphScroll}>
				<div class="inline-grid gap-[3px]" style="grid-template-columns: auto repeat({data.calendar.weeks.length}, 1fr);">
					<div></div>
					{#each data.calendar.weeks as week, i}
						{@const label = monthLabels.find((m) => m.col === i)}
						<div class="text-[10px] text-[var(--color-text-muted)] h-3">
							{label ? label.label : ''}
						</div>
					{/each}
					{#each [0, 1, 2, 3, 4, 5, 6] as dayIndex}
						<div class="text-[10px] text-[var(--color-text-muted)] pr-2 h-[11px] flex items-center">
							{dayIndex === 1 ? 'Mon' : dayIndex === 3 ? 'Wed' : dayIndex === 5 ? 'Fri' : ''}
						</div>
						{#each data.calendar.weeks as week}
							{@const day = week.days.find((d) => d.weekday === dayIndex)}
							{#if day}
								<div
									class="w-[11px] h-[11px] rounded-sm {contribLevel(day.count)}"
									title="{day.count} contribution{day.count !== 1 ? 's' : ''} on {day.date}"
								></div>
							{:else}
								<div class="w-[11px] h-[11px]"></div>
							{/if}
						{/each}
					{/each}
				</div>
			</div>
			<div class="flex items-center justify-end gap-1 mt-3">
				<span class="text-[10px] text-[var(--color-text-muted)]">Less</span>
				<div class="w-[11px] h-[11px] rounded-sm bg-[var(--color-border)]"></div>
				<div class="w-[11px] h-[11px] rounded-sm bg-green-900"></div>
				<div class="w-[11px] h-[11px] rounded-sm bg-green-700"></div>
				<div class="w-[11px] h-[11px] rounded-sm bg-green-500"></div>
				<div class="w-[11px] h-[11px] rounded-sm bg-green-400"></div>
				<span class="text-[10px] text-[var(--color-text-muted)]">More</span>
			</div>
		</div>

		<!-- Recent GitHub activity -->
		<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)]">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-4">Recent GitHub activity</p>
			{#if data.activity.length}
				<div class="space-y-2">
					{#each data.activity as event}
						<div class="text-sm">
							<span class="text-[var(--color-text-muted)]">{event.description}</span>
							<span class="text-xs text-[var(--color-text-muted)] block mt-0.5">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-[var(--color-text-muted)]">No recent activity.</p>
			{/if}
		</div>
	</div>
</div>
