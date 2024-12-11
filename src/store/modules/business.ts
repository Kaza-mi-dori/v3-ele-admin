import { store } from "@/store";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";

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
  let businessInfo = {};

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
          console.log("currentRecord", currentRecord);
          businessInfo = currentRecord;
          console.log("businessInfo3", businessInfo);
          resolve(currentRecord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    queryForm,
    businessInfo,
    getBusinessReportFormList,
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
