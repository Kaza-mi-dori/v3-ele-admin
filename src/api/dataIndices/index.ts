import request2 from "@/utils/request2";

const BASE_URL = "/Api/Business/IntegratedData";

export const DataIndicesAPI = {
  /**
   * 获取所有数据指标
   *
   * @returns 数据指标列表
   */
  getAllDataIndices: () => {
    return request2({
      url: `${BASE_URL}/QueryIntegratedData`,
      method: "post",
      data: {
        页码: 1,
        页容量: 1000,
      },
    });
  },
  /**
   * 获取数据指标列表
   */
  getDataIndicesList: (data: any) => {
    return request2({
      url: `${BASE_URL}/QueryIntegratedData`,
      method: "post",
      data,
    });
  },

  /**
   * 新增数据指标
   * @param data 新增数据指标信息(数组)
   */
  addDataIndicesInBatch: (data: any) => {
    return request2({
      url: `${BASE_URL}`,
      method: "post",
      data,
    });
  },
  /**
   * 修改数据指标
   * @param data
   */
  updateDataIndices: (data: any) => {
    return request2({
      url: `${BASE_URL}`,
      method: "put",
      data,
    });
  },

  /**
   * 删除数据指标
   * @param data
   */
  deleteDataIndices: (data: any) => {
    return request2({
      url: `${BASE_URL}`,
      method: "delete",
      data,
    });
  },

  /**获取导入模板 */
  getImportTemplate: (params: string[]) => {
    return request2({
      url: `${BASE_URL}/GetIntegratedDataTemplate`,
      method: "get",
      params: {
        标识集合: params.join(","), // 将数组转换为字符串
      },
      responseType: "blob",
    });
  },

  /** 解析excel模板数据 */
  parseExcelData: (params: any) => {
    return request2({
      url: `${BASE_URL}/GetExcelData`,
      method: "post",
      params,
    });
  },

  /**根据查询条件获取导出excel文件 */
  exportExcel: (data: any) => {
    return request2({
      url: `${BASE_URL}/ExportIntegratedDataExcel`,
      method: "post",
      data,
      responseType: "blob",
    });
  },
};
