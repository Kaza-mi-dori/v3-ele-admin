export const timeDimensionEnum = {
  YEAR: "年度报表",
  QUARTER: "季度报表",
  MONTH: "月度报表",
  WEEK: "周报表",
  DAY: "日报表",
  HOUR: "小时报表",
};

export const timeDimensionFtoBMap = {
  [timeDimensionEnum.YEAR]: "年",
  // [timeDimensionEnum.QUARTER]: "季",
  [timeDimensionEnum.MONTH]: "月",
  // [timeDimensionEnum.WEEK]: "周",
  [timeDimensionEnum.DAY]: "日",
  // [timeDimensionEnum.HOUR]: "时",
};

export const BMapFtoTimeDimension = {
  年: timeDimensionEnum.YEAR,
  //季: timeDimensionEnum.QUARTER,
  月: timeDimensionEnum.MONTH,
  // 周: timeDimensionEnum.WEEK,
  日: timeDimensionEnum.DAY,
  // 时: timeDimensionEnum.HOUR,
};
