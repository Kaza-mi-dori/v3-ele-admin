<template>
  <Model1 class="model1" title="客户库存构成">
    <div id="chart2-left-2" style="height: 250px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/SecondPage/Model1/index.vue";
import { ContractTypeEnum, ContractTypeEnumMap } from "@/enums/BusinessEnum";
import * as echarts from "echarts";
import { onMounted } from "vue";

const chart = shallowRef<echarts.ECharts | null>(null);

const itemLists = ref<any[]>([]);

async function initItemLists() {
  itemLists.value = [
    {
      clientName: "广西广投石化有限公司",
      count: 100,
    },
    {
      clientName: "公司A",
      count: 200,
    },
    {
      clientName: "公司B",
      count: 300,
    },
    {
      clientName: "公司C",
      count: 400,
    },
    {
      clientName: "公司D",
      count: 500,
    },
    {
      clientName: "公司E",
      count: 600,
    },
  ];
}

const initChart2Left2 = async () => {
  chart.value?.clear();
  chart.value = echarts.init(
    document.getElementById("chart2-left-2") as HTMLDivElement
  );
  await initItemLists();
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      // show: true, // 隐藏图例
      show: false,
      textStyle: {
        color: "#fff",
      },
      // 图例位置
      top: 5,
    },
    // 颜色
    color: ["#4BB5EF", "#335ECA", "#E95881", "#E46F44", "#E99F32", "#54DBE3"],
    grid: {
      left: "10",
      right: 0,
      top: 10,
      bottom: 0,
    },
    series: [
      {
        name: "合同类型",
        type: "pie",
        radius: ["45%", "70%"], // 环形图内外圈半径设置
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
        },
        emphasis: {
          // 鼠标悬浮时
          label: {
            show: true,
            fontSize: 20,
          },
        },
        data: itemLists.value.map((item) => {
          return {
            value: item.count,
            name: item.clientName,
          };
        }),
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
