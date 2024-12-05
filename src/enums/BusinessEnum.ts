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
