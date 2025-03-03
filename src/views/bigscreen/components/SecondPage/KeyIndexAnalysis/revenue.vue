<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Model1 class="model1" title="营收逐月分析">
        <div class="model-body">
          <div class="model-body__content">
            <div
              id="revenue-analysis-chart-1"
              style="height: 200px; width: 100%"
            />
          </div>
        </div>
      </Model1>
      <!-- <div class="b-space" /> -->
      <Model1 class="model1" title="营收同比环比分析">
        <div class="model-body">
          <div class="model-body__content">
            <div class="flex items-center h-full">
              <div
                id="revenue-analysis-chart-2"
                style="height: 200px; width: 100%"
              />
            </div>
          </div>
        </div>
      </Model1>
      <!-- <div class="b-space" /> -->
      <Model1 class="model1" title="营收构成分析">
        <div class="model-body">
          <div class="model-body__content">
            <div
              id="revenue-analysis-chart-3"
              style="height: 200px; width: 100%"
            />
          </div>
        </div>
      </Model1>
    </div>
    <!-- <div class="c-space" /> -->
    <div class="b-right">
      <Model1 class="model1" title="利润逐月分析">
        <div class="model-body">
          <div class="model-body__content">
            <div
              id="profit-analysis-chart-1"
              style="height: 200px; width: 100%"
            />
          </div>
        </div>
      </Model1>
      <!-- <div class="b-space" /> -->
      <Model1 class="model1" title="利润同比环比分析">
        <div class="model-body">
          <div class="model-body__content">
            <div class="flex items-center h-full">
              <div
                id="profit-analysis-chart-2"
                style="height: 200px; width: 100%"
              />
            </div>
          </div>
        </div>
      </Model1>
      <!-- <div class="b-space" /> -->
      <Model1 class="model1" title="利润构成分析">
        <div class="model-body">
          <div class="model-body__content">
            <div
              id="profit-analysis-chart-3"
              style="height: 200px; width: 100%"
            />
          </div>
        </div>
      </Model1>
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import DetailTable1 from "@/views/bigscreen/components/Common/Table/detailTable1.vue";
import Left1 from "@/views/bigscreen/components/SecondPage/Left/left1.vue";
import Left2 from "@/views/bigscreen/components/SecondPage/Left/left2.vue";
import Right1 from "@/views/bigscreen/components/SecondPage/Right/right1.vue";
import { ref, onMounted, shallowRef } from "vue";
import * as echarts from "echarts";
import "echarts-liquidfill";
import sassvariables from "@/styles/variables.module.scss";
import { getDateOfOneYear, getDateOfOneYearToNow } from "@/utils/time";

const totalData = ref([
  {
    year: "25438",
    month: "25438",
  },
  {
    year: "25438",
    month: "25438",
  },
  {
    year: "25438",
    month: "25438",
  },
  {
    year: "25438",
    month: "25438",
  },
]);

const chart1 = shallowRef();
const chart2 = shallowRef();
const chart3 = shallowRef();
const chart4 = shallowRef();
const chart5 = shallowRef();
const chart6 = shallowRef();
const fulfilledPercent = ref(20);

const initChart1 = () => {
  if (!chart1.value) {
    chart1.value = echarts.init(
      document.getElementById("revenue-analysis-chart-1")
    );
  }
  chart1.value.clear();
  // 完成率水滴图
  const option = {
    series: [
      {
        type: "liquidFill",
        name: "完成率",
        data: [
          {
            value: fulfilledPercent.value / 100,
            direction: "left",
            itemStyle: {
              color: "#6C683E",
            },
          },
          fulfilledPercent.value / 100,
        ],
        radius: "60%",
        outline: {
          show: false,
        },
        backgroundStyle: {
          color: "transparent",
          borderColor: "#156ACF",
          borderWidth: 1,
          shadowColor: "rgba(0, 0, 0, 0.4)",
          shadowBlur: 20,
        },
        color: [
          new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: "#EB8A00" },
            { offset: 0.8, color: "#D65305" },
          ]),
        ],
        label: {
          position: ["50%", "50%"],
          formatter: function () {
            return `${fulfilledPercent.value}%`;
          },
          fontSize: "1.5rem",
          color: sassvariables["bigscreen-primary-color-1"],
        },
        waveAnimation: fulfilledPercent.value > 0, // 只有在完成率大于0时启用水波动画
        animationEasingUpdate: "cubicOut", // 波动动画的缓动效果
        amplitude: fulfilledPercent.value > 0 ? 10 : 0, // 增加波动幅度，让水波效果更明显
        phase: fulfilledPercent.value > 0 ? 1 : 0, // 设置波浪初始偏移，实现水波从左向右滚动的效果
      },
    ],
  };
  chart1.value.setOption(option);
};
const initChart2 = () => {
  if (!chart2.value) {
    chart2.value = echarts.init(
      document.getElementById("revenue-analysis-chart-2")
    );
  }
  chart2.value.clear();
  const option = {
    xAxis: {
      type: "category",
      data: getDateOfOneYearToNow(),
      axisLabel: {
        textStyle: {
          color: "white",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "万元",
      nameTextStyle: {
        color: "white",
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "white",
        },
      },
      axisLabel: {
        color: "white",
      },
    },
    series: [
      {
        type: "line",
        data: getDateOfOneYearToNow().map((item) => {
          return {
            value: Math.random() * 10000,
            name: item,
          };
        }),
      },
    ],
  };
  chart2.value.setOption(option);
};
const initChart3 = () => {
  if (!chart3.value) {
    chart3.value = echarts.init(
      document.getElementById("revenue-analysis-chart-3")
    );
  }
  chart3.value.clear();
  const option = {
    legend: {
      show: true,
      icon: "circle",
      textStyle: {
        color: "white",
      },
    },
    series: [
      {
        type: "pie",
        data: [
          { value: 1048, name: "原油" },
          { value: 735, name: "成品油" },
          { value: 580, name: "化工产品" },
          { value: 484, name: "其他" },
        ],
      },
    ],
  };
  chart3.value.setOption(option);
};
const initChart4 = () => {
  if (!chart4.value) {
    chart4.value = echarts.init(
      document.getElementById("profit-analysis-chart-1")
    );
  }
  chart4.value.clear();
  // 柱形图，利润逐月分析，两个柱子一个是计划值一个是完成值
  // x轴是月份，y轴是利润
  const option = {
    xAxis: {
      type: "category",
      // data: getDateOfOneYearToNow(),
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
    },
    yAxis: {
      type: "value",
      name: "万元",
      nameTextStyle: {
        color: "white",
      },
    },
    series: [
      {
        type: "bar",
        data: [
          1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
          12000,
        ],
      },
    ],
  };
  chart4.value.setOption(option);
};

const initChart5 = () => {
  if (!chart5.value) {
    chart5.value = echarts.init(
      document.getElementById("profit-analysis-chart-2")
    );
  }
  // 同比环比折线 1-12月
  const option = {
    xAxis: {
      type: "category",
      // data: getDateOfOneYearToNow(),
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
    },
    yAxis: {
      type: "value",
      name: "%",
      nameTextStyle: {
        color: "white",
      },
    },
    series: [
      {
        type: "line",
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
      },
    ],
  };
  chart5.value.setOption(option);
};

// 利润构成分析，饼图
const initChart6 = () => {
  if (!chart6.value) {
    chart6.value = echarts.init(
      document.getElementById("profit-analysis-chart-3")
    );
  }
  chart6.value.clear();
  const option = {
    legend: {
      show: true,
      icon: "circle",
      textStyle: {
        color: "white",
      },
    },
    series: [
      {
        type: "pie",
        data: [
          { value: 1048, name: "原油" },
          { value: 735, name: "成品油" },
          { value: 580, name: "化工产品" },
          { value: 484, name: "其他" },
        ],
      },
    ],
  };
  chart6.value.setOption(option);
};

onMounted(() => {
  initChart1();
  initChart2();
  initChart3();
  initChart4();
  initChart5();
  initChart6();
  window.addEventListener("resize", () => {
    chart1.value.resize();
    chart2.value.resize();
    chart3.value.resize();
    chart4.value.resize();
    chart5.value.resize();
    chart6.value.resize();
  });
});
</script>

<style lang="scss" scoped>
@use "@/styles/gmixin.scss" as gmixin;

.bg-view-body {
  flex: 1;
  display: flex;
  gap: 10px;
  width: 100%;
  // height如果设为100%会导致左右定高，不设则会根据内容撑开
  // 定高可以自适应一屏，但是会使得中间地图无法保持比例，进而导致相对坐标不准确
  height: 100%;
  .b-left,
  .b-middle,
  .b-right {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .b-left {
    flex: 1;
  }
  .b-right {
    flex: 1;
    @include gmixin.b-table-1;
  }
}
.b-space {
  width: 0;
  height: 20px;
}
.c-space {
  width: 30px;
  @apply h-0;
}
.bg-view-body > .c-space:first-child {
  width: 15px;
}
.bg-view-body > .c-space:last-child {
  width: 15px;
}
.desc-item {
  @apply flex justify-between w-75%;
  .desc-item__name {
    @apply text-white;
    font-size: 1.2rem;
  }
  .desc-item__value {
    @apply text-blue-500;
    font-size: 1.2rem;
    .desc-item__value__num {
      @apply text-blue-500 mr-2;
      font-size: 1.2rem;
    }
    .desc-item__value__unit {
      @apply text-white;
      font-size: 1rem;
    }
  }
}
// .model1 {
//   @apply flex flex-1 flex-col h-full;
// }

.model1 {
  .model-footer {
    .model-footer__bg {
      height: auto;
    }
  }
}
</style>
