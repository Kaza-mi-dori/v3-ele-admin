/**
 * 包装方法: 自动重试的异步方法，重试完成或者Promise状态为resolve时返回结果，否则持续重试且状态为pending
 * @param fn 异步方法
 * @param retryTimes 重试次数
 * @param interval 重试间隔
 * @returns Promise 包装过的异步方法
 * 使用例子：
 * const realWork = fetch('https://api.github.com');
 * const workWrapper = autoRetry(realWork, 3, 1000);
 * workWrapper.then(res => console.log(res)).catch(e => console.error(e));
 */
export const autoRetryWrapper = async (
  fn: Promise<any>,
  retryTimes?: number,
  interval?: number
) => {
  let retry = 0;
  let result: any;
  const innerRetryTimes = retryTimes || 3;
  const innerInterval = interval || 1000;
  return new Promise((resolve, reject) => {
    const tryFn = async () => {
      try {
        result = await fn;
        resolve(result);
      } catch (e) {
        if (retry < innerRetryTimes) {
          retry++;
          setTimeout(tryFn, innerInterval);
        } else {
          reject(e);
        }
      }
    };
    tryFn();
  });
};

export class workerPool {
  private workers: { worker: Worker; isActive: boolean }[];
  private queue: any[];
  private activeWorkers: Map<Worker, any>;
  private options: any;
  constructor(
    url: string,
    size: number = navigator.hardwareConcurrency,
    options: any = {}
  ) {
    this.workers = [];
    this.queue = [];
    this.activeWorkers = new Map();
    for (let i = 0; i < size; i++) {
      const worker = new Worker(url);
      this.workers.push({
        worker,
        isActive: false,
      });
    }
    this.options = {
      taskTimeout: 10000,
      retryTimes: 3,
      interval: 1000,
      ...options,
    };
  }
  async runWork(data: any) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };
      const activeWorker = this.workers.find((w) => !w.isActive);
      if (activeWorker) {
        activeWorker.isActive = true;
        this.activeWorkers.set(activeWorker.worker, task);
        activeWorker.worker.postMessage(task);
      } else {
        this.queue.push(task);
      }
    });
  }
  handleWorkerMessage(worker: Worker, e: MessageEvent) {
    const task = this.activeWorkers.get(worker);
    if (task) {
      task.resolve(e.data);
    }
    this.activeWorkers.delete(worker);
    this.workers.push({ worker, isActive: false });
  }
  handleWorkerError(worker: Worker, e: ErrorEvent) {
    const task = this.activeWorkers.get(worker);
    if (task) {
      task.reject(e);
    }
    this.activeWorkers.delete(worker);
    this.workers.push({ worker, isActive: false });
  }
  completeWork(worker: Worker) {
    this.activeWorkers.delete(worker);
    this.workers.push({ worker, isActive: false });
  }
  processQueue() {
    while (this.queue.length > 0 && this.workers.some((w) => !w.isActive)) {
      const task = this.queue.shift();
      const activeWorker = this.workers.find((w) => !w.isActive);
      if (activeWorker) {
        activeWorker.isActive = true;
        this.activeWorkers.set(activeWorker.worker, task);
        activeWorker.worker.postMessage(task);
      }
    }
  }
  terminate() {
    for (const worker of this.workers) {
      worker.worker.terminate();
    }
    this.workers = [];
    this.queue = [];
    this.activeWorkers.clear();
  }
}

class MinHeap {
  private heap: any[];
  constructor() {
    this.heap = [];
  }
  private getParentIndex(index: number) {
    return Math.floor((index - 1) / 2);
  }
  private getLeftChildIndex(index: number) {
    return 2 * index + 1;
  }
  private getRightChildIndex(index: number) {
    return 2 * index + 2;
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp(index: number) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);
    while (
      currentIndex > 0 &&
      this.heap[currentIndex] < this.heap[parentIndex]
    ) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  private heapifyDown(index: number) {
    let currentIndex = index;
    let leftChildIndex = this.getLeftChildIndex(currentIndex);
    let rightChildIndex = this.getRightChildIndex(currentIndex);
    let smallest = currentIndex;
    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex] < this.heap[smallest]
    ) {
      smallest = leftChildIndex;
    }
    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex] < this.heap[smallest]
    ) {
      smallest = rightChildIndex;
    }
    if (smallest !== currentIndex) {
      this.swap(currentIndex, smallest);
      this.heapifyDown(smallest);
    }
  }

  insert(value: any) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 0) {
      return null;
    }
    const min = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown(0);
    return min;
  }
}
