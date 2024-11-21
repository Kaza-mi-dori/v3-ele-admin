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

const mockData = ref<MockDataRecord[]>([
  {
    category: "原油",
    all: {
      total: 1000,
      finished: 800,
    },
    purchase: {
      total: 500,
      finished: 400,
    },
    sales: {
      total: 500,
      finished: 400,
    },
  },
  {
    category: "煤炭",
    all: {
      total: 1000,
      finished: 800,
    },
    purchase: {
      total: 500,
      finished: 400,
    },
    sales: {
      total: 500,
      finished: 400,
    },
  },
  {
    category: "燃料油",
    all: {
      total: 1000,
      finished: 800,
    },
    purchase: {
      total: 500,
      finished: 400,
    },
    sales: {
      total: 500,
      finished: 400,
    },
  },
  {
    category: "LNG",
    all: {
      total: 1000,
      finished: 800,
    },
    purchase: {
      total: 500,
      finished: 400,
    },
    sales: {
      total: 500,
      finished: 400,
    },
  },
  {
    category: "化工产品",
    all: {
      total: 700,
      finished: 400,
    },
    purchase: {
      total: 500,
      finished: 250,
    },
    sales: {
      total: 200,
      finished: 150,
    },
  },
  {
    category: "成品油",
    all: {
      total: 1000,
      finished: 800,
    },
    purchase: {
      total: 500,
      finished: 400,
    },
    sales: {
      total: 500,
      finished: 400,
    },
  },
]);

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

const initData = () => {
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
