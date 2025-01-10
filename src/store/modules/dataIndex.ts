import { store } from "@/store";
import { DataDefinitionAPI } from "@/api/dataIndices/dataDefinition";
import { generateTreeData } from "@/utils/datastruct";

export const useDataIndexStore = defineStore("dataIndex", () => {
  const allDataIndex = ref<any[]>();

  const getDataIndexList = async (force = false) => {
    if (!allDataIndex.value || force) {
      const res: any = await DataDefinitionAPI.getDataDefinitionList({
        页码: 1,
        页容量: 1000,
      });
      allDataIndex.value = res["当前记录"];
    }
    return allDataIndex.value;
  };

  const getDataIndexTree = async () => {
    const originData = await getDataIndexList();
    if (!originData) return [];
    return generateTreeData(originData);
  };

  return {
    allDataIndex,
    getDataIndexList,
    getDataIndexTree,
  };
});

export function useDataIndexStoreHook() {
  return useDataIndexStore(store);
}
