namespace business {
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
}

export default business;
