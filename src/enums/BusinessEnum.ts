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
}

export const BusinessEnumMap = {
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
}

export const MapElementEnumMap = {
  [MapElementEnum.GAS_STATION]: "加油站",
  [MapElementEnum.OIL_DEPOT]: "油库",
  [MapElementEnum.OIL_SHIP]: "运油船",
  [MapElementEnum.OIL_CAR]: "油车",
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
}

export const OurCompanyEnumMap = {
  [OurCompanyEnum.GTSHC]: "广投石化",
  [OurCompanyEnum.GDFGS]: "广东分公司",
  [OurCompanyEnum.GTSHC_ZS]: "广投石化舟山",
  [OurCompanyEnum.YSCC]: "永盛仓储",
  [OurCompanyEnum.YSSHC]: "永盛石化",
};

// 全称map
export const OurCompanyFullNameMap = {
  [OurCompanyEnum.GTSHC]: "广西广投石化有限公司",
  [OurCompanyEnum.GDFGS]: "广西广投石化有限公司广东分公司",
  [OurCompanyEnum.GTSHC_ZS]: "广投石化(舟山)有限公司",
  [OurCompanyEnum.YSCC]: "广西永盛仓储有限公司",
  [OurCompanyEnum.YSSHC]: "广西永盛石油化工有限公司",
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
