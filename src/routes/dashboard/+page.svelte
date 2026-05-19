<script lang="ts">
	let { data } = $props();

	const ranges = [
		{ value: '7d', label: '7 days' },
		{ value: '30d', label: '30 days' },
		{ value: '90d', label: '90 days' },
		{ value: 'all', label: 'All time' }
	];

	const maxCount = $derived(Math.max(...(data.authenticated ? data.viewsOverTime.map((d) => d.count) : []), 1));

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
	const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	function contribLevel(count: number): string {
		if (count === 0) return 'bg-[var(--color-border)]';
		if (count <= 3) return 'bg-green-900';
		if (count <= 6) return 'bg-green-700';
		if (count <= 9) return 'bg-green-500';
		return 'bg-green-400';
	}

	function formatContribDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		const day = d.getDate();
		const suffix = day >= 11 && day <= 13 ? 'th' : ['th','st','nd','rd','th','th','th','th','th','th'][day % 10];
		return `${fullMonths[d.getMonth()]} ${day}${suffix}`;
	}

	let tooltipEl: HTMLDivElement | null = null;
	let hideTimer: ReturnType<typeof setTimeout>;

	function ensureTooltip(): HTMLDivElement {
		if (tooltipEl) return tooltipEl;
		tooltipEl = document.createElement('div');
		Object.assign(tooltipEl.style, {
			position: 'fixed', pointerEvents: 'none', zIndex: '9999',
			padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500',
			whiteSpace: 'nowrap', background: '#24292f', color: '#fff',
			border: '1px solid #454d56', display: 'none',
			transform: 'translate(-50%, calc(-100% - 8px))'
		});
		const caret = document.createElement('div');
		Object.assign(caret.style, {
			position: 'absolute', left: '50%', bottom: '-4px',
			width: '8px', height: '8px', background: '#24292f',
			border: '1px solid #454d56', borderTop: 'none', borderLeft: 'none',
			transform: 'translateX(-50%) rotate(45deg)'
		});
		tooltipEl.appendChild(document.createTextNode(''));
		tooltipEl.appendChild(caret);
		document.body.appendChild(tooltipEl);
		return tooltipEl;
	}

	function showTooltip(e: MouseEvent, day: { count: number; date: string }) {
		clearTimeout(hideTimer);
		const el = ensureTooltip();
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		el.style.left = `${rect.left + rect.width / 2}px`;
		el.style.top = `${rect.top}px`;
		el.childNodes[0].textContent = `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatContribDate(day.date)}.`;
		el.style.display = 'block';
	}

	function hideTooltip() {
		hideTimer = setTimeout(() => { if (tooltipEl) tooltipEl.style.display = 'none'; }, 80);
	}

	let graphScroll: HTMLDivElement;
	$effect(() => {
		if (graphScroll) graphScroll.scrollLeft = graphScroll.scrollWidth;
		return () => { tooltipEl?.remove(); };
	});

	const monthLabels = $derived.by(() => {
		if (!data.authenticated) return [] as { label: string; col: number }[];
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

{#if !data.authenticated}
	<div class="max-w-2xl mx-auto py-10 sm:py-14">
		<h1 class="text-2xl font-semibold">Dashboard</h1>
		<p class="text-[var(--color-text-muted)] mt-2">
			This is my personal analytics page. The login only works for me — but here's what's behind it.
		</p>

		<section class="mt-10">
			<h2 class="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Why this exists</h2>
			<p class="mt-3 text-sm text-[var(--color-text)] leading-relaxed">
				A working portfolio analytics tool — visitor counts, where they come from, what they read, plus my GitHub activity in one place. The data is mine; nobody else gets to look at it. Half the reason this page exists is that I wanted the numbers; the other half is that building it taught me more than any tutorial would have.
			</p>
		</section>

		<section class="mt-10">
			<h2 class="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Behind the scenes</h2>
			<ul class="mt-3 space-y-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
				<li>
					<span class="text-[var(--color-text)]">Privacy-first tracking script (~1KB)</span>
					— fires from any of my projects, no IP storage, country derived from Vercel's edge headers.
				</li>
				<li>
					<span class="text-[var(--color-text)]">Supabase with Row-Level Security</span>
					on the <code class="text-xs px-1 py-0.5 rounded bg-[var(--color-surface)]">page_views</code> table — the anon key reads aggregates only, nothing personal leaks even if a key did.
				</li>
				<li>
					<span class="text-[var(--color-text)]">GitHub OAuth via <code class="text-xs px-1 py-0.5 rounded bg-[var(--color-surface)]">@supabase/ssr</code></span>
					with cookie-based sessions; gated server-side by user ID, not just by route.
				</li>
				<li>
					<span class="text-[var(--color-text)]">SvelteKit hooks + load functions</span>
					for SSR auth state, GitHub GraphQL for the contribution calendar.
				</li>
				<li>
					<span class="text-[var(--color-text)]">Tailwind v4 CSS-config</span>,
					bento grid layout, custom theming.
				</li>
			</ul>
		</section>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<form method="POST" action="/auth/login">
				<button
					type="submit"
					class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
				>
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
					</svg>
					Sign in with GitHub
				</button>
			</form>
			<a
				href="https://github.com/PKlauv/pklauv-dashboard"
				target="_blank"
				rel="noopener"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)]/30 transition-colors"
			>
				View source on GitHub →
			</a>
		</div>
	</div>
{:else}
<div class="max-w-5xl mx-auto">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-semibold">Dashboard</h1>
		<div class="flex items-center gap-3">
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
			<form method="POST" action="/auth/logout">
				<button
					type="submit"
					class="px-3 py-1 text-xs rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface)] transition-colors"
				>
					Sign out
				</button>
			</form>
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
							class="w-full rounded-[1px] bg-[var(--color-accent)] transition-opacity opacity-60 hover:opacity-100"
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
				<div class="inline-grid gap-x-[2px] gap-y-[2px]" style="grid-template-columns: auto repeat({data.calendar.weeks.length}, 11px);">
					<div></div>
					{#each data.calendar.weeks as week, i}
						{@const label = monthLabels.find((m) => m.col === i)}
						<div class="text-[10px] text-[var(--color-text-muted)] h-3 overflow-visible whitespace-nowrap">
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
									class="w-[11px] h-[11px] rounded-[1px] {contribLevel(day.count)}"
									role="presentation"
									onmouseenter={(e) => showTooltip(e, day)}
									onmouseleave={hideTooltip}
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
				<div class="w-[11px] h-[11px] rounded-[1px] bg-[var(--color-border)]"></div>
				<div class="w-[11px] h-[11px] rounded-[1px] bg-green-900"></div>
				<div class="w-[11px] h-[11px] rounded-[1px] bg-green-700"></div>
				<div class="w-[11px] h-[11px] rounded-[1px] bg-green-500"></div>
				<div class="w-[11px] h-[11px] rounded-[1px] bg-green-400"></div>
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
{/if}
