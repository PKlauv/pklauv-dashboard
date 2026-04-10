<script lang="ts">
	let { data } = $props();
</script>

<div class="max-w-5xl mx-auto">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<!-- Intro card — spans 2 columns -->
		<div class="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			<h1 class="text-2xl font-semibold tracking-tight">Per Kristian Lauvstad</h1>
			<p class="text-[var(--color-text-muted)] mt-2">Computer Science Student &middot; NCAA Soccer Athlete &middot; Gannon University</p>
			<p class="text-sm text-[var(--color-text-muted)] mt-3">
				Building software at the intersection of sport and technology.
			</p>
		</div>

		<!-- Stats teaser card -->
		<a href="/dashboard" class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Portfolio views</p>
			<p class="text-3xl font-semibold mt-2 group-hover:text-[var(--color-accent)] transition-colors">&mdash;</p>
			<p class="text-xs text-[var(--color-text-muted)] mt-2">View dashboard &rarr;</p>
		</a>

		<!-- Project cards -->
		<a
			href="https://github.com/PKLauv/KeyCrack"
			target="_blank"
			rel="noopener"
			class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30"
		>
			<h3 class="font-medium group-hover:text-[var(--color-accent)] transition-colors">KeyCrack</h3>
			<p class="text-sm text-[var(--color-text-muted)] mt-2">
				Password awareness tool that educates users about the predictability of their passwords.
			</p>
			<div class="flex flex-wrap gap-2 mt-3">
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">JavaScript</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Supabase</span>
			</div>
		</a>

		<a
			href="https://github.com/PKLauv/Math-Phenomena"
			target="_blank"
			rel="noopener"
			class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30"
		>
			<h3 class="font-medium group-hover:text-[var(--color-accent)] transition-colors">Math-Phenomena</h3>
			<p class="text-sm text-[var(--color-text-muted)] mt-2">
				Interactive visualizations of Lorenz attractors, Mandelbrot sets, Möbius strips, Klein bottles, and Sierpinski fractals.
			</p>
			<div class="flex flex-wrap gap-2 mt-3">
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">JavaScript</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Canvas</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Plotly</span>
			</div>
		</a>

		<a
			href="https://github.com/PKLauv/GestureMute"
			target="_blank"
			rel="noopener"
			class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30"
		>
			<h3 class="font-medium group-hover:text-[var(--color-accent)] transition-colors">GestureMute</h3>
			<p class="text-sm text-[var(--color-text-muted)] mt-2">
				macOS menu bar app that lets you mute, unmute, and adjust mic volume with hand gestures via your webcam.
			</p>
			<div class="flex flex-wrap gap-2 mt-3">
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Python</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Swift</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">macOS</span>
			</div>
		</a>

		<!-- Latest blog post card -->
		{#if data.latestPost}
			<a href="/blog/{data.latestPost.slug}" class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30">
				<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Latest post</p>
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

		<!-- Mini contribution graph placeholder -->
		<div class="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			<p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">GitHub activity</p>
			<div class="mt-3 h-20 flex items-end gap-0.5">
				{#each Array(52) as _, i}
					<div class="flex-1 rounded-sm bg-[var(--color-border)]" style="height: {10 + ((i * 17 + 7) % 53)}%"></div>
				{/each}
			</div>
		</div>
	</div>
</div>
