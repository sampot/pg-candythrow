export class CandyThrowGame {
	constructor() {
		this.score = 0;
		this.combo = 0;
		this.buckets = [
			{ x: 60, y: 420, w: 100, h: 60 },
			{ x: 260, y: 420, w: 100, h: 60 },
		];

		this.candy = { x: 180, y: 450, state: "ready", vx: 0, vy: 0 };
		this.trail = [];

		this.lastTs = 0;
	}

	start() {
		this.score = 0;
		this.combo = 0;
		this.candy.state = "ready";
		this.trail = [];
	}

	update(dt) {
		if (this.candy.state === "flying") {
			this.candy.x += this.candy.vx;
			this.candy.y += this.candy.vy;
			this.candy.vy += 500 * dt; // gravity

			this.trail.push({ x: this.candy.x, y: this.candy.y });
			if (this.trail.length > 20) this.trail.shift();

			// Check hit bucket
			for (const bucket of this.buckets) {
				if (
					this.candy.x >= bucket.x &&
					this.candy.x <= bucket.x + bucket.w &&
					this.candy.y >= bucket.y - 20 &&
					this.candy.y <= bucket.y + bucket.h
				) {
					this.score += 10 + this.combo * 5;
					this.combo++;
					this.candy.state = "ready";
					this.trail = [];
				}
			}

			// Miss
			if (this.candy.y > 520) {
				this.combo = 0;
				this.candy.state = "ready";
				this.trail = [];
			}
		}
	}

	draw(ctx, w, h) {
		// Draw buckets
		ctx.fillStyle = "#78350f";
		for (const bucket of this.buckets) {
			ctx.fillRect(bucket.x, bucket.y, bucket.w, bucket.h);
		}

		// Draw trail
		if (this.trail.length > 0) {
			ctx.beginPath();
			ctx.strokeStyle = "#ec4899";
			ctx.lineWidth = 3;
			for (let i = 0; i < this.trail.length - 1; i++) {
				ctx.lineTo(this.trail[i].x, this.trail[i].y);
			}
			ctx.stroke();
		}

		// Draw candy
		if (this.candy.state !== "ready") {
			ctx.fillStyle = "#f472b6";
			ctx.beginPath();
			ctx.arc(this.candy.x, this.candy.y, 8, 0, Math.PI * 2);
			ctx.fill();
		} else {
			// Draw aiming line
			const dy = this.touchY - 450;
			ctx.setLineDash([5, 5]);
			ctx.strokeStyle = "#ec4899";
			ctx.beginPath();
			ctx.moveTo(180, 450);
			ctx.lineTo(this.touchX || 180, this.touchY || 450 + dy);
			ctx.stroke();
			ctx.setLineDash([]);

			// Draw ready candy
			ctx.fillStyle = "#ec4899";
			ctx.beginPath();
			ctx.arc(180, 450, 8, 0, Math.PI * 2);
			ctx.fill();
		}

		// Draw combo bonus
		if (this.combo > 1) {
			ctx.fillStyle = "#facc15";
			ctx.font = "bold 20px sans-serif";
			ctx.fillText(`連擊 x${this.combo}`, w / 2 - 40, h - 100);
		}
	}

	onDragStart(x, y) {
		this.touchX = x;
		this.touchY = y;
	}

	onDragEnd(x, y) {
		if (this.candy.state === "ready") {
			this.touchY = y;
			const dx = x - 180;
			const dy = y - 450;
			const power = Math.min(Math.sqrt(dx * dx + dy * dy) * 3, 600);
			const angle = Math.atan2(dy, dx);

			this.candy.vx = Math.cos(angle) * power;
			this.candy.vy = Math.sin(angle) * power;
			this.candy.state = "flying";
		}
	}
}
