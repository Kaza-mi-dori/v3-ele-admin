import axios from "axios";
import md5 from "js-md5";

const app_key = "35dd5bb864da42aaa4d3cb235f6270a4";
const app_secret = "ecab3cd16b1588a39c49bd1ad2e1cce6";
const access_token =
  "at.7nsnr7dda7vpt5ly90wo1sz03kfv03wm-1ovoqaalgh-1l0ehl5-cepm78gqe";

/**
 * 获取设备列表
 * @param address 地址
 * @param key 腾讯地图key
 * @param sk 腾讯地图sk
 */
export const getDeviceList = async (pageSize?: number) => {
  const { data } = await axios.post(
    `/video-api/api/lapp/device/list?accessToken=${access_token}&pageSize=${pageSize || 50}`
  );
  return data;
};

/**
 * 获取通道列表
 * @param address 地址
 * @param key 腾讯地图key
 * @param sk 腾讯地图sk
 */
export const getCameraList = async (pageSize?: number) => {
  const { data } = await axios.post(
    `/video-api/api/lapp/camera/list?accessToken=${access_token}&pageSize=${pageSize || 50}`
  );
  return data;
};

/**
 * 获取播放地址
 * @param keyword 关键字(/行政区划代码)
 * @param key 腾讯地图key
 * @param sk 腾讯地图sk
 * @param get_polygon 是否返回行政区划边界坐标点(1,2返回；0不返回)
 */
export const getMonitorUrl = async (
  deviceSerial: string,
  channelNo: number,
  protocol?: number,
  type?: number,
  quality?: number
) => {
  const { data } = await axios.post(
    `/video-api/api/lapp/v2/live/address/get?accessToken=${access_token}&deviceSerial=${deviceSerial}&protocol=${protocol || 4}&type=${type || 1}&quality=${quality || 2}&channelNo=${channelNo}&supportH265=1`
  );
  return data;
};
