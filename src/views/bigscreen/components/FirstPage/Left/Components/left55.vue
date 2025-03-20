<template>
  <div ref="left55" style="height: 320px" />
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, shallowRef, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const left55Ref = shallowRef<echarts.ECharts>();
const left55 = ref<HTMLElement>();
const props = defineProps<{
  year: number;
}>();
const initChart = () => {
  if (!left55Ref.value) {
    left55Ref.value = echarts.init(left55.value as HTMLDivElement);
  }
  left55Ref.value.clear();
  left55Ref.value.on("click", "series.pie", (params) => {
    // 筛选条件
    const { name } = params;
    if (!name) return;
    if (name === "已完成") {
      router.push({
        name: "ContractAnalysis",
        query: {
          year: props.year,
          companyName: "石化板块",
        },
      });
    } else if (name === "履行中") {
      router.push({
        name: "ContractAnalysis",
        query: {
          year: props.year,
          companyName: "石化板块",
        },
      });
    }
  });
  const option = {
    title: {
      text: `合同执行情况`,
      left: "center",
      top: 20,
      textStyle: {
        color: "lightblue",
        fontSize: 16,
      },
    },
    legend: {
      data: ["已完成", "履行中"],
      left: "right",
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
      containLabel: true,
    },
    series: [
      {
        type: "pie",
        radius: "50%",
        avoidLabelOverlap: true,
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
          formatter: `{b}\n{d}%\n{c}万元`,
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
        data: [
          { value: 1048, name: "已完成" },
          { value: 735, name: "履行中" },
        ],
      },
    ],
  };
  left55Ref.value.setOption(option);
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    left55Ref.value?.resize();
  });
});
</script>
