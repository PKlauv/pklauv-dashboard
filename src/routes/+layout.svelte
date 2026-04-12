<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let showToast = $state(false);

	function copyEmail() {
		navigator.clipboard.writeText('per.kristian@lauvstad.com');
		showToast = true;
		setTimeout(() => showToast = false, 2000);
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PK Lauvstad // Computer Science</title>
</svelte:head>

<div class="min-h-dvh flex flex-col">
	<nav class="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 text-sm border-b border-[var(--color-border)]">
		<a href="/" class="font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors shrink-0">
			PKLauv
		</a>
		<div class="flex items-center gap-3 sm:gap-5 ml-auto overflow-x-auto">
			<a href="/projects" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				Projects
			</a>
			<a href="/blog" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				Blog
			</a>
			<a href="/dashboard" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				Dashboard
			</a>
			<a href="#contact" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
				Contact
			</a>
		</div>
	</nav>

	<main class="flex-1 px-4 sm:px-6 py-10 sm:py-12 mx-auto w-full">
		{@render children()}
	</main>

	<footer id="contact" class="px-4 sm:px-6 pt-10 pb-8 border-t border-[var(--color-border)] text-center">
		<p class="text-sm text-[var(--color-text-muted)]">
			B.Sc. Computer Science (In Progress), NCAA Soccer PSAC Conference Champion, Elite 8 National Tournament Participant
		</p>
		<div class="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mt-4 text-sm">
			<a
				href="https://github.com/PKLauv"
				target="_blank"
				rel="noopener"
				class="text-[#5eead4] hover:underline transition-colors"
			>
				GitHub: <span class="text-[var(--color-text)]">@PKlauv</span>
			</a>
			<span class="text-[var(--color-border)]">&middot;</span>
			<a
				href="https://www.linkedin.com/in/per-kristian-lauvstad-89bba739b"
				target="_blank"
				rel="noopener"
				class="text-[#5eead4] hover:underline transition-colors"
			>
				LinkedIn
			</a>
			<span class="text-[var(--color-border)]">&middot;</span>
			<button
				onclick={copyEmail}
				class="text-[#5eead4] hover:underline transition-colors cursor-pointer"
			>
				email: <span class="text-[var(--color-text)]">per [dot] kristian [at] lauvstad [dot] com</span>
			</button>
			<span class="text-[var(--color-border)]">&middot;</span>
			<button
				onclick={scrollToTop}
				class="text-[#5eead4] hover:underline transition-colors cursor-pointer"
			>
				Back to top
			</button>
		</div>
	</footer>
</div>

{#if showToast}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] shadow-lg"
		style="animation: toast-in 0.2s ease-out, toast-out 0.2s ease-in 1.8s forwards;"
	>
		Copied to clipboard
	</div>
{/if}
