import request2 from "@/utils/request2";

const BASE_URL = "/Api/Business/MapElementShow";

export const GsLocationAPI = {
  // 获取所有地图元素
  getAllMapElement: () => {
    return request2({
      url: BASE_URL + "/Query",
      method: "post",
      data: {
        页码: 1,
        页容量: 1000,
      },
    });
  },
  // 获取地图元素
  getMapElementList: (data: any) => {
    return request2({
      url: BASE_URL + "/Query",
      method: "post",
      data,
    });
  },

  // 获取地图元素详情
  getMapElementDetail: (id: string | number) => {
    return request2({
      url: BASE_URL,
      method: "get",
      params: {
        id,
      },
    });
  },

  // 添加地图元素
  addMapElement: (data: any) => {
    return request2({
      url: BASE_URL,
      method: "post",
      data,
    });
  },

  // 修改地图元素
  updateMapElement: (data: any) => {
    return request2({
      url: BASE_URL,
      method: "patch",
      data,
    });
  },

  // 删除地图元素
  deleteMapElement: (id: string | number) => {
    return request2({
      url: BASE_URL,
      method: "delete",
      params: {
        id,
      },
    });
  },
};
