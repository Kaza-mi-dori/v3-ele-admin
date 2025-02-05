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
import { DataIndicesAPI } from "@/api/dataIndices";
import { useRouter } from "vue-router";
import sassvariables from "@/styles/variables.module.scss";
import { useDataIndex } from "@/hooks/useDataIndex";

const mode = 1; // 获取数据方式：0-报表管理；1-指标管理

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

const keywordMap = {
  年度营收: "194158fe0d4",
  年度利润: "194159067d5",
};

// 获取数据
const { result, loading, error, fetchData } = useDataIndex(
  Object.values(keywordMap),
  6,
  undefined,
  undefined,
  true
);

const handleClick = (tab: TabsPaneContext) => {
  activeName.value = tab.paneName;
  initChartRight3(); // 切换页签时重新初始化图表
};

const clickBarCb = (params: any) => {
  const { seriesName, name: year } = params;
  const route = router.resolve({
    name: seriesName === "营收" ? "RevenueAnalysis" : "ProfitAnalysis",
    query: {
      year,
    },
  });
  window.open(route.href, "_blank");
};

let resData = ref([]);

const initData = async () => {
  if (mode === 0) {
    queryForm.value = {
      页码: 1,
      页容量: 6,
      企业名称: "广投石化",
      状态集合: ["有效"],
      类型集合: ["年"],
    };
    const res: any = await BusinessFormAPI.getCompanyReportFormList(
      queryForm.value
    );
    resData.value = res["当前记录"] || [];
  } else if (mode === 1) {
    await fetchData();
    const revenueDataList = result.value[keywordMap["年度营收"]] || [];
    const profitDataList = result.value[keywordMap["年度利润"]] || [];

    const allData: never[] = [];

    // 将数据分别保存到对应的变量中
    revenueDataList.forEach((item: any) => {
      const year = new Date(item.时间).getFullYear().toString();
      allData.push({
        year,
        type: "revenue",
        value: parseFloat(item.数据) / 10000,
      });
    });

    profitDataList.forEach((item: any) => {
      const year = new Date(item.时间).getFullYear().toString();
      allData.push({
        year,
        type: "profit",
        value: parseFloat(item.数据) / 10000,
      });
    });

    // 营收和利润数据
    resData.value = allData;
  }
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

  // 用于存储最终图表数据
  let years: string[] = [];
  const revenueYears: string[] = [];
  const profitYears: string[] = [];
  const revenueData: number[] = [];
  const profitData: number[] = [];

  if (mode === 0) {
    // 按照日期字段（年份）从低到高排序
    const sortedData = resData.value.sort((a, b) => {
      return new Date(a.日期).getFullYear() - new Date(b.日期).getFullYear();
    });

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
      revenueData.push(parseFloat(overallRevenue) / 10000);
      profitData.push(parseFloat(overallProfit) / 10000);
    });
  } else if (mode === 1) {
    resData.value.forEach((item: any) => {
      const { year, type, value } = item;

      if (type === "revenue") {
        if (!revenueYears.includes(year)) {
          revenueYears.push(year);
        }
        revenueData.push(value);
      } else if (type === "profit") {
        if (!profitYears.includes(year)) {
          profitYears.push(year);
        }
        profitData.push(value);
      }
      years = activeName.value === REVENUE ? revenueYears : profitYears;
    });
  }

  const gradientColors = [
    {
      start: sassvariables["bigscreen-primary-color-3"],
      end: sassvariables["bigscreen-primary-color-4"],
    },
    {
      start: sassvariables["bigscreen-primary-color-5"],
      end: sassvariables["bigscreen-primary-color-6"],
    },
    {
      start: sassvariables["bigscreen-primary-color-9"],
      end: sassvariables["bigscreen-primary-color-10"],
    },
    { start: "#F28F78", end: "#F05633" },
    { start: "#18DDD4", end: "#02B4F2" },
    { start: "#69EBC9", end: "#AA3DD5" },
  ];

  const gradientColors2 = [
    { start: "#E28F78", end: "#E05633" },
    { start: "#08DDD4", end: "#02B4F2" },
    { start: "#49EBC9", end: "#4A3DD5" },
  ];

  // 判断当前激活的tab页签，并根据选中的 tab 渲染不同的数据
  const currentData = activeName.value === REVENUE ? revenueData : profitData;

  const option = {
    tooltip: {
      trigger: "axis",
    },
    // legend: {
    //   data: ["目标", "实际"],
    //   textStyle: {
    //     fontSize: 14,
    //     color: sassvariables["bigscreen-primary-color-7"],
    //   },
    //   // 图例位置
    //   top: "10%",
    //   right: "10%",
    // },
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
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      axisLabel: {
        fontSize: 14,
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
        fontSize: 14,
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    series: [
      {
        type: "bar",
        barWidth: "25%",
        barGap: "10%", // 柱体间距
        data:
          activeName.value === REVENUE
            ? [512.8, null, null]
            : [1.06, null, null], // 柱状图的值: 根据选中的页签显示对应的数据
        // name: activeName.value === REVENUE ? "目标" : "实际",
        name: "计划值",
        // 显示标签
        label: {
          show: true,
          position: "top",
          color: "#fff",
          textStyle: {
            fontSize: "1rem",
          },
          // 格式化标签
          formatter: ({ value }: { value: number }) => {
            const num = value.toFixed(1);
            return `${num}\n(计划值)`;
          },
        },
        itemStyle: {
          color: (params: any) => {
            const color =
              gradientColors2[params.dataIndex % gradientColors.length];
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color.start },
              { offset: 1, color: color.end },
            ]);
          },
        },
      },
      {
        type: "bar",
        barWidth: "25%",
        barGap: "10%", // 柱体间距
        data: currentData, // 柱状图的值: 根据选中的页签显示对应的数据
        // name: activeName.value === REVENUE ? "营收" : "利润",
        name: "实际",
        // 显示标签
        label: {
          show: true,
          position: "top",
          color: "#fff",
          textStyle: {
            fontSize: "1rem",
          },
          // 格式化标签
          formatter: ({ value }: { value: number }) => {
            const num = value.toFixed(1);
            return `${num}`;
          },
        },
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
  @apply flex flex-1 flex-col h-full;
}
</style>
