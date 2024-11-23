import request2 from "@/utils/request2";

const PERM_BASE_URL = "/Api/Core/System/Permission";

const PermissionApi = {
  /**
   * 获取权限列表
   * @param data
   */
  getPermissionList(data: any) {
    return request2({
      url: `${PERM_BASE_URL}/Query`,
      method: "post",
      data,
    });
  },
  /**
   * 添加权限
   * @param data
   */
  addPermission(data: any) {
    return request2({
      url: `${PERM_BASE_URL}`,
      method: "post",
      data,
    });
  },
  /**
   * 获取权限详情
   * @param data
   */
  getPermissionDetail(data: any) {
    return request2({
      url: `${PERM_BASE_URL}`,
      method: "get",
      params: data,
    });
  },
  /**
   * 修改权限
   * @param data
   */
  updatePermission(data: any) {
    return request2({
      url: `${PERM_BASE_URL}`,
      method: "patch",
      data,
    });
  },
  /**
   * 删除权限
   * @param data
   */
  deletePermission(data: any) {
    return request2({
      url: `${PERM_BASE_URL}`,
      method: "delete",
      data,
    });
  },
};
export default PermissionApi;
