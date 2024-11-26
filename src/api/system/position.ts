import request2 from "@/utils/request2";

const POS_BASE_URL = "/Api/Core/System/Position";

const positionApi = {
  /**
   * 获取所有职位信息
   */
  getAllPositions(data: any) {
    return request2({
      url: `${POS_BASE_URL}/Query`,
      method: "POST",
      data: {
        ...data,
        页码: 1,
        页容量: 1000,
      },
    });
  },
  /**
   * 查询职位信息
   */
  queryPositions(data: any) {
    return request2({
      url: `${POS_BASE_URL}/Query`,
      method: "POST",
      data,
    });
  },
  /**
   * 添加职位
   */
  addPosition(data: any) {
    return request2({
      url: `${POS_BASE_URL}`,
      method: "POST",
      data,
    });
  },
  /**
   * 更新职位
   */
  updatePosition(data: any) {
    return request2({
      url: `${POS_BASE_URL}`,
      method: "PATCH",
      data,
    });
  },
  /**
   * 删除职位
   */
  deletePosition(id: any) {
    return request2({
      url: `${POS_BASE_URL}/${id}`,
      method: "DELETE",
    });
  },
  /**
   * 获取职位详情
   */
  getPositionDetail(id: any) {
    return request2({
      url: `${POS_BASE_URL}/${id}`,
      method: "GET",
    });
  },
};

export default positionApi;
