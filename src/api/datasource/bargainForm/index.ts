import request2 from "@/utils/request2";

const COMMON_URL = "/Api/Business/TradeTracking";

export const bargainFormApi = {
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
  delete(data: any) {
    return request2({
      url: `${COMMON_URL}`,
      method: "delete",
      data,
    });
  },
  // 查询
  query(data: any) {
    return request2({
      url: `${COMMON_URL}`,
      method: "get",
      data,
    });
  },
  // 获取详情
  getDetail(id: number | string) {
    return request2({
      url: `${COMMON_URL}/GetDetail`,
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
