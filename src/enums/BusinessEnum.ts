/**
 * 业务类型枚举
 * 需要用值的时候使用 BusinessEnumMap
 * 需要用键的时候使用 BusinessEnum
 */
export const enum BusinessEnum {
  LNG = "LNG",
  CPY = "成品油",
  RLY = "燃料油",
  MT = "煤炭",
  HGCP = "化工产品",
  YY = "原油",
  QT = "其他",
  YZ = "油站运营",
  CC = "仓储",
}

export const BusinessEnumMap = {
  [BusinessEnum.CPY]: "成品油",
  [BusinessEnum.YY]: "原油",
  [BusinessEnum.HGCP]: "化工产品",
  [BusinessEnum.RLY]: "燃料油",
  [BusinessEnum.MT]: "煤炭",
  [BusinessEnum.LNG]: "LNG",
  [BusinessEnum.QT]: "其他",
  [BusinessEnum.YZ]: "油站运营",
  [BusinessEnum.CC]: "仓储",
};

/** 大屏展示顺序  */
export const BusinessEnumMapBigScreen = {
  [BusinessEnum.CPY]: "成品油",
  [BusinessEnum.YY]: "原油",
  [BusinessEnum.HGCP]: "化工产品",
  [BusinessEnum.RLY]: "燃料油",
  [BusinessEnum.MT]: "煤炭",
  [BusinessEnum.LNG]: "LNG",
  [BusinessEnum.QT]: "其他",
};

/** 币种枚举 */
export const enum CurrencyEnum {
  CNY = "人民币/CNY",
  USD = "美元/USD",
  EUR = "欧元/EUR",
  JPY = "日元/JPY",
  GBP = "英镑/GBP",
  KRW = "韩元/KRW",
  AUD = "澳元/AUD",
  CAD = "加元/CAD",
  /**港币 */
  HKD = "港币/HKD",
}

export const CurrencyEnumMap = {
  [CurrencyEnum.CNY]: "人民币",
  [CurrencyEnum.USD]: "美元",
  [CurrencyEnum.EUR]: "欧元",
  [CurrencyEnum.JPY]: "日元",
  [CurrencyEnum.GBP]: "英镑",
  [CurrencyEnum.KRW]: "韩元",
  [CurrencyEnum.AUD]: "澳元",
  [CurrencyEnum.CAD]: "加元",
};

/** 地图元素枚举 */
export const enum MapElementEnum {
  /** 加油站 */
  GAS_STATION = "gas_station",
  /** 油库 */
  OIL_DEPOT = "oil_depot",
  /** 运油船 */
  OIL_SHIP = "oil_ship",
  /** 油车 */
  OIL_CAR = "oil_car",
  /** 组织机构 */
  ORGANIZATION = "organization",
}

export const MapElementEnumMap = {
  [MapElementEnum.GAS_STATION]: "加油站",
  [MapElementEnum.OIL_DEPOT]: "油库",
  [MapElementEnum.OIL_SHIP]: "运油船",
  [MapElementEnum.OIL_CAR]: "油车",
  [MapElementEnum.ORGANIZATION]: "组织机构",
};

/** 我方公司枚举 */
export const enum OurCompanyEnum {
  /** 广投石化 */
  GTSHC = "广投石化",
  /** 广东分公司 */
  GDFGS = "广投石化广东分公司",
  /** 广投石化舟山 */
  GTSHC_ZS = "广投石化舟山",
  /** 永盛仓储 */
  YSCC = "永盛仓储",
  /** 永盛石化 */
  YSSHC = "永盛石化",
  /** 开燃公司 */
  KRY = "开燃公司",
  /** 桂盛公司 */
  GSSHC = "桂盛桂轩",
  /** 恒润公司 */
  HRY = "恒润公司",
  /** 石化板块（特殊） */
  SHBK = "石化板块",
}

export const OurCompanyEnumMap = {
  [OurCompanyEnum.GTSHC]: "广投石化",
  [OurCompanyEnum.GDFGS]: "广投石化广东分公司",
  [OurCompanyEnum.GTSHC_ZS]: "广投石化舟山",
  [OurCompanyEnum.YSCC]: "永盛仓储",
  [OurCompanyEnum.YSSHC]: "永盛石化",
  [OurCompanyEnum.KRY]: "开燃公司",
  [OurCompanyEnum.GSSHC]: "桂盛桂轩",
  [OurCompanyEnum.HRY]: "恒润公司",
  [OurCompanyEnum.SHBK]: "石化板块",
};

// 全称map
export const OurCompanyFullNameMap = {
  [OurCompanyEnum.GTSHC]: "广西广投石化有限公司",
  [OurCompanyEnum.GDFGS]: "广西广投石化有限公司广东分公司",
  [OurCompanyEnum.GTSHC_ZS]: "广投石化(舟山)有限公司",
  [OurCompanyEnum.YSCC]: "广西永盛仓储有限公司",
  [OurCompanyEnum.YSSHC]: "广西永盛石油化工有限公司",
  [OurCompanyEnum.KRY]: "开燃公司",
  [OurCompanyEnum.GSSHC]: "桂盛桂轩",
  [OurCompanyEnum.HRY]: "恒润公司",
  [OurCompanyEnum.SHBK]: "石化板块",
};

/** 合同类型枚举 */
export const enum ContractTypeEnum {
  /** 采购合同 */
  PURCHASE = "采购合同",
  /** 销售合同 */
  SALE = "销售合同",
  /** 运输合同 */
  TRANSPORT = "运输合同",
  /** 仓储合同 */
  STORAGE = "仓储合同",
  /** 其他合同 */
  OTHER = "其他合同",
}

export const ContractTypeEnumMap = {
  [ContractTypeEnum.PURCHASE]: "采购合同",
  [ContractTypeEnum.SALE]: "销售合同",
  [ContractTypeEnum.TRANSPORT]: "运输合同",
  [ContractTypeEnum.STORAGE]: "仓储合同",
  [ContractTypeEnum.OTHER]: "其他合同",
};

/** 业态枚举 */
export const enum BusinessFormatEnum {
  /** 贸易 */
  TRADE = "贸易",
  /** 油站运营 */
  GAS_STATION = "油站运营",
  /** 仓储 */
  STORAGE = "仓储",
}

export const BusinessFormatEnumMap = {
  [BusinessFormatEnum.TRADE]: "贸易",
  [BusinessFormatEnum.GAS_STATION]: "油站运营",
  [BusinessFormatEnum.STORAGE]: "仓储",
};

/** 合同状态枚举 */
export const enum ContractStatusEnum {
  /** 未签订 */
  UN_SIGNED = "未签订",
  /** 已签订 */
  SIGNED = "已签订",
}

export const ContractStatusEnumMap = {
  [ContractStatusEnum.UN_SIGNED]: "未签订",
  [ContractStatusEnum.SIGNED]: "已签订",
};

/** 货单状态枚举 */
export const enum OrderStatusEnum {
  /** 已提货 */
  PICKED = "已提货",
  /** 未提货 */
  NOT_PICKED = "未提货",
}

export const OrderStatusEnumMap = {
  [OrderStatusEnum.PICKED]: "已提货",
  [OrderStatusEnum.NOT_PICKED]: "未提货",
};
