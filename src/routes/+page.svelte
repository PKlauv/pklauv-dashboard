<script lang="ts">
	import MatrixRain from '$lib/components/MatrixRain.svelte';
	import ProjectMedia from '$lib/components/ProjectMedia.svelte';
	import { getTechColor } from '$lib/projects';

	let { data } = $props();
	let graphScroll: HTMLDivElement;
	$effect(() => {
		if (graphScroll) graphScroll.scrollLeft = graphScroll.scrollWidth;
	});

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

	$effect(() => {
		return () => { tooltipEl?.remove(); };
	});

	// Compute month labels from calendar weeks
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

<!-- Hero section with matrix rain — breaks out to full viewport width -->
<div class="relative -mx-4 sm:-mx-6 -mt-10 sm:-mt-12 mb-4" style="min-height: 500px;">
	<MatrixRain />

	<div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-card">
			<!-- Intro card — spans 2 columns -->
			<div class="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm p-6">
				<h1 class="text-2xl font-semibold tracking-tight">Computer Science | NCAA Soccer Athlete</h1>
				<p class="text-[var(--color-text-muted)] mt-2">Per Kristian Lauvstad</p>
				<p class="text-sm text-[var(--color-text-muted)] mt-3">
					I'm a CS student on the early stages of the Software Engineering/Data Science track with a parallel career as a NCAA Soccer Athlete. 
					<br><br>
					Interested in something I'm building? Let's talk about it!
				</p>
			</div>

			<!-- Stats teaser card -->
			<a href="/dashboard" class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm p-6 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30">
				<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Profile views</p>
				<p class="text-3xl font-semibold mt-2 group-hover:text-[var(--color-accent)] transition-colors">{data.totalViews.toLocaleString()}</p>
				<p class="text-xs text-[var(--color-text-muted)] mt-2">View dashboard &rarr;</p>
			</a>

			<!-- Project cards -->
			{#each data.featuredProjects as project}
				<a
					href="/projects/{project.slug}"
					class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm overflow-hidden transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30"
				>
					{#if project.image}
						<div class="aspect-video overflow-hidden bg-[var(--color-bg)]">
							<ProjectMedia
								src={project.image}
								poster={project.poster}
								alt={project.title}
								class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						</div>
					{:else}
						<div class="aspect-video bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] flex items-center justify-center">
							<span class="text-3xl font-bold text-[var(--color-border)]">{project.title[0]}</span>
						</div>
					{/if}
					<div class="p-4">
						<h3 class="text-sm font-medium group-hover:text-[var(--color-accent)] transition-colors">{project.title}</h3>
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
</div>

<!-- Below the fold — no matrix rain -->
<div class="max-w-5xl mx-auto">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-card">
		<!-- Latest blog post card -->
		{#if data.latestPost}
			<a href="/blog/{data.latestPost.slug}" class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30">
				<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Latest post from the blog</p>
				<h3 class="font-medium mt-2 group-hover:text-[var(--color-accent)] transition-colors">{data.latestPost.title}</h3>
				<p class="text-sm text-[var(--color-text-muted)] mt-2">{data.latestPost.excerpt}</p>
				<span class="text-xs text-[var(--color-text-muted)] mt-3 block">{data.latestPost.date}</span>
			</a>
		{:else}
			<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
				<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Latest post</p>
				<p class="text-sm text-[var(--color-text-muted)] mt-2">No posts yet — check back soon.</p>
			</div>
		{/if}

		<!-- GitHub contribution graph -->
		<div class="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			<div class="flex items-center justify-between mb-3">
				<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">GitHub activity</p>
				<p class="text-xs text-[var(--color-text-muted)]">{data.calendar.totalContributions} public contributions in the last year</p>
			</div>

			<div class="overflow-x-auto" bind:this={graphScroll}>
				<div class="inline-grid gap-x-[2px] gap-y-[2px]" style="grid-template-columns: auto repeat({data.calendar.weeks.length}, 10px);">
					<!-- Month labels row -->
					<div></div>
					{#each data.calendar.weeks as week, i}
						{@const label = monthLabels.find((m) => m.col === i)}
						<div class="text-[10px] text-[var(--color-text-muted)] h-3 overflow-visible whitespace-nowrap">
							{label ? label.label : ''}
						</div>
					{/each}

					<!-- Day rows (Sun=0 through Sat=6) -->
					{#each [0, 1, 2, 3, 4, 5, 6] as dayIndex}
						<div class="text-[10px] text-[var(--color-text-muted)] pr-2 h-[10px] flex items-center">
							{dayIndex === 1 ? 'Mon' : dayIndex === 3 ? 'Wed' : dayIndex === 5 ? 'Fri' : ''}
						</div>
						{#each data.calendar.weeks as week}
							{@const day = week.days.find((d) => d.weekday === dayIndex)}
							{#if day}
								<div
									class="w-[10px] h-[10px] rounded-[1px] {contribLevel(day.count)}"
									role="presentation"
									onmouseenter={(e) => showTooltip(e, day)}
									onmouseleave={hideTooltip}
								></div>
							{:else}
								<div class="w-[10px] h-[10px]"></div>
							{/if}
						{/each}
					{/each}
				</div>
			</div>

			<!-- Legend -->
			<div class="flex items-center justify-end gap-1 mt-3">
				<span class="text-[10px] text-[var(--color-text-muted)]">Less</span>
				<div class="w-[10px] h-[10px] rounded-[1px] bg-[var(--color-border)]"></div>
				<div class="w-[10px] h-[10px] rounded-[1px] bg-green-900"></div>
				<div class="w-[10px] h-[10px] rounded-[1px] bg-green-700"></div>
				<div class="w-[10px] h-[10px] rounded-[1px] bg-green-500"></div>
				<div class="w-[10px] h-[10px] rounded-[1px] bg-green-400"></div>
				<span class="text-[10px] text-[var(--color-text-muted)]">More</span>
			</div>

			<!-- Recent activity -->
			{#if data.activity.length}
				<div class="mt-4 space-y-1.5 border-t border-[var(--color-border)] pt-4">
					{#each data.activity.slice(0, 3) as event}
						<div class="flex items-center justify-between text-xs">
							<span class="text-[var(--color-text-muted)] truncate mr-3">{event.description}</span>
							<span class="text-[var(--color-text-muted)] shrink-0">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

</div>
