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
