// 合同报表模拟数据库

// mock基础是[企业,合同类型]月报

const orgList = [
  "广投石化本部",
  "广投石化广东分公司",
  "广投石化舟山",
  "永盛仓储",
  "桂盛桂轩",
  // "开燃公司",
  "恒润公司",
];

const contractTypeList = [
  "国际海运",
  "内陆船运",
  "采购合同",
  "销售合同",
  "仓储合同",
  "其他服务合同",
];

const flatOrgTree = {
  石化板块: {
    name: "石化板块",
    // 是否有独立统计
    isIndependent: false,
    parent: null,
    // children: ["广投石化", "桂盛桂轩", "开燃公司", "恒润公司"],
    children: ["广投石化", "桂盛桂轩", "恒润公司"],
  },
  广投石化: {
    name: "广投石化",
    // 是否有独立统计
    isIndependent: false,
    parent: "石化板块",
    children: ["广投石化本部", "广投石化广东分公司", "永盛仓储"],
  },
  广投石化本部: {
    name: "广投石化本部",
    parent: "广投石化",
    isIndependent: true,
  },
  广投石化广东分公司: {
    name: "广投石化广东分公司",
    parent: "广投石化",
    isIndependent: true,
  },
  永盛仓储: {
    name: "永盛仓储",
    parent: "广投石化",
    isIndependent: true,
  },
  桂盛桂轩: {
    name: "桂盛桂轩",
    parent: "石化板块",
    isIndependent: true,
  },
  // 开燃公司: {
  //   name: "开燃公司",
  //   parent: "石化板块",
  //   isIndependent: true,
  // },
  恒润公司: {
    name: "恒润公司",
    parent: "石化板块",
    isIndependent: true,
  },
};

interface ContractMonthReport {
  orgName: string;
  dataTime: string;
}

interface ContractMonthDetail {
  product?: string; // 产品
  type: string; // 合同类型
  name: string; // 企业名称
  dataTime: string; // 数据时间
  value: number; // 合同金额
  amount: number; // 合同数量
  count: number; // 合同总份数
  risk: number; // 风险合同数
  full: number; // 完成合同数
}

const mockTableData: ContractMonthDetail[] = [];

// 设置随机mock数据
const setRandomMockTableData = () => {
  const monthList = ["2025-01", "2025-02", "2025-03"];
  for (const month of monthList) {
    for (const org of orgList) {
      for (const type of contractTypeList) {
        mockTableData.push({
          type,
          name: org,
          dataTime: month,
          value: Math.random() * 10000,
          count: Math.floor(Math.random() * 100),
          risk: Math.floor(Math.random() * 10),
          full: Math.floor(Math.random() * 10),
          amount: Math.floor(Math.random() * 100),
        });
      }
    }
  }
};

interface ContractYearCache {
  byOrg: Record<string, any>;
  byType: Record<string, any>;
  byOrgAndType: Record<string, any>;
}

interface ContractMonthCache {
  byOrg: Record<string, any>;
  byType: Record<string, any>;
  byOrgAndType: Record<string, any>;
}

const contractMonthCache: ContractMonthCache = {
  byOrg: {},
  byType: {},
  byOrgAndType: {},
};

const contractYearCache: ContractYearCache = {
  byOrg: {},
  byType: {},
  byOrgAndType: {},
};

const clearContractYearCache = () => {
  contractYearCache.byOrg = {};
  contractYearCache.byType = {};
  contractYearCache.byOrgAndType = {};
};

const clearContractMonthCache = () => {
  contractMonthCache.byOrg = {};
  contractMonthCache.byType = {};
  contractMonthCache.byOrgAndType = {};
};

const initContractYearCache = () => {
  clearContractYearCache();
  aggregateYearData(mockTableData);
};

const initContractMonthCache = () => {
  clearContractMonthCache();
  aggregateMonthData(mockTableData);
};

// 聚合数据
const aggregateMonthData = (data: ContractMonthDetail[]) => {
  const byOrg = aggregateMonthDataByOrg(data);
  const byType = aggregateMonthDataByType(data);
  const byOrgAndType = aggregateMonthDataByOrgAndType(data);
  contractMonthCache.byOrg = byOrg;
  contractMonthCache.byType = byType;
  contractMonthCache.byOrgAndType = byOrgAndType;
};

const aggregateYearData = (data: ContractMonthDetail[]) => {
  const byOrg = aggregateYearDataByOrg(data);
  const byType = aggregateYearDataByType(data);
  const byOrgAndType = aggregateYearDataByOrgAndType(data);
  contractYearCache.byOrg = byOrg;
  contractYearCache.byType = byType;
  contractYearCache.byOrgAndType = byOrgAndType;
};

const aggregateMonthDataByOrg = (data: ContractMonthDetail[]) => {
  const byOrg: any = {};
  for (const item of data) {
    if (!byOrg[item.dataTime]) {
      byOrg[item.dataTime] = {};
    }
    if (!byOrg[item.dataTime][item.name]) {
      byOrg[item.dataTime][item.name] = {
        dataTime: item.dataTime,
        type: "",
        name: item.name,
        subData: [],
        count: 0,
        value: 0,
        amount: 0,
        risk: 0,
        full: 0,
      };
    }
    byOrg[item.dataTime][item.name].subData.push(item);
    byOrg[item.dataTime][item.name].count += item.count;
    byOrg[item.dataTime][item.name].value += item.value;
    byOrg[item.dataTime][item.name].amount += item.amount;
    byOrg[item.dataTime][item.name].risk += item.risk;
    byOrg[item.dataTime][item.name].full += item.full;
  }
  return byOrg;
};

const aggregateMonthDataByType = (data: ContractMonthDetail[]) => {
  const byType: any = {};
  for (const item of data) {
    if (!byType[item.dataTime]) {
      byType[item.dataTime] = {};
    }
    if (!byType[item.dataTime][item.type]) {
      byType[item.dataTime][item.type] = {
        dataTime: item.dataTime,
        type: item.type,
        name: item.name,
        subData: [],
        count: 0,
        value: 0,
        amount: 0,
        risk: 0,
        full: 0,
      };
    }
    byType[item.dataTime][item.type].subData.push(item);
    byType[item.dataTime][item.type].count += item.count;
    byType[item.dataTime][item.type].value += item.value;
    byType[item.dataTime][item.type].amount += item.amount;
    byType[item.dataTime][item.type].risk += item.risk;
    byType[item.dataTime][item.type].full += item.full;
  }
  return byType;
};

// 根据公司与类型聚合数据
const aggregateMonthDataByOrgAndType = (data: ContractMonthDetail[]) => {
  const byOrgAndType: any = {};
  for (const item of data) {
    if (!byOrgAndType[item.dataTime]) {
      byOrgAndType[item.dataTime] = {};
    }
    if (!byOrgAndType[item.dataTime][item.name]) {
      byOrgAndType[item.dataTime][item.name] = {};
    }
    if (!byOrgAndType[item.dataTime][item.name][item.type]) {
      byOrgAndType[item.dataTime][item.name][item.type] = {
        dataTime: item.dataTime,
        type: item.type,
        name: item.name,
        subData: [],
        count: 0,
        value: 0,
        amount: 0,
        risk: 0,
        full: 0,
      };
    }
    byOrgAndType[item.dataTime][item.name][item.type].subData.push(item);
    byOrgAndType[item.dataTime][item.name][item.type].count += item.count;
    byOrgAndType[item.dataTime][item.name][item.type].value += item.value;
    byOrgAndType[item.dataTime][item.name][item.type].amount += item.amount;
    byOrgAndType[item.dataTime][item.name][item.type].risk += item.risk;
    byOrgAndType[item.dataTime][item.name][item.type].full += item.full;
  }
  return byOrgAndType;
};

const aggregateYearDataByOrg = (data: ContractMonthDetail[]) => {
  const byOrg: any = {};
  // 聚合月数据
  const monthData = contractMonthCache.byOrg;
  for (const [month, data] of Object.entries(monthData)) {
    const year = month.split("-")[0];
    if (!byOrg[year]) {
      byOrg[year] = {};
    }
    for (const [org, typeData] of Object.entries(data)) {
      if (!byOrg[year][org]) {
        byOrg[year][org] = {
          dataTime: year,
          type: "",
          name: org,
          subData: [],
          count: 0,
          value: 0,
          amount: 0,
          risk: 0,
          full: 0,
        };
      }
      byOrg[year][org].subData.push(typeData);
      byOrg[year][org].count += typeData.count;
      byOrg[year][org].value += typeData.value;
      byOrg[year][org].amount += typeData.amount;
      byOrg[year][org].risk += typeData.risk;
      byOrg[year][org].full += typeData.full;
    }
  }
  return byOrg;
};

const aggregateYearDataByType = (data: ContractMonthDetail[]) => {
  const byType: any = {};
  for (const item of data) {
    const year = item.dataTime.split("-")[0];
    if (!byType[year]) {
      byType[year] = {};
    }
    if (!byType[year][item.type]) {
      byType[year][item.type] = {
        dataTime: year,
        type: item.type,
        name: item.name,
        subData: [],
        count: 0,
        value: 0,
        amount: 0,
        risk: 0,
        full: 0,
      };
    }
    byType[year][item.type].subData.push(item);
    byType[year][item.type].count += item.count;
    byType[year][item.type].value += item.value;
    byType[year][item.type].amount += item.amount;
    byType[year][item.type].risk += item.risk;
    byType[year][item.type].full += item.full;
  }
  return byType;
};

const aggregateYearDataByOrgAndType = (data: ContractMonthDetail[]) => {
  const byOrgAndType: any = {};
  for (const item of data) {
    const year = item.dataTime.split("-")[0];
    if (!byOrgAndType[year]) {
      byOrgAndType[year] = {};
    }
    if (!byOrgAndType[year][item.name]) {
      byOrgAndType[year][item.name] = {};
    }
    if (!byOrgAndType[year][item.name][item.type]) {
      byOrgAndType[year][item.name][item.type] = {
        dataTime: year,
        type: item.type,
        name: item.name,
        subData: [],
        count: 0,
        value: 0,
        amount: 0,
        risk: 0,
        full: 0,
      };
    }
    byOrgAndType[year][item.name][item.type].subData.push(item);
    byOrgAndType[year][item.name][item.type].count += item.count;
    byOrgAndType[year][item.name][item.type].value += item.value;
    byOrgAndType[year][item.name][item.type].amount += item.amount;
    byOrgAndType[year][item.name][item.type].risk += item.risk;
    byOrgAndType[year][item.name][item.type].full += item.full;
  }
  return byOrgAndType;
};

/**
 * 深度优先聚合部门树上各企业的月数据
 * @param orgTree 部门树
 * @param data 数据
 * @returns
 */
const aggregateOrgTreeData = (
  orgTree: any,
  org: string,
  type: string,
  force: boolean = false,
  dataTime: string,
  timeScale: "月" | "年",
  mode: "org" | "type" | "orgAndType",
  cache: any
) => {
  switch (mode) {
    case "org":
      // 如果聚合结果已经存在且不强制更新，则跳过
      if (cache?.[dataTime]?.[org] && !force) {
        return cache[dataTime][org];
      }
      // 如果独立统计，则直接聚合
      if (orgTree[org].isIndependent) {
        return cache?.[dataTime]?.[org];
      }
      // 否则递归
      if (orgTree[org].children) {
        if (!cache[dataTime]) {
          cache[dataTime] = {};
        }
        if (!cache[dataTime][org]) {
          cache[dataTime][org] = {};
        }
        if (!cache[dataTime][org][type]) {
          cache[dataTime][org][type] = {
            dataTime,
            type,
            name: org,
            subData: [],
            count: 0,
            value: 0,
            amount: 0,
            risk: 0,
            full: 0,
          };
        }
        for (const child of orgTree[org].children) {
          const childData = aggregateOrgTreeData(
            orgTree,
            child,
            type,
            force,
            dataTime,
            timeScale,
            mode,
            cache
          );
          if (childData) {
            cache[dataTime][org].subData.push(childData);
            cache[dataTime][org].count += childData.count;
            cache[dataTime][org].value += childData.value;
            cache[dataTime][org].amount += childData.amount;
            cache[dataTime][org].risk += childData.risk;
            cache[dataTime][org].full += childData.full;
          }
        }
      }
      // break;
      return cache[dataTime][org];
    case "type":
      // break;
      return cache[dataTime][type];
    case "orgAndType":
      // 如果聚合结果已经存在且不强制更新，则跳过
      if (cache?.[dataTime]?.[org]?.[type] && !force) {
        return cache[dataTime][org][type];
      }
      // 如果独立统计，则直接聚合
      if (orgTree[org].isIndependent) {
        return cache?.[dataTime]?.[org];
      }
      // 否则递归
      if (orgTree[org].children) {
        if (!cache[dataTime]) {
          cache[dataTime] = {};
        }
        if (!cache[dataTime][org]) {
          cache[dataTime][org] = {};
        }
        if (!cache[dataTime][org][type]) {
          cache[dataTime][org][type] = {
            dataTime,
            type,
            name: org,
            subData: [],
            count: 0,
            value: 0,
            amount: 0,
            risk: 0,
            full: 0,
          };
        }
        for (const child of orgTree[org].children) {
          const childData = aggregateOrgTreeData(
            orgTree,
            child,
            type,
            force,
            dataTime,
            timeScale,
            mode,
            cache
          );
          if (childData) {
            cache[dataTime][org][type].subData.push(childData);
            cache[dataTime][org][type].count += childData.count;
            cache[dataTime][org][type].value += childData.value;
            cache[dataTime][org][type].amount += childData.amount;
            cache[dataTime][org][type].risk += childData.risk;
            cache[dataTime][org][type].full += childData.full;
          }
        }
      }
      // break;
      return cache[dataTime][org][type];
  }
  // console.log(org, orgTree[org], cache[dataTime][org]);
};

/**
 * 初始化合同数据库
 * @returns
 */
const initCache = () => {
  setRandomMockTableData();
  initContractMonthCache();
  initContractYearCache();
  return {
    monthCache: contractMonthCache,
    yearCache: contractYearCache,
  };
};

/**
 * 统一查询入口
 * TODO 考虑org有父子关系，需要递归查询后组装结果
 * @param dataTime 数据时间
 * @param orgName 企业名称
 * @param contractType 合同类型
 * @returns
 */
const queryAggregateContractData = (
  timeScale: "月" | "年",
  dataTime: string,
  orgName?: string,
  contractType?: string
) => {
  const cache = timeScale === "月" ? contractMonthCache : contractYearCache;
  if (orgName) {
    if (orgName && contractType) {
      return aggregateOrgTreeData(
        flatOrgTree,
        orgName,
        contractType,
        false,
        dataTime,
        timeScale,
        "orgAndType",
        cache.byOrgAndType
      );
    }
    return aggregateOrgTreeData(
      flatOrgTree,
      orgName,
      "",
      false,
      dataTime,
      timeScale,
      "org",
      cache.byOrg
    );
  }
  if (contractType) {
    return cache.byType[dataTime][contractType];
  }
  return;
};

export {
  initCache,
  clearContractYearCache,
  clearContractMonthCache,
  type ContractMonthCache,
  type ContractYearCache,
  queryAggregateContractData,
};
