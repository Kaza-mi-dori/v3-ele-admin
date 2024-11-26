import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import qs from "qs";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { getToken } from "@/utils/auth2";

// todo: 考虑引入自动重试机制
export const retryRequestWrapper = (request: any, times: number = 3) => {
  return request().catch((error: any) => {
    if (times === 0) {
      return Promise.reject(error);
    }
    return retryRequestWrapper(request, times - 1);
  });
};

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_DEV,
  timeout: 10000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getToken();
    if (accessToken) {
      // config.headers.Authorization = accessToken;
      config.headers["Gtzn-Token"] = `${accessToken}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    // 将标志、消息、代码、对象、时间戳解构出来分别对应 flag、msg、code、data、timestamp

    // const { code, data, msg } = response.data;
    const {
      标志: flag,
      消息: msg,
      代码: code,
      对象: data,
      时间戳: timestamp,
    } = response.data;

    if (Number(code) > ResultEnum.DEV_TOKEN_INVALID_BENCHMARK) {
      window.location.assign("/#/devLogin");
    }

    if (code === ResultEnum.DEV_SUCCESS) {
      // console.log("开发环境请求成功", flag, msg, code, data, timestamp);
      return data;
    }

    ElMessage.error(msg || "系统出错");
    return Promise.reject(new Error(msg || "Error"));
  },
  (error: any) => {
    console.log("请求错误", error);
    // 异常处理 非 2xx 状态码 会进入这里
    if (error.response.data) {
      const { code, msg } = error.response.data;
      if (code === ResultEnum.TOKEN_INVALID) {
        ElNotification({
          title: "提示",
          message: "您的会话已过期，请重新登录",
          type: "info",
        });
        useUserStoreHook()
          .clearUserSession()
          .then(() => {
            location.reload();
          });
      } else {
        ElMessage.error(msg || "系统出错");
      }
    }
    return Promise.reject(error.message);
  }
);

export default service;
