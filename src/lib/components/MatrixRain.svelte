<script lang="ts">
	let canvas: HTMLCanvasElement;
	let animationId: number;

	const CHAR_SIZE = 14;
	const SOCCER_BALL_CHANCE = 0.002;
	const COLOR = '#22c55e';

	interface Drop {
		x: number;
		y: number;
		speed: number;
		opacity: number;
		char: string;
	}

	interface SoccerBall {
		x: number;
		y: number;
		speed: number;
		opacity: number;
		size: number;
		rotation: number;
		rotationSpeed: number;
	}

	let drops: Drop[] = [];
	let soccerBalls: SoccerBall[] = [];

	function initDrops(width: number, height: number) {
		const cols = Math.floor(width / CHAR_SIZE);
		drops = [];
		for (let i = 0; i < cols; i++) {
			drops.push({
				x: i * CHAR_SIZE,
				y: Math.random() * height * -1,
				speed: 1 + Math.random() * 3,
				opacity: 0.05 + Math.random() * 0.35,
				char: Math.random() > 0.5 ? '0' : '1'
			});
		}
	}

	function drawSoccerBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, opacity: number, rotation: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rotation);
		ctx.globalAlpha = opacity;
		ctx.strokeStyle = COLOR;
		ctx.lineWidth = 1;

		// Outer circle
		ctx.beginPath();
		ctx.arc(0, 0, r, 0, Math.PI * 2);
		ctx.stroke();

		// Center pentagon (the classic soccer ball pattern)
		const pentR = r * 0.42;
		const pentPoints: [number, number][] = [];
		for (let i = 0; i < 5; i++) {
			const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
			pentPoints.push([pentR * Math.cos(angle), pentR * Math.sin(angle)]);
		}

		// Draw filled center pentagon
		ctx.beginPath();
		ctx.moveTo(pentPoints[0][0], pentPoints[0][1]);
		for (let i = 1; i < 5; i++) {
			ctx.lineTo(pentPoints[i][0], pentPoints[i][1]);
		}
		ctx.closePath();
		ctx.fillStyle = COLOR;
		ctx.globalAlpha = opacity * 0.3;
		ctx.fill();
		ctx.globalAlpha = opacity;
		ctx.stroke();

		// Lines from pentagon vertices to the circle edge
		for (let i = 0; i < 5; i++) {
			const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
			// Midpoint between two adjacent pentagon vertices projected outward
			const nextI = (i + 1) % 5;
			const midAngle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
			const edgeX = r * 0.9 * Math.cos(midAngle);
			const edgeY = r * 0.9 * Math.sin(midAngle);

			// Line from each pentagon vertex outward
			ctx.beginPath();
			ctx.moveTo(pentPoints[i][0], pentPoints[i][1]);
			const outX = r * 0.85 * Math.cos(angle);
			const outY = r * 0.85 * Math.sin(angle);
			ctx.lineTo(outX, outY);
			ctx.stroke();

			// Connecting lines between outer points (hexagon edges)
			const prevAngle = ((i - 0.5 + 5) % 5 * 2 * Math.PI) / 5 - Math.PI / 2 + (Math.PI / 5);
			ctx.beginPath();
			ctx.moveTo(outX, outY);
			ctx.lineTo(edgeX, edgeY);
			ctx.stroke();

			// Connect edge point to next vertex's outer point
			const nextAngle = ((i + 1) * 2 * Math.PI) / 5 - Math.PI / 2;
			const nextOutX = r * 0.85 * Math.cos(nextAngle);
			const nextOutY = r * 0.85 * Math.sin(nextAngle);
			ctx.beginPath();
			ctx.moveTo(edgeX, edgeY);
			ctx.lineTo(nextOutX, nextOutY);
			ctx.stroke();
		}

		ctx.restore();
	}

	function animate() {
		const ctx = canvas?.getContext('2d');
		if (!ctx) return;

		const { width, height } = canvas;

		// Fade trail effect
		ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
		ctx.fillRect(0, 0, width, height);

		// Draw binary rain
		ctx.font = `${CHAR_SIZE}px ui-monospace, 'Cascadia Code', monospace`;
		for (const drop of drops) {
			ctx.fillStyle = COLOR;
			ctx.globalAlpha = drop.opacity;
			ctx.fillText(drop.char, drop.x, drop.y);

			drop.y += drop.speed;
			if (drop.y > height + 20) {
				drop.y = -CHAR_SIZE;
				drop.speed = 1 + Math.random() * 3;
				drop.opacity = 0.05 + Math.random() * 0.35;
				drop.char = Math.random() > 0.5 ? '0' : '1';
			}

			if (Math.random() < 0.02) {
				drop.char = Math.random() > 0.5 ? '0' : '1';
			}
		}
		ctx.globalAlpha = 1;

		// Spawn soccer balls occasionally
		if (Math.random() < SOCCER_BALL_CHANCE) {
			soccerBalls.push({
				x: Math.random() * width,
				y: -40,
				speed: 0.3 + Math.random() * 1,
				opacity: 0.15 + Math.random() * 0.3,
				size: 12 + Math.random() * 16,
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.02
			});
		}

		// Draw and update soccer balls
		for (let i = soccerBalls.length - 1; i >= 0; i--) {
			const ball = soccerBalls[i];
			drawSoccerBall(ctx, ball.x, ball.y, ball.size, ball.opacity, ball.rotation);
			ball.y += ball.speed;
			ball.rotation += ball.rotationSpeed;
			if (ball.y > height + 50) {
				soccerBalls.splice(i, 1);
			}
		}

		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (!canvas) return;
		const rect = canvas.parentElement!.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		initDrops(canvas.width, canvas.height);
	}

	const prefersReducedMotion = typeof window !== 'undefined'
		? window.matchMedia('(prefers-reduced-motion: reduce)').matches
		: false;

	$effect(() => {
		if (!canvas || prefersReducedMotion) return;

		handleResize();
		animate();

		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(canvas.parentElement!);

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
	<canvas
		bind:this={canvas}
		class="w-full h-full"
	></canvas>
	<div class="absolute inset-0" style="background: linear-gradient(to bottom, transparent 40%, var(--color-bg) 100%);"></div>
</div>
