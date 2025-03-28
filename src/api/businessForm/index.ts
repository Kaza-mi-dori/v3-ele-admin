import request2 from "@/utils/request2";
import request from "@/utils/request";
import add from "@/views/demo/curd/config/add";

const BUSINESS_FORM_BASE_URL = "/Api/Business";

const BusinessFormAPI = {
  /**
   * 企业概况表单新增
   * @param data 企业概况表单
   * @returns
   * @throws
   */
  addCompanyDescForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CompanyOverviewShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 企业概况表单修改
   * @param data 企业概况表单
   * @returns
   * @throws
   */
  editCompanyDescForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CompanyOverviewShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 企业概况表单详情
   * @param companyId 企业ID
   * @returns 企业概况表单详情
   * @throws
   */
  getCompanyDescForm(companyId: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/CompanyOverviewShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 企业概况表单删除
   * @param companyId 企业ID
   * @returns
   * @throws
   */
  deleteCompanyDescForm(companyId: number) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CompanyOverviewShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 企业概况表单批量删除
   * @param ids 企业概况表单记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deleteCompanyDescFormByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CompanyOverviewShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 企业概况表单列表
   * @param data 查询条件
   * @returns 企业概况表单列表
   * @throws
   */
  getCompanyDescFormList(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CompanyOverviewShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 企业概况表单导出
   * @param data 查询条件
   * @returns 企业概况表单列表
   * @throws
   */
  exportCompanyDescForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CompanyOverviewShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 企业概况表单导入
   * @param data 查询条件
   * @returns 企业概况表单列表
   * @throws
   */
  importCompanyDescForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CompanyOverviewShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 业态经营报表新增
   * @param data 业态经营报表
   * @returns
   */
  addBusinessReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/BusinessOperationsReportShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 业态经营报表修改
   * @param data 业态经营报表
   * @returns
   */
  editBusinessReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/BusinessOperationsReportShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 业态经营报表详情
   * @param companyId 企业ID
   * @returns 业态经营报表详情
   */
  getBusinessReportForm(companyId: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/BusinessOperationsReportShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 业态经营报表删除
   * @param companyId 企业ID
   * @returns
   */
  deleteBusinessReportForm(companyId: number) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/BusinessOperationsReportShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 业态经营报表批量删除
   * @param ids 业态经营报表记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deleteBusinessReportFormByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/BusinessOperationsReportShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 业态经营报表列表
   * @param data 查询条件
   * @returns 业态经营报表列表
   */
  getBusinessReportFormList(data: any) {
    return request2<any, PageResultDev<any>>({
      url: `${BUSINESS_FORM_BASE_URL}/BusinessOperationsReportShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 业态经营报表导出
   * @param data 查询条件
   * @returns 业态经营报表列表
   */
  exportBusinessReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/BusinessOperationsReportShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 业态经营报表导入
   * @param data 查询条件
   * @returns 业态经营报表列表
   */
  importBusinessReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/BusinessOperationsReportShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 企业经营报表新增
   * @param data 企业经营报表
   * @returns
   */
  addCompanyReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateOperationsReportShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 企业经营报表修改
   * @param data 企业经营报表
   * @returns
   */
  editCompanyReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateOperationsReportShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 企业经营报表详情
   * @param companyId 企业ID
   * @returns 企业经营报表详情
   */
  getCompanyReportForm(companyId: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateOperationsReportShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 企业经营报表删除
   * @param companyId 企业ID
   * @returns
   */
  deleteCompanyReportForm(companyId: number) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateOperationsReportShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 企业经营报表批量删除
   * @param ids 企业经营报表记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deleteCompanyReportFormByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateOperationsReportShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 企业经营报表列表
   * @param data 查询条件
   * @returns 企业经营报表列表
   */
  getCompanyReportFormList(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateOperationsReportShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 企业经营报表导出
   * @param data 查询条件
   * @returns 企业经营报表列表
   */
  exportCompanyReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateOperationsReportShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 企业经营报表导入
   * @param data 查询条件
   * @returns 企业经营报表列表
   */
  importCompanyReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateOperationsReportShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 贸易伙伴报表新增
   * @param data 贸易伙伴报表
   * @returns
   */
  addTradePartnersReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 贸易伙伴报表修改
   * @param data 贸易伙伴报表
   * @returns
   */
  editTradePartnersReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 贸易伙伴报表详情
   * @param companyId 企业ID
   * @returns 贸易伙伴报表详情
   */
  getTradePartnersReportForm(companyId: number) {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 贸易伙伴报表删除
   * @param companyId 企业ID
   * @returns
   */
  deleteTradePartnersReportForm(id: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow`,
      method: "delete",
      params: {
        id,
      },
    });
  },

  /**
   * 贸易伙伴报表批量删除
   * @param ids 贸易伙伴报表记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deleteTradePartnersReportFormByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 贸易伙伴报表列表
   * @param data 查询条件
   * @returns 贸易伙伴报表列表
   */
  getTradePartnersReportFormList(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 贸易伙伴报表导出
   * @param data 查询条件
   * @returns 贸易伙伴报表列表
   */
  exportTradePartnersReportForm(params: any) {
    // return request2({
    //   url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow/Export`,
    //   method: "get",
    //   params,
    // });
    return request({
      url: `/excel/PartnerReportExport`,
      method: "post",
      data: params,
      responseType: "arraybuffer",
    });
  },

  /**
   * 贸易伙伴报表导入
   * @param data 查询条件
   * @returns 贸易伙伴报表列表
   */
  importTradePartnersReportForm(data: any) {
    // return request2({
    //   url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow/Import`,
    //   method: "post",
    //   data,
    // });
    return request({
      url: `/excel/PartnerReportImport`,
      method: "post",
      data,
    });
  },

  /**
   * 贸易伙伴报表导入模板获取
   * @returns 贸易伙伴报表导入模板
   */
  getTradePartnersReportFormImportTemplate() {
    // return request2({
    //   url: `${BUSINESS_FORM_BASE_URL}/TradePartnersReportShow/ImportTemplate`,
    //   method: "get",
    //   responseType: "arraybuffer",
    // });
    return request({
      url: `/excel/PartnerReportImportTemplate`,
      method: "get",
      responseType: "arraybuffer",
    });
  },

  /**
   * 市场报价报表新增
   * @param data 市场报价报表
   * @returns
   * @throws
   */
  addMarketQuotationReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/MarketQuotationShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 市场报价报表修改
   * @param data 市场报价报表
   * @returns
   * @throws
   */
  editMarketQuotationReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/MarketQuotationShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 市场报价报表详情
   * @param companyId 企业ID
   * @returns 市场报价报表详情
   * @throws
   */
  getMarketQuotationReportForm(companyId: number) {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/MarketQuotationShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 市场报价报表删除
   * @param companyId 企业ID
   * @returns
   * @throws
   */
  deleteMarketQuotationReportForm(companyId: number) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/MarketQuotationShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 市场报价报表批量删除
   * @param ids 市场报价报表记录ID字符串，多个以英文逗号(,)分割
   * @returns
   */
  deleteMarketQuotationReportFormByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/MarketQuotationShow/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 市场报价报表列表
   * @param data 查询条件
   * @returns 市场报价报表列表
   * @throws
   */
  getMarketQuotationReportFormList(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/MarketQuotationShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 市场报价报表导出
   * @param data 查询条件
   * @returns 市场报价报表列表
   * @throws
   */
  exportMarketQuotationReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/MarketQuotationShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 市场报价报表导入
   * @param data 查询条件
   * @returns 市场报价报表列表
   * @throws
   */
  importMarketQuotationReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/MarketQuotationShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 产品报价报表新增
   * @param data 产品报价报表
   * @returns
   */
  addProductQuotationReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductQuotationShow`,
      method: "post",
      data: data,
    });
  },

  /**
   * 产品报价报表修改
   * @param data 产品报价报表
   * @returns
   */
  editProductQuotationReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductQuotationShow`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 产品报价报表详情
   * @param companyId 企业ID
   * @returns 产品报价报表详情
   */
  getProductQuotationReportForm(companyId: number) {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/ProductQuotationShow`,
      method: "get",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 产品报价报表删除
   * @param companyId 企业ID
   * @returns
   */
  deleteProductQuotationReportForm(companyId: number) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductQuotationShow`,
      method: "delete",
      params: {
        id: companyId,
      },
    });
  },

  /**
   * 产品报价报表列表
   * @param data 查询条件
   * @returns 产品报价报表列表
   */
  getProductQuotationReportFormList(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductQuotationShow/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 产品报价报表导出
   * @param data 查询条件
   * @returns 产品报价报表列表
   */
  exportProductQuotationReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductQuotationShow/Export`,
      method: "get",
      data,
    });
  },

  /**
   * 产品报价报表导入
   * @param data 查询条件
   * @returns 产品报价报表列表
   */
  importProductQuotationReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductQuotationShow/Import`,
      method: "post",
      data,
    });
  },

  /**
   * 获取产品类型包含关系
   *
   */
  getProductRelation() {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/ProductRelation`,
      method: "get",
    });
  },

  /**
   * 获取企业关系
   *
   */
  getEnterpriseRelation() {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/EnterpriseRelation`,
      method: "get",
    });
  },

  /**
   * 产品经营报表新增
   * @param data 产品经营报表
   * @returns
   */
  addMonthlyProductReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductMonthReport`,
      method: "post",
      data: data,
    });
  },

  /**
   * 产品经营报表修改
   * @param data 产品经营报表
   * @returns
   */
  editMonthlyProductReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductMonthReport`,
      method: "patch",
      data: data,
    });
  },

  /**
   * 产品经营报表详情
   * @param companyId 企业ID
   * @returns 产品经营报表详情
   */
  getMonthlyProductReportForm(id: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/ProductMonthReport`,
      method: "get",
      params: {
        id: id,
      },
    });
  },

  /**
   * 产品经营报表删除
   * @param id 产品经营报表ID
   * @returns
   */
  deleteMonthlyProductReportFormByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductMonthReport/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 产品经营报表列表
   * @param data 查询条件
   * @returns 产品经营报表列表
   */
  getMonthlyProductReportFormList(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductMonthReport/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 产品经营报表导出
   * @param data 查询条件
   * @returns 产品经营报表列表
   */
  exportMonthlyProductReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductMonthReport/Export/exportExcel`,
      method: "post",
      data,
      responseType: "blob",
    });
  },

  /**
   * 获取产品经营报表导入模板
   * @returns 产品经营报表导入模板
   */
  getMonthlyProductReportImportTemplate() {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductMonthReport/GetExcelTemplate`,
      method: "get",
      responseType: "blob",
    });
  },

  /**
   * 批量新增修改产品经营报表
   * @param data 产品经营报表
   * @returns
   */
  addOrUpdateMonthlyProductReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/ProductMonthReport/AddOrChangeBatch`,
      method: "post",
      data,
    });
  },

  /**DailyStorageReport
   * 库存报表查询
   */
  getCorporateStorageReportList(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 新增库存报表
   * @param data
   * @returns
   */
  addDailyStorageReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport`,
      method: "post",
      data,
    });
  },

  /**
   * 修改库存报表
   * @param data
   * @returns
   */
  editDailyStorageReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/`,
      method: "patch",
      data,
    });
  },
  /**
   * 库存报表详情
   * @param id 库存报表ID
   */
  getDailyStorageReportForm(id: number | string) {
    return request2<any, any>({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport`,
      method: "get",
      params: {
        id,
      },
    });
  },

  /**
   * 删除库存报表
   * @param id 库存报表ID
   */
  deleteDailyStorageReportForm(id: number | string) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport`,
      method: "delete",
      params: {
        id,
      },
    });
  },

  /**
   * 批量删除库存报表
   * @param ids 库存报表ID字符串，多个以英文逗号(,)分割
   */
  deleteDailyStorageReportFormByIds(ids: any[]) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },

  /**
   * 库存报表导出
   * @param data 查询条件
   */
  exportDailyStorageReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport/Export/exportExcel`,
      method: "post",
      data,
      responseType: "blob",
    });
  },

  /**
   * 库存报表excel解析
   * @param data 查询条件
   */
  importDailyStorageReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport/Import/importExcel`,
      method: "post",
      data,
    });
  },

  /**
   * 获取库存报表导入模板
   */
  getDailyStorageReportImportTemplate() {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport/GetExcelTemplate`,
      method: "get",
      responseType: "blob",
    });
  },

  /**
   * 批量新增修改库存报表
   * @param data 库存报表
   * @returns
   */
  addOrUpdateDailyStorageReportForm(data: any) {
    return request2({
      url: `${BUSINESS_FORM_BASE_URL}/CorporateStorageReport/AddOrChangeBatch`,
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

export interface BusinessReportQuery {
  /** 业务维度 */
  业务维度: string;
  /** 状态集合 */
  状态集合: string[];
  /** id集合 */
  id集合: string[];
  /** 日期早于 */
  日期早于: string;
  /** 日期晚于 */
  日期晚于: string;
  /** 企业名称 */
  企业名称: string;
  /** 类型集合 */
  类型集合: string[];
}

export interface MarketQuotationReportQuery {
  /** 业务维度 */
  业务维度: string;
  /** 状态集合 */
  状态集合: string[];
  /** id集合 */
  id集合: string[];
  /** 产品名称 */
  产品名称: string;
  /** 日期早于 */
  日期早于: string;
  /** 日期晚于 */
  日期晚于: string;
}

export default BusinessFormAPI;
