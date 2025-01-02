<template>
  <div ref="left51Ref" style="height: 320px" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import sassvariables from "@/styles/variables.module.scss";
import { businessSubjects } from "../../../constants";
import { ref, onMounted, watch, shallowRef } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const left51Ref = ref<HTMLElement>();
const chartRef = shallowRef<echarts.ECharts>();
const data = ref<any[]>([
  { title: "广投石化本部", value: [100, 50] },
  { title: "广投石化广东分公司", value: [100, 50] },
  { title: "广投石化舟山", value: [100, 50] },
  { title: "永盛仓储", value: [100, 50] },
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

function onClickBar(params: any) {
  const { name, seriesName } = params;
  const subject = businessSubjects.find((item) => item.label === name);
  if (subject) {
    // console.log(subject);
    const route = router.resolve({
      name: "SubjectSubsidiary",
      params: {
        subjectName: subject.name,
      },
    });
    if (!route) return;
    window.open(route.href, "_blank");
  }
}

// 初始化图表
function initChart() {
  // 将数据整理为柱状图所需的格式
  dataFilterOne();
  // 柱状图
  if (!chartRef.value) {
    chartRef.value = echarts.init(left51Ref.value as HTMLDivElement);
    // 增加点击回调
    chartRef.value.on("click", "series", onClickBar);
  }
  chartRef.value.clear();
  const option = {
    tooltip: {
      trigger: "axis",
    },
    barWidth: "15%",
    // 标题
    title: {
      text: "各主体营收及利润",
      left: "center",
      top: 10,
      textStyle: {
        color: sassvariables["bigscreen-primary-color-1"],
        fontSize: "1rem",
      },
    },
    color: [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: sassvariables["bigscreen-primary-color-3"] },
        { offset: 1, color: sassvariables["bigscreen-primary-color-4"] },
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: sassvariables["bigscreen-primary-color-5"] },
        { offset: 1, color: sassvariables["bigscreen-primary-color-6"] },
      ]),
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
      name: "单位:万元",
      nameTextStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
        fontWeight: "bold",
      },
      axisLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: sassvariables["bigscreen-primary-color-7"],
      },
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
    },
    xAxis: {
      type: "category",
      data: data.value.map((item) => item.title),
      axisLabel: {
        // 全部显示
        interval: 0,
        color: "#fff",
        fontSize: "0.8rem",
        fontWeight: "bold",
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
