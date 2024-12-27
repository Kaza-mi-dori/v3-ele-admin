<template>
  <Model1 class="model1" title="销售价格趋势分析">
    <Tab v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="原油市场价格" name="CRUDEOIL" />
      <el-tab-pane label="成品油价格" name="REFINEDOIL" />
    </Tab>
    <div id="chart22-right-2" style="height: 320px; margin-top: -10px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/SecondPage/Model1/index.vue";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import * as echarts from "echarts";
import type { TabsPaneContext } from "element-plus";
import { ref, onMounted } from "vue";
import sassvariables from "@/styles/variables.module.scss";

const CRUDEOIL = "CRUDEOIL";
const REFINEDOIL = "REFINEDOIL";

const activeName = ref<number | string | undefined>(CRUDEOIL);

const chart = shallowRef<echarts.ECharts | null>(null);

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

// 每个类别对应的数据系列
const categoryMap = {
  CRUDEOIL: months,
  REFINEDOIL: months,
};

const getRandomData = (categories: string[]) => {
  return categories.map(() => Math.floor(Math.random() * 101)); // 随机生成0-100之间的值
};

const handleClick = (tab: TabsPaneContext) => {
  console.log(tab);
  activeName.value = tab.paneName;
  initChart22Right2();
};

const initChart22Right2 = () => {
  chart.value = echarts.init(
    document.getElementById("chart22-right-2") as HTMLDivElement
  );
  chart.value.clear();
  const categories = categoryMap[activeName.value as keyof typeof categoryMap];
  const data = getRandomData(categories);

  const option = {
    grid: {
      left: "2%",
      right: "5%",
      bottom: "0.5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: categories,
      axisLine: {
        lineStyle: {
          color: "#27518D",
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
          color: "#E8325C", // 设置线条颜色
          width: 3, // 线条宽度
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(232,50,92, 0.4)" }, // 折线图顶端颜色
            { offset: 1, color: "rgba(219, 137, 67, 0)" }, // 底部渐变透明
          ]),
        },
      },
    ],
  };
  chart.value.setOption(option);
};

onMounted(() => {
  initChart22Right2();
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
