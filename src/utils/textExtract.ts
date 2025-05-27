function extractFuzzyFields(text: string, fuzzyMap: Record<string, string[]>) {
  // 模糊字段映射：同一组别名归为一个标准字段名
  const fieldToPattern: [string, RegExp][] = Object.entries(fuzzyMap).flatMap(
    ([standardField, aliases]) => {
      const pattern = aliases
        .map((alias) => `${alias}：\\s*([^\\n\\s]+)`)
        .join("|");
      console.log(pattern);
      return [[standardField, new RegExp(pattern, "g")]];
    }
  );

  const result: Record<string, string> = {};

  for (const [standardField, regex] of fieldToPattern) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      // 找到第一个非 undefined 的值（因为是多个别名并列）
      const value = match.slice(1).find(Boolean)?.trim();
      if (value) {
        if (result[standardField]) {
          result[standardField] += ", " + value; // 多个值合并
        } else {
          result[standardField] = value;
        }
      }
    }
  }

  return result;
}

export const extractInfoFromContractRecord = (text?: string): any => {
  if (!text) {
    return {
      contractNumber: null,
      supplier: null,
      buyer: null,
      contractPrice: null,
      contractQuantity: null,
      contractTotalPrice: null,
      goodsName: null,
      way: null,
      deliveryPlace: null,
      deliveryTime: null,
      paymentMethod: null,
    };
  }
  const result = extractFuzzyFields(text, {
    合同号: ["合同号", "合同编号"],
    供方: ["供方", "供应商", "乙方"],
    需方: ["需方", "客户", "甲方"],
    合同价格: ["合同价格", "合同总价"],
    合同数量: ["数量", "总数量", "合同数量", "合同总数量"],
    交货方式: ["交货方式", "提货方式"],
    交货地点: ["交货地点", "提货地点"],
    交货时间: ["交货时间", "提货时间"],
    支付方式: ["支付方式", "付款方式"],
    货物名称: ["货物名称", "商品名称", "品名"],
    付款方式: ["付款方式", "支付方式"],
  });
  return result;
};
