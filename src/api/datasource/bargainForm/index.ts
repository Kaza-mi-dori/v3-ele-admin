import request2 from "@/utils/request2";

const COMMON_URL = "/Api/Business/TradeTracking";

export const BargainFormApi = {
  // 新增
  add(data: any) {
    return request2({
      url: `${COMMON_URL}`,
      method: "post",
      data,
    });
  },
  // 修改
  update(data: any) {
    return request2({
      url: `${COMMON_URL}`,
      method: "patch",
      data,
    });
  },
  // 删除
  delete(id: number | string) {
    return request2({
      url: `${COMMON_URL}`,
      method: "delete",
      params: { id },
    });
  },
  // 批量删除
  deleteByIds(ids: any[]) {
    return request2({
      url: `${COMMON_URL}/DeleteBatch`,
      method: "delete",
      data: ids,
    });
  },
  // 查询
  query(data: any) {
    return request2({
      url: `${COMMON_URL}/Query`,
      method: "post",
      data,
    });
  },
  // 获取详情
  getDetail(id: number | string) {
    return request2({
      url: `${COMMON_URL}`,
      method: "get",
      params: { id },
    });
  },
  // 读取excel文件
  readExcel(data: any) {
    return request2({
      url: `${COMMON_URL}/ReadFromSpecialExcel`,
      method: "post",
      data,
    });
  },
};
