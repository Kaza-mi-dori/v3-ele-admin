interface Star {
  orbitRadius: number;
  radius: number;
  orbitX: number;
  orbitY: number;
  timePassed: number;
  speed: number;
  alpha: number;
}

function random(min: number, max?: number) {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  if (min > max) {
    const hold = max;
    max = min;
    min = hold;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(width: number, height: number) {
  const max = Math.max(width, height);
  const diameter = Math.round(Math.sqrt(max * max + max * max));
  return diameter / 2;
}

// init → draw → run → requestAnimationFrame 滚动星空
export class RollingStarrySky {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  hue: number;
  stars: Star[];
  count: number;
  maxStars: number;
  starImage: HTMLCanvasElement;
  starImageCtx: CanvasRenderingContext2D;
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.hue = 217;
    this.stars = [];
    this.count = 0;
    this.maxStars = 600;
    this.starImage = document.createElement("canvas");
    this.starImage.width = 100;
    this.starImage.height = 100;
    this.starImageCtx = this.starImage.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    const half = this.starImage.width / 2;
    const gradient = this.starImageCtx.createRadialGradient(
      half,
      half,
      0,
      half,
      half,
      half
    );
    gradient.addColorStop(0.025, "#CCC");
    gradient.addColorStop(0.1, "hsl(" + this.hue + ", 61%, 33%)");
    gradient.addColorStop(0.25, "hsl(" + this.hue + ", 64%, 6%)");
    gradient.addColorStop(1, "transparent");
    this.starImageCtx.fillStyle = gradient;
    this.starImageCtx.beginPath();
    this.starImageCtx.arc(half, half, half, 0, Math.PI * 2);
    this.starImageCtx.fill();
  }

  init() {
    this.createStars();
    this.animate();
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  createStar() {
    if (!this.canvas) return;
    const star: Star = {
      orbitRadius: random(maxOrbit(this.canvas.width, this.canvas.height)),
      orbitX: this.canvas.width / 2,
      orbitY: this.canvas.height / 2,
      timePassed: random(0, this.maxStars),
      alpha: random(2, 10) / 10,
      radius: 0,
      speed: 0,
    };
    star.radius = random(60, star.orbitRadius) / 25;
    star.speed = random(star.orbitRadius) / 180000;
    return star;
  }

  createStars() {
    for (let i = 0; i < this.maxStars; i++) {
      const star = this.createStar();
      if (star) {
        this.stars.push(star);
        this.count++;
      }
    }
  }

  drawStar(star: Star) {
    if (!this.ctx || !this.canvas) return;
    const x = Math.sin(star.timePassed) * star.orbitRadius + star.orbitX;
    const y = Math.cos(star.timePassed) * star.orbitRadius + star.orbitY;
    const twinkle = random(10);
    if (twinkle === 1 && star.alpha > 0) {
      star.alpha -= 0.05;
    } else if (twinkle === 2 && star.alpha < 1) {
      star.alpha += 0.05;
    }
    this.ctx.globalAlpha = star.alpha;
    this.ctx.drawImage(
      this.starImage,
      x - star.radius / 2,
      y - star.radius / 2,
      star.radius,
      star.radius
    );
    star.timePassed += star.speed;
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  animate() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillStyle = `hsla(${this.hue}, 64%, 6%, 2)`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = "lighter"; // 混合模式, lighter会叠加颜色
    for (let i = 0; i < this.count; i++) {
      const star = this.stars[i];
      this.drawStar(star);
    }
    requestAnimationFrame(this.animate.bind(this));
  }
}
