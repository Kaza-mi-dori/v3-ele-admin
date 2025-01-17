<template>
  <Model1 class="model1" title="历年销售趋势">
    <div
      id="chart22-right-1"
      style="width: 100%; height: 360px; margin-top: 10px"
    />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import sassvariables from "@/styles/variables.module.scss";

// 每个类别对应的数据系列
const months = ["2020年", "2021年", "2022年", "2023年", "2024年"];

// 随机生成收入数据
const getRandomData = () => {
  return months.map(() => ({
    product1: Math.floor(Math.random() * 101),
    product2: Math.floor(Math.random() * 101),
  }));
};

const chart = shallowRef<echarts.ECharts | null>(null);

const initChart = () => {
  chart.value = echarts.init(
    document.getElementById("chart22-right-1") as HTMLDivElement
  );
  chart.value.clear();
  const data = getRandomData();

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["化工产品", "成品油"],
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
      },
      top: 20,
      right: 40,
      itemWidth: 12,
      itemHeight: 7,
    },
    grid: {
      left: "3%",
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
        fontSize: 14,
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
        fontSize: 14,
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    series: [
      {
        name: "化工产品",
        type: "bar",
        data: data.map((item) => item.product1),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: sassvariables["bigscreen-primary-color-9"] },
            { offset: 1, color: sassvariables["bigscreen-primary-color-10"] },
          ]),
        },
        barWidth: "24%",
      },
      {
        name: "成品油",
        type: "bar",
        data: data.map((item) => item.product2),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: sassvariables["bigscreen-primary-color-3"] },
            { offset: 1, color: sassvariables["bigscreen-primary-color-4"] },
          ]),
        },
        barWidth: "24%",
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
