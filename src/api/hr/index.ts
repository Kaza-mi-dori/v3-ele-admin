import request2 from "@/utils/request2";

const HR_BASE_URL = "/Api/Business/Employee";
const HR_ORG_BASE_URL = "/Api/Business/OrgStructure";

export interface EmployeeDTO {
  id?: number | string;
  用户id: string | number;
  部门岗位id: string | number;
  状态: string;
  姓名: string;
  性别: string;
  手机号码: string;
  电子邮箱: string;
  办公电话: string;
  办公地址: string;
  备注: string;
}

export interface OrgForm {
  id: string | number;
  上级id: string | number | undefined;
  类型: string;
  状态: string;
  名称: string;
  地址: string;
  备注: string;
}

export interface OrgQuery {
  id集合: string[];
  上级id集合: string[];
  类型集合: string[];
  状态集合: string[];
  名称: string;
}

export const HR_API = {
  /*
   * 获取员工列表
   */
  getEmployeeList: (data: any) => {
    return request2({
      url: `${HR_BASE_URL}/Query`,
      method: "post",
      data,
    });
  },

  /*
   * 获取员工详情
   */
  getEmployeeDetail: (id: number | string) => {
    return request2({
      url: `${HR_BASE_URL}`,
      method: "get",
      params: { id },
    });
  },

  /**
   * 新增员工
   */
  addEmployee: (data: EmployeeDTO) => {
    return request2({
      url: `${HR_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 修改员工
   */
  updateEmployee: (data: EmployeeDTO) => {
    return request2({
      url: `${HR_BASE_URL}`,
      method: "patch",
      data,
    });
  },

  /**
   * 获取导入模板
   */
  getImportTemplate: (desc?: string) => {
    return request2({
      url: `${HR_BASE_URL}/GetExcelImportTemplate`,
      method: "get",
      params: { 说明文本: desc || "" },
      responseType: "arraybuffer",
    });
  },

  /**
   * 从excel中读取数据
   */
  readDataFromExcel: (data: any) => {
    return request2({
      url: `${HR_BASE_URL}/ReadFromExcel`,
      method: "post",
      data,
    });
  },

  /**
   * 批量新增修改
   */
  batchAddOrUpdate: (data: any) => {
    return request2({
      url: `${HR_BASE_URL}/AddOrChangeBatch`,
      method: "post",
      data,
    });
  },

  /**
   * 新增部门
   */
  addOrg: (data: any) => {
    return request2({
      url: `${HR_ORG_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 获取部门详情
   */
  getOrgDetail: (id: number | string) => {
    return request2({
      url: `${HR_ORG_BASE_URL}`,
      method: "get",
      params: { id },
    });
  },

  /**
   * 获取部门列表
   */
  getOrgList: (data: any) => {
    return request2({
      url: `${HR_ORG_BASE_URL}/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 修改部门
   * @param data 部门信息
   */
  updateOrg: (data: any) => {
    return request2({
      url: `${HR_ORG_BASE_URL}`,
      method: "patch",
      data,
    });
  },

  /**
   * 删除部门
   * @param id 部门id
   */
  deleteOrg: (id: number | string) => {
    return request2({
      url: `${HR_ORG_BASE_URL}`,
      method: "delete",
      params: { id },
    });
  },
};
