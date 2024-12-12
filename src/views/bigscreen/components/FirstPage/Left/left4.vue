<template>
  <Model1 class="model1" title="合同类型">
    <Tab v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="采购" name="PURCHASE" />
      <el-tab-pane label="销售" name="SELL" />
    </Tab>
    <div id="chart-left-4" style="height: 180px; margin-top: -10px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/FirstPage/Model1/index.vue";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import * as echarts from "echarts";
import type { TabsPaneContext } from "element-plus";
import { ref, onMounted } from "vue";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";

const PURCHASE = "PURCHASE";
const SELL = "SELL";

const activeName = ref<number | string | undefined>(PURCHASE);

const chart = shallowRef<echarts.ECharts | null>(null);

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

const handleClick = (tab: TabsPaneContext) => {
  console.log(tab);
  activeName.value = tab.paneName;
  initChartMiddle4();
};

let resData = ref([]);
const initData = async () => {
  queryForm.value = {
    页码: 1,
    页容量: 1,
    企业名称: "广投石化",
    状态集合: ["有效"],
  };
  const res = await BusinessFormAPI.getCompanyReportFormList(queryForm.value);
  resData.value = res["当前记录"][0]["内容"]["详情"];
};

const initChartMiddle4 = async () => {
  // 确保图表实例被正确初始化
  if (!chart.value) {
    chart.value = echarts.init(
      document.getElementById("chart-left-4") as HTMLDivElement
    );
  }
  // 清空图表
  chart.value.clear();
  // 获取数据
  await initData();
  // 固定的业态类型顺序
  const fixedCategories = [
    "原油",
    "化工产品",
    "燃料油",
    "成品油",
    "LNG",
    "煤炭",
  ];
  const data: number[] = new Array(fixedCategories.length).fill(0); // 初始化数据数组
  // 遍历 resData，根据业态类型找到对应的合同数
  resData.value.forEach((item) => {
    const index = fixedCategories.indexOf(item["业态类型"]);
    if (index !== -1) {
      // 根据当前激活的标签页选择对应的合同数
      if (activeName.value === PURCHASE) {
        data[index] = item["累计采购合同数"];
      } else if (activeName.value === SELL) {
        data[index] = item["累计销售合同数"];
      }
    }
  });

  const gradientColors = [
    { start: "#f2b678", end: "#f18c32" },
    { start: "#18DBD4", end: "#01B3F3" },
    { start: "#25DDA7", end: "#249E55" },
    { start: "#F28F78", end: "#F05633" },
    { start: "#18DDD4", end: "#02B4F2" },
    { start: "#69EBC9", end: "#AA3DD5" },
  ];

  const option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: fixedCategories, // 使用固定的业态类型顺序
      axisLine: {
        lineStyle: {
          color: "#27518D",
        },
      },
      axisLabel: {
        fontSize: 14,
        color: "#5099E3",
      },
    },
    yAxis: {
      type: "value",
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
        fontSize: 14,
        color: "#5099E3",
      },
    },
    series: [
      {
        type: "bar",
        barWidth: "30%",
        barGap: "40%", // 柱体间距
        data: data, // 使用构建号的数据数组
        itemStyle: {
          color: (params: any) => {
            const color =
              gradientColors[params.dataIndex % gradientColors.length];
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color.start },
              { offset: 1, color: color.end },
            ]);
          },
        },
      },
    ],
  };
  chart.value.setOption(option);
};

onMounted(() => {
  initChartMiddle4();
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
