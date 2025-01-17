<template>
  <Model1 class="model1" title="原油采购价格历史趋势分析">
    <div id="chart22-left-1" style="width: 100%; height: 360px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import sassvariables from "@/styles/variables.module.scss";

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
  return month.map(() => Math.floor(Math.random() * 101)); // 随机生成0-100之间的值
};

const chart = shallowRef<echarts.ECharts | null>(null);
const initChart = () => {
  chart.value = echarts.init(
    document.getElementById("chart22-left-1") as HTMLDivElement
  );
  chart.value.clear();
  const data = getRandomData(months);
  const option = {
    grid: {
      left: "3%",
      right: "6%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
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
        data: data,
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
