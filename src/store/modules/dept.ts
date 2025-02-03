import { store } from "@/store";
import { DeptAPI2 } from "@/api/system/dept";
import {
  getTreeFromFlatNodes,
  getTreeFromLeftRightTreeNodes,
} from "@/utils/datastruct";

/**
 * 初始化组织树
 */
export function initDeptTree(deptOptions: any, treeNodes: any) {
  // 根据左右值算法构建部门树
  try {
    const treeData = treeNodes.map((node: any) => {
      return {
        id: node.id,
        value: +node.id,
        leftValue: +node.左值,
        rightValue: +node.右值,
        label: node.名称,
        ...node,
      };
    });
    // console.log("1", treeData);
    deptOptions = getTreeFromLeftRightTreeNodes(
      treeData,
      "leftValue",
      "rightValue"
    );
    // console.log("部门树", deptOptions.value);
    deptOptions.unshift({
      label: "顶级部门",
      value: 0,
      children: [],
    });
    return deptOptions;
  } catch (error) {
    console.error("初始化部门树失败: " + error);
  }
  return [];
}

export const useDeptStore = defineStore("dept", () => {
  const deptList = useStorage<any>("deptList", []);
  const deptTree = useStorage<any>("deptTree", []);

  const loadDeptList = async () => {
    try {
      const res: any = await DeptAPI2.getAllDeptList();
      deptList.value = res["当前记录"];
    } catch (error) {
      console.error(error);
    }
  };

  const loadDeptTree = async () => {
    try {
      const res: any = await getDeptList();
      const treeData = initDeptTree([], res);
      deptTree.value = treeData;
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

  const getDeptTree = async () => {
    if (deptTree.value.length === 0) {
      await loadDeptTree();
    }
    return deptTree.value;
  };

  return {
    deptList,
    getDeptList,
    loadDeptList,
    loadDeptTree,
    deptTree,
    getDeptTree,
  };
});

export function useDeptStoreHook() {
  return useDeptStore(store);
}
