import { store } from "@/store";
import { DeptAPI2 } from "@/api/system/dept";
export const useDeptStore = defineStore("dept", () => {
  const deptList = useStorage<any>("deptList", []);

  const loadDeptList = async () => {
    try {
      const res: any = await DeptAPI2.getAllDeptList();
      deptList.value = res["当前记录"];
    } catch (error) {
      console.error(error);
    }
  };

  const getDeptList = async () => {
    if (deptList.value.length === 0) {
      await loadDeptList();
    }
    return deptList.value;
  };

  return { deptList, getDeptList, loadDeptList };
});

export function useDeptStoreHook() {
  return useDeptStore(store);
}
