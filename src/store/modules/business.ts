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
} from "@/store/utils/agg-utils";

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
        "#92汽油": {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 105,
          当期实际值: 112,
          年累计值: 112,
          环比: 15.0,
          同比增长: 18.0,
          同比增幅: 0.18,
        },
        "#95汽油": {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 85,
          当期实际值: 92,
          年累计值: 92,
          环比: 12.0,
          同比增长: 16.0,
          同比增幅: 0.16,
        },
        "#98汽油": {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 45,
          当期实际值: 50,
          年累计值: 50,
          环比: 20.0,
          同比增长: 25.0,
          同比增幅: 0.25,
        },
        "#0柴油": {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 120,
          当期实际值: 128,
          年累计值: 128,
          环比: 10.0,
          同比增长: 14.0,
          同比增幅: 0.14,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 500,
          当期实际值: 530,
          年累计值: 530,
          环比: 8.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
      },
      广投石化广东分公司: {
        "#92汽油": {
          组织名: "广投石化广东分公司",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 80,
          当期实际值: 85,
          年累计值: 85,
          环比: 10.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
        "#95汽油": {
          组织名: "广投石化广东分公司",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 60,
          当期实际值: 65,
          年累计值: 65,
          环比: 8.0,
          同比增长: 10.0,
          同比增幅: 0.1,
        },
        "#0柴油": {
          组织名: "广投石化广东分公司",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 90,
          当期实际值: 95,
          年累计值: 95,
          环比: 12.0,
          同比增长: 15.0,
          同比增幅: 0.15,
        },
      },
      开燃公司: {
        原油产品: {
          组织名: "开燃公司",
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 400,
          当期实际值: 420,
          年累计值: 420,
          环比: 6.0,
          同比增长: 8.0,
          同比增幅: 0.08,
        },
      },
    },
    "2025-02": {
      广投石化本部: {
        "#92汽油": {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 110,
          当期实际值: 118,
          年累计值: 230,
          环比: 5.4,
          同比增长: 16.0,
          同比增幅: 0.16,
        },
        "#95汽油": {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 90,
          当期实际值: 96,
          年累计值: 188,
          环比: 4.3,
          同比增长: 14.0,
          同比增幅: 0.14,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 520,
          当期实际值: 550,
          年累计值: 1080,
          环比: 3.8,
          同比增长: 10.0,
          同比增幅: 0.1,
        },
      },
      广投石化舟山: {
        "#0柴油": {
          组织名: "广投石化舟山",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 70,
          当期实际值: 75,
          年累计值: 75,
          环比: 8.0,
          同比增长: 12.0,
          同比增幅: 0.12,
        },
        原油产品: {
          组织名: "广投石化舟山",
          数据时间: "2025-02",
          数据类型: "月度",
          当期计划值: 350,
          当期实际值: 370,
          年累计值: 370,
          环比: 5.7,
          同比增长: 9.0,
          同比增幅: 0.09,
        },
      },
    },
    "2025-03": {
      广投石化本部: {
        "#92汽油": {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 115,
          当期实际值: 125,
          年累计值: 355,
          环比: 5.9,
          同比增长: 14.0,
          同比增幅: 0.14,
        },
        "#98汽油": {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 50,
          当期实际值: 55,
          年累计值: 105,
          环比: 10.0,
          同比增长: 20.0,
          同比增幅: 0.2,
        },
        原油产品: {
          组织名: "广投石化本部",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 540,
          当期实际值: 570,
          年累计值: 1650,
          环比: 3.6,
          同比增长: 8.0,
          同比增幅: 0.08,
        },
      },
      开燃公司: {
        "#92汽油": {
          组织名: "开燃公司",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 70,
          当期实际值: 75,
          年累计值: 75,
          环比: 7.0,
          同比增长: 9.0,
          同比增幅: 0.09,
        },
        "#0柴油": {
          组织名: "开燃公司",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 80,
          当期实际值: 85,
          年累计值: 85,
          环比: 6.0,
          同比增长: 8.0,
          同比增幅: 0.08,
        },
      },
      桂盛桂轩: {
        "#92汽油": {
          组织名: "桂盛桂轩",
          数据时间: "2025-03",
          数据类型: "月度",
          当期计划值: 10,
          当期实际值: 11,
          年累计值: 11,
          环比: 10.0,
          同比增长: 15.0,
          同比增幅: 0.15,
        },
      },
    },
  },
  利润: {
    "2025-01": {
      广投石化本部: {
        "#92汽油": {
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 18,
          当期实际值: 20,
          年累计值: 20,
          环比: 20.0,
          同比增长: 25.0,
          同比增幅: "25.0%",
        },
        "#98汽油": {
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 12,
          当期实际值: 14,
          年累计值: 14,
          环比: 16.7,
          同比增长: 33.3,
          同比增幅: "33.3%",
        },
      },
      桂盛桂轩: {
        "#92汽油": {
          数据时间: "2025-01",
          数据类型: "月度",
          当期计划值: 10,
          当期实际值: 11,
          年累计值: 11,
          环比: 10.0,
          同比增长: 15.0,
          同比增幅: "15.0%",
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
  const yearCache = ref<YearCache>();
  const monthCache = ref<MonthCache>();

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
   * 根据参数获取数据
   * 1. 根据关系找出要聚合的数据行
   * 2. 对每个聚合维度（company、category、product）进行聚合获得月报
   * 3. 根据每个聚合维度的月报和上一期的年报得这一期的年报
   * @param keyIndex 关键指标
   * @param timeScale 时间维度
   * @param company 企业
   * @param fromYear 开始年份
   * @param toYear 结束年份
   * @param fromMonth 开始月份
   * @param toMonth 结束月份
   * @param category 业态, 和company至少一个
   * @param product 产品, 和company至少一个
   */
  function getKeyIndexData(
    keyIndex: "营收" | "利润",
    timeScale: "年" | "月",
    fromYear: number,
    toYear: number,
    fromMonth: number,
    toMonth: number,
    company?: string,
    category?: string,
    product?: string
  ) {
    const dataBase = revenueData;
    const table = dataBase[keyIndex];
    /**
     * 在同一时间维度下，根据当前驾驶舱规划页面有几种聚合查询可能
     * 1. company + category 需要根据enterpriseRelationData先获取所有的后代企业(非叶子节点)或者自己，然后根据productRelationData获取所有后代产品(非叶子节点)或者自己，然后根据table进行聚合
     * 2. company + product 需要根据enterpriseRelationData先获取所有的后代企业(非叶子节点)或者自己，然后找到相应的产品，然后根据table进行聚合
     * 3. company 需要根据enterpriseRelationData先获取所有的后代企业(非叶子节点)或者自己，然后根据table获取相应时间维度数据进行聚合
     * 4. category 需要根据productRelationData获取所有后代产品(非叶子节点)或者自己，然后根据table获取相应时间维度数据进行聚合
     **/
    let rows: any[] = [];
    let result: TimeSpanDataResult = {
      timeSpan: timeScale,
      dataTime: `${toYear}-${toMonth}`,
      keyIndexType: keyIndex,
      org: company || "石化板块",
      productType: category,
      product: product,
      plan: 0,
      real: 0,
      accumulated: 0,
      pOverPRate: 0,
      pOverPValue: 0,
      pToPRate: 0,
      pToPValue: 0,
    };
    const companyCode = 0x00000001;
    const categoryCode = 0x00000010;
    const productCode = 0x00000100;
    const companyAndCategoryCode = companyCode | categoryCode;
    const companyAndProductCode = companyCode | productCode;
    const categoryAndProductCode = categoryCode | productCode;
    const companyAndCategoryAndProductCode =
      companyAndCategoryCode | productCode;
    const queryCode = company
      ? category
        ? product
          ? companyAndCategoryAndProductCode
          : companyAndCategoryCode
        : product
          ? companyAndProductCode
          : companyCode
      : category
        ? product
          ? categoryAndProductCode
          : categoryCode
        : productCode;
    // 如果包含了company，则获取所有后代企业(非叶子节点)或者自己
    if (queryCode & companyCode) {
      // 获取所有后代企业(非叶子节点)或者自己
      const children = dfsSearch(enterpriseRelationData, company!, (data) => {
        return getLeafNodes(data);
      });
      // 用fromYear toYear fromMonth toMonth 构造区间内每个月份
      const months = [];
      // 如果fromYear和toYear相同，则只取fromMonth到toMonth
      if (fromYear === toYear) {
        for (let month = fromMonth; month <= toMonth; month++) {
          months.push(`${fromYear}-${month.toString().padStart(2, "0")}`);
        }
      } else {
        // 如果fromYear和toYear不同，则取fromMonth到12月，然后取中间年份的1月到12月，然后取toYear的1月到toMonth
        for (let month = fromMonth; month <= 12; month++) {
          months.push(`${fromYear}-${month.toString().padStart(2, "0")}`);
        }
        for (let year = fromYear + 1; year < toYear; year++) {
          for (let month = 1; month <= 12; month++) {
            months.push(`${year}-${month.toString().padStart(2, "0")}`);
          }
        }
        for (let month = 1; month <= toMonth; month++) {
          months.push(`${toYear}-${month.toString().padStart(2, "0")}`);
        }
      }
      // 根据[keyIndex][month][company]构造rows
      for (const month of months) {
        for (const child of children) {
          if (table[month] && table[month][child]) {
            // TODO 此时索引到的是一个对象，需要根据productRelationData获取所有后代产品(非叶子节点)或者自己，然后根据table进行聚合
            // const productChildren = dfsSearch(productRelationData, child, (data) => {
            //   return getLeafNodes(data);
            // });
            // 直接将所有所有包含的key加入rows
            for (const product of Object.keys(table[month][child])) {
              rows.push({
                ...table[month][child][product],
                产品: product,
              });
            }
          }
        }
      }
      if ((queryCode & companyAndCategoryCode) === companyAndCategoryCode) {
        const productChildren = dfsSearch(
          productRelationData,
          category!,
          (data) => {
            return getLeafNodes(data);
          }
        );
        // 过滤掉rows中productChildren中不包含的key
        rows = rows.filter((item) => {
          return productChildren.includes(item.产品);
        });
      }
      // 先构造以月份为key的monthResult
      const monthResult: Record<string, TimeSpanDataResult> = {};
      for (const row of rows) {
        if (!monthResult[row.数据时间]) {
          monthResult[row.数据时间] = {
            timeSpan: "月",
            dataTime: row.数据时间,
            keyIndexType: keyIndex,
            org: row.组织名,
            productType: row.产品类型,
            product: row.产品,
            plan: 0,
            real: 0,
            accumulated: 0,
            pOverPRate: 0,
            pOverPValue: 0,
            pToPRate: 0,
            pToPValue: 0,
            subData: [],
          };
        }
        monthResult[row.数据时间].subData!.push({
          dataTime: row.数据时间,
          org: row.组织名,
          productType: row.产品类型,
          product: row.产品,
          plan: row.当期计划值,
          real: row.当期实际值,
          accumulated: row.累计值,
          pOverPRate: row.环比,
          pOverPValue: row.环比增幅,
          pToPRate: row.同比,
          pToPValue: row.同比增幅,
        } as TimeSpanDataResult);
      }
      // 聚合monthResult计算得到几个聚合值
      for (const month of Object.keys(monthResult)) {
        const monthData = monthResult[month];
        result.plan += monthData.subData!.reduce(
          (acc: number, row: any) => acc + row.plan,
          0
        );
        result.real += monthData.subData!.reduce(
          (acc: number, row: any) => acc + row.real,
          0
        );
        result.accumulated += monthData.subData!.reduce(
          (acc: number, row: any) => acc + row.accumulated,
          0
        );
      }
      // TODO 根据上一期计算同比增幅

      const monthResultValues = Object.values(monthResult).sort((a, b) => {
        return new Date(a.dataTime) > new Date(b.dataTime) ? 1 : -1;
      });
      // 计算环比增幅与比例（减去上个月 、除以上个月）
      for (let i = 0; i < monthResultValues.length; i++) {
        const current = monthResultValues[i];
        const previous = monthResultValues[i - 1];
        if (previous) {
          current.pOverPRate = (current.real - previous.real) / previous.real;
          current.pOverPValue = current.real - previous.real;
        }
      }
      // 如果timeScale为年，则将monthResultValues中的数据聚合到result中
      if (timeScale === "年") {
        result.subData = [];
        for (const month of monthResultValues) {
          result.plan += month.plan;
          result.real += month.real;
          result.accumulated += month.accumulated;
          result.subData.push(month);
        }
      } else {
        result = monthResultValues[monthResultValues.length - 1];
      }
    } else if ((queryCode & productCode) === productCode) {
      // 先根据productRelationData获取所有后代产品(非叶子节点)或者自己
      const productChildren = dfsSearch(
        productRelationData,
        product!,
        (data) => {
          return getLeafNodes(data);
        }
      );
      // 根据fromYear toYear fromMonth toMonth 构造区间内每个月份
      const months = [];
      // 如果fromYear和toYear相同，则只取fromMonth到toMonth
      // 如果fromYear和toYear相同，则只取fromMonth到toMonth
      if (fromYear === toYear) {
        for (let month = fromMonth; month <= toMonth; month++) {
          months.push(`${fromYear}-${month.toString().padStart(2, "0")}`);
        }
      } else {
        // 如果fromYear和toYear不同，则取fromMonth到12月，然后取中间年份的1月到12月，然后取toYear的1月到toMonth
        for (let month = fromMonth; month <= 12; month++) {
          months.push(`${fromYear}-${month.toString().padStart(2, "0")}`);
        }
        for (let year = fromYear + 1; year < toYear; year++) {
          for (let month = 1; month <= 12; month++) {
            months.push(`${year}-${month.toString().padStart(2, "0")}`);
          }
        }
        for (let month = 1; month <= toMonth; month++) {
          months.push(`${toYear}-${month.toString().padStart(2, "0")}`);
        }
      }
      // 根据[keyIndex][month][company]构造rows, 将所有company的productChildren的key加入rows
      // 并筛选出rows中productChildren中包含的key
      for (const month of months) {
        for (const company of Object.keys(table[month])) {
          // 直接筛选出productChildren中包含的key
          const productToAdd = Object.keys(table[month][company]).filter(
            (product) => {
              return productChildren.includes(product);
            }
          );
          rows.push(
            ...productToAdd.map((product) => {
              return {
                ...table[month][company][product],
                产品: product,
              };
            })
          );
        }
      }
    }
    return result;
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
  ) {
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
