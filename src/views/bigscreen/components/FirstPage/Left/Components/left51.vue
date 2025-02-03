<template>
  <div ref="left51Ref" style="height: 320px" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import sassvariables from "@/styles/variables.module.scss";
import { businessSubjects } from "../../../constants";
import { ref, onMounted, watch, shallowRef } from "vue";
import { OurCompanyEnum } from "@/enums/BusinessEnum";
import { companyStoreHook } from "@/store/modules/company";
import { useRouter } from "vue-router";

const router = useRouter();
const left51Ref = ref<HTMLElement>();
const chartRef = shallowRef<echarts.ECharts>();
const data = ref<any[]>([
  // { title: "广投石化", value: [100, 50, 10, 20, 1000, 250] },
  // { title: "广投石化广东分公司", value: [100, 50, 25, 40, 400, 125] },
  // { title: "广投石化舟山", value: [0, 0, 0, 0, 0, 0] },
  // { title: "永盛仓储", value: [0, 0, 0, 0, 0, 0] },
  { title: "广投石化", value: [100, 50, 10, 20, 1000, 250] },
  { title: "开燃公司", value: [100, 50, 25, 40, 400, 125] },
  { title: "桂盛公司", value: [0, 0, 0, 0, 0, 0] },
  { title: "恒润公司", value: [0, 0, 0, 0, 0, 0] },
]);
const companyStore = companyStoreHook();

// 获取数据
async function getData() {
  const firms = [
    // OurCompanyEnum.GTSHC,
    // OurCompanyEnum.GDFGS,
    // OurCompanyEnum.GTSHC_ZS,
    // OurCompanyEnum.YSCC,
    // OurCompanyEnum.YSSHC,
    OurCompanyEnum.GTSHC,
    OurCompanyEnum.KRY,
    OurCompanyEnum.GSSHC,
    OurCompanyEnum.HRY,
  ];
  const res = await Promise.allSettled(
    firms.map(
      (firm) =>
        new Promise((resolve) => {
          companyStore
            .getFirmReportMap(firm, props.year.toString())
            .then((res) => {
              resolve(res);
            });
        })
    )
  );
  /**
   * 遍历data，查看res中是否存在对应的数据
   * 如果数据不存在，则设置为0
   * 如果数据存在，则更新数据
   */
  data.value.forEach((item: any) => {
    const firmData: any = res.find(
      (res: any) => res.value?.["企业名称"] === item.title
    );
    if (firmData) {
      const totalRow = firmData.value["内容"]?.["详情"]?.find(
        (item: any) => item["业态类型"] === "总体"
      );
      const {
        累计营收金额: revenue,
        累计利润金额: profit,
        累计营收目标完成率: revenueRate,
        累计利润目标完成率: profitRate,
      } = totalRow || {};
      item.value = [
        +revenue,
        +profit,
        +revenueRate,
        +profitRate,
        +(
          firmData.value["内容"]?.["营收基准值"] ||
          (revenueRate ? (revenue / revenueRate).toFixed(2) : 0)
        ),
        +(
          firmData.value["内容"]?.["利润基准值"] ||
          (profitRate ? (profit / profitRate).toFixed(2) : 0)
        ),
      ];
    } else {
      item.value = [0, 0, 0, 0, 0, 0];
    }
  });
}

// 数据整理
function dataFilterOne() {
  const order = {
    [OurCompanyEnum.GTSHC]: 1,
    // [OurCompanyEnum.GDFGS]: 2,
    // [OurCompanyEnum.GTSHC_ZS]: 3,
    // [OurCompanyEnum.YSCC]: 4,
    [OurCompanyEnum.KRY]: 2,
    [OurCompanyEnum.GSSHC]: 3,
    [OurCompanyEnum.HRY]: 4,
  };
  data.value = data.value
    .map((item) => {
      return {
        title: item.title,
        value: item.value,
      };
    })
    .sort(
      (a, b) =>
        order[b.title as keyof typeof order] -
        order[a.title as keyof typeof order]
    );
}

function onClickBar(params: any) {
  const { name, seriesName } = params;
  const subject = businessSubjects.find((item) => item.label === name);
  if (subject) {
    // console.log(subject);
    const route = router.resolve({
      // 第一个字母大写
      name: subject.name.charAt(0).toUpperCase() + subject.name.slice(1),
    });
    if (!route) return;
    window.open(route.href, "_blank");
  }
}

function onClickLabel(params: any) {
  console.log(params);
}

// 初始化图表
function initChart() {
  // 将数据整理为柱状图所需的格式
  dataFilterOne();
  // 柱状图
  if (!chartRef.value) {
    chartRef.value = echarts.init(left51Ref.value as HTMLDivElement);
    // 增加点击回调
    chartRef.value.on("click", "series", onClickBar);
    // 点击series的label
    chartRef.value.on("click", "series.label", onClickLabel);
  }
  chartRef.value.clear();
  console.log(data.value);
  const option = {
    tooltip: {
      trigger: "axis",
    },
    barWidth: "25%",
    // 系列之间的距离
    barGap: "0%",
    // 标题
    title: {
      text: `各主体营收及利润/${props.year}`,
      left: "center",
      top: 10,
      textStyle: {
        color: sassvariables["bigscreen-primary-color-1"],
        fontSize: "1rem",
      },
    },
    color: [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: sassvariables["bigscreen-primary-color-2"] },
        { offset: 1, color: sassvariables["bigscreen-primary-color-4"] },
      ]),
      // 比上面淡一些
      "#96704b",
      // 半透明
      // "rgba(255, 255, 255, 0.9)",
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: sassvariables["bigscreen-primary-color-7"] },
        { offset: 1, color: sassvariables["bigscreen-primary-color-8"] },
      ]),
      "#334c6e",
      // 半透明
      // "rgba(255, 255, 255, 0.9)",
    ],
    grid: {
      bottom: 20,
      left: "3%",
      containLabel: true,
    },
    legend: {
      data: ["营收", "利润"],
      right: 10,
      top: 10,
      textStyle: {
        fontSize: 14,
        color: "#2abfff",
      },
    },
    // x轴单位
    xAxis: {
      type: "value",
      name: "单位:万元",
      nameTextStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
        fontWeight: "bold",
      },
      ameLocation: "end", // 将单位文字放到坐标轴末尾位置
      nameGap: 5, // 调整单位文字和坐标轴的间距，负值可以让它向左移动
      axisLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: sassvariables["bigscreen-primary-color-7"],
      },
      axisLine: {
        show: true, // 显示坐标轴线
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      splitLine: {
        show: false, // 显示分割线
        lineStyle: {
          type: "dashed", // 虚线
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
    },
    yAxis: {
      type: "category",
      data: data.value.map((item) => item.title),
      axisLabel: {
        // 全部显示
        interval: 0,
        color: sassvariables["bigscreen-primary-color-7"],
        fontSize: "0.9rem",
        fontWeight: "bold",
      },
    },
    series: [
      {
        name: "营收",
        type: "bar",
        stack: "revenue",
        data: data.value.map((item) => item.value[0]),
        label: {
          show: true,
          position: "inside",
          textStyle: {
            // 文字颜色
            color: "#fff",
            fontSize: "0.8rem",
            fontWeight: "bold",
            align: "center",
            verticalAlign: "middle",
          },
          // 数值/百分比
          formatter: "{c}",
        },
        // markPoint显示完成率
        markPoint: {
          data: data.value.map((item) => ({
            symbolSize: 35,
            symbolOffset: [0, "-5%"],
            // symbol背景色
            itemStyle: {
              color: "crimson",
            },
            xAxis: item.value[0],
            yAxis: item.title,
            value: item.value[4]
              ? ((item.value[0] / item.value[4]) * 100).toFixed(0) + "%"
              : "0%",
          })),
          label: {
            fontWeight: "bold",
            color: "#fff",
          },
        },
        // markLine: {
        //   symbol: "none",
        //   label: {
        //     show: false,
        //   },
        //   data: data.value
        //     .filter(
        //       (item) => item.value[0] > 0 && item.value[0] < item.value[4]
        //     )
        //     .map((item) => ({
        //       type: "line",
        //       xAxis: item.value[0],
        //       lineStyle: {
        //         color: "rgba(255, 255, 255)",
        //         cap: "round",
        //       },
        //       dashOffset: 5,
        //     })),
        // },
      },
      {
        name: "未完成营收",
        type: "bar",
        stack: "revenue",
        // 如果小于0，则显示0
        data: data.value.map((item) =>
          item.value[4] - item.value[0] < 0 ? 0 : item.value[4] - item.value[0]
        ),
      },
      {
        name: "利润",
        type: "bar",
        stack: "profit",
        data: data.value.map((item) => item.value[1]),
        label: {
          show: true,
          position: "inside",
          textStyle: {
            color: "#fff",
            fontSize: "0.8rem",
            fontWeight: "bold",
            align: "center",
            verticalAlign: "middle",
          },
          formatter: "{c}",
        },
      },
      {
        name: "未完成利润",
        type: "bar",
        stack: "profit",
        // 如果小于0，则显示0
        data: data.value.map((item) =>
          item.value[5] - item.value[1] < 0 ? 0 : item.value[5] - item.value[1]
        ),
      },
    ],
  };
  chartRef.value.setOption(option);
}

const props = defineProps<{
  year: number;
}>();

watch(
  () => props.year,
  async () => {
    await getData();
    initChart();
  }
);

onMounted(async () => {
  await getData();
  initChart();
  // 监听窗口变化，重置图表
  window.addEventListener("resize", () => {
    try {
      chartRef.value?.resize();
    } catch (e) {
      console.log(e);
    }
  });
});
</script>
