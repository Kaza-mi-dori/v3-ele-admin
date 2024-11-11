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
    id: string;
    name: string;
    no: string;
    price: number;
    count: number;
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
    goods: IGoods[];
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
    name: string;
    amount: number;
    date: string;
    from: string; // 合同信息来源，如：泛微、钉钉
    goodsDetails: any[]; // 商品明细
  }

  // 泛型，某个类型T和可审计项的组合
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type IAuditableEntity<T> = T & IAuditable;
}

export default business;
