<template>
  <Model1 class="model1" title="历年经营情况">
    <Tab v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="营收" name="REVENUE" />
      <el-tab-pane label="利润" name="PROFIT" />
    </Tab>
    <div id="chart-right-3-new" style="height: 100%; margin-top: -30px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/FirstPage/Model1/index.vue";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import * as echarts from "echarts";
import type { TabsPaneContext } from "element-plus";
import { ref, onMounted } from "vue";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import { useRouter } from "vue-router";

const REVENUE = "REVENUE";
const PROFIT = "PROFIT";

const router = useRouter();

const activeName = ref<number | string | undefined>(REVENUE);

const chart = shallowRef<echarts.ECharts | null>(null);

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 6,
});

const handleClick = (tab: TabsPaneContext) => {
  console.log(tab);
  activeName.value = tab.paneName;
  initChartRight3(); // 切换页签时重新初始化图表
};

const clickBarCb = (params: any) => {
  router.push({
    name: "ContractList",
    query: {
      module: "contract",
      businessType: params.name,
    },
  });
};

let resData = ref([]);

const initData = async () => {
  queryForm.value = {
    页码: 1,
    页容量: 6,
    企业名称: "广投石化",
    状态集合: ["有效"],
  };
  const res: any = await BusinessFormAPI.getCompanyReportFormList(
    queryForm.value
  );
  resData.value = res["当前记录"] || [];
};

const initChartRight3 = async () => {
  // 确保图表实例被正确初始化
  if (!chart.value) {
    chart.value = echarts.init(
      document.getElementById("chart-right-3-new") as HTMLDivElement
    );
    // 绑定事件
    chart.value.on("click", "series.bar", clickBarCb);
  }
  // 清空图表
  chart.value.clear();
  // 获取数据
  await initData();

  // 按照日期字段（年份）从低到高排序
  const sortedData = resData.value.sort((a, b) => {
    return new Date(a.日期).getFullYear() - new Date(b.日期).getFullYear();
  });

  // 用于存储最终图表数据
  const years: string[] = [];
  const revenueData: number[] = [];
  const profitData: number[] = [];

  sortedData.forEach((item) => {
    const year = new Date(item.日期).getFullYear().toString();
    const details = item.内容?.详情 || [];

    // 查找业态类型为"总体"的数据
    const overallRevenue =
      details.find((detail: any) => detail["业态类型"] === "总体")?.[
        "累计营收金额"
      ] || 0;
    const overallProfit =
      details.find((detail: any) => detail["业态类型"] === "总体")?.[
        "累计利润金额"
      ] || 0;

    // 将年份添加到x轴数据
    if (!years.includes(year)) {
      years.push(year);
    }

    // 对应年份的营收和利润数据
    revenueData.push(parseFloat(overallRevenue));
    profitData.push(parseFloat(overallProfit));
  });

  const gradientColors = [
    { start: "#f2b678", end: "#f18c32" },
    { start: "#18DBD4", end: "#01B3F3" },
    { start: "#25DDA7", end: "#249E55" },
    { start: "#F28F78", end: "#F05633" },
    { start: "#18DDD4", end: "#02B4F2" },
    { start: "#69EBC9", end: "#AA3DD5" },
  ];

  // 判断当前激活的tab页签，并根据选中的 tab 渲染不同的数据
  const currentData = activeName.value === REVENUE ? revenueData : profitData;

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
      data: years, // 横坐标为年份
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
        barWidth: "50%",
        barGap: "10%", // 柱体间距
        data: currentData, // 柱状图的值: 根据选中的页签显示对应的数据
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
  initChartRight3();
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
