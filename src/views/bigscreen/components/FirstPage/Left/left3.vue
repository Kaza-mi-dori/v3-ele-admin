<template>
  <Model1 class="model1" title="合同执行情况">
    <Tab v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabLabelNameMap"
        :key="index"
        :label="item"
        :name="index"
      />
    </Tab>
    <div class="chart-left-3">
      <ProgressBar
        v-for="(item, index) in dataSeries"
        :key="index"
        :data="item"
      />
    </div>
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/FirstPage/Model1/index.vue";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import ProgressBar from "@/views/bigscreen/components/FirstPage/ProgressBar/index.vue";
import * as echarts from "echarts";
import type { TabsPaneContext } from "element-plus";
import { ref, onMounted } from "vue";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";

const activeName = ref<number | string | undefined>("all");

const chart = shallowRef<echarts.ECharts | null>(null);

const tabLabelNameMap = {
  all: "总体",
  purchase: "采购",
  sales: "销售",
};

interface MockDataRecord {
  category: string;
  all: {
    total: number;
    finished: number;
  };
  purchase: {
    total: number;
    finished: number;
  };
  sales: {
    total: number;
    finished: number;
  };
  [key: string]: any;
}

interface DataRecord {
  category: string;
  total: number;
  finished: number;
}

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

const mockData = ref([]);

const dataMap: Ref<Record<string, any>> = ref({});
const dataSeries: Ref<DataRecord[]> = ref([]);

const handleClick = (tab: TabsPaneContext) => {
  console.log(tab);
  activeName.value = tab.paneName;
  dataSeries.value = dataMap.value[tab.paneName as string];
};

const dataFilterOne: (data: MockDataRecord[]) => Record<string, any> = (
  data
) => {
  const result: Record<string, any> = {};
  for (const key of Object.keys(tabLabelNameMap)) {
    result[key] = data.map((item) => {
      return {
        category: item.category,
        total: item[key].total,
        finished: item[key].finished,
      };
    });
  }
  return result;
};

const convertToMockData = (resData: any[]) => {
  const requiredCategories = [
    "原油",
    "煤炭",
    "燃料油",
    "LNG",
    "化工产品",
    "成品油",
  ];
  //筛选出需要的业态类型,并且按照指定顺序排列
  return resData
    .filter((item) => requiredCategories.includes(item["业态类型"]))
    .sort(
      (a, b) =>
        requiredCategories.indexOf(a["业态类型"]) -
        requiredCategories.indexOf(b["业态类型"])
    )
    .map((item) => {
      return {
        category: item["业态类型"],
        all: {
          total: item["累计合同总份数"] || 0,
          finished: item["累计合同履行数"] || 0, // TODO 待确认
        },
        purchase: {
          total: item["累计销售合同数"] || 0,
          finished: item["累计销售合同履行数"] || 0,
        },
        sales: {
          total: item["累计采购合同数"] || 0,
          finished: item["累计采购合同履行数"] || 0,
        },
      };
    });
};

const getData = async () => {
  queryForm.value = {
    页码: 1,
    页容量: 1,
    企业名称: "广投石化",
    状态集合: ["有效"],
  };
  const res = await BusinessFormAPI.getCompanyReportFormList(queryForm.value);
  let resData = res["当前记录"][0]["内容"]["详情"];

  // 将API返回的 resData 转换为符合 mockData 结构的数据
  mockData.value = convertToMockData(resData);
  // 处理数据并生成 DataRecord 格式
  dataMap.value = dataFilterOne(mockData.value);
  nextTick(() => {
    dataSeries.value = dataMap.value[activeName.value as string];
  });
};

const initData = () => {
  getData();
  // 先将数据处理为DataRecord格式
  dataMap.value = dataFilterOne(mockData.value);
  nextTick(() => {
    // 初始化图表
    dataSeries.value = dataMap.value[activeName.value as string];
  });
};

// const initChartMiddle4 = () => {
//   chart.value?.clear();
//   chart.value = echarts.init(
//     document.getElementById("chart-middle-4") as HTMLDivElement
//   );
//   // 根据数据渲染图表
//   // 类目x轴
//   const xAxisData = getDateOfOneMonth();
//   const series = categoryMap[activeName.value as keyof typeof categoryMap];
//   const option = {
//     // title: {
//     //   text: "价格趋势图",
//     //   left: "center",
//     //   textStyle: {
//     //     color: "#fff",
//     //   },
//     // },
//     tooltip: {
//       trigger: "axis",
//     },
//     grid: {
//       left: "3%",
//       right: "4%",
//       bottom: "2%",
//       containLabel: true,
//     },
//     legend: {
//       data: series,
//       icon: "rect",
//       top: 20,
//       right: 40,
//       itemWidth: 12,
//       itemHeight: 7,
//       textStyle: {
//         fontSize: 14,
//         color: "#fff",
//       },
//     },
//     lineStyle: {
//       width: 1,
//     },
//     xAxis: {
//       type: "category",
//       data: xAxisData,
//       axisLine: {
//         lineStyle: {
//           color: "#2a5999",
//         },
//       },
//     },
//     yAxis: {
//       type: "value",
//       min: 200,
//       max: 600,
//       axisLine: {
//         show: true, // 显示坐标轴线
//         lineStyle: {
//           color: "#2a5999",
//         },
//       },
//       splitLine: {
//         show: true, // 显示分割线
//         lineStyle: {
//           type: "dashed", // 虚线
//           color: "#2a5999",
//         },
//       },
//     },
//     smooth: false,
//     series: series.map((item: string) => {
//       return {
//         name: item,
//         type: "line",
//         smooth: true,
//         data: getRandomDataOneMonth().map((item) => item.value),
//       };
//     }),
//   };
//   chart.value.setOption(option);
// };

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.model1 {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}

.chart-left-3 {
  @apply flex flex-wrap;
}
</style>
