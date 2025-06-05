export type StorageName =
  | "钦州永盛库"
  | "钦州广明库"
  | "恒润厂区库"
  | "东莞盛源库"
  | "来宾古瓦库";

// 同样包含组织 → 公司 → 油库关系
// 当前此模块模拟数据为【组织】的【分油品】日报

// 组织列表
// const orgList = ["广投石化", "开燃公司", "桂盛桂轩", "恒润公司"];
const orgList = ["广投石化", "桂盛桂轩", "恒润公司"];

// 产品列表
const products = ["#92汽油", "#95汽油", "#98汽油", "#0柴油", "原油"];

// 库存日报数据
export interface StorageDailyData {
  // 时间
  dataTime: string;
  // // 油库名
  // storageName: StorageName;
  // 组织
  storageName: string;
  // 产品细项
  product: string;
  // 库存量
  storage: number;
  // 出库量
  out: number;
  // 入库量
  in: number;
}

// 模拟数据
const storageDailyData: StorageDailyData[] = [];
export interface StorageMonthCache {
  // 油库报表 油库名 -> 月份 -> 数据
  byStorageName: Record<string, Record<string, any>>;
  // 组织报表 组织名 -> 月份 -> 数据
  byOrg: Record<string, Record<string, any>>;
  // 产品报表 产品名 -> 月份 -> 数据
  byProduct: Record<string, Record<string, any>>;
  // 产品类型报表 产品类型名 -> 月份 -> 数据
  byProductType: Record<string, Record<string, any>>;
  // 油库名和产品名联合报表 油库名 -> 月份 -> 产品名 -> 数据
  byStorageNameAndProduct: Record<string, Record<string, Record<string, any>>>;
  // 产品名和油库名联合报表 产品名 -> 月份 -> 油库名 -> 数据
  byProductAndStorageName: Record<string, Record<string, Record<string, any>>>;
}

export const storageMonthCache: StorageMonthCache = {
  byStorageName: {
    广投石化: {},
    // 开燃公司: {},
    桂盛桂轩: {},
    恒润公司: {},
  },
  byOrg: {},
  byProduct: {},
  byProductType: {},
  byStorageNameAndProduct: {},
  byProductAndStorageName: {},
};

// 年度报表
export interface StorageYearCache {
  // 油库报表 油库名 -> 年份 -> 数据
  byStorageName: Record<string, Record<string, any>>;
  // 组织报表 组织名 -> 年份 -> 数据
  byOrg: Record<string, Record<string, any>>;
  // 产品报表 产品名 -> 年份 -> 数据
  byProduct: Record<string, Record<string, any>>;
  // 产品类型报表 产品类型名 -> 年份 -> 数据
  byProductType: Record<string, Record<string, any>>;
  // 油库名和产品名联合报表 油库名和产品名联合 -> 年份 -> 数据
  byStorageNameAndProduct: Record<string, Record<string, Record<string, any>>>;
  // 产品名和油库名联合报表 产品名 -> 年份 -> 油库名 -> 数据
  byProductAndStorageName: Record<string, Record<string, Record<string, any>>>;
}

export const storageYearCache: StorageYearCache = {
  byStorageName: {
    广投石化: {},
    // 开燃公司: {},
    桂盛桂轩: {},
    恒润公司: {},
  },
  byOrg: {},
  byProduct: {},
  byProductType: {},
  byStorageNameAndProduct: {},
  byProductAndStorageName: {},
};

// 库存报表缓存
export const storageData: StorageDailyData[] = [];

export function initStorageCache() {
  // 初始化模拟数据
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  // 从1月到当前月每个月模拟3条数据
  for (let month = 1; month <= currentMonth; month++) {
    for (let i = 1; i <= 3; i++) {
      // // 每个油库模拟3天数据
      // for (let storageName of Object.keys(storageMonthCache.byStorageName)) {
      //   // 每个产品模拟3条数据
      //   for (let product of products) {
      //     storageDailyData.push({
      //       dataTime: `${currentYear}-${month.toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`,
      //       storageName: storageName as String,
      //       product,
      //       storage: Math.floor(Math.random() * 1000),
      //       out: Math.floor(Math.random() * 100),
      //       in: Math.floor(Math.random() * 100),
      //     });
      //   }
      // }
      // 每个组织模拟3天数据
      for (let org of orgList) {
        for (let product of products) {
          storageDailyData.push({
            dataTime: `${currentYear}-${month.toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`,
            storageName: org,
            product,
            storage: Math.floor(Math.random() * 1000),
            out: Math.floor(Math.random() * 100),
            in: Math.floor(Math.random() * 100),
          });
        }
      }
    }
  }
  // 按月聚合
  buildStorageMonthCache();
  // 按年聚合
  buildStorageYearCache();

  return {
    monthCache: storageMonthCache,
    yearCache: storageYearCache,
  };
}

export function clearStorageCache() {
  storageMonthCache.byStorageName = {};
  storageMonthCache.byOrg = {};
  storageMonthCache.byProduct = {};
  storageMonthCache.byProductType = {};
  storageMonthCache.byStorageNameAndProduct = {};

  storageYearCache.byStorageName = {};
  storageYearCache.byOrg = {};
  storageYearCache.byProduct = {};
  storageYearCache.byProductType = {};
  storageYearCache.byStorageNameAndProduct = {};
}

function getMonthList(rawData: StorageDailyData[]) {
  const result = new Set();
  for (let data of rawData) {
    const date = new Date(data.dataTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    result.add(`${year}-${month.toString().padStart(2, "0")}`);
  }
  return Array.from(result);
}

// 按油库名产品名聚合
function aggregateMonthByStorageNameAndProduct(rawData: StorageDailyData[]) {
  for (let data of rawData) {
    const { storageName, dataTime, product } = data;
    const date = new Date(dataTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (!storageMonthCache.byStorageNameAndProduct[storageName]) {
      storageMonthCache.byStorageNameAndProduct[storageName] = {};
    }
    if (
      !storageMonthCache.byStorageNameAndProduct[storageName][
        `${year}-${month.toString().padStart(2, "0")}`
      ]
    ) {
      storageMonthCache.byStorageNameAndProduct[storageName][
        `${year}-${month.toString().padStart(2, "0")}`
      ] = {};
    }
    if (
      !storageMonthCache.byStorageNameAndProduct[storageName][
        `${year}-${month.toString().padStart(2, "0")}`
      ][product]
    ) {
      storageMonthCache.byStorageNameAndProduct[storageName][
        `${year}-${month.toString().padStart(2, "0")}`
      ][product] = {
        storageName,
        dataTime,
        product,
        storage: 0,
        out: 0,
        in: 0,
        subData: [],
      };
    }
    storageMonthCache.byStorageNameAndProduct[storageName][
      `${year}-${month.toString().padStart(2, "0")}`
    ][product].subData.push(data);

    // 对称
    if (!storageMonthCache.byProductAndStorageName[product]) {
      storageMonthCache.byProductAndStorageName[product] = {};
    }
    if (
      !storageMonthCache.byProductAndStorageName[product][
        `${year}-${month.toString().padStart(2, "0")}`
      ]
    ) {
      storageMonthCache.byProductAndStorageName[product][
        `${year}-${month.toString().padStart(2, "0")}`
      ] = {};
    }
    if (
      !storageMonthCache.byProductAndStorageName[product][
        `${year}-${month.toString().padStart(2, "0")}`
      ][storageName]
    ) {
      storageMonthCache.byProductAndStorageName[product][
        `${year}-${month.toString().padStart(2, "0")}`
      ][storageName] = {
        storageName,
        dataTime,
        product,
        storage: 0,
        out: 0,
        in: 0,
        subData: [],
      };
    }
    storageMonthCache.byProductAndStorageName[product][
      `${year}-${month.toString().padStart(2, "0")}`
    ][storageName].subData.push(data);
  }

  // 每个月加和
  for (let storageName of Object.keys(
    storageMonthCache.byStorageNameAndProduct
  )) {
    for (let month of Object.keys(
      storageMonthCache.byStorageNameAndProduct[storageName]
    )) {
      for (let product of Object.keys(
        storageMonthCache.byStorageNameAndProduct[storageName][month]
      )) {
        // 计算所有的in, out, storage
        const subData =
          storageMonthCache.byStorageNameAndProduct[storageName][month][product]
            .subData;
        const aggStorage = subData.reduce(
          (acc: any, curr: any) => acc + curr.storage,
          0
        );
        const aggOut = subData.reduce(
          (acc: any, curr: any) => acc + curr.out,
          0
        );
        const aggIn = subData.reduce((acc: any, curr: any) => acc + curr.in, 0);
        storageMonthCache.byStorageNameAndProduct[storageName][month][
          product
        ].storage = aggStorage;
        storageMonthCache.byStorageNameAndProduct[storageName][month][
          product
        ].out = aggOut;
        storageMonthCache.byStorageNameAndProduct[storageName][month][
          product
        ].in = aggIn;
      }
    }
  }

  // 对称
  for (let product of Object.keys(storageMonthCache.byProductAndStorageName)) {
    for (let month of Object.keys(
      storageMonthCache.byProductAndStorageName[product]
    )) {
      for (let storageName of Object.keys(
        storageMonthCache.byProductAndStorageName[product][month]
      )) {
        // 计算所有的in, out, storage
        const subData =
          storageMonthCache.byProductAndStorageName[product][month][storageName]
            .subData;
        const aggStorage = subData.reduce(
          (acc: any, curr: any) => acc + curr.storage,
          0
        );
        const aggOut = subData.reduce(
          (acc: any, curr: any) => acc + curr.out,
          0
        );
        const aggIn = subData.reduce((acc: any, curr: any) => acc + curr.in, 0);
        storageMonthCache.byProductAndStorageName[product][month][
          storageName
        ].storage = aggStorage;
        storageMonthCache.byProductAndStorageName[product][month][
          storageName
        ].out = aggOut;
        storageMonthCache.byProductAndStorageName[product][month][
          storageName
        ].in = aggIn;
      }
    }
  }
}

// 按油库聚合
function aggregateMonthByStorageName() {
  // 从storageMonthCache.byStorageNameAndProduct中提取数据
  for (let storageName of Object.keys(
    storageMonthCache.byStorageNameAndProduct
  )) {
    for (let month of Object.keys(
      storageMonthCache.byStorageNameAndProduct[storageName]
    )) {
      if (!storageMonthCache.byStorageName[storageName as string]) {
        storageMonthCache.byStorageName[storageName as string] = {};
      }
      if (!storageMonthCache.byStorageName[storageName as string][month]) {
        storageMonthCache.byStorageName[storageName as string][month] = {
          storageName,
          dataTime: month,
          product: "-",
          storage: 0,
          out: 0,
          in: 0,
          subData: [],
        };
      }
      // 聚合所有product
      for (let [product, data] of Object.entries(
        storageMonthCache.byStorageNameAndProduct[storageName][month]
      )) {
        // 加和storage
        storageMonthCache.byStorageName[storageName as string][month].storage +=
          data.storage;
        // 加和out
        storageMonthCache.byStorageName[storageName as string][month].out +=
          data.out;
        // 加和in
        storageMonthCache.byStorageName[storageName as string][month].in +=
          data.in;
        storageMonthCache.byStorageName[storageName as string][
          month
        ].subData.push(data);
      }
    }
  }
}
// 按产品聚合
function aggregateMonthByProduct() {
  // 从storageMonthCache.byProductAndStorageName中提取数据
  for (let product of Object.keys(storageMonthCache.byProductAndStorageName)) {
    for (let month of Object.keys(
      storageMonthCache.byProductAndStorageName[product]
    )) {
      for (let storageName of Object.keys(
        storageMonthCache.byProductAndStorageName[product][month]
      )) {
        if (!storageMonthCache.byProduct[product]) {
          storageMonthCache.byProduct[product] = {};
        }
        if (!storageMonthCache.byProduct[product][month]) {
          storageMonthCache.byProduct[product][month] = {
            product,
            dataTime: month,
            storageName,
            storage: 0,
            out: 0,
            in: 0,
            subData: [],
          };
        }
        // 聚合所有storageName
        for (let [storageName, data] of Object.entries(
          storageMonthCache.byProductAndStorageName[product][month]
        )) {
          storageMonthCache.byProduct[product][month].storage += data.storage;
          storageMonthCache.byProduct[product][month].out += data.out;
          storageMonthCache.byProduct[product][month].in += data.in;
          storageMonthCache.byProduct[product][month].subData.push(data);
        }
      }
    }
  }
}

// 年版本
function aggregateYearByStorageNameAndProduct(rawData: StorageDailyData[]) {
  for (let data of rawData) {
    const { storageName, dataTime, product } = data;
    const date = new Date(dataTime);
    const year = date.getFullYear();
    if (!storageYearCache.byStorageNameAndProduct[storageName]) {
      storageYearCache.byStorageNameAndProduct[storageName] = {};
    }
    if (!storageYearCache.byStorageNameAndProduct[storageName][year]) {
      storageYearCache.byStorageNameAndProduct[storageName][year] = {};
    }
    if (!storageYearCache.byStorageNameAndProduct[storageName][year][product]) {
      storageYearCache.byStorageNameAndProduct[storageName][year][product] = {
        storageName,
        dataTime,
        product,
        storage: 0,
        out: 0,
        in: 0,
        subData: [],
      };
    }

    // 加和in，out
    storageYearCache.byStorageNameAndProduct[storageName][year][product].in +=
      data.in;
    storageYearCache.byStorageNameAndProduct[storageName][year][product].out +=
      data.out;

    // 对称
    if (!storageYearCache.byProductAndStorageName[product]) {
      storageYearCache.byProductAndStorageName[product] = {};
    }
    if (!storageYearCache.byProductAndStorageName[product][year]) {
      storageYearCache.byProductAndStorageName[product][year] = {};
    }
    if (!storageYearCache.byProductAndStorageName[product][year][storageName]) {
      storageYearCache.byProductAndStorageName[product][year][storageName] = {
        storageName,
        dataTime,
        product,
        storage: 0,
        out: 0,
        in: 0,
        subData: [],
      };
    }

    storageYearCache.byProductAndStorageName[product][year][storageName].in +=
      data.in;
    storageYearCache.byProductAndStorageName[product][year][storageName].out +=
      data.out;
  }
}

function aggregateYearByStorageName() {
  // 从月版本的byStorageName中提取数据
  for (let storageName of Object.keys(storageMonthCache.byStorageName)) {
    if (!storageYearCache.byStorageName[storageName as string]) {
      storageYearCache.byStorageName[storageName as string] = {};
    }
    for (let month of Object.keys(
      storageMonthCache.byStorageName[storageName as string]
    )) {
      const year = new Date(month).getFullYear();
      if (!storageYearCache.byStorageName[storageName as string][year]) {
        storageYearCache.byStorageName[storageName as string][year] = {
          storageName,
          dataTime: year,
          product: "-",
          storage: 0,
          out: 0,
          in: 0,
          subData: [],
        };
      }
      // 加和数据
      // storageYearCache.byStorageName[storageName as String][
      //   year
      // ].storage +=
      //   storageMonthCache.byStorageName[storageName as String][
      //     month
      //   ].storage;
      storageYearCache.byStorageName[storageName as string][year].out +=
        storageMonthCache.byStorageName[storageName as string][month].out;
      storageYearCache.byStorageName[storageName as string][year].in +=
        storageMonthCache.byStorageName[storageName as string][month].in;

      storageYearCache.byStorageName[storageName as string][year].subData.push(
        storageMonthCache.byStorageName[storageName as string][month]
      );
    }
  }
}

function aggregateYearByProduct() {
  // 从月版本的byProduct中提取数据
  for (let product of Object.keys(storageMonthCache.byProduct)) {
    if (!storageYearCache.byProduct[product]) {
      storageYearCache.byProduct[product] = {};
    }
    for (let month of Object.keys(storageMonthCache.byProduct[product])) {
      const year = new Date(month).getFullYear();
      if (!storageYearCache.byProduct[product][year]) {
        storageYearCache.byProduct[product][year] = {
          product,
          dataTime: year,
          storageName: "-",
          storage: 0,
          out: 0,
          in: 0,
          subData: [],
        };
      }
      // 加和数据
      // storageYearCache.byProduct[product][year].storage +=
      //   storageMonthCache.byProduct[product][month].storage;
      storageYearCache.byProduct[product][year].out +=
        storageMonthCache.byProduct[product][month].out;
      storageYearCache.byProduct[product][year].in +=
        storageMonthCache.byProduct[product][month].in;

      storageYearCache.byProduct[product][year].subData.push(
        storageMonthCache.byProduct[product][month]
      );
    }
  }
}

function buildStorageMonthCache() {
  // 先计算最深的聚合再计算上层聚合
  aggregateMonthByStorageNameAndProduct(storageDailyData);
  aggregateMonthByStorageName();
  aggregateMonthByProduct();
}

function buildStorageYearCache() {
  aggregateYearByStorageNameAndProduct(storageDailyData);
  aggregateYearByStorageName();
  aggregateYearByProduct();
}

function test() {
  initStorageCache();
  // console.log(storageYearCache);
}

// test();
