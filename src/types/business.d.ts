namespace business {
  // 通用组合类型：数据可审计项

  interface IAuditable {
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    dataFrom: string; // 数据来源编码, 每个数据来源应该有个字典项
    audited: boolean; // 是否已审核
  }
  // 货品
  interface IGoods {
    id: string; // 货品ID
    name: string; // 货品名称
    category: string; // 货品类别
    no: string; // 货品编号
    price: number; // 单价
    count?: number; // 数量
    unit: string; // 规格
    currency: string; // 结算币种
    description: string;
  }

  // 订单

  interface IOrder {
    id: string;
    no: string;
    date: string;
    category: string; // 订单类别
    amount: number;
    status: string; // 订单本身的状态，非数据审核状态
    goods: Partial<IGoods>[];
  }

  // 款项
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface IPayment {
    id: string;
    no: string;
    date: string;
    amount: number;
    status: string; // 款项状态
    description: string; // 备注
    order: IOrder;
    orderNo: string;
  }
  // 业务查询条件，用来声明每个条件项的属性
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface IBuisnessFilterItem {
    label: string;
    value: any;
    prop: string;
    multiple?: boolean;
    options?: any[];
    children?: IBuisnessFilterItem[];
    order?: number; // 排序权重，越小越靠前
    disabled?: boolean; // 是否禁用该选项
    visible?: boolean; // 是否显示该选项
    inputType:
      | "input"
      | "textarea"
      | "number"
      | "date"
      | "datetime"
      | "time"
      | "checkbox"
      | "radio"
      | "cascader"
      | "select"
      | "transfer"
      | "custom"; // 输入框类型
  }

  // 合同信息
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface IContract {
    id: string;
    no: string; // 编号
    name: string; // 名称
    amount: number; // 金额（含税)
    tax: number; // 税率
    taxAmount: number; // 税额
    description: string; // 说明
    currency: string; // 币种
    partner: string; // 合作伙伴(相对人)
    status: string; // 合同状态
    date: string; // 签订日期
    from?: string; // 合同信息来源，如：泛微、钉钉
    goodsDetails?: any[]; // 商品明细
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface IYearlyBusinessReport {
    id?: string;
    year: string;
    income: number;
    outcome: number;
    profit: number;
    purchaseAmount: number; // 采购金额
    salesAmount: number; // 销售金额
    contractCount: number; // 合同数量
    contractFulfilledCount: number; // 已履行合同数量
    riskContractCount: number; // 风险合同数量
    purchaseContractCount: number; // 采购合同数量
    salesContractCount: number; // 销售合同数量
    purchaseOrderCount: number; // 采购订单数量
    salesOrderCount: number; // 销售订单数量,
    storage: Arrat<Record<string, number>>; // 仓储信息
    settlementCount: number; // 结算数量
    settlementAmount: number; // 结算金额
    planIncome: number; // 计划收入
    planOutcome: number; // 计划支出
    planProfit: number; // 计划利润
    incomeFulfilledRate: number; // 营收目标完成率
    profitFulfilledRate: number; // 利润目标完成率
  }

  // 月度业务报表
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface IMonthlyBusinessReport {
    id?: string;
    year: number;
    month: number;
    income: number;
    outcome: number;
    profit: number;
    purchaseAmount: number; // 采购金额
    salesAmount: number; // 销售金额
    contractCount: number; // 合同数量
    contractFulfilledCount: number; // 已履行合同数量
    riskContractCount: number; // 风险合同数量
    purchaseContractCount: number; // 采购合同数量
    salesContractCount: number; // 销售合同数量
    purchaseOrderCount: number; // 采购订单数量
    salesOrderCount: number; // 销售订单数量,
    storage: Record<string, number>; // 仓储信息
    settlementCount: number; // 结算数量
    settlementAmount: number; // 结算金额
    planIncome: number; // 计划收入
    planOutcome: number; // 计划支出
    planProfit: number; // 计划利润
    incomeFulfilledRate: number; // 营收目标完成率
    profitFulfilledRate: number; // 利润目标完成率
  }

  // 企业概况报表
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface IEnterpriseOverviewReport {
    id?: string;
    name: string;
    description: string;
    assets: number; // 资产总额
    liabilities: number; // 负债总额
    employees: number; // 员工数量
  }

  // 泛型，某个类型T和可审计项的组合
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type IAuditableEntity<T> = T & IAuditable;
}

export default business;
