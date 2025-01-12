class IndexedDBStore {
  private db: IDBDatabase | null = null;
  private dbName: string;
  private storeName: string;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  // 初始化数据库
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        reject(new Error("数据库打开失败"));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    });
  }

  // 添加数据
  async add(data: any): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取数据
  async get(id: IDBValidKey): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 更新数据
  async update(data: any): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 删除数据
  async delete(id: IDBValidKey): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 获取所有数据
  async getAll(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 数据过期检查
  async cleanExpiredData() {
    try {
      const allData = await this.getAll();
      const now = Date.now();

      for (const item of allData) {
        if (item.expiryDate && item.expiryDate < now) {
          await this.delete(item.id);
        }
      }
    } catch (error) {
      console.error("清理过期数据失败:", error);
    }
  }

  // 存储数据时设置过期时间
  async setDataWithExpiry(key: string, data: any, ttl: number) {
    if (!this.db) {
      throw new Error("数据库未初始化");
    }
    const item = {
      key,
      data,
      expiryDate: Date.now() + ttl,
    };

    await this.add(item);
  }

  // 定期检查存储空间
  async checkStorageQuota() {
    if (navigator.storage && navigator.storage.estimate) {
      const quota = await navigator.storage.estimate();
      const usagePercentage = (quota.usage! / quota.quota!) * 100;

      // 如果使用率超过 80%，清理旧数据
      if (usagePercentage > 80) {
        await this.cleanOldData();
      }
    }
  }

  // 清理旧数据
  async cleanOldData() {
    try {
      const allData = await this.getAll();
      // 按时间排序
      allData.sort((a, b) => a.timestamp - b.timestamp);

      // 删除最旧的 20% 数据
      const deleteCount = Math.floor(allData.length * 0.2);
      for (let i = 0; i < deleteCount; i++) {
        await this.delete(allData[i].id);
      }
    } catch (error) {
      console.error("清理旧数据失败:", error);
    }
  }
}

export default IndexedDBStore;
