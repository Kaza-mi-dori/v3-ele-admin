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
