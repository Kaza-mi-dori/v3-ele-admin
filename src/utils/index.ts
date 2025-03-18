import { unref } from "vue";
/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * 判断是否是外部链接
 *
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

/**
 * 深度unref
 */
export function deepUnref(value: any): any {
  if (Array.isArray(value)) {
    return value.map((item) => deepUnref(item));
  } else {
  }
  return unref(value);
}

/**
 * 数值转换为千分位
 */
export function toThousands(num: number | string) {
  // 如果是undefined或者null则返回-
  if (num === undefined || num === null) {
    return "";
  }
  if (typeof num === "string") {
    num = Number(num);
  }
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}

/**
 * 数组转化为字符串
 */
export function arrayToString(arr?: any[] | string, separator = ",") {
  if (!arr) return "";
  if (typeof arr === "string") return arr;
  return arr.join(separator);
}

/**
 * 字符串转化为数组
 */
export function stringToArray(str?: string | string[], separator = ",") {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  return str.split(separator);
}

/**
 * 补全数组
 */
export function fulfillArray(
  arr: any[] | undefined,
  model?: any,
  minLength?: number
) {
  if (!arr) return [];
  if (!minLength || arr.length >= minLength || !model) return arr;
  const fillContent = Array(minLength - arr.length).fill(
    Object.assign({}, model || {})
  );
  return arr.concat(fillContent);
}
