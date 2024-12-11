import { store } from "@/store";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
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

export const companyStore = defineStore("company", () => {
  const companyInfo = ref([]);
  const companyInfoValue = computed(() => companyInfo.value);
  /**
   * 获取企业报表列表
   *
   */
  function getCompanyReportFormList(queryForm: any) {
    return new Promise<any>((resolve, reject) => {
      BusinessFormAPI.getCompanyReportFormList(queryForm)
        .then((res) => {
          if (!res) {
            reject("Please try again.");
            return;
          }
          const currentRecord = res["当前记录"][0]["内容"]["详情"];
          companyInfo.value = currentRecord;
          resolve(currentRecord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    queryForm,
    queryForm2,
    companyInfo,
    companyInfoValue,
    getCompanyReportFormList,
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
