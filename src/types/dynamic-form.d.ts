type IFormTypeEnum = "融合表" | "普通表";

// 表单定义
interface IFormDefinitionDTO {
  编号: string;
  名称: string;
  描述?: string;
  类型: IFormTypeEnum;
  数据源id?: number;
  表名?: string;
  数据时间类型?: string;
  数据时间显示名称?: string;
  数据时间显示顺序?: number;
  开启行级权限?: boolean;
  创建人可见性?: boolean;
  用户组可见性?: string;
}

type IFormFieldTypeEnum =
  | "未定义"
  | "字符串"
  | "整数"
  | "浮点数"
  | "定点数"
  | "布尔"
  | "字典项"
  | "日期时间"
  | "附件";

// 表单字段定义
interface IFormFieldDefinitionDTO {
  表单定义编号?: string;
  编号?: string;
  名称?: string;
  描述?: string;
  类型?: IFormFieldTypeEnum;
  顺序?: number;
  索引名?: string;
  索引唯一?: boolean;
  索引顺序?: number;
  字符串最大长度?: number;
  数值精度?: number;
  数值小数位数?: number;
  时间精度?: number;
}

type IFormFieldDefinitionForm = IFormFieldDefinitionDTO & {
  id: string | number;
};

// 表单定义Form，在表单定义的基础上，添加了表单定义的id以及可能的表单定义项
type IFormDefinitionForm = IFormDefinitionDTO & {
  id: string | number;
  字段列表?: IFormFieldDefinitionForm[];
};

// 表单实例
interface IFormInstanceDTO {
  id: string | number;
  表单定义编号: string | number;
  数据时间: string;
  部门id: string;
  部门名称: string;
  创建者: string;
  创建时间: string;
  修改者: string;
  修改时间: string;
}

// 表单属性实例
interface IFormPropertyInstanceDTO {
  id: string | number;
  表单实例id: string | number;
  表单属性定义编号: string | number;
  创建者: string;
  创建时间: string;
  修改者: string;
  修改时间: string;
  值: any;
}

// 表单实例Form，在表单实例的基础上，添加了表单实例的id以及可能的表单实例项
type IFormInstanceForm = IFormInstanceDTO & {
  formPropertyInstanceDTOList?: IFormPropertyInstanceDTO[];
};
