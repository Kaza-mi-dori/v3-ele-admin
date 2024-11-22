import { store } from "@/store";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useDictStoreHook } from "@/store/modules/dict";

import AuthAPI, { type LoginData } from "@/api/auth";
import UserAPI, { type UserInfo } from "@/api/system/user";

import { setToken, clearToken, setToken2, clearToken2 } from "@/utils/auth";
import { AuthAPI_2, type LoginData_2 } from "@/api/auth";
import { UserAPI_2 } from "@/api/system/user";

export const useUserStoreDev = defineStore("user", () => {
  const userInfo = useStorage<any>("userInfo", {} as any);

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData_2) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI_2.login(loginData)
        .then((data) => {
          // const { tokenType, accessToken } = data;
          const accessToken = data;
          setToken2(accessToken); // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 获取用户信息
   *
   * @returns {UserInfo} 用户信息
   */
  function getUserInfo(token: string) {
    return new Promise<any>((resolve, reject) => {
      UserAPI_2.getInfo(token)
        .then((data) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          Object.assign(userInfo.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 登出
   */
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI_2.logout()
        .then(() => {
          clearUserSession();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   *  清理用户会话
   *
   * @returns
   */
  function clearUserSession() {
    return new Promise<void>((resolve) => {
      clearToken2();
      usePermissionStoreHook().resetRouter();
      useDictStoreHook().clearDictionaryCache();
      resolve();
    });
  }

  return {
    userInfo,
    getUserInfo,
    login,
    logout,
    clearUserSession,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreDevHook() {
  return useUserStoreDev(store);
}
