import request2 from "@/utils/request2";

const BUSINESS_STANDBOOK_BASE_URL = "/Api/Business";

const BusinessStandbookAPI = {
  /**
   * 合同展示台账记录新增
   * @param data 合同展示台账记录
   * @returns
   * @throws
   */
  addContractLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 合同展示台账记录修改
   * @param data 合同展示台账记录
   * @returns
   * @throws
   */
  editContractLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 合同展示台账记录批量新增修改
   * @param data 合同展示台账记录
   * @returns
   * @throws
   */
  batchAddEditContractLedgerRecord(data: any[]) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow/AddOrChangeBatch`,
      method: "post",
      data,
    });
  },

  /**
   * 合同展示台账记录详情
   * @param companyId 企业ID
   * @returns 合同展示台账记录详情
   * @throws
   */
  getContractLedgerRecord(id: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow`,
      method: "get",
      params: {
        id,
      },
    });
  },

  /**
   * 合同展示台账记录删除
   * @param companyId 企业ID
   * @returns
   * @throws
   */
  deleteContractLedgerRecord(companyId: number | string) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 合同展示台账批量删除
   * @param ids 合同台账记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deleteContractLedgerRecordByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 合同展示台账记录列表
   * @param data 查询条件
   * @returns 合同展示台账记录列表
   * @throws
   */
  getContractLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 合同展示台账记录导出
   * @param data 查询条件
   * @returns 合同展示台账记录列表
   * @throws
   */
  exportContractLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 合同展示台账记录导入
   * @param data 查询条件
   * @returns 合同展示台账记录列表
   * @throws
   */
  importContractLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 解析钉钉合同台账excel
   * @param data 钉钉合同台账excel
   * @returns
   */
  parseDingTalkContractLedgerExcel(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow/ReadFromDingExcel`,
      method: "post",
      data,
    });
  },

  /**
   * 客商台账记录新增
   * @param data 客商台账记录
   * @returns
   */
  addCustomerAndSupplierLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 客商台账记录修改
   * @param data 客商台账记录
   * @returns
   */
  editCustomerAndSupplierLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 客商台账记录详情
   * @param companyId 企业ID
   * @returns 客商台账记录详情
   */
  getCustomerAndSupplierLedgerRecord(companyId: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 客商台账记录删除
   * @param companyId 企业ID
   * @returns
   */
  deleteCustomerAndSupplierLedgerRecord(companyId: number) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 客商台账记录批量删除
   * @param ids 客商台账记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deleteCustomerAndSupplierLedgerRecordByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 客商台账记录列表
   * @param data 查询条件
   * @returns 客商台账记录列表
   */
  getCustomerAndSupplierLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 客商台账记录导出
   * @param data 查询条件
   * @returns 客商台账记录列表
   */
  exportCustomerAndSupplierLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 客商台账记录导入
   * @param data 查询条件
   * @returns 客商台账记录列表
   */
  importCustomerAndSupplierLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 订单台账记录新增
   * @param data 订单台账记录
   * @returns
   */
  addOrderLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/OrderLedgerShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 订单台账记录修改
   * @param data 订单台账记录
   * @returns
   */
  editOrderLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/OrderLedgerShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 订单台账记录详情
   * @param companyId 企业ID
   * @returns 订单台账记录详情
   */
  getOrderLedgerRecord(companyId: number) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/OrderLedgerShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 订单台账记录删除
   * @param companyId 企业ID
   * @returns
   */
  deleteOrderLedgerRecord(companyId: number) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/OrderLedgerShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 订单台账记录列表
   * @param data 查询条件
   * @returns 订单台账记录列表
   */
  getOrderLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/OrderLedgerShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 订单台账记录导出
   * @param data 查询条件
   * @returns 订单台账记录列表
   */
  exportOrderLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/OrderLedgerShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 订单台账记录导入
   * @param data 查询条件
   * @returns 订单台账记录列表
   */
  importOrderLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/OrderLedgerShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 款项台账记录新增
   * @param data 款项台账记录
   * @returns
   */
  addPaymentLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 款项台账记录修改
   * @param data 款项台账记录
   * @returns
   */
  editPaymentLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 款项台账记录详情
   * @param companyId 企业ID
   * @returns 款项台账记录详情
   */
  getPaymentLedgerRecord(companyId: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 款项台账记录删除
   * @param companyId 企业ID
   * @returns
   */
  deletePaymentLedgerRecord(companyId: number) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 款项台账记录批量删除
   * @param ids 款项台账记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deletePaymentLedgerRecordByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 款项台账记录列表
   * @param data 查询条件
   * @returns 款项台账记录列表
   */
  getPaymentLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 款项台账记录导出
   * @param data 查询条件
   * @returns 款项台账记录列表
   */
  exportPaymentLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 款项台账记录导入
   * @param data 查询条件
   * @returns 款项台账记录列表
   */
  importPaymentLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 结算台账记录新增
   * @param data 结算台账记录
   * @returns
   */
  addSettlementLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 结算台账记录修改
   * @param data 结算台账记录
   * @returns
   */
  editSettlementLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 结算台账记录详情
   * @param companyId 企业ID
   * @returns 结算台账记录详情
   */
  getSettlementLedgerRecord(id: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow`,
      method: "get",
      params: {
        id,
      },
    });
  },

  /**
   * 结算台账记录删除
   * @param companyId 企业ID
   * @returns
   */
  deleteSettlementLedgerRecord(companyId: number) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 结算台账记录批量删除
   * @param ids 结算台账记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deleteSettlementLedgerRecordByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 结算台账记录列表
   * @param data 查询条件
   * @returns 结算台账记录列表
   */
  getSettlementLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 结算台账记录导出
   * @param data 查询条件
   * @returns 结算台账记录列表
   */
  exportSettlementLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 结算台账记录导入
   * @param data 查询条件
   * @returns 结算台账记录列表
   */
  importSettlementLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 货单台账记录新增
   * @param data 货单台账记录
   * @returns
   */
  addWaybillLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ShipmentLedgerShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 货单台账记录修改
   * @param data 货单台账记录
   * @returns
   */
  editWaybillLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ShipmentLedgerShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 货单台账记录详情
   * @param companyId 企业ID
   * @returns 货单台账记录详情
   */
  getWaybillLedgerRecord(companyId: number) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ShipmentLedgerShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 货单台账记录删除
   * @param companyId 企业ID
   * @returns
   */
  deleteWaybillLedgerRecord(companyId: number) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ShipmentLedgerShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 货单台账记录列表
   * @param data 查询条件
   * @returns 货单台账记录列表
   */
  getWaybillLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ShipmentLedgerShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 货单台账记录导出
   * @param data 查询条件
   * @returns 货单台账记录列表
   */
  exportWaybillLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ShipmentLedgerShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 货单台账记录导入
   * @param data 查询条件
   * @returns 货单台账记录列表
   */
  importWaybillLedgerRecord(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ShipmentLedgerShow/Import`,
      method: "post",
      data,
    });
  },
};

export interface CompanyOverviewForm {
  /** 企业名称 */
  companyName: string;
  /** 企业简称 */
  companyShortName: string;
  /** 企业类型 */
  companyType: string;
  /** 企业规模 */
  companySize: string;
  /** 企业人数 */
  companyNumber: string;
  /** 企业资产 */
  companyAssets: string;
  /** 企业性质 */
  companyNature: string;
  /** 企业地址 */
  companyAddress: string;
  /** 企业网址 */
  companyWebsite: string;
  /** 企业电话 */
  companyPhone: string;
  /** 企业邮箱 */
  companyEmail: string;
  /** 企业简介 */
  companyProfile: string;
  /** 企业logo */
  companyLogo: string;
}

export interface CustomerAndSupplierQuery {
  id集合: Array<number | string>;
  数据源集合: Array<string>;
  状态集合: Array<string>;
  日期晚于: string;
  日期早于: string;
}

/** 客商台账详情 */
export interface CustomerAndSupplierLedgerRecordForm {
  id?: number | string;
  履约风险合同数: number;
  累计贸易额: number;
  累计签订合同数: number;
  未履约合同数: number;
  数据源: string;
  日期: string;
  状态: string;
  客商名称: string;
  客商类型: string;
  准入状态: string;
  评价: string;
  备注: string;
}
export default BusinessStandbookAPI;
