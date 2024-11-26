import request2 from "@/utils/request2";

const PERM_BASE_URL = "/Api/Core/System/Permission";

export type PermissionType = "菜单" | "按钮" | "接口";
export interface PermissionForm {
  /** 权限ID */
  id?: number;
  /** 权限名称 */
  名称: string;
  /** 权限编码 */
  编码: string;
  /** 权限描述 */
  描述?: string;
  /** 权限类型 */
  类型: PermissionType;
  /** 权限地址 */
  地址?: string;
}

export interface PermissionQuery {
  /** 权限名称 */
  名称: string;
  /** 权限编码 */
  编码: string;
}

const PermissionApi = {
  /**
   * 获取所有权限
   */
  getAllPermission() {
    return request2({
      url: `${PERM_BASE_URL}/Query`,
      method: "post",
      data: {
        页码: 1,
        页容量: 1000,
      },
    });
  },
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
  getPermissionDetail(id: string | number) {
    return request2({
      url: `${PERM_BASE_URL}`,
      method: "get",
      params: {
        id,
      },
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
   * @param id
   */
  deletePermission(id: number | string) {
    return request2({
      url: `${PERM_BASE_URL}`,
      method: "delete",
      params: { id },
    });
  },
};
export default PermissionApi;
