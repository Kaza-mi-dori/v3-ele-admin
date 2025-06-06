import request2 from "@/utils/request2";

/**
 * 钉钉合同记录详情获取
 */
export const getDingTalkContractLedger = (id: number, ddId: number) => {
  return request2({
    url: `/Api/Business/DingTalkContractRecord`,
    method: "GET",
    params: {
      id,
      ddId,
    },
  });
};

/**
 * 钉钉合同记录新增
 * @param data 请求参数
 * @returns 返回数据
 */
export const addDingTalkContractLedger = (data: any) => {
  return request2({
    url: "/Api/Business/DingTalkContractRecord",
    method: "POST",
    data,
  });
};

/**
 * 钉钉合同记录编辑
 * @param data 请求参数
 * @returns 返回数据
 */
export const editDingTalkContractLedger = (data: any) => {
  return request2({
    url: "/Api/Business/DingTalkContractRecord",
    method: "PATCH",
    data,
  });
};

/**
 * 钉钉合同记录删除
 * @param id 主键id
 * @returns 返回数据
 */
export const deleteDingTalkContractLedger = (id: number) => {
  return request2({
    url: `/Api/Business/DingTalkContractRecord`,
    method: "DELETE",
    params: {
      id,
    },
  });
};

/**
 * 钉钉合同记录查询
 * @param data 请求参数
 * @returns 返回数据
 */
export const queryDingTalkContractLedger = (data: any) => {
  return request2({
    url: "/Api/Business/DingTalkContractRecord/Query",
    method: "POST",
    data,
  });
};
/**
 * 钉钉合同记录列表
 * @param data 请求参数
 * @returns 返回数据
 */
export const getDingTalkContractLedgerList = (data: any) => {
  return request2({
    url: "/Api/Business/DingTalkContractRecord/List",
    method: "POST",
    data,
  });
};

/**
 * (测试)钉钉合同记录手动同步
 * @param data 请求参数
 * @returns 返回数据
 */
export const syncDingTalkContractLedger = (
  startDate: string,
  endDate: string
) => {
  return request2({
    url: "/Api/Business/DingTalkContractRecord/Update/Range",
    method: "POST",
    params: {
      开始日期: startDate,
      结束日期: endDate,
    },
  });
};

export const DingTalkFormApi = {
  getDingTalkContractLedger,
  addDingTalkContractLedger,
  editDingTalkContractLedger,
  deleteDingTalkContractLedger,
  queryDingTalkContractLedger,
  getDingTalkContractLedgerList,
  syncDingTalkContractLedger,
};
