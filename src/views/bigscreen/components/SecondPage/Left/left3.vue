<template>
  <Model1 class="model1" title="合同类型">
    <div id="chart-left-4" style="height: 230px; margin-top: -10px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";

// 每个类别对应的数据系列
const categoryMap = ["销售", "采购", "运输", "仓储", "装卸", "其他"];

// 随机生成分类数量数据
const getRandomCategoryData = (categories: string[]) => {
  return categories.map(() => Math.floor(Math.random() * 101)); // 随机生成0-100之间的值
};

const chart = shallowRef<echarts.ECharts | null>(null);

const initChartMiddle4 = () => {
  chart.value = echarts.init(
    document.getElementById("chart-left-4") as HTMLDivElement
  );
  chart.value.clear();
  const data = getRandomCategoryData(categoryMap);

  const gradientColors = [
    { start: "#f2b678", end: "#f18c32" },
    { start: "#18DBD4", end: "#01B3F3" },
    { start: "#25DDA7", end: "#249E55" },
  ];

  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: categoryMap,
      textStyle: {
        color: "#5099E3",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categoryMap,
      axisLine: {
        lineStyle: {
          color: "#27518D",
        },
      },
      axisLabel: {
        fontSize: 15,
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
        fontSize: 16,
        color: "#5099E3",
      },
    },
    series: [
      {
        type: "bar",
        barWidth: "50%",
        barGap: "5%", // 柱体间距
        data: data,
        itemStyle: {
          color: (params: any) => {
            const color =
              gradientColors[params.dataIndex % gradientColors.length];
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color.start },
              { offset: 1, color: color.end },
            ]);
          },
        },
      },
    ],
  };
  chart.value.setOption(option);
};

onMounted(() => {
  initChartMiddle4();
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
