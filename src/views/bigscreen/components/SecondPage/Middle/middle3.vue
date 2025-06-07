<template>
  <Model1 class="model1" title="经营收入分析">
    <div id="chart2-middle-3" style="width: 100%; height: 230px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import sassvariables from "@/styles/variables.module.scss";
import { Decimal } from "decimal.js";

const companyName = inject("companyName");
const router = useRouter();

const props = defineProps<{
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
  return props.data
    ? props.data.map((item: any) => ({
        planned: item.planned,
        actual: item.actual,
      }))
    : months.map(() => ({
        planned: 0, // 计划经营收入
        actual: 0, // 实际经营收入
      }));
};

const chart = shallowRef<echarts.ECharts | null>(null);

const initChart = () => {
  chart.value = echarts.init(
    document.getElementById("chart2-middle-3") as HTMLDivElement
  );
  chart.value.clear();
  chart.value.on("click", "series.bar", (params: any) => {
    router.push({
      name: "Revenue",
      query: {
        companyName: companyName as unknown as string,
      },
    });
  });
  const data = getRandomData();

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["计划经营收入", "实际经营收入"],
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
        fontSize: 15,
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    yAxis: {
      type: "value",
      name: "单位：亿元",
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
        name: "计划经营收入",
        type: "bar",
        data: data.map((item) =>
          new Decimal(item.planned).div(10000).toNumber()
        ),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: sassvariables["bigscreen-primary-color-9"] },
            { offset: 1, color: "#2BFDBC" },
          ]),
        },
        barWidth: "25%",
      },
      {
        name: "实际经营收入",
        type: "bar",
        data: data.map((item) =>
          new Decimal(item.actual).div(10000).toNumber()
        ),
        label: {
          show: true,
          position: "top",
          color: "#fff",
          fontSize: 14,
          formatter: (params: any) => {
            // 只有当值存在且不为0时才显示
            return params.value && params.value !== 0
              ? params.value.toFixed(2)
              : "";
          },
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: sassvariables["bigscreen-primary-color-3"] },
            { offset: 1, color: sassvariables["bigscreen-primary-color-4"] },
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
