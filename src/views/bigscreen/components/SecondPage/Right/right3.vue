<template>
  <Model1 class="model1" title="经营利润分析">
    <div id="chart2-right-3" style="width: 100%; height: 230px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import sassvariables from "@/styles/variables.module.scss";
import { Decimal } from "decimal.js";

const props = defineProps<{
  data?: any;
}>();

const companyName = inject("companyName");
const router = useRouter();

const months = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
];

const getRandomData = (month: string[]) => {
  // return month.map(() => Math.floor(Math.random() * 101) - 20); // 随机生成-20~-100之间的值
  return props.data
    ? props.data.map((item: any) => item.profit)
    : month.map(() => 0);
};

const chart = shallowRef<echarts.ECharts | null>(null);
const initChart = () => {
  chart.value = echarts.init(
    document.getElementById("chart2-right-3") as HTMLDivElement
  );
  chart.value.clear();
  chart.value.on("click", (params: any) => {
    if (params.seriesType === "bar") {
      router.push({
        name: "Profit",
        query: {
          companyName: companyName as unknown as string,
        },
      });
    }
  });
  const data = getRandomData(months);
  const accuData: number[] = [];
  const monthData: number[] = [];
  // 使用 Decimal 进行高精度累加
  data.reduce((acc, curr) => {
    const current = new Decimal(curr); // 将当前值转换为 Decimal 类型
    const sum = acc.plus(current); // 使用 Decimal 的加法

    // 将结果转换为数字并存入数组
    accuData.push(sum.toNumber());
    monthData.push(current.toNumber());
    // 返回 Decimal 类型的累加值
    return sum;
  }, new Decimal(0)); // 初始值为 Decimal 类型的 0
  const option = {
    tooltip: {
      trigger: "axis",
    },
    color: ["#DB8943", "crimson"],
    legend: {
      orient: "horizontal", // 水平排列
      top: 20,
      right: 40,
      data: ["累计利润", "当月利润"], // 显示的文本
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"], // 文字颜色
        fontSize: 14, // 文字大小
      },
      icon: "rect", // 设置为矩形
      itemWidth: 15, // 设置矩形宽度
      itemHeight: 10, // 设置矩形高度
      // itemStyle: {
      //   color: "#DB8943",
      // },
    },
    grid: {
      left: "3%",
      right: "5%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      data: months,
      axisLine: {
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      axisLabel: {
        fontSize: 15,
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    yAxis: {
      type: "value",
      // min: 0,
      // max: 100,
      // interval: 20,
      name: "单位：万元",
      nameTextStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
        fontSize: 15,
      },
      nameGap: 20,
      axisLine: {
        show: true, // 显示坐标轴线
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          type: "dashed", // 虚线
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      axisLabel: {
        fontSize: 16,
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    series: [
      {
        name: "累计利润", // 与legend中的name对应
        data: accuData,
        type: "line",
        smooth: true, // 设置线条为圆滑
        symbol: "none", // 不显示折线点的点号
        lineStyle: {
          color: "#DB8943", // 设置线条颜色
          width: 3, // 线条宽度
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(219, 137, 67, 0.4)" }, // 折线图顶端颜色
            { offset: 1, color: "rgba(219, 137, 67, 0)" }, // 底部渐变透明
          ]),
        },
      },
      {
        name: "当月利润", // 与legend中的name对应
        data: monthData,
        type: "bar",
        itemStyle: {
          color: (params: any) => {
            return params.value > 0 ? "crimson" : "green";
          },
        },
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          textStyle: {
            color: "#fff",
          },
        },
      },
    ],
  };
  chart.value.setOption(option);
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    chart.value?.resize();
  });
});
</script>

<style lang="scss" scoped>
.model1 {
  @apply flex flex-1 flex-col h-full;
}
</style>
