import { store } from "@/store";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import { ref, computed } from "vue";

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 10000,
});

export const businessStore = defineStore("business", () => {
  const businessInfo = ref([]);
  const businessInfoValue = computed(() => businessInfo.value);
  const businessReportMap = ref<Record<string, any>>({});
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
  return {
    queryForm,
    businessInfo,
    businessInfoValue,
    getBusinessReportFormList,
    getBusinessReportMap,
    businessReportMap,
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
