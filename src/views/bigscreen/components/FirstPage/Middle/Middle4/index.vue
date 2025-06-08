<template>
  <Model1 class="model1" title="市场价格" :showSpecialTitleBg="true">
    <Tab v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="原油" name="YUANYOU" />
      <el-tab-pane label="汽柴油" name="QICHAIYOU" />
      <el-tab-pane label="燃料油" name="RANLIAOYOU" />
      <el-tab-pane label="化工产品" name="HUAGONG" />
      <el-link class="el-link-more" @click="handleCheckMore">查看更多</el-link>
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
import { DataIndicesAPI } from "@/api/dataIndices";
import { DataDefinitionNameToMarkMap } from "@/enums/DataDefinitionEnum";
import { ref, onMounted } from "vue";
import { autoRetryWrapper } from "@/utils/asyncwork";
import sassvariables from "@/styles/variables.module.scss";
import { useRouter } from "vue-router";

const YUANYOU = "YUANYOU";
const HUAGONG = "HUAGONG";
const QICHAIYOU = "QICHAIYOU";
const RANLIAOYOU = "RANLIAOYOU";

const router = useRouter();
const activeName = ref<number | string | undefined>(YUANYOU);

const chart = shallowRef<echarts.ECharts | null>(null);

interface DataRecord {
  time: string;
  value: number;
  unit: string;
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
  RANLIAOYOU: [
    { time: "1月", value: 2200 },
    { time: "2月", value: 2300 },
    { time: "3月", value: 3200 },
    { time: "4月", value: 4100 },
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
  YUANYOU: ["WTI日价", "布伦特日价"],
  HUAGONG: ["乙烯焦油华南价"],
  RANLIAOYOU: ["俄罗斯到岸价(山东)"],
  QICHAIYOU: ["#92汽油", "#95汽油", "#0柴油"],
};

const dataMap: Ref<Record<string, any>> = ref({
  [categoryMap.YUANYOU[0]]: undefined,
  [categoryMap.YUANYOU[1]]: undefined,
  [categoryMap.HUAGONG[0]]: undefined,
  [categoryMap.RANLIAOYOU[0]]: undefined,
  [categoryMap.QICHAIYOU[0]]: undefined,
  [categoryMap.QICHAIYOU[1]]: undefined,
  [categoryMap.QICHAIYOU[2]]: undefined,
});

const dataMap2: Ref<Record<string, any>> = ref({
  [categoryMap.YUANYOU[0]]: undefined,
  [categoryMap.YUANYOU[1]]: undefined,
  [categoryMap.HUAGONG[0]]: undefined,
  [categoryMap.RANLIAOYOU[0]]: undefined,
  [categoryMap.QICHAIYOU[0]]: undefined,
  [categoryMap.QICHAIYOU[1]]: undefined,
  [categoryMap.QICHAIYOU[2]]: undefined,
});

// 随机生成365天数据
const getRandomDataOneYear = () => {
  const dateArr = getDateOfOneYear();
  const data = dateArr.map((item) => {
    return {
      time: item,
      value: 400 + Math.floor(Math.random() * 100),
      unit: "元/吨",
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
      unit: "元/吨",
    };
  });
  return data;
};

const dataFilterOne = (data: DataRecord[]) => {
  return data.map((item) => {
    return {
      time: item.time,
      value: item.value,
      unit: item.unit,
    };
  });
};

const dataSeries: Ref<DataRecord[]> = ref([]);

const handleCheckMore = () => {
  const route = router.resolve({
    name: "CustomDataBoard",
  });
  window.open(route.href, "_blank");
};

const handleClick = (tab: TabsPaneContext) => {
  // console.log(tab);
  activeName.value = tab.paneName;
  dataSeries.value = allData.value[tab.paneName as string];
  initChartMiddle4();
};

const getMinYAxis = (activeName: string) => {
  switch (activeName) {
    case YUANYOU:
      return 60;
    case HUAGONG:
      return 2000;
    case RANLIAOYOU:
      return 4000;
    case QICHAIYOU:
      return 6000;
  }
};

const getMaxYAxis = (activeName: string) => {
  switch (activeName) {
    case YUANYOU:
      return 100;
    case HUAGONG:
      return 5000;
    case RANLIAOYOU:
      return 10000;
    case QICHAIYOU:
      return 10000;
  }
};

/** 根据dataSeries.value 获取相应数据渲染图表 */
const initChartMiddle4 = () => {
  chart.value?.clear();
  chart.value = echarts.init(
    document.getElementById("chart-middle-4") as HTMLDivElement
  );
  // 根据数据渲染图表
  // 类目x轴
  const xAxisData = getDateOfOneYear();
  // console.log("xAxisData"xAxisData);
  const series = categoryMap[activeName.value as keyof typeof categoryMap];
  const dataSeries: any = [];
  // 从dataMap中和dataMap2中获取数据
  for (let i = 0; i < series.length; i++) {
    const item = series[i];
    dataSeries.push({
      name: item,
      type: "line",
      data: dataMap.value[item] ? dataFilterOne(dataMap.value[item]) : [],
      // 粗细
      lineStyle: {
        width: 3,
      },
      smooth: true,
    });
    dataSeries.push({
      name: `${new Date().getFullYear() - 1} ` + item,
      type: "line",
      data: dataMap2.value[item] ? dataFilterOne(dataMap2.value[item]) : [],
      lineStyle: {
        width: 1,
      },
      smooth: true,
    });
  }
  const option = {
    color: ["#FFC000", "#FFD966", "#70AD47", "#A9D18E", "#FF0000", "#F4B183"],
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "5%",
      right: "4%",
      bottom: "2%",
      containLabel: true,
    },
    // 前三个深后三个浅
    legend: {
      // data: series,
      data: [
        ...series,
        ...series.map(
          (item: string) => `${new Date().getFullYear() - 1} ` + item
        ),
      ],
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
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        // interval: 0,
        formatter: (value: string) => {
          const dates = value.split("-");
          return `${parseInt(dates[0])}月`;
        },
        customValues: [
          "01-01",
          "02-01",
          "03-01",
          "04-01",
          "05-01",
          "06-01",
          "07-01",
          "08-01",
          "09-01",
          "10-01",
          "11-01",
          "12-01",
          "12-31",
        ],
      },
    },
    yAxis: {
      min: getMinYAxis(activeName.value),
      max: getMaxYAxis(activeName.value),
      type: "value",
      name: activeName.value === YUANYOU ? "美元/桶" : "元/吨",
      // 读取
      nameTextStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
        fontSize: 15,
        padding: [0, 0, 0, 20],
      },
      axisLine: {
        show: true, // 显示坐标轴线
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          type: "dashed", // 虚线
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
    },
    // series: series.map((item: string) => {
    //   return {
    //     name: item,
    //     type: "line",
    //     // smooth: true,
    //     data: dataMap.value[item] ? dataFilterOne(dataMap.value[item]) : [],
    //   };
    // }),
    series: dataSeries,
  };
  chart.value.setOption(option);
};

/**
 * 根据dataSeries.value 获取相应数据渲染图表
 */
const processChartData = (data: any) => {
  for (const category in categoryMap as Record<string, string[]>) {
    categoryMap[category as keyof typeof categoryMap].forEach(
      (item: string) => {
        // item: WTI日价
        if (dataMap.value[item] === undefined) {
          dataMap.value[item] = data
            .filter(
              (record: any) =>
                record["标识"] === DataDefinitionNameToMarkMap[item]
            )
            .map((record: any) => {
              return {
                time: record["时间"].substring(5, 10),
                value: record["数据"],
                unit: record["单位"],
              };
            })
            .sort((a: any, b: any) => {
              return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
        }
      }
    );
  }
};

const processChartData2 = (data: any) => {
  for (const category in categoryMap as Record<string, string[]>) {
    categoryMap[category as keyof typeof categoryMap].forEach(
      (item: string) => {
        // item: WTI日价
        if (dataMap2.value[item] === undefined) {
          dataMap2.value[item] = data
            .filter(
              (record: any) =>
                record["标识"] === DataDefinitionNameToMarkMap[item]
            )
            .map((record: any) => {
              return {
                time: record["时间"].substring(5, 10),
                value: record["数据"],
                unit: record["单位"],
              };
            })
            .sort((a: any, b: any) => {
              return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
        }
      }
    );
  }
};

/**
 * 根据配置项，分别获取每个标识对应数据的当年数据
 */
const initData = async () => {
  // dataSeries.value = allData.value[activeName.value as string];
  // const marks: any[] = [];
  const fetchDataTask: any[] = [];
  const fetchDataTaskLastYear: any[] = [];
  for (const category in categoryMap as Record<string, string[]>) {
    // 对每个类别的标识进行获取数据后放到dataMap中
    fetchDataTask.push(
      ...categoryMap[category as keyof typeof categoryMap].map(
        (item: string) => {
          return autoRetryWrapper(
            DataIndicesAPI.getDataIndicesList({
              标识集合: [DataDefinitionNameToMarkMap[item]],
              时间晚于: new Date().getFullYear() + "-01-01 00:00:00",
              页码: 1,
              页容量: 1000,
            })
          );
        }
      )
    );
    // 获取去年数据
    fetchDataTaskLastYear.push(
      ...categoryMap[category as keyof typeof categoryMap].map(
        (item: string) => {
          return autoRetryWrapper(
            DataIndicesAPI.getDataIndicesList({
              标识集合: [DataDefinitionNameToMarkMap[item]],
              时间晚于: new Date().getFullYear() - 1 + "-01-01 00:00:00",
              页码: 1,
              页容量: 1000,
            })
          );
        }
      )
    );
    // console.log("fetchDataTask", fetchDataTask);
  }
  const res = await Promise.all(fetchDataTask);
  const data = res.map((item: any) => item["当前记录"]);
  processChartData(data.flat());
  const resLastYear = await Promise.all(fetchDataTaskLastYear);
  const dataLastYear = resLastYear.map((item: any) => item["当前记录"]);
  processChartData2(dataLastYear.flat());
  initChartMiddle4();
};

onMounted(() => {
  // 获取数据后初始化图表
  initData();
  // initChartMiddle4();
  // 监听窗口变化，重置图表
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
.el-link-more {
  @apply cursor-pointer;
  float: right;
  margin-right: 1rem;
  color: $bigscreen-primary-color-7;
  font-size: 14px;
}
</style>
