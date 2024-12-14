import request2 from "@/utils/request2";

export interface ysERPData {
  id: string | number;
  时间: string;
  类型: string;
  编号: string;
  单号: string;
  批号: string;
  产品名: string;
  罐号: string;
  车船名: string;
  入库: number;
  出库: number;
  结存: number;
  客户: string;
  提货人: string;
}

export interface ysERPDataQuery {
  id集合: any[];
  时间晚于: string;
  时间早于: string;
}

export const ysERPDataAPI = {
  /** 获取库存日志列表 */
  getStorageHisotryList: (data: any) =>
    request2({
      url: "/Api/Business/QzStockRecordSource/Query",
      method: "post",
      data,
    }),
};
