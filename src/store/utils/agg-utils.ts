// 1.另起数据库服务
// 2. 每次查询的缓存不存在时初始化 + 手动重新计算
// 3. 直接构造随机数据

interface ProductData {
  指标类型: string;
  公司: string;
  产品类型?: string;
  产品: string;
  组织名: string;
  数据时间: string;
  数据类型: string;
  当期计划值: number;
  当期实际值: number;
  累计值: number;
  环比: number;
  同比增长: number;
  同比增幅: number | string;
}

// 聚合后的数据结构
interface AggregatedData {
  指标类型: string; // 营收、利润等
  维度类型: string; // 组织、产品类型、公司、产品
  维度值: string; // 具体的组织名、产品类型名等
  时间维度: string; // 年、月
  数据时间: string; // 具体时间 2025-01、2025等
  计划值: number;
  实际值: number;
  累计值: number;
  环比率: number;
  环比值: number;
  同比率: number;
  同比值: number;
  // 子项: AggregatedData[]; // 嵌套子项数据
}

// 聚合后组装出来的数据结构
interface AggData {
  指标类型: string;
  维度类型: string;
  维度值: string;
  时间维度: string;
  数据时间: string;
  计划值: number;
  实际值: number;
  累计值: number;
  环比率: number;
  环比值: number;
  同比率: number;
  同比值: number;
  subTimeData?: AggData[]; // 嵌套子项数据
  subProductData?: AggData[]; // 嵌套子项数据
  subProductTypeData?: AggData[]; // 嵌套子项数据
}

// 组织到企业的映射
const orgToEnterpriseMap: Record<string, string[]> = {
  石化板块: [
    "广投石化本部",
    "广投石化广东分公司",
    "广投石化舟山",
    "永盛仓储",
    "开燃公司",
    "恒润公司",
    "桂盛桂轩",
  ],
  广投石化: ["广投石化本部", "广投石化广东分公司", "广投石化舟山", "永盛仓储"],
  桂盛桂轩: ["桂盛桂轩"],
  开燃公司: ["开燃公司"],
  恒润公司: ["恒润公司"],
};

// 产品类型到产品的映射(tag)
const productTypeToProductMap: Record<string, string[]> = {
  成品油: ["#92汽油", "#95汽油", "#98汽油", "#0柴油"],
  原油类: ["原油产品"],
  化工类: ["化工产品"],
  天然气类: ["天然气产品"],
  其他类: ["其他产品"],
  汽油: ["#92汽油", "#95汽油", "#98汽油"],
  柴油: ["#0柴油"],
};

// 反向映射：公司到组织的映射
const enterpriseToOrgMap: Record<string, string[]> = {};

// 反向映射：产品到产品类型的映射
const productToProductTypeMap: Record<string, string[]> = {};

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

// 组织类型映射
const organizationTypes = {
  石化板块: ["广投石化", "桂盛桂轩", "开燃公司", "恒润公司"],
  成品油: ["汽油", "柴油"],
  原油: ["原油产品"],
};

function initReverseMap() {
  // 反向映射：公司到组织的映射
  for (const [enterprise, orgs] of Object.entries(orgToEnterpriseMap)) {
    for (const org of orgs) {
      if (!enterpriseToOrgMap[org]) {
        enterpriseToOrgMap[org] = [];
      }
      enterpriseToOrgMap[org].push(enterprise);
    }
  }

  // 反向映射：产品到产品类型的映射
  for (const [productType, products] of Object.entries(
    productTypeToProductMap
  )) {
    for (const product of products) {
      if (!productToProductTypeMap[product]) {
        productToProductTypeMap[product] = [];
      }
      productToProductTypeMap[product].push(productType);
    }
  }
}

// 缓存结构
// 年度数据缓存
interface YearCache {
  // 按组织维度缓存
  byOrg: Record<string, Record<string, Record<string, AggregatedData>>>; // 指标类型 -> 组织 -> 年份 -> 数据

  // 按产品类型维度缓存
  byProductType: Record<string, Record<string, Record<string, AggregatedData>>>; // 指标类型 -> 产品类型 -> 年份 -> 数据

  // 按公司维度缓存
  byCompany: Record<string, Record<string, Record<string, AggregatedData>>>; // 指标类型 -> 公司 -> 年份 -> 数据

  // 按产品维度缓存
  byProduct: Record<string, Record<string, Record<string, AggregatedData>>>; // 指标类型 -> 产品 -> 年份 -> 数据

  // 按组织和产品类型联合维度缓存
  byOrgAndProductType: Record<
    string,
    Record<string, Record<string, Record<string, AggregatedData>>>
  >; // 指标类型 -> 组织 -> 产品类型 -> 年份 -> 数据
}

// 月度数据缓存
interface MonthCache {
  // 按组织维度缓存
  byOrg: Record<string, Record<string, Record<string, AggregatedData>>>; // 指标类型 -> 组织 -> 月份 -> 数据

  // 按产品类型维度缓存
  byProductType: Record<string, Record<string, Record<string, AggregatedData>>>; // 指标类型 -> 产品类型 -> 月份 -> 数据

  // 按公司维度缓存
  byCompany: Record<string, Record<string, Record<string, AggregatedData>>>; // 指标类型 -> 公司 -> 月份 -> 数据

  // 按产品维度缓存
  byProduct: Record<string, Record<string, Record<string, AggregatedData>>>; // 指标类型 -> 产品 -> 月份 -> 数据

  // 按组织和产品类型联合维度缓存
  byOrgAndProductType: Record<
    string,
    Record<string, Record<string, Record<string, AggregatedData>>>
  >; // 指标类型 -> 组织 -> 产品类型 -> 月份 -> 数据
}

// 初始化缓存
const yearCache: YearCache = {
  byOrg: {},
  byProductType: {},
  byCompany: {},
  byProduct: {},
  byOrgAndProductType: {},
};

const monthCache: MonthCache = {
  byOrg: {},
  byProductType: {},
  byCompany: {},
  byProduct: {},
  byOrgAndProductType: {},
};

// {
//   指标类型: string;
//   数据时间: string;
//   公司: string;
//   产品: string;
//   数据: ProductData;
// }
function flattenData(rawData: any): Array<ProductData> {
  const flattenedData: Array<ProductData> = [];
  // 遍历所有指标类型（营收、利润等）
  Object.keys(rawData).forEach((指标类型) => {
    const 指标数据 = rawData[指标类型];

    // 遍历所有时间点
    Object.keys(指标数据).forEach((时间点) => {
      const 时间数据 = 指标数据[时间点];

      // 遍历所有公司
      Object.keys(时间数据).forEach((公司名) => {
        const 公司数据 = 时间数据[公司名];

        // 遍历所有产品
        Object.keys(公司数据).forEach((产品名) => {
          const 产品数据 = 公司数据[产品名];

          // 添加到扁平数据中
          flattenedData.push({
            指标类型,
            数据时间: 时间点,
            公司: 公司名,
            产品: 产品名,
            组织名: 产品数据.组织名,
            产品类型: 产品数据.产品类型,
            当期计划值: 产品数据.当期计划值,
            当期实际值: 产品数据.当期实际值,
            累计值: 产品数据.累计值,
            环比: 产品数据.环比,
            同比增长: 产品数据.同比增长,
            同比增幅: 产品数据.同比增幅,
            数据类型: 产品数据.数据类型,
          });
        });
      });
    });
  });
  return flattenedData;
}

// 初始化月缓存
function initMonthCache(monthData: Record<string, any[]>) {
  Object.keys(monthData).forEach((month) => {
    const currentMonthData = monthData[month];

    // 按指标类型分组
    const groupedByType: Record<string, any[]> = {};
    currentMonthData.forEach((item) => {
      const keyIndexType = item.指标类型;
      if (!groupedByType[keyIndexType]) {
        groupedByType[keyIndexType] = [];
      }
      groupedByType[keyIndexType].push(item);
    });

    // 按组织维度分组
    Object.keys(groupedByType).forEach((keyIndexType) => {
      const currentKeyIndexTypeData = groupedByType[keyIndexType];

      // 1. 按组织维度聚合
      buildMonthOrgCache(keyIndexType, month, currentKeyIndexTypeData);

      // 2. 按产品类型维度聚合
      buildMonthProductTypeCache(keyIndexType, month, currentKeyIndexTypeData);

      // 3. 按公司维度聚合
      buildMonthCompanyCache(keyIndexType, month, currentKeyIndexTypeData);

      // 4. 按产品维度聚合
      buildMonthProductCache(keyIndexType, month, currentKeyIndexTypeData);

      // 5. 按组织和产品类型联合维度聚合
      buildMonthOrgAndProductTypeCache(
        keyIndexType,
        month,
        currentKeyIndexTypeData
      );
    });
  });
}

// 初始化年缓存
function initYearCache(yearData: Record<string, any[]>, rawData: any[]) {
  Object.keys(yearData).forEach((year) => {
    const currentYearData = yearData[year];

    if (currentYearData.length > 0) {
      const groupedByType: Record<string, any[]> = {};
      currentYearData.forEach((item) => {
        const keyIndexType = item.指标类型;
        if (!groupedByType[keyIndexType]) {
          groupedByType[keyIndexType] = [];
        }
      });

      Object.keys(groupedByType).forEach((keyIndexType) => {
        const currentKeyIndexTypeData = groupedByType[keyIndexType];

        // 1. 按组织维度聚合
        buildYearOrgCache(keyIndexType, year, currentKeyIndexTypeData);

        // 2. 按产品类型维度聚合
        buildYearProductTypeCache(keyIndexType, year, currentKeyIndexTypeData);

        // 3. 按公司维度聚合
        buildYearCompanyCache(keyIndexType, year, currentKeyIndexTypeData);

        // 4. 按产品维度聚合
        buildYearProductCache(keyIndexType, year, currentKeyIndexTypeData);
      });
    }
  });

  const allYears = [
    ...new Set(rawData.map((item) => item.数据时间.split("-")[0])),
  ];

  allYears.forEach((year) => {
    // 筛选该年份的所有月度数据
    const yearData = rawData.filter((item) => item.数据时间.startsWith(year));

    if (yearData.length > 0) {
      // 按指标类型分组
      const groupedByType: Record<string, any[]> = {};
      yearData.forEach((item) => {
        if (!groupedByType[item.指标类型]) groupedByType[item.指标类型] = [];
        groupedByType[item.指标类型].push(item);
      });

      // 处理每个指标类型的数据
      Object.keys(groupedByType).forEach((keyIndexType) => {
        const currentKeyIndexTypeData = groupedByType[keyIndexType];

        // 从月度数据聚合年度数据
        // 聚合月度到年度(指标类型, 年份, 指标数据);

        // 1. 按组织维度聚合
        buildYearOrgCache(keyIndexType, year, currentKeyIndexTypeData);

        // 2. 按产品类型维度聚合
        buildYearProductTypeCache(keyIndexType, year, currentKeyIndexTypeData);

        // 3. 按公司维度聚合
        buildYearCompanyCache(keyIndexType, year, currentKeyIndexTypeData);

        // // 4. 按产品维度聚合
        buildYearProductCache(keyIndexType, year, currentKeyIndexTypeData);
      });
    }
  });
}

// 构建年度组织维度缓存
function buildYearOrgCache(keyIndexType: string, year: string, data: any[]) {
  if (!yearCache.byOrg[keyIndexType]) {
    yearCache.byOrg[keyIndexType] = {};
  }
  // 按组织分类
  const orgDataMap: Record<string, any[]> = {};

  data.forEach((item) => {
    const enterprise = item.公司;
    const org = enterpriseToOrgMap[enterprise] || [];

    org.forEach((org) => {
      if (!orgDataMap[org]) {
        orgDataMap[org] = [];
      }
      orgDataMap[org].push(item);
    });
  });

  // 按组织维度聚合
  Object.keys(orgDataMap).forEach((org) => {
    if (!yearCache.byOrg[keyIndexType][org]) {
      yearCache.byOrg[keyIndexType][org] = {};
    }

    // 构建组织级数据
    const orgAggData: AggregatedData = {
      指标类型: keyIndexType,
      维度类型: "组织",
      维度值: org,
      时间维度: "年",
      数据时间: year,
      计划值: 0,
      实际值: 0,
      累计值: 0,
      环比率: 0,
      环比值: 0,
      同比率: 0,
      同比值: 0,
    };
    // 从相应的月度数据中获取组织级数据
    const monthDatas = monthCache.byOrg[keyIndexType][org];

    Object.keys(monthDatas)
      .filter((month) => month.startsWith(year))
      .forEach((month) => {
        const monthData = monthDatas[month];
        orgAggData.计划值 += monthData.计划值;
        orgAggData.实际值 += monthData.实际值;
        orgAggData.累计值 += monthData.累计值;
      });

    yearCache.byOrg[keyIndexType][org][year] = orgAggData;
  });
}
// 构建月度组织维度缓存
function buildMonthOrgCache(keyIndexType: string, month: string, data: any[]) {
  if (!monthCache.byOrg[keyIndexType]) {
    monthCache.byOrg[keyIndexType] = {};
  }
  // 按组织分类
  const orgDataMap: Record<string, any[]> = {};

  data.forEach((item) => {
    const enterprise = item.公司;
    const org = enterpriseToOrgMap[enterprise] || [];

    org.forEach((org) => {
      if (!orgDataMap[org]) {
        orgDataMap[org] = [];
      }
      orgDataMap[org].push(item);
    });
  });

  // 按组织维度聚合
  Object.keys(orgDataMap).forEach((org) => {
    const orgDataRows = orgDataMap[org];
    if (!monthCache.byOrg[keyIndexType][org]) {
      monthCache.byOrg[keyIndexType][org] = {};
    }

    // 聚合公司级数据
    const companyDataMap: Record<string, AggregatedData> = {};
    orgDataRows.forEach((item) => {
      const company = item.公司;

      if (!companyDataMap[company]) {
        companyDataMap[company] = {
          指标类型: keyIndexType,
          维度类型: "公司",
          维度值: company,
          时间维度: "月",
          数据时间: month,
          计划值: 0,
          实际值: 0,
          累计值: 0,
          环比率: 0,
          环比值: 0,
          同比率: 0,
          同比值: 0,
        };
      }

      // 累加数值
      companyDataMap[company].实际值 += item.当期实际值;
      companyDataMap[company].累计值 += item.累计值;
      companyDataMap[company].计划值 += item.当期计划值;
    });

    // 构建组织级数据
    const orgAggData: AggregatedData = {
      指标类型: keyIndexType,
      维度类型: "组织",
      维度值: org,
      时间维度: "月",
      数据时间: month,
      计划值: 0,
      实际值: 0,
      累计值: 0,
      环比率: 0,
      环比值: 0,
      同比率: 0,
      同比值: 0,
    };

    // 将组织级数据添加到缓存中
    Object.values(companyDataMap).forEach((companyData) => {
      orgAggData.计划值 += companyData.计划值;
      orgAggData.实际值 += companyData.实际值;
      orgAggData.累计值 += companyData.累计值;
      orgAggData.环比率 += companyData.环比率;
      orgAggData.环比值 += companyData.环比值;
      orgAggData.同比率 += companyData.同比率;
      orgAggData.同比值 += companyData.同比值;
    });

    monthCache.byOrg[keyIndexType][org][month] = orgAggData;
  });
}

// 构建年度产品类型维度缓存
function buildYearProductTypeCache(
  keyIndexType: string,
  year: string,
  data: any[]
) {
  if (!yearCache.byProductType[keyIndexType]) {
    yearCache.byProductType[keyIndexType] = {};
  }

  // 按产品类型分组
  const productTypeDataMap: Record<string, any[]> = {};
  data.forEach((item) => {
    const product = item.产品;
    const productTypes = productToProductTypeMap[product] || [];
    productTypes.forEach((productType) => {
      if (!productTypeDataMap[productType]) {
        productTypeDataMap[productType] = [];
      }
      productTypeDataMap[productType].push(item);
    });
  });

  // 按产品类型维度聚合
  Object.keys(productTypeDataMap).forEach((productType) => {
    if (!yearCache.byProductType[keyIndexType][productType]) {
      yearCache.byProductType[keyIndexType][productType] = {};
    }

    // 构建产品类型级数据
    const productTypeAggData: AggregatedData = {
      指标类型: keyIndexType,
      维度类型: "产品类型",
      维度值: productType,
      时间维度: "年",
      数据时间: year,
      计划值: 0,
      实际值: 0,
      累计值: 0,
      环比率: 0,
      环比值: 0,
      同比率: 0,
      同比值: 0,
    };

    // 从相应的月度数据中获取产品类型级数据
    const monthDatas = monthCache.byProductType[keyIndexType][productType];

    Object.keys(monthDatas)
      .filter((month) => month.startsWith(year))
      .forEach((month) => {
        const monthData = monthDatas[month];
        productTypeAggData.计划值 += monthData.计划值;
        productTypeAggData.实际值 += monthData.实际值;
        productTypeAggData.累计值 += monthData.累计值;
      });

    yearCache.byProductType[keyIndexType][productType][year] =
      productTypeAggData;
  });
}

// 构建月度产品类型维度缓存(类似组织维度)
// 1. 将flatData按产品类型分组
// 2. 按产品类型维度聚合，子项为产品
// 3. 将聚合后的产品类型数据添加到缓存中
function buildMonthProductTypeCache(
  keyIndexType: string,
  month: string,
  data: any[]
) {
  if (!monthCache.byProductType[keyIndexType]) {
    monthCache.byProductType[keyIndexType] = {};
  }

  // 按产品类型分组
  const productTypeDataMap: Record<string, any[]> = {};
  data.forEach((item) => {
    const product = item.产品;
    const productTypes = productToProductTypeMap[product] || [];
    productTypes.forEach((productType) => {
      if (!productTypeDataMap[productType]) {
        productTypeDataMap[productType] = [];
      }
      productTypeDataMap[productType].push(item);
    });
  });

  // 按产品类型维度聚合
  Object.keys(productTypeDataMap).forEach((productType) => {
    const productTypeDataRows = productTypeDataMap[productType];
    if (!monthCache.byProductType[keyIndexType][productType]) {
      monthCache.byProductType[keyIndexType][productType] = {};
    }

    // 聚合产品级数据
    const productDataMap: Record<string, AggregatedData> = {};
    productTypeDataRows.forEach((item) => {
      const product = item.产品名;
      if (!productDataMap[product]) {
        productDataMap[product] = {
          指标类型: keyIndexType,
          维度类型: "产品",
          维度值: product,
          时间维度: "月",
          数据时间: month,
          计划值: 0,
          实际值: 0,
          累计值: 0,
          环比率: 0,
          环比值: 0,
          同比率: 0,
          同比值: 0,
        };
      }

      // 累加数值
      productDataMap[product].实际值 += item.当期实际值;
      productDataMap[product].累计值 += item.累计值;
      productDataMap[product].计划值 += item.当期计划值;
    });

    // 构建产品类型级数据
    const productTypeAggData: AggregatedData = {
      指标类型: keyIndexType,
      维度类型: "产品类型",
      维度值: productType,
      时间维度: "月",
      数据时间: month,
      计划值: 0,
      实际值: 0,
      累计值: 0,
      环比率: 0,
      环比值: 0,
      同比率: 0,
      同比值: 0,
    };

    // 将产品类型级数据添加到缓存中
    Object.values(productDataMap).forEach((productData) => {
      productTypeAggData.计划值 += productData.计划值;
      productTypeAggData.实际值 += productData.实际值;
      productTypeAggData.累计值 += productData.累计值;
    });

    monthCache.byProductType[keyIndexType][productType][month] =
      productTypeAggData;
  });
}

// 构建年度公司维度缓存
function buildYearCompanyCache(
  keyIndexType: string,
  year: string,
  data: any[]
) {
  if (!yearCache.byCompany[keyIndexType]) {
    yearCache.byCompany[keyIndexType] = {};
  }
  // 按公司维度分组
  const companyDataMap: Record<string, any[]> = {};
  data.forEach((item) => {
    const company = item.公司;
    if (!companyDataMap[company]) {
      companyDataMap[company] = [];
    }
    companyDataMap[company].push(item);
  });

  // 按公司维度聚合
  Object.keys(companyDataMap).forEach((company) => {
    if (!yearCache.byCompany[keyIndexType][company]) {
      yearCache.byCompany[keyIndexType][company] = {};
    }
    const companyAggData: AggregatedData = {
      指标类型: keyIndexType,
      维度类型: "公司",
      维度值: company,
      时间维度: "年",
      数据时间: year,
      计划值: 0,
      实际值: 0,
      累计值: 0,
      环比率: 0,
      环比值: 0,
      同比率: 0,
      同比值: 0,
    };

    // 从相应的月度数据中获取公司级数据
    const monthDatas = monthCache.byCompany[keyIndexType][company];

    Object.keys(monthDatas)
      .filter((month) => month.startsWith(year))
      .forEach((month) => {
        const monthData = monthDatas[month];
        companyAggData.计划值 += monthData.计划值;
        companyAggData.实际值 += monthData.实际值;
        companyAggData.累计值 += monthData.累计值;
      });

    yearCache.byCompany[keyIndexType][company][year] = companyAggData;
  });
}
// 构建月度公司维度缓存
function buildMonthCompanyCache(
  keyIndexType: string,
  month: string,
  data: any[]
) {
  if (!monthCache.byCompany[keyIndexType]) {
    monthCache.byCompany[keyIndexType] = {};
  }
  // 按公司维度分组
  const companyDataMap: Record<string, any[]> = {};
  data.forEach((item) => {
    const company = item.公司;
    if (!companyDataMap[company]) {
      companyDataMap[company] = [];
    }
    companyDataMap[company].push(item);
  });

  // 按公司维度聚合
  Object.keys(companyDataMap).forEach((company) => {
    const companyDataRows = companyDataMap[company];
    if (!monthCache.byCompany[keyIndexType][company]) {
      monthCache.byCompany[keyIndexType][company] = {};
    }
    const companyAggData: AggregatedData = {
      指标类型: keyIndexType,
      维度类型: "公司",
      维度值: company,
      时间维度: "月",
      数据时间: month,
      计划值: 0,
      实际值: 0,
      累计值: 0,
      环比率: 0,
      环比值: 0,
      同比率: 0,
      同比值: 0,
    };

    // 累加数值
    companyDataRows.forEach((item) => {
      companyAggData.实际值 += item.当期实际值;
      companyAggData.累计值 += item.累计值;
      companyAggData.计划值 += item.当期计划值;
    });

    monthCache.byCompany[keyIndexType][company][month] = companyAggData;
  });
}

// 构建年度产品维度缓存
function buildMonthProductCache(
  keyIndexType: string,
  month: string,
  data: any[]
) {
  if (!monthCache.byProduct[keyIndexType]) {
    monthCache.byProduct[keyIndexType] = {};
  }
  // 按产品维度分组
  const productDataMap: Record<string, any[]> = {};
  data.forEach((item) => {
    const product = item.产品;
    if (!productDataMap[product]) {
      productDataMap[product] = [];
    }
    productDataMap[product].push(item);
  });

  // 按产品维度聚合
  Object.keys(productDataMap).forEach((product) => {
    const productDataRows = productDataMap[product];
    if (!monthCache.byProduct[keyIndexType][product]) {
      monthCache.byProduct[keyIndexType][product] = {};
    }
    const productAggData: AggregatedData = {
      指标类型: keyIndexType,
      维度类型: "产品",
      维度值: product,
      时间维度: "月",
      数据时间: month,
      计划值: 0,
      实际值: 0,
      累计值: 0,
      环比率: 0,
      环比值: 0,
      同比率: 0,
      同比值: 0,
    };

    // 累加数值
    productDataRows.forEach((item) => {
      productAggData.实际值 += item.当期实际值;
      productAggData.累计值 += item.累计值;
      productAggData.计划值 += item.当期计划值;
    });

    monthCache.byProduct[keyIndexType][product][month] = productAggData;
  });
}

// 构建月度产品维度缓存
// 和公司维度类似
function buildYearProductCache(
  keyIndexType: string,
  year: string,
  data: any[]
) {
  if (!yearCache.byProduct[keyIndexType]) {
    yearCache.byProduct[keyIndexType] = {};
  }
  // 按产品维度分组
  const productDataMap: Record<string, any[]> = {};
  data.forEach((item) => {
    const product = item.产品;
    if (!productDataMap[product]) {
      productDataMap[product] = [];
    }
    productDataMap[product].push(item);
  });

  // 按产品维度聚合
  Object.keys(productDataMap).forEach((product) => {
    if (!yearCache.byProduct[keyIndexType][product]) {
      yearCache.byProduct[keyIndexType][product] = {};
    }
    const productAggData: AggregatedData = {
      指标类型: keyIndexType,
      维度类型: "产品",
      维度值: product,
      时间维度: "年",
      数据时间: year,
      计划值: 0,
      实际值: 0,
      累计值: 0,
      环比率: 0,
      环比值: 0,
      同比率: 0,
      同比值: 0,
    };

    // 从相应的月度数据中获取产品级数据
    const monthDatas = monthCache.byProduct[keyIndexType][product];

    Object.keys(monthDatas)
      .filter((month) => month.startsWith(year))
      .forEach((month) => {
        const monthData = monthDatas[month];
        productAggData.计划值 += monthData.计划值;
        productAggData.实际值 += monthData.实际值;
        productAggData.累计值 += monthData.累计值;
      });

    yearCache.byProduct[keyIndexType][product][year] = productAggData;
  });
}

// 构建月度组织和产品类型联合维度缓存
function buildMonthOrgAndProductTypeCache(
  keyIndexType: string,
  month: string,
  data: any[]
) {
  if (!monthCache.byOrgAndProductType[keyIndexType]) {
    monthCache.byOrgAndProductType[keyIndexType] = {};
  }
  // 按组织和产品类型联合维度分组
  const orgAndProductTypeDataMap: Record<string, Record<string, any[]>> = {};
  data.forEach((item) => {
    const enterprise = item.公司;
    const orgs = enterpriseToOrgMap[enterprise] || [];
    const product = item.产品;
    const productTypes = productToProductTypeMap[product] || [];
    orgs.forEach((org) => {
      if (!orgAndProductTypeDataMap[org]) {
        orgAndProductTypeDataMap[org] = {};
      }
      productTypes.forEach((productType) => {
        if (!orgAndProductTypeDataMap[org][productType]) {
          orgAndProductTypeDataMap[org][productType] = [];
        }
        orgAndProductTypeDataMap[org][productType].push(item);
      });
    });
  });

  // 按组织和产品类型联合维度聚合
  Object.keys(orgAndProductTypeDataMap).forEach((org) => {
    if (!monthCache.byOrgAndProductType[keyIndexType][org]) {
      monthCache.byOrgAndProductType[keyIndexType][org] = {};
    }
    Object.keys(orgAndProductTypeDataMap[org]).forEach((productType) => {
      const productTypeDataRows = orgAndProductTypeDataMap[org][productType];
      if (!monthCache.byOrgAndProductType[keyIndexType][org][productType]) {
        monthCache.byOrgAndProductType[keyIndexType][org][productType] = {};
      }

      const aggData: AggregatedData = {
        指标类型: keyIndexType,
        维度类型: "组织和产品类型",
        维度值: `${org}-${productType}`,
        时间维度: "月",
        数据时间: month,
        计划值: 0,
        实际值: 0,
        累计值: 0,
        环比率: 0,
        环比值: 0,
        同比率: 0,
        同比值: 0,
      };

      // 累加数值
      productTypeDataRows.forEach((item) => {
        aggData.实际值 += item.当期实际值;
        aggData.累计值 += item.累计值;
        aggData.计划值 += item.当期计划值;
      });

      monthCache.byOrgAndProductType[keyIndexType][org][productType][month] =
        aggData;
    });
  });
}

// 计算指定维度的环比
function calculateDimensionMToM(
  cache: Record<string, Record<string, AggregatedData>>,
  currentMonth: string,
  lastMonth: string
) {
  Object.keys(cache).forEach((keyIndexType) => {
    const currentMonthData = cache[keyIndexType][currentMonth];
    const lastMonthData = cache[keyIndexType][lastMonth];
    if (currentMonthData && lastMonthData) {
      currentMonthData.环比率 = currentMonthData.实际值 / lastMonthData.实际值;
      currentMonthData.环比值 =
        lastMonthData.实际值 > 0
          ? currentMonthData.实际值 - lastMonthData.实际值
          : 0;
    }
  });
}

// 计算指定维度的同比
function calculateDimensionYToY(
  cache: Record<string, Record<string, AggregatedData>>,
  current: string,
  last: string
) {
  Object.keys(cache).forEach((keyIndexType) => {
    const currentYearData = cache[keyIndexType][current];
    const lastYearData = cache[keyIndexType][last];
    if (currentYearData && lastYearData) {
      currentYearData.同比率 = currentYearData.实际值 / lastYearData.实际值;
      currentYearData.同比值 = lastYearData.实际值
        ? currentYearData.实际值 - lastYearData.实际值
        : 0;
    }
  });
}

// 计算所有缓存数据的同比环比
function calculateMonthCache() {
  // 计算月度环比
  calculateMonthMToM();
  // 计算月度同比
  calculateMonthYToY();
  // 计算年度同比
  calculateYearYToY();
}

// 计算月度环比
function calculateMonthMToM() {
  // 遍历所有月份
  const monthList = getMonthList();
  monthList.sort();
  Object.keys(monthCache.byOrg).forEach((keyIndexType) => {
    // 对于每个指标类型
    for (let i = 1; i < monthList.length; i++) {
      const currentItem = monthList[i];
      const lastItem = monthList[i - 1];

      // 确保是相邻月份（可能有数据缺失的月份）
      const [currentYear, currentMonth] = currentItem.split("-").map(Number);
      const [lastYear, lastMonth] = lastItem.split("-").map(Number);

      // 只有当前后两个月份相邻时才计算环比
      if (
        (currentYear === lastYear && currentMonth === lastMonth + 1) ||
        (currentYear === lastYear + 1 && currentMonth === 1 && lastMonth === 12)
      ) {
        // 处理组织维度
        calculateDimensionMToM(
          monthCache.byOrg[keyIndexType],
          currentItem,
          lastItem
        );
        // 处理产品类型维度
        calculateDimensionMToM(
          monthCache.byProductType[keyIndexType],
          currentItem,
          lastItem
        );
        // 处理公司维度
        calculateDimensionMToM(
          monthCache.byProduct[keyIndexType],
          currentItem,
          lastItem
        );
        // 处理产品维度
        calculateDimensionMToM(
          monthCache.byProduct[keyIndexType],
          currentItem,
          lastItem
        );
        // 处理组织和产品类型联合维度
        // Object.keys(monthCache.byOrgAndProductType[keyIndexType]).forEach(
        //   (org) => {
        //     Object.keys(
        //       monthCache.byOrgAndProductType[keyIndexType][org]
        //     ).forEach((productType) => {
        //       calculateDimensionMToM(
        //         monthCache.byOrgAndProductType[keyIndexType][org][productType],
        //         currentItem,
        //         lastItem
        //       );
        //     });
        //   }
        // );
      }

      // 计算环比
    }
  });
}
// 计算月度同比
function calculateMonthYToY() {
  // 对每个指标类型处理
}

// 计算年度同比
function calculateYearYToY() {
  // 遍历所有年份
}

// 获取所有月份
function getMonthList() {
  const monthSet = new Set<string>();

  // 从所有缓存中收集月份
  Object.keys(monthCache.byOrg).forEach((keyIndexType) => {
    Object.keys(monthCache.byOrg[keyIndexType]).forEach((org) => {
      Object.keys(monthCache.byOrg[keyIndexType][org]).forEach((month) => {
        monthSet.add(month);
      });
    });
  });

  return Array.from(monthSet);
}

// 初始化缓存
function initCache(rawData: any) {
  initReverseMap();
  const flattenedData = flattenData(rawData);

  // 按月份分组
  const monthData: Record<string, any[]> = {};
  const yearData: Record<string, any[]> = {};
  flattenedData.forEach((item) => {
    const month = item.数据时间;
    monthData[month] = monthData[month] || [];
    monthData[month].push(item);

    const year = item.数据时间.split("-")[0];
    yearData[year] = yearData[year] || [];
    yearData[year].push(item);
  });

  // 按年份分组
  // console.log(monthData);
  // 构建月度缓存
  initMonthCache(monthData);
  console.log(monthCache);
  // 构建年份缓存
  initYearCache(yearData, flattenedData);
  console.log(yearCache);
}

/**
 * 查询组织维度缓存
 * @param keyIndexType 指标类型
 * @param orgName 组织名称
 * @param timeDimension 时间维度
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns
 */
function queryOrgData(
  keyIndexType: string,
  orgName: string,
  timeDimension: string,
  startDate: string,
  endDate: string
) {
  const cache = timeDimension === "year" ? yearCache : monthCache;
  // 检查缓存是否存在
  if (!cache.byOrg[keyIndexType] || !cache.byOrg[keyIndexType][orgName]) {
    return [];
  }

  const timeData = cache.byOrg[keyIndexType][orgName];
  const result: AggregatedData[] = [];
  Object.keys(timeData)
    .filter((time) => {
      return time >= startDate && time <= endDate;
    })
    .sort()
    .forEach((time) => {
      result.push(timeData[time]);
    });
  // 返回缓存数据
  return result;
}

/**
 * 查询产品类型维度缓存
 * @param keyIndexType 指标类型
 * @param productType 产品类型
 * @param timeDimension 时间维度
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns
 */
function queryProductTypeData(
  keyIndexType: string,
  productType: string,
  timeDimension: string,
  startDate: string,
  endDate: string
) {
  const cache = timeDimension === "year" ? yearCache : monthCache;
  // 检查缓存是否存在
  if (
    !cache.byProductType[keyIndexType] ||
    !cache.byProductType[keyIndexType][productType]
  ) {
    return [];
  }

  const timeData = cache.byProductType[keyIndexType][productType];
  const result: AggregatedData[] = [];
  Object.keys(timeData)
    .filter((time) => {
      return time >= startDate && time <= endDate;
    })
    .sort()
    .forEach((time) => {
      result.push(timeData[time]);
    });
  // 返回缓存数据
  return result;
}

/**
 * 查询公司维度缓存
 * @param keyIndexType 指标类型
 * @param companyName 公司名称
 * @param timeDimension 时间维度
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns
 */
function queryCompanyData(
  keyIndexType: string,
  companyName: string,
  timeDimension: string,
  startDate: string,
  endDate: string
) {
  const cache = timeDimension === "year" ? yearCache : monthCache;
  // 检查缓存是否存在
  if (
    !cache.byCompany[keyIndexType] ||
    !cache.byCompany[keyIndexType][companyName]
  ) {
    return [];
  }

  const timeData = cache.byCompany[keyIndexType][companyName];
  const result: AggregatedData[] = [];
  Object.keys(timeData)
    .filter((time) => {
      return time >= startDate && time <= endDate;
    })
    .sort()
    .forEach((time) => {
      result.push(timeData[time]);
    });
  // 返回缓存数据
  return result;
}

/**
 * 查询产品维度缓存
 * @param keyIndexType 指标类型
 * @param productName 产品名称
 * @param timeDimension 时间维度
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns
 */
function queryProductData(
  keyIndexType: string,
  productName: string,
  timeDimension: string,
  startDate: string,
  endDate: string
) {
  const cache = timeDimension === "year" ? yearCache : monthCache;
  // 检查缓存是否存在
  if (
    !cache.byProduct[keyIndexType] ||
    !cache.byProduct[keyIndexType][productName]
  ) {
    return [];
  }

  const timeData = cache.byProduct[keyIndexType][productName];
  const result: AggregatedData[] = [];
  Object.keys(timeData)
    .filter((time) => {
      return time >= startDate && time <= endDate;
    })
    .sort()
    .forEach((time) => {
      result.push(timeData[time]);
    });
  // 返回缓存数据
  return result;
}

/**
 * 查询组织和产品类型联合维度缓存
 * @param keyIndexType 指标类型
 * @param orgName 组织名称
 * @param productType 产品类型
 * @param timeDimension 时间维度
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns
 */
function queryOrgAndProductTypeData(
  keyIndexType: string,
  orgName: string,
  productType: string,
  timeDimension: string,
  startDate: string,
  endDate: string
) {
  const cache = timeDimension === "year" ? yearCache : monthCache;
  // 检查缓存是否存在
  if (
    !cache.byOrgAndProductType[keyIndexType] ||
    !cache.byOrgAndProductType[keyIndexType][orgName][productType]
  ) {
    return [];
  }

  const timeData =
    cache.byOrgAndProductType[keyIndexType][orgName][productType];
  const result: AggregatedData[] = [];
  Object.keys(timeData)
    .filter((time) => {
      return time >= startDate && time <= endDate;
    })
    .sort()
    .forEach((time) => {
      result.push(timeData[time]);
    });
  // 返回缓存数据
  return result;
}

// 清除缓存
function clearCache() {
  yearCache.byOrg = {};
  yearCache.byProductType = {};
  yearCache.byCompany = {};
  yearCache.byProduct = {};
  yearCache.byOrgAndProductType = {};
  monthCache.byOrg = {};
  monthCache.byProductType = {};
  monthCache.byCompany = {};
  monthCache.byProduct = {};
  monthCache.byOrgAndProductType = {};
}

// TODO 增删查改

export {
  initCache,
  clearCache,
  queryOrgData,
  queryProductTypeData,
  queryCompanyData,
  queryProductData,
  queryOrgAndProductTypeData,
};
