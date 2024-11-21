<template>
  <Model1 class="model1" title="价格趋势图">
    <Tab v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="原油" name="YUANYOU" />
      <el-tab-pane label="汽柴油" name="QICHAIYOU" />
      <el-tab-pane label="化工产品" name="HUAGONG" />
    </Tab>
    <div
      id="chart-middle-4"
      style="height: 180px; width: 100%; margin-top: -10px"
    />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/FirstPage/Model1/index.vue";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import * as echarts from "echarts";
import type { TabsPaneContext } from "element-plus";
import { ref, onMounted } from "vue";

const YUANYOU = "YUANYOU";
const HUAGONG = "HUAGONG";
const QICHAIYOU = "QICHAIYOU";

const activeName = ref<number | string | undefined>(YUANYOU);

const chart = shallowRef<echarts.ECharts | null>(null);

interface DataRecord {
  time: string;
  value: number;
}

const allData: Ref<Record<any, DataRecord[]>> = ref({
  YUANYOU: [
    { time: "1月", value: 2200 },
    { time: "2月", value: 2400 },
    { time: "3月", value: 2400 },
    { time: "4月", value: 2500 },
    { time: "5月", value: 2640 },
    { time: "6月", value: 2700 },
  ],
  HUAGONG: [
    { time: "1月", value: 2200 },
    { time: "2月", value: 2300 },
    { time: "3月", value: 4210 },
    { time: "4月", value: 2500 },
    { time: "5月", value: 2600 },
    { time: "6月", value: 2700 },
  ],
  QICHAIYOU: [
    { time: "1月", value: 2200 },
    { time: "2月", value: 2300 },
    { time: "3月", value: 3200 },
    { time: "4月", value: 4100 },
    { time: "5月", value: 2600 },
    { time: "6月", value: 2700 },
  ],
});

// 返回一年365天日期作为横坐标
const getDateOfOneYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  // 根据年份判断是否是闰年
  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };
  const dateArr = [];
  for (let i = 1; i <= 12; i++) {
    const days = isLeapYear(year) ? 29 : 28;
    const month = i < 10 ? `0${i}` : i;
    for (let j = 1; j <= days; j++) {
      const day = j < 10 ? `0${j}` : j;
      dateArr.push(`${month}-${day}`);
    }
  }
  return dateArr;
};

// 返回近30天日期作为横坐标
const getDateOfOneMonth = () => {
  const date = new Date();
  // 倒算30天
  date.setDate(date.getDate() - 30);
  const dateArr = [];
  for (let i = 0; i < 30; i++) {
    date.setDate(date.getDate() + 1);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    dateArr.push(`${month}-${day}`);
  }
  return dateArr;
};

// 每个类别对应的数据系列
const categoryMap = {
  YUANYOU: ["原油"],
  HUAGONG: ["化工产品A", "化工产品B", "化工产品C"],
  QICHAIYOU: ["#92汽油", "#95汽油", "#0柴油"],
};

// 随机生成365天数据
const getRandomDataOneYear = () => {
  const dateArr = getDateOfOneYear();
  const data = dateArr.map((item) => {
    return {
      time: item,
      value: 400 + Math.floor(Math.random() * 100),
    };
  });
  return data;
};

// 随机生成30天数据
const getRandomDataOneMonth = () => {
  const dateArr = getDateOfOneMonth();
  const data = dateArr.map((item) => {
    return {
      time: item,
      value: 400 + Math.floor(Math.random() * 100),
    };
  });
  return data;
};

const dataFilterOne = (data: DataRecord[]) => {
  return data.map((item) => {
    return {
      time: item.time,
      value: item.value,
    };
  });
};

const dataSeries: Ref<DataRecord[]> = ref([]);

const handleClick = (tab: TabsPaneContext) => {
  console.log(tab);
  activeName.value = tab.paneName;
  dataSeries.value = allData.value[tab.paneName as string];
  initChartMiddle4();
};

const initChartMiddle4 = () => {
  chart.value?.clear();
  chart.value = echarts.init(
    document.getElementById("chart-middle-4") as HTMLDivElement
  );
  // 根据数据渲染图表
  // 类目x轴
  const xAxisData = getDateOfOneMonth();
  const series = categoryMap[activeName.value as keyof typeof categoryMap];
  const option = {
    // title: {
    //   text: "价格趋势图",
    //   left: "center",
    //   textStyle: {
    //     color: "#fff",
    //   },
    // },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "2%",
      containLabel: true,
    },
    legend: {
      data: series,
      icon: "rect",
      top: 20,
      right: 40,
      itemWidth: 12,
      itemHeight: 7,
      textStyle: {
        fontSize: 14,
        color: "#fff",
      },
    },
    lineStyle: {
      width: 1,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: "#5099E3",
        },
      },
    },
    yAxis: {
      type: "value",
      min: 200,
      max: 600,
      axisLine: {
        show: true, // 显示坐标轴线
        lineStyle: {
          color: "#5099E3",
        },
      },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          type: "dashed", // 虚线
          color: "#27518D",
        },
      },
    },
    smooth: false,
    series: series.map((item: string) => {
      return {
        name: item,
        type: "line",
        smooth: true,
        data: getRandomDataOneMonth().map((item) => item.value),
      };
    }),
  };
  chart.value.setOption(option);
};

onMounted(() => {
  initChartMiddle4();
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
</style>
