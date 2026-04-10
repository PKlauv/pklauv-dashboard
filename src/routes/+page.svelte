<script lang="ts">
	let { data } = $props();
</script>

<section class="mb-16">
	<h1 class="text-3xl font-semibold mb-3 tracking-tight">Per Kristian Lauvstad</h1>
	<p class="text-lg text-[var(--color-text-muted)] mb-1">D2 Athlete &middot; CS Student &middot; Gannon University</p>
	<p class="text-[var(--color-text-muted)]">
		Building software at the intersection of sport and technology.
	</p>
</section>

<section class="mb-16">
	<h2 class="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-6">Projects</h2>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<a
			href="https://github.com/PKLauv/KeyCrack"
			target="_blank"
			rel="noopener"
			class="group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30"
		>
			<h3 class="font-medium mb-2 group-hover:text-[var(--color-accent)] transition-colors">KeyCrack</h3>
			<p class="text-sm text-[var(--color-text-muted)] mb-3">
				Password awareness tool that educates users about the predictability of their passwords.
			</p>
			<div class="flex flex-wrap gap-2">
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">JavaScript</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Supabase</span>
			</div>
		</a>

		<a
			href="https://github.com/PKLauv/Math-Phenomena"
			target="_blank"
			rel="noopener"
			class="group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30"
		>
			<h3 class="font-medium mb-2 group-hover:text-[var(--color-accent)] transition-colors">Math-Phenomena</h3>
			<p class="text-sm text-[var(--color-text-muted)] mb-3">
				Interactive visualizations of Lorenz attractors, Mandelbrot sets, Möbius strips, Klein bottles, and Sierpinski fractals.
			</p>
			<div class="flex flex-wrap gap-2">
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">JavaScript</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Canvas</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Plotly</span>
			</div>
		</a>

		<a
			href="https://github.com/PKLauv/GestureMute"
			target="_blank"
			rel="noopener"
			class="group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)]/30 sm:col-span-2"
		>
			<h3 class="font-medium mb-2 group-hover:text-[var(--color-accent)] transition-colors">GestureMute</h3>
			<p class="text-sm text-[var(--color-text-muted)] mb-3">
				macOS menu bar app that lets you mute, unmute, and adjust mic volume with hand gestures via your webcam.
			</p>
			<div class="flex flex-wrap gap-2">
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Python</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">Swift</span>
				<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">macOS</span>
			</div>
		</a>
	</div>
</section>

<section>
	<h2 class="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-6">Latest from the blog</h2>
	{#if data.latestPost}
		<a href="/blog/{data.latestPost.slug}" class="group block -mx-3 px-3 py-4 rounded-lg hover:bg-[var(--color-surface)] transition-colors">
			<time class="text-xs text-[var(--color-text-muted)]">{data.latestPost.date}</time>
			<h3 class="font-medium mt-1 group-hover:text-[var(--color-accent)] transition-colors">{data.latestPost.title}</h3>
			<p class="text-sm text-[var(--color-text-muted)] mt-1">{data.latestPost.excerpt}</p>
		</a>
	{:else}
		<p class="text-sm text-[var(--color-text-muted)]">No posts yet — check back soon.</p>
	{/if}
</section>
