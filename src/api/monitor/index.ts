import request2 from "@/utils/request2";

const MONITOR_BASE_URL = "/Api/Business/CCTV";

export interface MonitorQueryDetailVO {
  通道编码: string;
  过期时间: number;
  流类型: number;
  流协议: number;
  访问ip: string;
}

export const MonitorAPI = {
  /**
   * 获取监控列表
   */
  getMonitorList: () => {
    return request2({
      url: `${MONITOR_BASE_URL}/GetChannelList`,
      method: "post",
    });
  },

  /**
   * 获取监控视频流地址
   */
  getMonitorDetail: (data: Partial<MonitorQueryDetailVO>) => {
    return request2({
      url: `${MONITOR_BASE_URL}/GetLiveStreamUrl`,
      method: "post",
      data,
    });
  },
};
