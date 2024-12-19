import axios from "axios";
import md5 from "js-md5";

const TMAP_KEY = "OVGBZ-AB4KU-RE5VF-GWC3I-7M3G5-X4BUJ";
const SK = "54WKMTdRztx9nPgB5aPgDkVawkxLaaLZ";

/**
 * 地址转经纬度
 * @param address 地址
 * @param key 腾讯地图key
 * @param sk 腾讯地图sk
 */
export const getGeoCode = async (
  address: string,
  key?: string,
  sk?: string
) => {
  const apiKey = key || TMAP_KEY;
  const skKey = sk || SK;
  // 对address=${address}&key=${apiKey}进行URl编码
  // 生成签名
  // 对签名进行URL编码
  // 拼接URL
  const sign = md5(`/ws/geocoder/v1/?address=${address}&key=${apiKey}${skKey}`);
  // const encodedAddress = encodeURIComponent(address);
  // const encodedSign = encodeURIComponent(sign);
  // const encodedKey = encodeURIComponent(apiKey);
  const { data } = await axios.get(
    `/tmap-api/ws/geocoder/v1/?address=${address}&key=${apiKey}&sig=${sign}`
  );
  return data;
};

/**
 * 行政区划搜索
 * @param keyword 关键字(/行政区划代码)
 * @param key 腾讯地图key
 * @param sk 腾讯地图sk
 * @param get_polygon 是否返回行政区划边界坐标点(1,2返回；0不返回)
 */
export const getDistrict = async (
  keyword: string,
  key?: string,
  sk?: string,
  get_polygon?: number
) => {
  const apiKey = key || TMAP_KEY;
  const skKey = sk || SK;
  const polygon = get_polygon || 1;
  // 对keyword=${keyword}&key=${apiKey}进行URl编码
  // 生成签名
  // 对签名进行URL编码
  // 拼接URL
  const sign = md5(
    `/ws/district/v1/search?get_polygon=${polygon}&key=${apiKey}&keyword=${keyword}${skKey}`
  );
  // const encodedKeyword = encodeURIComponent(keyword);
  const { data } = await axios.get(
    `/tmap-api/ws/district/v1/search?get_polygon=${polygon}&key=${apiKey}&keyword=${keyword}&sig=${sign}`
  );
  return data;
};
