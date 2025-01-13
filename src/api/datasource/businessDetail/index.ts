import request2 from "@/utils/request2";

const COMMON_URL = "/Api/Business/";

export const BusinessDetailAPI = {
  // 采购明细报表查询
  getPurchaseDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport/Query`,
      method: "post",
      data,
    });
  },

  // 新增
  addPurchaseDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport`,
      method: "post",
      data,
    });
  },

  // 获取详情
  getPurchaseDetailReportDetail(id: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport`,
      method: "get",
      params: { id },
    });
  },

  // 编辑
  editPurchaseDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport`,
      method: "put",
      data,
    });
  },

  // 删除
  deletePurchaseDetailReport(id: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport`,
      method: "delete",
      params: { id },
    });
  },

  // 采购明细报表导出
  exportPurchaseDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport/Export`,
      method: "post",
      data,
    });
  },

  // 采购明细报表导入
  importPurchaseDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport/Import`,
      method: "post",
      data,
    });
  },

  // 批量新增
  batchAddPurchaseDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport/BatchAdd`,
      method: "post",
      data,
    });
  },

  // 批量删除
  batchDeletePurchaseDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/PurchaseDetailReport/BatchDelete`,
      method: "post",
      data,
    });
  },

  // 销售明细报表查询
  getSaleDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/SaleDetailReport/Query`,
      method: "post",
      data,
    });
  },

  // 销售明细报表导出
  exportSaleDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/SaleDetailReport/Export`,
      method: "post",
      data,
    });
  },

  // 销售明细报表导入
  importSaleDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/SaleDetailReport/Import`,
      method: "post",
      data,
    });
  },

  // 批量新增
  batchAddSaleDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/SaleDetailReport/BatchAdd`,
      method: "post",
      data,
    });
  },

  // 批量删除
  batchDeleteSaleDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/SaleDetailReport/BatchDelete`,
      method: "post",
      data,
    });
  },

  // 新增
  addSaleDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/SaleDetailReport`,
      method: "post",
      data,
    });
  },

  // 获取详情
  getSaleDetailReportDetail(id: any) {
    return request2({
      url: `${COMMON_URL}/SaleDetailReport`,
      method: "get",
      params: { id },
    });
  },

  // 编辑
  editSaleDetailReport(data: any) {
    return request2({
      url: `${COMMON_URL}/SaleDetailReport`,
      method: "put",
      data,
    });
  },
};
