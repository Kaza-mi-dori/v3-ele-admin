// TODO 做成策略模式

interface Part {
  x: number;
  y: number;
  size: number;
  posX: number;
  posY: number;
  posZ: number;
  fl: number;
  speed: number;
  r: number;
  color: string;
}

export class ParticalSpiral {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  maxSize: number = 4;
  halfWidth: number = 0;
  halfHeight: number = 0;
  counts: number = 0;
  parts: Part[] = [];

  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.maxSize = 4;
    this.halfWidth = 0;
    this.halfHeight = 0;
    this.counts = 2000;
    this.parts = [];
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.style.background = "#000000";
    this.ctx.globalAlpha = 0.9;
    this.halfWidth = canvas.width / 2;
    this.halfHeight = canvas.height / 2;
  }

  /**
   * 将粒子绘制到canvas上
   * @param part
   * @returns
   */
  addPart(part: Part) {
    if (!this.ctx) {
      return;
    }
    // grd是渐变色，从中心到边缘颜色逐渐变浅
    // createRadialGradient 创建一个放射渐变, 参数是圆心坐标和半径
    // 圆心坐标是 (coordinate.x, coordinate.y)，半径是 coordinate.size，
    // 颜色从 0.5 到 0
    const grd = this.ctx.createRadialGradient(
      part.x,
      part.y,
      part.size / 2,
      part.x,
      part.y,
      part.size
    );
    grd.addColorStop(0, "white");
    grd.addColorStop(1, part.color);
    this.ctx.fillStyle = grd;
    this.ctx.beginPath();
    this.ctx.arc(part.x, part.y, part.size, 0, 2 * Math.PI, true);
    // 旋转, 参数分别是: 旋转角度, 旋转中心x, 旋转中心y, 旋转角度, 旋转中心x, 旋转中心y
    this.ctx.transform(1, 0, 0, 1, 0, part.posZ);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * 初始化
   * @returns
   */
  init() {
    if (!this.canvas || !this.ctx) {
      return;
    }
    // this.bg();
    this.run();
    this.render();
    this.animate();
  }
  bg() {
    if (!this.ctx || !this.canvas) {
      return;
    }
    console.log("set bg", this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#000000";
    this.ctx.globalAlpha = 0.9;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * 添加粒子
   * @returns
   */
  run() {
    if (!this.canvas || !this.ctx) {
      return;
    }
    let nums = 0;
    while (nums < this.counts) {
      this.parts.push({
        x: Math.ceil(Math.random() * this.canvas.width),
        y: Math.ceil(Math.random() * this.canvas.height),
        size: 0,
        posX: Math.random() * this.canvas.width - this.halfWidth,
        posY: Math.random() * this.canvas.height - this.halfHeight,
        posZ: Math.random() * 250,
        fl: 100,
        speed: Math.random() * 2,
        r: Math.ceil(Math.random() * this.maxSize),
        color: `rgba(${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random())})`,
      });
      nums++;
    }
  }

  clear() {
    if (!this.ctx || !this.canvas) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 渲染
   * @returns
   */
  render() {
    if (!this.ctx) {
      return;
    }
    this.clear();
    this.parts.forEach((part) => {
      this.draw(part);
    });
  }

  /**
   * 绘制粒子
   * @param part
   * @returns
   */
  draw(part: Part) {
    if (part.posZ > -part.fl) {
      const scale = part.fl / (part.fl + part.posZ);
      part.x = this.halfWidth + part.posX * scale;
      part.y = this.halfHeight + part.posY * scale;
      part.size = part.r * scale;
      part.posZ -= part.speed;
    } else {
      part.posZ = Math.random() * 250;
    }
    this.addPart(part);
  }

  /**
   * 动画
   * @returns
   */
  animate() {
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }
}
