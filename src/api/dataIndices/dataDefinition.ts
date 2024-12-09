import request2 from "@/utils/request2";

const BASE_URL = "/Api/Business/IntegratedDataDefinition";

export const DataDefinitionAPI = {
  /**
   * 获取所有数据定义
   *
   * @returns 数据定义列表
   */
  getAllDataDefinition: () => {
    return request2({
      url: `${BASE_URL}/GetAllDefinitionType`,
      method: "get",
    });
  },
  /**
   * 获取数据定义列表
   */
  getDataDefinitionList: (data: any) => {
    return request2({
      url: `${BASE_URL}/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 添加数据定义
   * @param data
   */
  addDataDefinition: (data: any) => {
    return request2({
      url: `${BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 修改数据定义
   * @param data
   */
  updateDataDefinition: (data: any) => {
    return request2({
      url: `${BASE_URL}`,
      method: "patch",
      data,
    });
  },

  /**
   * 删除数据定义
   * @param data
   */
  deleteDataDefinition: (data: any) => {
    return request2({
      url: `${BASE_URL}`,
      method: "delete",
      data,
    });
  },
};
