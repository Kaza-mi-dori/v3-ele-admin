/**
 * 从左右值的数组构建树
 * @param leftRightTreeNodes
 * @param leftValueProp
 * @param rightValueProp
 * @returns
 */
export function getTreeFromLeftRightTreeNodes(
  leftRightTreeNodes: any[],
  leftValueProp: string,
  rightValueProp: string
) {
  const sortedData = leftRightTreeNodes.sort(
    (a, b) => a[leftValueProp] - b[leftValueProp]
  );
  // 按照左值排序后，结构为前序遍历
  const pStack = [];
  const root = {
    children: [],
    [leftValueProp]: 0,
    [rightValueProp]: Number.MAX_VALUE,
  };
  pStack.push(root);
  for (let i = 0; i < sortedData.length; i++) {
    const node = sortedData[i];
    let parent = pStack[pStack.length - 1];
    const newNode = { ...node };
    while (
      parent[rightValueProp] !== undefined &&
      parent[rightValueProp] < node[rightValueProp] &&
      pStack.length > 1
    ) {
      pStack.pop();
      parent = pStack[pStack.length - 1];
    }
    newNode.parentId = parent.id ?? 0;
    if (!parent.children) {
      // parent.hasChildren = true;
      parent.children = [];
    }
    parent.children.push(newNode);
    pStack.push(newNode);
  }
  return root.children;
}

/**
 * 从平铺的节点数组构建树
 * @param flatNodes
 * @param idProp
 * @param parentIdProp
 * @returns
 * @example
 **/
export function getTreeFromFlatNodes(
  flatNodes: any[],
  idProp: string,
  parentIdProp: string
) {
  const idMap = new Map();
  const root = {
    children: [],
    [idProp]: 0,
  };
  for (let i = 0; i < flatNodes.length; i++) {
    const node = flatNodes[i];
    idMap.set(node[idProp], node);
  }
  for (let i = 0; i < flatNodes.length; i++) {
    const node = flatNodes[i];
    const parentId = node[parentIdProp];
    const parent = idMap.get(parentId);
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
    } else {
      root.children.push(node);
    }
  }
  return root.children;
}

export interface IDataItem {
  类型: string;
  名称1: string;
  名称2?: string;
  名称3?: string;
  标识?: string;
}

/**
 *  按名称1、名称2、名称3组织出树形结构(BFS)
 * @param data
 * @returns
 */
export function generateTreeData(data: IDataItem[]): any[] {
  const treeData: any[] = [];
  const typeMap = new Map();
  for (const item of data) {
    const type = item["类型"];
    const name1 = item["名称1"];
    const name2 = item["名称2"];
    const name3 = item["名称3"];
    if (!typeMap.has(type)) {
      typeMap.set(type, {
        label: type,
        id: "-1",
        children: [],
      });
      treeData.push(typeMap.get(type));
    }
    const typeNode = typeMap.get(type);
    const name1Node = typeNode.children.find(
      (node: any) => node.label === name1
    );
    if (!name1Node) {
      typeNode.children.push({
        label: name1,
        ...item,
        children: [],
      });
    }
    const name1NodeIndex = typeNode.children.findIndex(
      (node: any) => node.label === name1
    );
    const name2Node = typeNode.children[name1NodeIndex].children.find(
      (node: any) => node.label === name2
    );
    if (!name2Node) {
      typeNode.children[name1NodeIndex].children.push({
        label: name2,
        children: [],
        ...item,
      });
    }
    const name2NodeIndex = typeNode.children[name1NodeIndex].children.findIndex(
      (node: any) => node.label === name2
    );
    const name3Node = typeNode.children[name1NodeIndex].children[
      name2NodeIndex
    ].children.find((node: any) => node.label === name3);
    if (!name3Node) {
      typeNode.children[name1NodeIndex].children[name2NodeIndex].children.push({
        label: name3,
        ...item,
      });
    }
  }
  // console.log(treeData);
  return treeData;
}
