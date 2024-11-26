import request2 from "@/utils/request2";

const BUSINESS_STANDBOOK_BASE_URL = "/Api/Business";

const BusinessFormAPI = {
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
   * 合同展示台账记录详情
   * @param companyId 企业ID
   * @returns 合同展示台账记录详情
   * @throws
   */
  getContractLedgerRecord(companyId: number) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 合同展示台账记录删除
   * @param companyId 企业ID
   * @returns
   * @throws
   */
  deleteContractLedgerRecord(companyId: number) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow`,
      method: "delete",
      params: {
        id: companyId,
      },
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
      url: `${BUSINESS_STANDBOOK_BASE_URL}/ContractLedgerShow`,
      method: "get",
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
  getCustomerAndSupplierLedgerRecord(companyId: number) {
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
   * 客商台账记录列表
   * @param data 查询条件
   * @returns 客商台账记录列表
   */
  getCustomerAndSupplierLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CustomerAndSupplierLedgerShow`,
      method: "get",
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
  addCompanyReportForm(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CorporateOperationsReportShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 订单台账记录修改
   * @param data 订单台账记录
   * @returns
   */
  editCompanyReportForm(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CorporateOperationsReportShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 订单台账记录详情
   * @param companyId 企业ID
   * @returns 订单台账记录详情
   */
  getCompanyReportForm(companyId: number) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CorporateOperationsReportShow`,
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
  deleteCompanyReportForm(companyId: number) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CorporateOperationsReportShow`,
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
  getCompanyReportFormList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CorporateOperationsReportShow`,
      method: "get",
      data,
    });
  },

  /**
   * 订单台账记录导出
   * @param data 查询条件
   * @returns 订单台账记录列表
   */
  exportCompanyReportForm(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CorporateOperationsReportShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 订单台账记录导入
   * @param data 查询条件
   * @returns 订单台账记录列表
   */
  importCompanyReportForm(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/CorporateOperationsReportShow/Import`,
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
  }

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
  getPaymentLedgerRecord(companyId: number) {
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
   * 款项台账记录列表
   * @param data 查询条件
   * @returns 款项台账记录列表
   */
  getPaymentLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/PaymentLedgerShow`,
      method: "get",
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
  getSettlementLedgerRecord(companyId: number) {
    return request2<any, any>({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow`,
      method: "get",
      params: {
        id: companyId,
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
   * 结算台账记录列表
   * @param data 查询条件
   * @returns 结算台账记录列表
   */
  getSettlementLedgerRecordList(data: any) {
    return request2({
      url: `${BUSINESS_STANDBOOK_BASE_URL}/SettlementLedgerShow`,
      method: "get",
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
      url: `${BUSINESS_STANDBOOK_BASE_URL}/WaybillLedgerShow`,
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
      url: `${BUSINESS_STANDBOOK_BASE_URL}/WaybillLedgerShow`,
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
      url: `${BUSINESS_STANDBOOK_BASE_URL}/WaybillLedgerShow`,
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
      url: `${BUSINESS_STANDBOOK_BASE_URL}/WaybillLedgerShow`,
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
      url: `${BUSINESS_STANDBOOK_BASE_URL}/WaybillLedgerShow`,
      method: "get",
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
      url: `${BUSINESS_STANDBOOK_BASE_URL}/WaybillLedgerShow/Export`,
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
      url: `${BUSINESS_STANDBOOK_BASE_URL}/WaybillLedgerShow/Import`,
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

export default BusinessFormAPI;
