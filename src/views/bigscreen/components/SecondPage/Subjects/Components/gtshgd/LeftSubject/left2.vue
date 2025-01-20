<template>
  <Model1 class="model1" title="合同类型分析">
    <div id="chart2-left-2" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/SecondPage/Model1/index.vue";
import { ContractTypeEnum, ContractTypeEnumMap } from "@/enums/BusinessEnum";
import * as echarts from "echarts";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const chart = shallowRef<echarts.ECharts | null>(null);
const router = useRouter();

function handleClick() {
  router.push({
    name: "ContractList",
    params: {
      ourCompany: "gtshgd",
      year: new Date().getFullYear().toString(),
    },
  });
}

const initChart2Left2 = () => {
  if (!chart.value) {
    chart.value = echarts.init(
      document.getElementById("chart2-left-2") as HTMLDivElement
    );
    chart.value.on("click", handleClick);
  }
  chart.value.clear();
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: true, // 隐藏图例
      orient: "vertical",
      textStyle: {
        color: "#fff",
        fontSize: "1rem",
      },
      // 图例位置
      top: 10,
      right: 5,
    },
    // 颜色
    color: ["#4BB5EF", "#335ECA", "#E95881", "#E46F44", "#E99F32", "#54DBE3"],
    grid: {
      left: "10",
      right: 0,
      top: 0,
      bottom: 0,
    },
    series: [
      {
        name: "合同类型",
        type: "pie",
        radius: ["45%", "65%"], // 环形图内外圈半径设置
        startAngle: -180, // 设置饼图的起始角度，使得饼图从顶部开始
        avoidLabelOverlap: false,
        label: {
          // 标签
          show: true,
          position: "outside", // 标签显示在外部
          formatter: "{b}，{c}\n{d}%", // 格式化标签，显示名称和占比
          color: "#fff",
          fontSize: 16,
          fontWight: 400,
          edgeDistance: 10,
          lineHeight: 20,
        },
        labelLine: {
          show: true,
          length: 10,
          // 颜色
          lineStyle: {
            color: "#fff",
          },
          // 设置表前线
        },
        emphasis: {
          // 鼠标悬浮时
          label: {
            show: true,
            fontSize: 20,
          },
        },
        data: Object.keys(ContractTypeEnumMap).map((key) => ({
          value: Math.floor(Math.random() * 100),
          name: ContractTypeEnumMap[key as keyof typeof ContractTypeEnumMap],
        })),
        // 添加center属性调整饼图位置
        center: ["42%", "50%"], //X轴位置调整为40%，Y轴位置保持在50%
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
  @apply flex flex-1 flex-col h-full;
}
#chart2-left-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  @apply w-full h-full;
}
</style>
