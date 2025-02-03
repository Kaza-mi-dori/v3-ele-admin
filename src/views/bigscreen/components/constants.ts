import {
  OurCompanyEnum,
  OurCompanyEnumMap,
  BusinessFormatEnum,
  BusinessFormatEnumMap,
} from "@/enums/BusinessEnum";

export interface navItem {
  id: number;
  label: string;
  name: string;
}

export const businessTypes: navItem[] = [
  { id: 1, label: "LNG", name: "LNG" },
  { id: 2, label: "燃料油", name: "fuelOil" },
  { id: 3, label: "成品油", name: "refinedOilProduct" },
  { id: 4, label: "化工产品", name: "chemicalProduct" },
  { id: 5, label: "原油", name: "crudeOil" },
  { id: 6, label: "煤炭", name: "coal" },
];

export const businessTypes2: navItem[] = [
  { id: 1, label: "化工产品", name: "chemicalProduct" },
  { id: 2, label: "原油", name: "crudeOil" },
  { id: 3, label: "燃料油", name: "fuelOil" },
  { id: 4, label: "成品油", name: "refinedOilProduct" },
  { id: 5, label: "LNG", name: "LNG" },
  { id: 6, label: "煤炭", name: "coal" },
];

export const businessTypeRouteNameMap = {
  chemicalProduct: "Cpy",
  crudeOil: "Mt",
  fuelOil: "Yy",
  refinedOilProduct: "Cpy",
  LNG: "Lng",
  coal: "Rly",
};

/** 经营主体 */
export const businessSubjects: navItem[] = [
  { id: 1, label: OurCompanyEnumMap[OurCompanyEnum.GTSHC], name: "gtsh" },
  { id: 2, label: OurCompanyEnumMap[OurCompanyEnum.GDFGS], name: "gtshgd" },
  { id: 3, label: OurCompanyEnumMap[OurCompanyEnum.GTSHC_ZS], name: "gtshzs" },
  { id: 4, label: OurCompanyEnumMap[OurCompanyEnum.YSCC], name: "yscc" },
  { id: 5, label: OurCompanyEnumMap[OurCompanyEnum.KRY], name: "kry" },
  { id: 6, label: OurCompanyEnumMap[OurCompanyEnum.GSSHC], name: "gsshc" },
  { id: 7, label: OurCompanyEnumMap[OurCompanyEnum.HRY], name: "hry" },
];

/** 业态 */
export const businessFormats: navItem[] = [
  {
    id: 1,
    label: BusinessFormatEnumMap[BusinessFormatEnum.TRADE],
    name: "trade",
  },
  {
    id: 2,
    label: BusinessFormatEnumMap[BusinessFormatEnum.GAS_STATION],
    name: "gasStation",
  },
  {
    id: 3,
    label: BusinessFormatEnumMap[BusinessFormatEnum.STORAGE],
    name: "storage",
  },
];

// 动态计算市场信息的id为businessTypes的长度加1
export const allBusinessTypes: navItem[] = [
  ...businessTypes,
  { id: businessTypes.length + 1, label: "市场信息", name: "marketInfo" },
];
