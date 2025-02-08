<template>
  <Model1 class="model1" title="结算交易分析">
    <div class="risk-warning" @click="handleRiskWarningClick">
      <span class="text">有</span>
      <span class="risk-count">{{ props.data?.riskCount || 0 }}</span>
      <span class="text">份合同处于有履约风险状态</span>
      <span>
        <el-icon><ArrowRight /></el-icon>
      </span>
    </div>
    <div id="chart2-right-2" style="width: 100%; height: 250px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import { useRouter } from "vue-router";
import sassvariables from "@/styles/variables.module.scss";
import { getDateOfOneMonth } from "@/utils/time";

const chart = shallowRef<echarts.ECharts | null>(null);
const router = useRouter();

const props = defineProps<{
  data?: any;
}>();

// 每个类别对应的数据系列
const dates = getDateOfOneMonth(new Date().toISOString()).slice(22);

// 随机生成收入数据
const getRandomData = () => {
  return props.data
    ? props.data.map((item: any) => ({
        tradingVolume: item.tradingVolume, // 销售量
        transactionVolume: item.transactionVolume, // 销售金额
      }))
    : dates.map(() => ({
        tradingVolume: 0, // 销售量
        transactionVolume: 0, // 销售金额
      }));
};

const initChart = () => {
  chart.value = echarts.init(
    document.getElementById("chart2-right-2") as HTMLDivElement
  );
  chart.value.clear();
  const data = getRandomData();

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      // top: 60,
      bottom: "1%",
      containLabel: true,
    },
    legend: {
      data: ["销售金额", "销售量"],
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
      },
      icon: "rect",
      right: 10,
      itemWidth: 12,
      itemHeight: 7,
      itemGap: 8, // 图例项之间的间距
      // padding: [-5, 0, 0, 0], // 图例的上下内边距，格式为 [上, 右, 下, 左]
    },
    xAxis: [
      {
        type: "category",
        data: dates,
        axisLine: {
          lineStyle: {
            color: sassvariables["bigscreen-primary-color-8"],
          },
        },
        axisLabel: {
          fontSize: 15,
          color: sassvariables["bigscreen-primary-color-7"],
        },
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        min: 0,
        max: 100,
        interval: 20,
        name: "单位：万元",
        nameTextStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
          fontSize: 15,
        },
        nameGap: 15,
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
          fontSize: 16,
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
      {
        type: "value",
        min: 0,
        max: 10,
        interval: 2,
        name: "单位：万吨",
        nameTextStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
          fontSize: 15,
        },
        nameGap: 20,
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
          fontSize: 16,
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
    ],
    series: [
      {
        name: "销售金额",
        type: "bar",
        yAxisIndex: 0, // 指定使用左边的Y轴
        data: data.map((item) => item.transactionVolume),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: sassvariables["bigscreen-primary-color-11"] },
            { offset: 1, color: sassvariables["bigscreen-primary-color-12"] },
          ]),
        },
        barWidth: "25%",
      },
      {
        name: "销售量",
        type: "bar",
        yAxisIndex: 1, // 指定使用右边的Y轴
        data: data.map((item) => item.tradingVolume),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: sassvariables["bigscreen-primary-color-5"] },
            { offset: 1, color: sassvariables["bigscreen-primary-color-6"] },
          ]),
        },
        barWidth: "25%",
      },
    ],
  };
  chart.value.setOption(option);
};

const handleRiskWarningClick = () => {
  console.log("风险提示信息被点击了");
  // 跳转合同三级页
  router.push({
    name: "ContractList",
    query: {
      module: "contract",
      filters: JSON.stringify({
        是否风险合同: true,
      }),
    },
  });
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    chart.value?.resize();
  });
});
</script>

<style lang="scss" scoped>
.model1 {
  @apply flex flex-1 flex-col h-full;
}

.risk-warning {
  @apply flex items-center relative cursor-pointer;
  font-size: 16px;
  letter-spacing: 1px;
  color: #fff;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 20px;
  z-index: 10; /* 确保点击事件能触发 */
  width: 55%; /* 避免遮挡右边图例导致点击不了 */
}

.risk-warning span {
  @apply inline-flex items-center;
}

.risk-warning .text {
  color: #fff;
}

.risk-warning .risk-count {
  color: #e8325c;
  margin: 0 5px;
  @apply font-bold;
}

.risk-warning:hover {
  @apply opacity-70;
}
</style>
