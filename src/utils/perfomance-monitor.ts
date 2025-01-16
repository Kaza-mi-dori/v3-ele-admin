export interface PerformanceInfo {
  fps: number;
  frameTime: number;
  longFrames: number;
  memoryUsage?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

export class PerformanceMonitor {
  private frames = 0;
  private startTime = Date.now();
  private fps = 0;
  private longFrameThreshold = 32.34; // 30fps 对应的帧时间
  private longFrames = 0;
  private lastFrameTime = performance.now();

  constructor(private callback?: (info: PerformanceInfo) => void) {}

  private monitor = () => {
    // 计算FPS
    const currentTime = Date.now();
    const now = performance.now();
    this.frames++;

    // 计算每帧耗时
    const frameTime = now - this.lastFrameTime;
    if (frameTime > this.longFrameThreshold) {
      this.longFrames++;
    }
    this.lastFrameTime = now;

    // 每秒更新一次数据
    if (currentTime - this.startTime > 1000) {
      this.fps = Math.round(
        (this.frames * 1000) / (currentTime - this.startTime)
      );

      const performanceInfo: PerformanceInfo = {
        fps: this.fps,
        frameTime,
        longFrames: this.longFrames,
      };

      // 获取内存使用情况（仅Chrome支持）
      if (performance.memory) {
        performanceInfo.memoryUsage = {
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          usedJSHeapSize: performance.memory.usedJSHeapSize,
        };
      }

      // 获取页面加载性能数据
      const navigationTiming = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        const loadTime =
          navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        const dnsTime =
          navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart;
        const tcpTime =
          navigationTiming.connectEnd - navigationTiming.connectStart;
        const firstPaintTime =
          performance.getEntriesByType("paint")[0]?.startTime;

        Object.assign(performanceInfo, {
          loadTime,
          dnsTime,
          tcpTime,
          firstPaintTime,
        });
      }

      // 执行回调
      this.callback?.(performanceInfo);

      // 重置计数器
      this.frames = 0;
      this.startTime = currentTime;
      this.longFrames = 0;
    }

    requestAnimationFrame(this.monitor);
  };

  start() {
    this.monitor();
  }
}
