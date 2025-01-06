import { store } from "@/store";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import { OurCompanyEnum, OurCompanyEnumMap } from "@/enums/BusinessEnum";
import { ref, computed } from "vue";

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  企业名称: undefined,
  企业类型: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

const queryForm2: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  页码: 1,
  页容量: 1,
  企业名称: "广投石化",
  状态集合: ["有效"],
});

let companyInfo = ref([]);
let companyInfoValue = computed(() => companyInfo.value);

export const companyStore = defineStore("company", () => {
  /**
   * 企业报表数据
   * @param {OurCompanyEnum} firm - 企业枚举
   * @param {string} year - 年份
   * @returns {Promise<any>} - 企业报表数据
   */
  const firmReportMap: Ref<Record<string, any>> = ref({
    [OurCompanyEnum.GTSHC]: {},
    [OurCompanyEnum.GDFGS]: {},
    [OurCompanyEnum.GTSHC_ZS]: {},
    [OurCompanyEnum.YSCC]: {},
    [OurCompanyEnum.YSSHC]: {},
  });
  /**
   * 获取企业报表列表
   *
   */
  function getCompanyReportFormList(queryForm: any) {
    return new Promise<any>((resolve, reject) => {
      BusinessFormAPI.getCompanyReportFormList(queryForm)
        .then((res: any) => {
          if (!res) {
            reject("请重试");
            return;
          }
          const currentRecord = res["当前记录"]?.[0]?.["内容"]?.["详情"] || [];
          companyInfo.value = currentRecord;
          resolve(currentRecord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /**
   * 根据企业名称和年份获取企业报表数据
   *
   */
  function getFirmReportMap(firm: OurCompanyEnum, year: string, force = false) {
    return new Promise(async (resolve) => {
      if (!firmReportMap.value[firm]) {
        firmReportMap.value[firm] = {};
      }
      if (firmReportMap.value[firm][year] && !force) {
        resolve(firmReportMap.value[firm][year]);
        return;
      }
      const firmName = OurCompanyEnumMap[firm];
      const data: any = await BusinessFormAPI.getCompanyReportFormList({
        企业名称: firmName,
        类型集合: ["年"],
        状态集合: ["有效"],
        日期早于: `${year}-12-31`,
        日期晚于: `${year}-01-01`,
      });
      firmReportMap.value[firmName][year] = data["当前记录"]?.[0];
      resolve(firmReportMap.value[firmName][year]);
    });
  }
  return {
    queryForm,
    queryForm2,
    companyInfo,
    companyInfoValue,
    getCompanyReportFormList,
    getFirmReportMap,
    firmReportMap,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function companyStoreHook() {
  return companyStore(store);
}
