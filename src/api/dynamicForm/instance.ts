import request2 from "@/utils/request2";

const DYNAMIC_FORM_INSTANCE_BASE_URL = "/Api/Business/FormInstance";

export const DynamicFormInstanceAPI = {
  /**
   * 获取表单实例列表
   * @param params 查询参数
   * @returns 表单实例列表
   */
  getDynamicFormInstanceList(params: any) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_BASE_URL}/Query`,
      method: "post",
      data: params,
    });
  },

  /**
   * 获取表单实例详情
   * @param id 主键
   * @returns 表单实例详情
   */
  getDynamicFormInstanceDetail(id: string) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_BASE_URL}/${id}`,
      method: "get",
    });
  },

  /**
   * 新增表单实例
   * @param data 表单实例数据
   * @returns 表单实例
   */
  addDynamicFormInstance(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 编辑表单实例
   * @param data 表单实例数据
   * @returns 表单实例
   */
  editDynamicFormInstance(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_BASE_URL}`,
      method: "patch",
      data,
    });
  },

  /**
   * 删除表单实例
   * @param id 主键
   */
  deleteDynamicFormInstance(id: string) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_BASE_URL}/${id}`,
      method: "delete",
    });
  },

  /**
   * 批量删除表单实例
   * @param ids 主键集合
   */
  deleteDynamicFormInstanceBatch(ids: string[]) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_BASE_URL}/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 批量新增修改表单实例
   * @param data 表单实例数据
   * @returns 表单实例
   */
  addOrUpdateDynamicFormInstanceBatch(data: any) {
    return request2({
      // url: `${DYNAMIC_FORM_INSTANCE_BASE_URL}/AddorChangeBatch`,
      url: `/Api/Business/FormOperation`,
      method: "put",
      data,
    });
  },

  /**
   * 分页查询
   */
  getDynamicFormInstancePage(params: any) {
    return request2({
      url: `/Api/Business/FormOperation/Query`,
      method: "post",
      data: params,
    });
  },

  /**
   * 获取导入模板
   *  */
  getDynamicFormInstanceImportTemplate(formDefNumber: any) {
    return request2({
      url: `/Api/Business/FormOperation/ImportTemplate`,
      method: "get",
      params: {
        表单定义编号: formDefNumber,
      },
    });
  },

  /**
   * 解析excel文件
   */
  parseExcelFile(data: any) {
    return request2({
      url: `/Api/Business/FormOperation/ParseExcel`,
      method: "post",
      data,
    });
  },
};

const DYNAMIC_FORM_INSTANCE_FIELD_BASE_URL =
  "/Api/Business/FormPropertyInstance";

/**
 * 表单实例字段相关接口
 */
export const DynamicFormInstanceFieldAPI = {
  /**
   * 获取表单实例字段列表
   * @param params 查询参数
   * @returns 表单实例字段列表
   */
  getDynamicFormInstanceFieldList(params: any) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_FIELD_BASE_URL}/Query`,
      method: "get",
      params,
    });
  },

  /**
   * 获取表单实例字段详情
   * @param id 主键
   * @returns 表单实例字段详情
   */
  getDynamicFormInstanceFieldDetail(id: string) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_FIELD_BASE_URL}/${id}`,
      method: "get",
    });
  },

  /**
   * 新增表单实例字段
   * @param data 表单实例字段数据
   * @returns 表单实例字段
   */
  addDynamicFormInstanceField(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_FIELD_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 编辑表单实例字段
   * @param data 表单实例字段数据
   * @returns 表单实例字段
   */
  editDynamicFormInstanceField(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_FIELD_BASE_URL}`,
      method: "patch",
      data,
    });
  },

  /**
   * 批量新增修改表单实例字段
   * @param data 表单实例字段数据
   * @returns 表单实例字段
   */
  addOrUpdateDynamicFormInstanceFieldBatch(data: any) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_FIELD_BASE_URL}/AddorChangeBatch`,
      method: "post",
      data,
    });
  },

  /**
   * 删除表单实例字段
   * @param id 主键
   */
  deleteDynamicFormInstanceField(id: string) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_FIELD_BASE_URL}/${id}`,
      method: "delete",
    });
  },

  /**
   * 批量删除表单实例字段
   * @param ids 主键集合
   */
  deleteDynamicFormInstanceFieldBatch(ids: string[]) {
    return request2({
      url: `${DYNAMIC_FORM_INSTANCE_FIELD_BASE_URL}/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },
};
