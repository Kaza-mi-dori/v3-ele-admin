export const enum DatasourceEnum {
  /**
   * 泛微
   */
  FANWEI = "泛微",

  /**
   * 钉钉
   * @description 钉钉
   */
  DINGDING = "钉钉",

  /**
   * 永盛ERP
   * @description 库区ERP
   */
  YONGSHENG_ERP = "永盛ERP",

  /**
   * 其他
   * @description 其他，包括手填、导入
   */
  OTHER = "其他",
}

export const DatasourceEnumMap = {
  [DatasourceEnum.FANWEI]: "泛微",
  [DatasourceEnum.DINGDING]: "钉钉",
  [DatasourceEnum.YONGSHENG_ERP]: "永盛ERP",
  [DatasourceEnum.OTHER]: "其他",
};
