<template>
  <Model1 class="model1" title="历年销售趋势">
    <!-- 标签页区 -->
    <Tab v-model="activeName" @tab-click="handleClick">
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
    </Tab>
    <!-- 指标区 -->
    <div class="flex mt-4">
      <div class="desc-box">
        <div class="desc-box__icon">
          <img style="height: 25px; width: 25px" :src="planIcon" alt="" />
        </div>
        <div class="desc-box__content">
          <div class="desc-box__title">计划销售额</div>
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
          <div class="desc-box__title">实际销售额</div>
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
import Model1 from "../Model1/index.vue";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import * as echarts from "echarts";
import { BusinessEnum, BusinessEnumMap } from "@/enums/BusinessEnum";
import { ref, onMounted, shallowRef } from "vue";
import { useTransition } from "@vueuse/core";
import planIcon from "@/views/bigscreen/img/business.png";
import sellIcon from "@/views/bigscreen/img/left_icon1.png";
import finishIcon from "@/views/bigscreen/img/left_icon2.png";
import sassvariables from "@/styles/variables.module.scss";

// 每个类别对应的数据系列(过去5年的年份)
const categoryMap = new Array(5)
  .fill(new Date().getFullYear())
  .map((year, index) => year - (4 - index));

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
  ];

  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: categoryMap,
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
      },
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
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      axisLabel: {
        fontSize: 15,
        color: sassvariables["bigscreen-primary-color-7"],
        formatter: (value: string) => {
          return value + "年";
        },
      },
    },
    yAxis: {
      type: "value",
      name: "单位：万元",
      nameTextStyle: {
        // 显示
        color: sassvariables["bigscreen-primary-color-7"],
        fontSize: 15,
      },
      nameGap: 20, // 控制轴名与轴线之间的间距，单位为像素
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
    series: [
      {
        type: "bar",
        barWidth: "50%",
        barGap: "5%", // 柱体间距
        data: data,
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
