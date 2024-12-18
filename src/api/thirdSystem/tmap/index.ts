import axios from "axios";
import md5 from "js-md5";

const TMAP_KEY = "OVGBZ-AB4KU-RE5VF-GWC3I-7M3G5-X4BUJ";
const SK = "54WKMTdRztx9nPgB5aPgDkVawkxLaaLZ";

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
