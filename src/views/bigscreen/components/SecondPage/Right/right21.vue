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
        color: "#5099E3",
      },
      top: 20,
      right: 40,
      itemWidth: 12,
      itemHeight: 7,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: months,
      axisLine: {
        lineStyle: {
          color: "#27518D",
        },
      },
      axisLabel: {
        fontSize: 14,
        color: "#5099E3",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true, // 显示坐标轴线
        lineStyle: {
          color: "#27518D",
        },
      },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          type: "dashed", // 虚线
          color: "#27518D",
        },
      },
      axisLabel: {
        fontSize: 14,
        color: "#5099E3",
      },
    },
    series: [
      {
        name: "化工产品",
        type: "bar",
        data: data.map((item) => item.product1),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#25DDA7" },
            { offset: 1, color: "#249E55" },
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
            { offset: 0, color: "#f2b678" },
            { offset: 1, color: "#f18c32" },
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
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}
</style>
