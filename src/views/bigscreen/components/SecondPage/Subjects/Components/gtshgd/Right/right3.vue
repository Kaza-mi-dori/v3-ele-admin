<template>
  <Model1 class="model1" title="经营利润分析">
    <div id="chart2-right-3" style="width: 100%; height: 230px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/SecondPage/Model1/index.vue";
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
  return month.map(() => Math.floor(Math.random() * 101) - 20); // 随机生成-20~-100之间的值
};

const chart = shallowRef<echarts.ECharts | null>(null);
const initChart = () => {
  chart.value = echarts.init(
    document.getElementById("chart2-right-3") as HTMLDivElement
  );
  chart.value.clear();
  const data = getRandomData(months);
  const accuData: number[] = [];
  const monthData: number[] = [];
  data.reduce((acc, curr) => {
    accuData.push(acc + curr);
    monthData.push(curr);
    return acc + curr;
  }, 0);
  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      orient: "horizontal", // 水平排列
      top: 20,
      right: 40,
      data: ["累计利润"], // 显示的文本
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"], // 文字颜色
        fontSize: 14, // 文字大小
      },
      icon: "rect", // 设置为矩形
      itemWidth: 15, // 设置矩形宽度
      itemHeight: 10, // 设置矩形高度
      itemStyle: {
        color: "#DB8943",
      },
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
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}
</style>
