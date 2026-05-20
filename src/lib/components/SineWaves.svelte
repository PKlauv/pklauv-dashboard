<script lang="ts">
	let canvas: HTMLCanvasElement;
	let animationId: number;

	const COLOR = '#34d399';

	interface Wave {
		y: number;
		amp: number;
		freq: number;
		phase: number;
		speed: number;
		opacity: number;
	}

	let waves: Wave[] = [];
	let t = 0;

	function rand(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function initWaves(width: number, height: number) {
		// Line count scales to height (~1 line per 28px) so density stays sparse at any size.
		const count = Math.max(4, Math.round(height / 28));

		// Non-uniform vertical positions: random, then sorted for uneven gaps top-to-bottom.
		const ys: number[] = [];
		for (let i = 0; i < count; i++) ys.push(rand(0, height));
		ys.sort((a, b) => a - b);

		waves = ys.map((y) => ({
			y,
			amp: rand(12, 28),
			freq: rand(0.005, 0.013),
			phase: rand(0, Math.PI * 2),
			speed: rand(0.5, 1.4) * (Math.random() < 0.5 ? -1 : 1) * 0.5,
			opacity: rand(0.25, 0.5)
		}));
	}

	function drawFrame(ctx: CanvasRenderingContext2D, width: number, height: number) {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, width, height);

		ctx.lineCap = 'round';
		ctx.lineWidth = 1.6;
		ctx.strokeStyle = COLOR;
		ctx.shadowColor = COLOR;
		ctx.shadowBlur = 12;

		for (const wave of waves) {
			ctx.beginPath();
			ctx.globalAlpha = wave.opacity;
			for (let x = 0; x <= width; x += 3) {
				const y = wave.y + Math.sin(x * wave.freq + wave.phase + t * 0.02 * wave.speed) * wave.amp;
				if (x === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();
		}

		ctx.globalAlpha = 1;
		ctx.shadowBlur = 0;
	}

	function animate() {
		const ctx = canvas?.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const width = canvas.width / dpr;
		const height = canvas.height / dpr;

		t += 1;
		drawFrame(ctx, width, height);

		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (!canvas) return;
		const rect = canvas.parentElement!.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		const ctx = canvas.getContext('2d');
		ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
		initWaves(rect.width, rect.height);

		// Reduced motion: draw a single static frame instead of animating.
		if (prefersReducedMotion && ctx) drawFrame(ctx, rect.width, rect.height);
	}

	const prefersReducedMotion =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;

	$effect(() => {
		if (!canvas) return;

		handleResize();

		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(canvas.parentElement!);

		if (prefersReducedMotion) {
			return () => resizeObserver.disconnect();
		}

		animate();

		function handleVisibility() {
			if (document.hidden) {
				cancelAnimationFrame(animationId);
			} else {
				animate();
			}
		}
		document.addEventListener('visibilitychange', handleVisibility);

		return () => {
			cancelAnimationFrame(animationId);
			resizeObserver.disconnect();
			document.removeEventListener('visibilitychange', handleVisibility);
		};
	});
</script>

<div class="absolute inset-0 overflow-hidden" style="will-change: transform; transform: translateZ(0);">
	<canvas bind:this={canvas} class="w-full h-full"></canvas>
	<div
		class="absolute inset-0"
		style="background: linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(10, 10, 10, 0.5) 78%, rgba(10, 10, 10, 0.9) 92%, var(--color-bg) 100%);"
	></div>
</div>
