<template>
  <Model1 class="model1" title="仓储经营情况">
    <!-- 标签页区 -->
    <!-- <Tab v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        :label="BusinessEnum.CPY"
        :name="BusinessEnumMap[BusinessEnum.CPY]"
      />
      <el-tab-pane
        :label="BusinessEnum.YY"
        :name="BusinessEnumMap[BusinessEnum.YY]"
      />
      <el-tab-pane
        :label="BusinessEnum.RLY"
        :name="BusinessEnumMap[BusinessEnum.RLY]"
      />
      <el-tab-pane
        :label="BusinessEnum.HGCP"
        :name="BusinessEnumMap[BusinessEnum.HGCP]"
      />
    </Tab> -->
    <!-- 指标区 -->
    <div class="flex mt-4">
      <div class="desc-box">
        <div class="desc-box__icon">
          <img style="height: 25px; width: 25px" :src="planIcon" alt="" />
        </div>
        <div class="desc-box__content">
          <div class="desc-box__title">计划营收额</div>
          <div class="desc-box__amount">
            <el-statistic :value="animatedPlanAmount" />
            <span class="__unit">万元</span>
          </div>
        </div>
      </div>
      <div class="desc-box">
        <div class="desc-box__icon">
          <img style="height: 25px; width: 25px" :src="sellIcon" alt="" />
        </div>
        <div class="desc-box__content">
          <div class="desc-box__title">实际营收额</div>
          <div class="desc-box__amount">
            <el-statistic :value="animatedSellAmount" />
            <span class="__unit">万元</span>
          </div>
        </div>
      </div>
      <div class="desc-box">
        <div class="desc-box__icon">
          <img style="height: 25px; width: 25px" :src="finishIcon" alt="" />
        </div>
        <div class="desc-box__content">
          <div class="desc-box__title">完成率</div>
          <div class="desc-box__amount">
            <el-statistic :value="animatedFinishRate" />
            <span class="__unit">%</span>
          </div>
        </div>
      </div>
    </div>
    <div id="chart2-left-3" style="height: 230px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/SecondPage/Model1/index.vue";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import * as echarts from "echarts";
import { BusinessEnum, BusinessEnumMap } from "@/enums/BusinessEnum";
import { ref, onMounted, shallowRef } from "vue";
import { useTransition } from "@vueuse/core";
import planIcon from "@/views/bigscreen/img/business.png";
import sellIcon from "@/views/bigscreen/img/left_icon1.png";
import finishIcon from "@/views/bigscreen/img/left_icon2.png";
import sassvariables from "@/styles/variables.module.scss";

// 每个类别对应的数据系列(过去12个月)
const year = new Date().getFullYear();
const categoryMap = new Array(12)
  .fill(0)
  .map((_, index) => `${year}年${index + 1}月`);

const activeName = ref<number | string | undefined>(BusinessEnum.CPY);

// 随机生成分类数量数据
const getRandomCategoryData = (categories: any[]) => {
  return categories.map(() => Math.floor(Math.random() * 101)); // 随机生成0-100之间的值
};

const chart = shallowRef<echarts.ECharts | null>(null);

const planAmount = ref(552);
const sellAmount = ref(226.42);
const finishRate = computed(() => {
  return +((sellAmount.value / planAmount.value) * 100).toFixed(2);
});
const animatedPlanAmount = useTransition(planAmount, {
  duration: 1500,
});
const animatedSellAmount = useTransition(sellAmount, {
  duration: 1500,
});
const animatedFinishRate = useTransition(finishRate, {
  duration: 1500,
});

const clickBarCb = (params: any) => {
  console.log(params);
};

function handleClick() {
  // console.log("handleClick");
  // 随机生成数据
  initChartMiddle4();
}

const initChartMiddle4 = () => {
  if (!chart.value) {
    chart.value = echarts.init(
      document.getElementById("chart2-left-3") as HTMLDivElement
    );
  }
  chart.value.clear();
  const data = getRandomCategoryData(categoryMap);
  // 周转量
  const data2 = getRandomCategoryData(categoryMap);
  // 利润
  const data3 = getRandomCategoryData(categoryMap);

  const gradientColors = [
    { start: "#f2b678", end: "#f18c32" },
    { start: "#18DBD4", end: "#01B3F3" },
    { start: "#25DDA7", end: "#249E55" },
  ];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["营收", "利润", "周转量"],
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
      },
      top: 20,
      left: "center",
      show: true,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categoryMap,
      axisLine: {
        lineStyle: {
          color: "#27518D",
        },
      },
      // 倾斜
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 15,
        color: sassvariables["bigscreen-primary-color-7"],
        formatter: (value: string) => {
          // 将年月格式化为年-月
          return value.replace("年", "-").replace("月", "");
        },
      },
    },
    // 双y轴，左右两边，一条是营收，一条是周转量
    yAxis: [
      {
        type: "value",
        name: "单位：万元",
        nameTextStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
          fontSize: 15,
        },
        nameGap: 20,
        axisLine: {
          show: true,
          lineStyle: {
            color: sassvariables["bigscreen-primary-color-7"],
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#27518D",
          },
        },
      },
      {
        type: "value",
        name: "单位：万吨",
        nameTextStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
          fontSize: 15,
        },
        nameGap: 20,
        axisLine: {
          show: true,
          lineStyle: {
            color: sassvariables["bigscreen-primary-color-7"],
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#27518D",
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        barGap: "5%", // 柱体间距
        // 柱间距离
        barCategoryGap: "20%",
        // 系列名称
        name: "营收",
        data: data,
      },
      {
        type: "bar",
        barGap: "5%", // 柱体间距
        name: "利润",
        data: data3,
      },
      {
        type: "line",
        yAxisIndex: 1,
        name: "周转量",
        data: data2,
        itemStyle: {
          color: "#F29379",
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

:deep(.desc-box) {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  // flex-gap
  justify-content: center;
  align-items: flex-start;
  margin: 0 10px;
  .desc-box__icon {
    margin-bottom: 10px;
  }
  .desc-box__content {
    display: flex;
    flex-direction: column;
    .desc-box__title {
      font-size: 16px;
      color: #5099e3;
    }
    .desc-box__amount {
      display: flex;
      align-items: flex-end;
      font-size: 1.1rem;
      .el-statistic__number {
        color: #2abfff;
      }
      .__unit {
        margin-left: 1em;
        font-size: 1rem;
        color: #5099e3;
      }
    }
  }
}
</style>
