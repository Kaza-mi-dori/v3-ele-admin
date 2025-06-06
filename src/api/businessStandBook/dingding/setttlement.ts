import request2 from "@/utils/request2";

/**
 * 钉钉结算记录详情获取
 */
export const getDingTalkSettlementLedger = (id: number, ddId: number) => {
  return request2({
    url: `/Api/Business/DingTalkSettlementRecord`,
    method: "GET",
    params: {
      id,
      ddId,
    },
  });
};

/**
 * 钉钉结算记录新增
 * @param data 请求参数
 * @returns 返回数据
 */
export const addDingTalkSettlementLedger = (data: any) => {
  return request2({
    url: "/Api/Business/DingTalkSettlementRecord",
    method: "POST",
    data,
  });
};

/**
 * 钉钉结算记录编辑
 * @param data 请求参数
 * @returns 返回数据
 */
export const editDingTalkSettlementLedger = (data: any) => {
  return request2({
    url: "/Api/Business/DingTalkSettlementRecord",
    method: "PATCH",
    data,
  });
};

/**
 * 钉钉结算记录删除
 * @param id 主键id
 * @returns 返回数据
 */
export const deleteDingTalkSettlementLedger = (id: number) => {
  return request2({
    url: `/Api/Business/DingTalkSettlementRecord`,
    method: "DELETE",
    params: {
      id,
    },
  });
};

/**
 * 钉钉结算记录查询
 * @param data 请求参数
 * @returns 返回数据
 */
export const queryDingTalkSettlementLedger = (data: any) => {
  return request2({
    url: "/Api/Business/DingTalkSettlementRecord/Query",
    method: "POST",
    data,
  });
};
/**
 * 钉钉结算记录列表
 * @param data 请求参数
 * @returns 返回数据
 */
export const getDingTalkSettlementLedgerList = (data: any) => {
  return request2({
    url: "/Api/Business/DingTalkSettlementRecord/List",
    method: "POST",
    data,
  });
};

/**
 * (测试)钉钉结算记录手动同步
 * @param data 请求参数
 * @returns 返回数据
 */
export const syncDingTalkSettlementLedger = (
  startDate: string,
  endDate: string
) => {
  return request2({
    url: "/Api/Business/DingTalkSettlementRecord/Update/Range",
    method: "POST",
    params: {
      开始日期: startDate,
      结束日期: endDate,
    },
  });
};

export const DingTalkSettlementFormApi = {
  getDingTalkSettlementLedger,
  addDingTalkSettlementLedger,
  editDingTalkSettlementLedger,
  deleteDingTalkSettlementLedger,
  queryDingTalkSettlementLedger,
  getDingTalkSettlementLedgerList,
  syncDingTalkSettlementLedger,
};
