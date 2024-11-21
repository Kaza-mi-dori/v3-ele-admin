<template>
  <Model1 class="model1" title="合同类型">
    <Tab v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="采购" name="PURCHASE" />
      <el-tab-pane label="销售" name="SELL" />
    </Tab>
    <div id="chart-left-4" style="height: 180px; margin-top: -10px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/FirstPage/Model1/index.vue";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import * as echarts from "echarts";
import type { TabsPaneContext } from "element-plus";
import { ref, onMounted } from "vue";

const PURCHASE = "PURCHASE";
const SELL = "SELL";

const activeName = ref<number | string | undefined>(PURCHASE);

// 每个类别对应的数据系列
const categoryMap = {
  PURCHASE: ["原油", "化工产品", "燃料油", "成品油", "LNG", "煤炭"],
  SELL: ["原油", "化工产品", "燃料油", "成品油", "LNG", "煤炭"],
};

// 随机生成分类数量数据
const getRandomCategoryData = (categories: string[]) => {
  return categories.map(() => Math.floor(Math.random() * 101)); // 随机生成0-100之间的值
};

const handleClick = (tab: TabsPaneContext) => {
  console.log(tab);
  activeName.value = tab.paneName;
  initChartMiddle4();
};

const initChartMiddle4 = () => {
  const chart = echarts.init(
    document.getElementById("chart-left-4") as HTMLDivElement
  );
  chart.clear();
  const categories = categoryMap[activeName.value as keyof typeof categoryMap];
  const data = getRandomCategoryData(categories);

  const gradientColors = [
    { start: "#f2b678", end: "#f18c32" },
    { start: "#18DBD4", end: "#01B3F3" },
    { start: "#25DDA7", end: "#249E55" },
    { start: "#F28F78", end: "#F05633" },
    { start: "#18DDD4", end: "#02B4F2" },
    { start: "#69EBC9", end: "#AA3DD5" },
  ];

  const option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
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
        type: "bar",
        barWidth: "30%",
        barGap: "40%", // 柱体间距
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
  chart.setOption(option);
};

onMounted(() => {
  initChartMiddle4();
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
