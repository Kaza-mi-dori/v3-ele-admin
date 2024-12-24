<template>
  <div ref="left51Ref" style="height: 250px" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import sassvariables from "@/styles/variables.module.scss";

const left51Ref = ref<HTMLElement>();
const chartRef = shallowRef<echarts.ECharts>();
const data = ref<any[]>([
  { title: "广投石化本部", value: [100, 50] },
  { title: "广投石化广东分公司", value: [100, 50] },
  { title: "广投石化舟山", value: [100, 50] },
]);

// 数据整理
function dataFilterOne() {
  data.value = data.value.map((item) => {
    return {
      title: item.title,
      value: item.value,
    };
  });
}

// 初始化图表
function initChart() {
  // 将数据整理为柱状图所需的格式
  dataFilterOne();
  // 柱状图
  if (!chartRef.value) {
    chartRef.value = echarts.init(left51Ref.value as HTMLDivElement);
  }
  chartRef.value.clear();
  const option = {
    tooltip: {
      trigger: "axis",
    },
    color: [
      sassvariables["bigscreen-primary-color-2"],
      sassvariables["bigscreen-primary-color-1"],
    ],
    grid: {
      bottom: 40,
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
    // y轴单位
    yAxis: {
      type: "value",
      name: "单位:亿元",
      nameTextStyle: {
        color: "#5099E3",
      },
      axisLabel: {
        fontSize: 14,
        color: "#5099E3",
      },
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
    },
    xAxis: {
      type: "category",
      data: data.value.map((item) => item.title),
      axisLabel: {
        color: "#5099E3",
      },
    },
    series: [
      {
        name: "营收",
        type: "bar",
        data: data.value.map((item) => item.value[0]),
      },
      {
        name: "利润",
        type: "bar",
        data: data.value.map((item) => item.value[1]),
      },
    ],
  };
  chartRef.value.setOption(option);
}

onMounted(() => {
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
