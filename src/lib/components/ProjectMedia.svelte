<script lang="ts">
	let {
		src,
		poster,
		alt,
		class: className = ''
	}: {
		src: string;
		poster?: string;
		alt: string;
		class?: string;
	} = $props();

	const isVideo = $derived(/\.(mp4|webm)$/i.test(src));
</script>

{#if isVideo}
	<video
		{src}
		{poster}
		class={className}
		autoplay
		muted
		loop
		playsinline
		preload="metadata"
		aria-label={alt}
	></video>
{:else}
	<img {src} {alt} loading="lazy" class={className} />
{/if}
