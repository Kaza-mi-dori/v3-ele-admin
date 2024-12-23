<template>
  <div ref="left53Ref" style="height: 250px" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts";

const left53Ref = ref<HTMLElement>();
const chartRef = shallowRef<echarts.ECharts>();
const data = ref<any[]>([
  { title: "贸易", value: 100 },
  { title: "仓储", value: 80 },
  { title: "油站运营", value: 60 },
]);

// 初始化图表
function initChart() {
  // 饼图
  if (!chartRef.value) {
    chartRef.value = echarts.init(left53Ref.value as HTMLDivElement);
  }
  chartRef.value.clear();
  const option = {
    title: {
      text: "各业态营收",
      left: "center",
      top: 20,
      textStyle: {
        color: "lightblue",
        fontSize: 16,
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 30,
      bottom: 30,
    },
    series: [
      {
        type: "pie",
        radius: "40%",
        avoidLabelOverlap: false,
        label: {
          show: true,
          textStyle: {
            fontSize: 14,
            color: "#fff",
          },
          edgeDistance: 10,
          lineHeight: 20,
          // 上面一行是标题+百分比，下一行是数值
          // {rich|{d}%}的意思是使用rich中的d字段，d字段是百分比, {c}是数值, {b}是标题, {a}是标题+百分比
          formatter: `{b} {d}%\n{c}万元`,
          rich: {
            a: {
              color: "#fff",
              fontSize: 12,
              lineHeight: 20,
              marginRight: 20,
            },
          },
        },
        labelLine: {
          show: true,
          length: 5,
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: "bold",
          },
        },
        data: data.value.map((item) => {
          return {
            value: item.value,
            name: item.title,
          };
        }),
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
