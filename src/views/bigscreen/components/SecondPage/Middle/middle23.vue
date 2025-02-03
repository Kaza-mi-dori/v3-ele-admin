<template>
  <Model1 class="model1" title="油品经营分析">
    <div
      id="chart22-middle-3"
      style="width: 100%; height: 230px; margin-top: -10px"
    />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import sassvariables from "@/styles/variables.module.scss";

const props = defineProps<{
  /** 数据 */
  data?: any;
}>();

// 每个类别对应的数据系列
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
  "11月",
  "12月",
];

// 随机生成收入数据
const getRandomData = () => {
  return months.map(() => ({
    income: Math.floor(Math.random() * 101),
    profit: Math.floor(Math.random() * 101),
  }));
};

const chart = shallowRef<echarts.ECharts | null>(null);

const initChart = () => {
  chart.value = echarts.init(
    document.getElementById("chart22-middle-3") as HTMLDivElement
  );
  chart.value.clear();
  const data = getRandomData();

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["经营收入", "利润总额"],
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
      },
      top: 20,
      right: 40,
      itemWidth: 12,
      itemHeight: 7,
      itemGap: 20, // 增加图例间距
    },
    grid: {
      left: "2%",
      right: "4%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
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
        name: "经营收入",
        type: "bar",
        data: data.map((item) => item.income),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#19DCD5" },
            { offset: 1, color: sassvariables["bigscreen-primary-color-6"] },
          ]),
        },
        barWidth: "25%",
      },
      {
        name: "利润总额",
        type: "bar",
        data: data.map((item) => item.profit),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#F29379" },
            { offset: 1, color: "#F14D34" },
          ]),
        },
        barWidth: "25%",
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
