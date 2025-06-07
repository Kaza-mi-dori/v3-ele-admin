import { store } from "@/store";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import { ref, computed } from "vue";
import {
  type MonthCache,
  type YearCache,
  initCache,
  clearCache,
  queryOrgData,
  queryProductTypeData,
  queryCompanyData,
  queryOrgAndProductTypeData,
  queryProductData,
  queryAggData,
  type AggregatedData,
} from "@/store/utils/agg-utils";
import {
  storageData,
  type StorageMonthCache,
  type StorageYearCache,
  clearStorageCache,
  initStorageCache,
} from "@/store/utils/storage-agg-utils";
import {
  initCache as initContractCache,
  clearContractYearCache,
  clearContractMonthCache,
  type ContractMonthCache,
  type ContractYearCache,
  queryAggregateContractData,
} from "@/store/utils/contract-utils";

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 10000,
});

// 数据结果
interface TimeSpanDataResult {
  // 时间维度
  timeSpan: any;
  // 时间
  dataTime: string;
  // 指标
  keyIndexType: string;
  // 组织名
  org: string;
  // 产品类型
  productType?: string;
  // 产品细项
  product?: string;
  // 当期计划值 当期实际值 累计值 环比 同比增长 同比增幅
  plan: number;
  real: number;
  accumulated: number;
  pOverPRate: number;
  pOverPValue: number;
  pToPRate: number;
  pToPValue: number;
  // 下属企业数据；产品数据；下属时间段数据
  subOrg?: TimeSpanDataResult[];
  subProduct?: TimeSpanDataResult[]; // 对企业是产品类型，对产品是分项产品
  subData?: TimeSpanDataResult[];
}

// 要考虑时间维度如何做聚合，当前简化形式需要能很好地在迭代中比较
// 更合理做法是key不用直接的时间而是用标准时间放在value中，每个数据其实是一行
// "行"的标识应该和数据库一样像是uuid/id，时间只是一个索引
// 此处先简化实现，如果用mongo等进行维护则再修改
export const revenueData = {
  营收: {
    "2024-01": {
      广投石化本部: {
        "#92汽油": {
          组织名: "广投石化本部",
          数据时间: "2024-01",
          数据类型: "月度",
          当期计划值: 50,
          当期实际值: 55,
          年累计值: 105,
          环比: 15.0,
          同比增长: 18.0,
          同比增幅: 0.18,
        },
      },
    },
    "2024-12": {
      广投石化本部: {
        "#92汽油": {
          组织名: "广投石化本部",
          数据时间: "2024-12",
          数据类型: "月度",
          当期计划值: 100,
          当期实际值: 105,
          年累计值: 105,
          环比: 15.0,
          同比增长: 18.0,
          同比增幅: 0.18,
        },
      },
    },
    "2025-01": {
      广投石化本部: {
        成品油: {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 78810.24,
          年累计值: 78810.24,
          环比: 50.5,
          同比增长: 12.31,
          同比增幅: 42.15,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 500,
          当期实际值: 165436.7,
          年累计值: 165436.7,
          环比: 8.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 43247.13,
          年累计值: 43247.13,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 0.12,
        },
      },
      // 广投石化广东分公司: {
      //   "#92汽油": {
      //     组织名: "广投石化广东分公司",
      //     数据时间: "2025-01",
      //     数据类型: "月度",
      //     当期计划值: 80,
      //     当期实际值: 85,
      //     年累计值: 85,
      //     环比: 10.0,
      //     同比增长: 12.0,
      //     同比增幅: 0.12,
      //   },
      //   "#95汽油": {
      //     组织名: "广投石化广东分公司",
      //     数据时间: "2025-01",
      //     数据类型: "月度",
      //     当期计划值: 60,
      //     当期实际值: 65,
      //     年累计值: 65,
      //     环比: 8.0,
      //     同比增长: 10.0,
      //     同比增幅: 0.1,
      //   },
      //   "#0柴油": {
      //     组织名: "广投石化广东分公司",
      //     数据时间: "2025-01",
      //     数据类型: "月度",
      //     当期计划值: 90,
      //     当期实际值: 95,
      //     年累计值: 95,
      //     环比: 12.0,
      //     同比增长: 15.0,
      //     同比增幅: 0.15,
      //   },
      // },
    },
    "2025-02": {
      广投石化本部: {
        // "#92汽油": {
        //   组织名: "广投石化本部",
        //   数据时间: "2025-02",
        //   数据类型: "月度",
        //   当期计划值: 110,
        //   当期实际值: 118,
        //   年累计值: 230,
        //   环比: 5.4,
        //   同比增长: 16.0,
        //   同比增幅: 0.16,
        // },
        // "#95汽油": {
        //   组织名: "广投石化本部",
        //   数据时间: "2025-02",
        //   数据类型: "月度",
        //   当期计划值: 90,
        //   当期实际值: 96,
        //   年累计值: 188,
        //   环比: 4.3,
        //   同比增长: 14.0,
        //   同比增幅: 0.14,
        // },
        成品油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 91348.14,
          年累计值: 170158.38,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 391031.58,
          年累计值: 556468.28,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 14952.72,
          年累计值: 58199.85,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
      },
    },
    "2025-03": {
      广投石化本部: {
        成品油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 120000,
          当期实际值: 108457.4,
          年累计值: 278615.78,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 242931.04,
          年累计值: 799399.32,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 27172.48,
          年累计值: 85372.33,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
      },
    },
    "2025-04": {
      广投石化本部: {
        成品油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-04",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 102271.46,
          年累计值: 380887.24,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-04",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 290855.88,
          年累计值: 1090255.2,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-04",
          数据类型: "月度",
          当期计划值: 5000,
          当期实际值: -155.97,
          年累计值: 85216.36,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 100.59,
        },
      },
    },
    广投石化本部: {
      成品油产品: {
        组织名: "广投石化本部",
        数据时间: "2025-05",
        数据类型: "月度",
        当期计划值: 0,
        当期实际值: 100909.39,
        年累计值: 481796.63,
        环比: 1,
        同比增长: 1,
        同比增幅: 1,
      },
      原油产品: {
        组织名: "广投石化本部",
        数据时间: "2025-05",
        数据类型: "月度",
        当期计划值: 258.48,
        当期实际值: 198790.57,
        年累计值: 1289045.77,
        环比: 8.0,
        同比增长: 12.0,
        同比增幅: 0.12,
      },
      燃料油: {
        组织名: "广投石化本部",
        数据时间: "2025-05",
        数据类型: "月度",
        当期计划值: 0,
        当期实际值: -12.04,
        年累计值: 85204.32,
        环比: 1,
        同比增长: 13.94,
        同比增幅: 0.12,
      },
    },
  },
  利润: {
    "2025-01": {
      广投石化本部: {
        成品油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 246.84,
          年累计值: 246.84,
          环比: 1,
          同比增长: 1,
          同比增幅: 1,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: -930.39,
          当期实际值: -930.39,
          年累计值: 2554.21,
          环比: 8.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 851.29,
          年累计值: 851.29,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 0.12,
        },
      },
    },
    "2025-02": {
      广投石化本部: {
        成品油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 2307.37,
          年累计值: 2554.21,
          环比: 1,
          同比增长: 1,
          同比增幅: 1,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 258.48,
          当期实际值: 1188.87,
          年累计值: 258.48,
          环比: 8.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: -279.69,
          年累计值: 571.6,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 0.12,
        },
      },
    },
    "2025-03": {
      广投石化本部: {
        成品油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: -1083.44,
          年累计值: 1470.77,
          环比: 1,
          同比增长: 1,
          同比增幅: 1,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 258.48,
          当期实际值: 2827.67,
          年累计值: 3086.15,
          环比: 8.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 916.54,
          年累计值: 1488.14,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 0.12,
        },
      },
    },
    "2025-04": {
      广投石化本部: {
        成品油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-04",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 247.53,
          年累计值: 1718.3,
          环比: 1,
          同比增长: 1,
          同比增幅: 1,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-04",
          数据类型: "月度",
          当期计划值: 258.48,
          当期实际值: 2680.99,
          年累计值: 5767.14,
          环比: 8.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-04",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: 894.28,
          年累计值: 2382.42,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 0.12,
        },
      },
    },
    "2025-05": {
      广投石化本部: {
        成品油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-05",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: -1405.26,
          年累计值: 313.04,
          环比: 1,
          同比增长: 1,
          同比增幅: 1,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-05",
          数据类型: "月度",
          当期计划值: 258.48,
          当期实际值: 3348.0,
          年累计值: 9115.14,
          环比: 8.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
        燃料油: {
          组织名: "广投石化本部",
          数据时间: "2025-05",
          数据类型: "月度",
          当期计划值: 0,
          当期实际值: -184.4,
          年累计值: 2198.02,
          环比: 1,
          同比增长: 13.94,
          同比增幅: 0.12,
        },
      },
    },
  },
  采购量: {
    "2025-02": {
      恒润公司: {
        原油产品: {
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 300,
          当期实际值: 320,
          年累计值: 320,
          环比: 6.7,
          同比增长: 7.0,
          同比增幅: "7.0%",
        },
      },
    },
  },
  销售量: {
    "2025-01": {
      广投石化本部: {
        原油产品: {
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 100,
          当期实际值: 110,
          年累计值: 110,
        },
      },
    },
  },
};

// 层数较浅直接用json模拟树结构
// 较深则转用节点树 + k-v 表
const enterpriseRelationData = {
  石化板块: {
    广投石化: {
      广投石化本部: undefined,
      广投石化广东分公司: undefined,
      永盛仓储: undefined,
      广投石化舟山: undefined,
    },
    桂盛桂轩: undefined,
    开燃公司: undefined,
    恒润公司: undefined,
  },
};

const productRelationData = {
  成品油: {
    汽油: {
      "#92汽油": undefined,
      "#95汽油": undefined,
      "#98汽油": undefined,
    },
    柴油: {
      "#0柴油": undefined,
    },
  },
  原油: {
    原油产品: undefined,
  },
};
/**
 * 针对json模拟树结构进行深度优先搜索
 * @param data 数据
 * @param target 目标
 * @param mapper 映射函数
 * @returns 目标
 */
function dfsSearch(
  data: any,
  target: string,
  mapper?: (data: any) => any
): any {
  for (const key in data) {
    if (key === target) {
      const result = mapper ? mapper(data[key]) : data[key];
      return result;
    }
    if (typeof data[key] === "object") {
      const result = dfsSearch(data[key], target, mapper);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

/**
 * 获取某个节点下属的所有叶子后代
 * @param data 数据
 * @param targetKey 目标
 * @returns 目标
 */
function getLeafNodes(data: any): any {
  let result: any[] = [];
  if (!data) {
    return result;
  }
  for (const key in data) {
    if (typeof data[key] === "object") {
      // 对每个子节点进行递归
      result = result.concat(getLeafNodes(data[key]));
    } else {
      result.push(key);
    }
  }
  return result;
}

export const businessStore = defineStore("business", () => {
  const businessInfo = ref([]);
  const businessInfoValue = computed(() => businessInfo.value);
  const businessReportMap = ref<Record<string, any>>({});

  // 模拟数据库
  const yearCache = ref<YearCache>();
  const monthCache = ref<MonthCache>();
  // 模拟库存数据表
  const storageYearCache = ref<StorageYearCache>();
  const storageMonthCache = ref<StorageMonthCache>();
  // 模拟合同数据表
  const contractYearCache = ref<ContractYearCache>();
  const contractMonthCache = ref<ContractMonthCache>();

  // 初始化业务数据库
  function initLocalBusinessDatabase() {
    if (yearCache.value && monthCache.value) {
      // return;
      clearCache();
    }
    const cache = initCache(revenueData);
    yearCache.value = cache.yearCache;
    monthCache.value = cache.monthCache;
    // console.log(yearCache.value, monthCache.value);
  }

  // 初始化库存数据库
  function initLocalStorageDatabase() {
    if (storageYearCache.value && storageMonthCache.value) {
      // return;
      clearStorageCache();
    }
    const cache = initStorageCache();
    storageYearCache.value = cache.yearCache;
    storageMonthCache.value = cache.monthCache;
    // console.log(storageYearCache.value, storageMonthCache.value);
  }

  // 初始化合同数据库
  function initLocalContractDatabase() {
    if (contractYearCache.value && contractMonthCache.value) {
      // return;
      clearContractYearCache();
      clearContractMonthCache();
    }
    const cache = initContractCache();
    contractYearCache.value = cache.yearCache;
    contractMonthCache.value = cache.monthCache;
    // console.log(contractYearCache.value, contractMonthCache.value);
  }

  function getLocalStorageDatabase() {
    if (!storageYearCache.value || !storageMonthCache.value) {
      initLocalStorageDatabase();
    }
    return {
      yearCache: storageYearCache.value,
      monthCache: storageMonthCache.value,
    };
  }

  /**
   * 获取业态报表列表
   *
   */
  function getBusinessReportFormList(queryForm: any) {
    return new Promise<any>((resolve, reject) => {
      BusinessFormAPI.getBusinessReportFormList(queryForm)
        .then((res) => {
          if (!res) {
            reject("Please try again.");
            return;
          }
          const currentRecord = res["当前记录"];
          businessInfo.value = currentRecord;
          resolve(currentRecord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 获取业态报表数据
   *
   */
  function getBusinessReportMap(year: string, category: string, force = false) {
    return new Promise(async (resolve) => {
      if (!businessReportMap.value[year]) {
        businessReportMap.value[year] = {};
      }
      if (businessReportMap.value[year][category] && !force) {
        resolve(businessReportMap.value[year][category]);
        return;
      }
      const data: any = await BusinessFormAPI.getBusinessReportFormList({
        业务维度: category,
        类型集合: ["年"],
        状态集合: ["有效"],
        日期早于: `${year}-12-31`,
        日期晚于: `${year}-01-01`,
      });
      businessReportMap.value[year][year] = data["当前记录"]?.[0];
      resolve(businessReportMap.value[year][year]);
    });
  }

  /**
   * 获取产品类型包含关系
   *
   */
  function getProductRelation() {
    return new Promise<any>((resolve, reject) => {
      resolve(productRelationData);
    });
  }

  /**
   * 获取企业关系
   *
   */
  function getEnterpriseRelation() {
    return new Promise<any>((resolve, reject) => {
      resolve(enterpriseRelationData);
    });
  }

  /**
   * 获取某个组织的所有作为叶子节点的后代
   * 当前直接使用企业名在enterpriseRelationData中搜索
   * @param enterpriseId 企业ID
   */
  function getSubordinateEnterprise(enterpriseId: string) {
    return new Promise<any>((resolve, reject) => {
      // 使用dfs搜索
      const result = dfsSearch(enterpriseRelationData, enterpriseId, (data) => {
        return getLeafNodes(data, enterpriseId);
      });
      resolve(result);
    });
  }

  /**
   * 查询关键指标数据并根据企业关系进行拼装
   * @param keyIndex 关键指标
   * @param timeScale 时间维度
   * @param company 企业
   * @param fromYear 开始年份
   * @param toYear 结束年份
   * @param fromMonth 开始月份
   * @param toMonth 结束月份
   * @param category 业态, 和company至少一个
   * @param product 产品, 和company至少一个
   * @param withSubTimeData 是否查询子时段数据
   * @param withSubOrgData 是否查询下属企业数据
   * @param withSubProductData 是否查询下属产品数据
   * @param withSubProductTypeData 是否查询下属业态数据
   */
  function queryKeyIndexData(
    keyIndex: "营收" | "利润",
    timeScale: "年" | "月",
    company?: string,
    fromYear?: number,
    toYear?: number,
    fromMonth?: number,
    toMonth?: number,
    category?: string,
    product?: string,
    withSubTimeData?: boolean,
    withSubOrgData?: boolean,
    withSubProductData?: boolean,
    withSubProductTypeData?: boolean
  ): AggregatedData[] {
    return new Promise<any>((resolve, reject) => {
      // 如果缓存为空，则初始化缓存
      if (!yearCache.value || !monthCache.value) {
        initLocalBusinessDatabase();
      }

      // 如果不满足参数条件则返回空
      if (!company && !category && !product) {
        reject("请至少选择一个企业或业态或产品来查询");
        return;
      }
      // 根据时间维度，采用不同的默认参数
      if (timeScale === "年") {
        // from或to为空则采用当前年份1月到当前月份
        fromYear = fromYear || new Date().getFullYear();
        toYear = toYear || new Date().getFullYear();
        fromMonth = 1;
        toMonth = new Date().getMonth() + 1;
      }
      if (timeScale === "月") {
        // from或to为空则采用当前月份
        fromYear = fromYear || new Date().getFullYear();
        toYear = toYear || new Date().getFullYear();
        fromMonth = fromMonth || new Date().getMonth() + 1;
        toMonth = toMonth || new Date().getMonth() + 1;
      }
      // const result = getKeyIndexData(
      //   keyIndex,
      //   timeScale,
      //   fromYear!,
      //   toYear!,
      //   fromMonth!,
      //   toMonth!,
      //   company,
      //   category,
      //   product
      // );
      const result = queryAggData({
        keyIndexType: keyIndex,
        timeDimension: timeScale === "年" ? "year" : "month",
        org: company,
        productType: category,
        product: product,
        startDate:
          timeScale === "年"
            ? `${fromYear}`
            : `${fromYear}-${fromMonth!.toString().padStart(2, "0")}`,
        endDate:
          timeScale === "年"
            ? `${toYear}`
            : `${toYear}-${toMonth!.toString().padStart(2, "0")}`,
        withSubTimeData,
        withSubOrgData,
        withSubProductData,
        withSubProductTypeData,
      });
      resolve(result);
    });
  }

  function queryStorageData(
    timeScale: "年" | "月",
    company?: string,
    product?: string,
    productType?: string
  ) {
    if (!storageYearCache.value || !storageMonthCache.value) {
      initLocalStorageDatabase();
    }
    return new Promise<any>((resolve, reject) => {
      resolve(storageMonthCache.value);
    });
  }

  // service + controller
  /**
   * 查询合同数据
   * @param timeScale
   * @param company
   * @param product
   * @param productType
   * @returns
   */
  function queryContractData(
    timeScale: "年" | "月",
    dataTime: string,
    company?: string,
    contractType?: string
  ) {
    if (!contractYearCache.value || !contractMonthCache.value) {
      initLocalContractDatabase();
    }
    // console.log(contractYearCache.value, contractMonthCache.value);
    return new Promise<any>((resolve, reject) => {
      resolve(
        queryAggregateContractData(timeScale, dataTime, company, contractType)
      );
    });
  }

  return {
    queryForm,
    businessInfo,
    businessInfoValue,
    businessReportMap,
    getBusinessReportFormList,
    getBusinessReportMap,
    // 临时数据源
    getProductRelation,
    getEnterpriseRelation,
    getSubordinateEnterprise,
    queryKeyIndexData,
    queryStorageData,
    queryContractData,
    getLocalStorageDatabase,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function businessStoreHook() {
  return businessStore(store);
}
