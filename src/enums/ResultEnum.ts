/**
 * 响应码枚举
 */
export const enum ResultEnum {
  /**
   * 成功
   */
  SUCCESS = "00000",
  /**
   * 错误
   */
  ERROR = "B0001",

  /**
   * 令牌无效或过期
   */
  TOKEN_INVALID = "A0230",

  /**
   * 开发环境正常返回
   */
  DEV_SUCCESS = "200",

  /**
   * 开发环境鉴权失败
   */
  DEV_TOKEN_INVALID_BENCHMARK = 10000,
}
