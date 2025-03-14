import path from "path";
import { createDefineMock } from "vite-plugin-mock-dev-server";

export const defineMock = createDefineMock((mock) => {
  // 拼接url
  mock.url = path.join(
    import.meta.env.VITE_APP_API_URL_DEV + "/api/v1/keyIndex",
    mock.url
  );
});

const revenueData = {
  营收: {
    年: {
      当期计划值: 1250,
      当期实际值: 1320,
      累计值: 1320,
      环比: 10.0,
      同比增长: 12.0,
      同比增幅: "12.0%",
    },
  },
};

export default defineMock([
  {
    url: "getIndexData",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        ...revenueData,
      },
      msg: "一切ok",
    },
  },
]);
