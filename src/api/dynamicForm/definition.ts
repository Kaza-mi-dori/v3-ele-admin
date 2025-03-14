import request2 from "@/utils/request2";

const DYNAMIC_FORM_BASE_URL = "/Api/Business/FormDefinition";

export const DynamicFormAPI = {
  getDynamicFormDefinition(id: string) {
    return request2({
      url: `${DYNAMIC_FORM_BASE_URL}`,
      method: "get",
      params: {
        id,
      },
    });
  },
  getDynamicFormDefinitionList(params: any) {
    return request2<any>({
      url: `${DYNAMIC_FORM_BASE_URL}/Query`,
      method: "post",
      data: params,
    });
  },
  addDynamicFormDefinition(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_BASE_URL}`,
      method: "post",
      data,
    });
  },
  editDynamicFormDefinition(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_BASE_URL}`,
      method: "patch",
      data,
    });
  },

  /**
   * 更改状态
   * @param id 主键
   * @param status 状态
   */
  changeDynamicFormDefinitionStatus(id: string, status: string) {
    return request2({
      url: `${DYNAMIC_FORM_BASE_URL}/changeStatus`,
      method: "patch",
      data: { id, 状态: status },
    });
  },

  /**
   * 删除
   */
  deleteDynamicFormDefinition(id: string) {
    return request2({
      url: `${DYNAMIC_FORM_BASE_URL}`,
      method: "delete",
      params: {
        id,
      },
    });
  },
};

const DYNAMIC_FORM_FIELD_BASE_URL = "/Api/Business/FormPropertyDefinition";

/** 表单字段相关接口 */
export const DynamicFormFieldAPI = {
  /**
   * 获取表单字段列表
   * @param params 查询参数
   * @returns 表单字段列表
   */
  getDynamicFormFieldList(params: any) {
    return request2({
      url: `${DYNAMIC_FORM_FIELD_BASE_URL}/Query`,
      method: "post",
      data: params,
    });
  },

  /**
   * 添加表单字段
   * @param data 表单字段数据
   * @returns 表单字段
   */
  addDynamicFormField(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_FIELD_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 编辑表单字段
   * @param data 表单字段数据
   * @returns 表单字段
   */
  editDynamicFormField(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_FIELD_BASE_URL}`,
      method: "patch",
      data,
    });
  },

  /**
   * 批量新增修改表单字段
   * @param data 表单字段数据
   * @returns 表单字段
   */
  addOrUpdateDynamicFormFieldBatch(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_FIELD_BASE_URL}/Batch`,
      method: "post",
      data,
    });
  },
  /**
   * 删除表单字段
   * @param id 主键
   */
  deleteDynamicFormField(id: string) {
    return request2({
      url: `${DYNAMIC_FORM_FIELD_BASE_URL}`,
      method: "delete",
      params: {
        id,
      },
    });
  },

  /**
   * 批量删除表单字段
   * @param ids 主键集合
   */
  deleteDynamicFormFieldBatch(ids: string[]) {
    return request2({
      url: `${DYNAMIC_FORM_FIELD_BASE_URL}/Batch`,
      method: "delete",
      data: ids,
    });
  },
};
