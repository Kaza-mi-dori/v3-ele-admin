<template>
  <Model1 class="model1" title="合同执行统计">
    <div id="chart2-left-2" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { onMounted } from "vue";

const chart = shallowRef<echarts.ECharts | null>(null);

const initChart2Left2 = () => {
  chart.value?.clear();
  chart.value = echarts.init(
    document.getElementById("chart2-left-2") as HTMLDivElement
  );
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false, // 隐藏图例
    },
    series: [
      {
        name: "合同执行状态",
        type: "pie",
        radius: ["50%", "75%"], // 环形图内外圈半径设置
        startAngle: -180, // 设置饼图的起始角度，使得饼图从顶部开始
        avoidLabelOverlap: false,
        label: {
          // 标签
          show: true,
          position: "outside", // 标签显示在外部
          formatter: "{b}，{d}%", // 格式化标签，显示名称和占比
          color: "#fff",
          fontSize: 16,
          fontWight: 400,
        },
        emphasis: {
          // 鼠标悬浮时
          label: {
            show: true,
            fontSize: 20,
          },
        },
        labelLine: {
          show: false, // 不显示连接线
        },
        data: [
          {
            value: 80,
            name: "已履行",
            itemStyle: {
              color: "#5cafff",
            },
          },
          {
            value: 20,
            name: "未履行",
            itemStyle: {
              color: "#fc377e",
            },
          },
        ],
      },
    ],
  };
  chart.value.setOption(option);
};

onMounted(() => {
  initChart2Left2();
  window.addEventListener("resize", () => {
    try {
      chart.value?.resize();
    } catch (e) {
      console.log(e);
    }
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
#chart2-left-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
