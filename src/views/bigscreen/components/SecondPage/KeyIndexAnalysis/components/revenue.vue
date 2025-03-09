<template>
  <div v-loading="loading" class="w-full">
    <div class="search-bar mb-4 ml-4">
      <div class="flex gap-2">
        <el-date-picker
          v-model="datatime"
          type="month"
          placeholder="请选择月份"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <span class="text-white text-lg">数据截止日期：{{ dataTimeText }}</span>
    </div>
    <div class="bg-view-body">
      <Model1 class="model1 w-full" title="营收逐月分析">
        <div class="model-body">
          <div class="model-body__content">
            <div class="flex items-center h-full w-full gap-2">
              <div class="flex items-center justify-center w-1/3">
                <div
                  id="revenue-analysis-chart-liquid-fill"
                  style="height: 250px; width: 60%"
                />
                <div class="flex flex-col items-center justify-center w-2/5">
                  <MetricItem
                    v-for="item in metricItemData"
                    :key="item.title"
                    :title="item.title"
                    :value="item.value"
                    :unit="item.unit"
                  />
                </div>
              </div>
              <div class="relative w-[calc(100%-33%)]">
                <div
                  id="revenue-analysis-chart-1"
                  style="height: 250px; width: 100%"
                />
                <!-- 柱状图/折线图切换开关 -->
                <div class="flex justify-end absolute top-2 right-12 w-full">
                  <el-radio-group
                    v-model="graphType"
                    size="small"
                    fill="darkBlue"
                  >
                    <el-radio-button label="柱状图" value="bar" />
                    <el-radio-button label="折线图" value="line" />
                  </el-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Model1>
      <Model1 class="model1" title="营收构成分析">
        <div class="model-body">
          <div class="model-body__content">
            <div class="flex gap-2">
              <div
                id="revenue-analysis-chart-3"
                style="height: 250px; width: 100%"
              />
              <div
                id="profit-analysis-chart-3"
                style="height: 250px; width: 100%"
              />
            </div>
          </div>
        </div>
      </Model1>
      <!-- <div class="b-space" /> -->
      <Model1 class="model1" title="下属企业当月营收">
        <div class="model-body">
          <div class="model-body__content mx-4 my-2 flex gap-2">
            <table class="sub-org-table m-auto">
              <thead>
                <tr>
                  <th>企业</th>
                  <th>月实际（累计）</th>
                  <th>同比</th>
                  <th>环比</th>
                  <th>完成率</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>广投石化</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>1000</td>
                </tr>
                <tr>
                  <td>开燃公司</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>1000</td>
                </tr>
              </tbody>
            </table>
            <table class="sub-org-table m-auto">
              <thead>
                <tr>
                  <th>企业</th>
                  <th>月实际（累计）</th>
                  <th>同比</th>
                  <th>环比</th>
                  <th>完成率</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>广投石化</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>1000</td>
                </tr>
                <tr>
                  <td>开燃公司</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>1000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Model1>
    </div>
  </div>
</template>

<script setup lang="ts">
import Model1 from "../../Model1/index.vue";
import DetailTable1 from "@/views/bigscreen/components/Common/Table/detailTable1.vue";
import Left1 from "@/views/bigscreen/components/SecondPage/Left/left1.vue";
import Left2 from "@/views/bigscreen/components/SecondPage/Left/left2.vue";
import Right1 from "@/views/bigscreen/components/SecondPage/Right/right1.vue";
import { ref, onMounted, shallowRef } from "vue";
import * as echarts from "echarts";
import "echarts-liquidfill";
import MetricItem from "@/views/bigscreen/components/SecondPage/Common/MetricItem/index.vue";
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

const metricItemData = ref([
  {
    title: "1月",
    value: 0,
    unit: "万元",
  },
  {
    title: "环比增幅",
    value: 0,
    unit: "%",
  },
  {
    title: "同比增长",
    value: 0,
    unit: "万元",
  },
  {
    title: "同比增幅",
    value: 0,
    unit: "%",
  },
]);

const subOrgTableData = ref([
  {
    name: "广投石化",
    value: "1000",
  },
  {
    name: "开燃公司",
    value: "1000",
  },
]);

const chart1 = shallowRef();
const graphType = ref("bar"); // chart1的柱状图/折线图切换开关
const chart2 = shallowRef();
const chart3 = shallowRef();
const chart4 = shallowRef();
const chart5 = shallowRef();
const chart6 = shallowRef();
const liquidFill = shallowRef();
const fulfilledPercent = ref(20);
const datatime = ref();
const dataTimeText = computed(() => {
  if (!datatime.value) {
    return "";
  }
  return new Date(datatime.value).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });
});
const loading = ref(false);

const initLiquidFill = () => {
  if (!liquidFill.value) {
    liquidFill.value = echarts.init(
      document.getElementById("revenue-analysis-chart-liquid-fill")
    );
  }
  liquidFill.value.clear();
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
        radius: "90%",
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
          fontSize: 20,
          color: sassvariables["bigscreen-primary-color-1"],
        },
        waveAnimation: fulfilledPercent.value > 0, // 只有在完成率大于0时启用水波动画
        animationEasingUpdate: "cubicOut", // 波动动画的缓动效果
        amplitude: fulfilledPercent.value > 0 ? 10 : 0, // 增加波动幅度，让水波效果更明显
        phase: fulfilledPercent.value > 0 ? 1 : 0, // 设置波浪初始偏移，实现水波从左向右滚动的效果
      },
    ],
  };
  liquidFill.value.setOption(option);
};

const initChart1 = () => {
  if (!chart1.value) {
    chart1.value = echarts.init(
      document.getElementById("revenue-analysis-chart-1")
    );
  }
  chart1.value.clear();
  // 柱状图
  const option = {
    legend: {
      show: true,
      // icon: "circle",
      top: "3%",
      data: ["计划经营收入", "实际经营收入"],
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      top: "50px",
      bottom: "10px",
      containLabel: true,
    },
    color: ["orange", "lightgreen"],
    xAxis: {
      type: "category",
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
      axisLine: {
        show: true,
        lineStyle: {
          color: 'sassvariables["bigscreen-primary-color-7"]',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      name: "单位：万元",
      axisLine: {
        show: true,
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
      // 读取
      nameTextStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
        fontSize: 15,
        padding: [0, 0, 0, 20],
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
    },
    series: [
      {
        type: "bar",
        name: "计划经营收入",
        barWidth: "25%",
        barGap: "35%",
        markLine: {
          lineStyle: {
            type: "dashed",
            color: sassvariables["bigscreen-primary-color-7"],
          },
        },
        // 渐变绿色
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: "#22FF22" },
          { offset: 1, color: sassvariables["bigscreen-primary-color-7"] },
        ]),
        data: [100, 200],
      },
      {
        type: "bar",
        name: "实际经营收入",
        barWidth: "25%",
        barGap: "35%",
        data: [110, 220],
        markLine: {
          lineStyle: {
            type: "dashed",
            color: sassvariables["bigscreen-primary-color-7"],
          },
        },
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
    legend: {
      show: true,
      icon: "circle",
      textStyle: {
        color: "white",
      },
      data: ["同比", "环比"],
    },
    xAxis: {
      type: "category",
      axisLabel: {
        textStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
      axisTick: {
        show: false,
      },
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
      name: "单位: %",
      axisLine: {
        show: false,
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
      nameTextStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
        fontSize: 15,
        padding: [0, 0, 0, 20],
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: sassvariables["bigscreen-primary-color-7"],
        },
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
    grid: {
      left: "3%",
      right: "4%",
      top: "5%",
      bottom: "3%",
      containLabel: true,
    },
    series: [
      {
        type: "pie",
        radius: ["10%", "60%"],
        roseType: "radius",
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
    legend: {
      show: true,
      icon: "circle",
      textStyle: {
        color: "white",
      },
    },
    color: ["orange", "lightgreen"],
    xAxis: {
      type: "category",
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
      axisLine: {
        show: true,
        lineStyle: {
          color: 'sassvariables["bigscreen-primary-color-7"]',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      name: "单位：万元",
      axisLine: {
        show: true,
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
      // 读取
      nameTextStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
        fontSize: 15,
        padding: [0, 0, 0, 20],
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: sassvariables["bigscreen-primary-color-7"],
        },
      },
    },
    series: [
      {
        type: "bar",
        barWidth: "25%",
        markLine: {
          lineStyle: {
            type: "dashed",
            color: sassvariables["bigscreen-primary-color-7"],
          },
        },
        data: [
          {
            value: 100,
            name: "完成率",
          },
        ],
      },
      {
        type: "bar",
        barWidth: "25%",
        data: [
          {
            value: 100,
            name: "完成量",
          },
        ],
        markLine: {
          lineStyle: {
            type: "dashed",
            color: sassvariables["bigscreen-primary-color-7"],
          },
        },
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
    grid: {
      left: "3%",
      right: "4%",
      top: "5%",
      bottom: "3%",
      containLabel: true,
    },
    series: [
      {
        type: "pie",
        radius: ["10%", "60%"],
        roseType: "radius",
        data: [
          { value: 533, name: "广投石化" },
          { value: 335, name: "开燃公司" },
        ],
      },
    ],
  };
  chart6.value.setOption(option);
};

const handleSearch = () => {
  // TODO 查询相关数据
};

onMounted(() => {
  initChart1();
  // initChart2();
  initChart3();
  // initChart4();
  // initChart5();
  // initChart6();
  initLiquidFill();
  window.addEventListener("resize", () => {
    try {
      chart1.value.resize();
      // chart2.value.resize();
      chart3.value.resize();
      // chart4.value.resize();
      // chart5.value.resize();
      // chart6.value.resize();
      liquidFill.value.resize();
    } catch (error) {
      console.log(error);
    }
  });
});
</script>

<style lang="scss" scoped>
@use "@/styles/gmixin.scss" as gmixin;

:deep(.search-bar) {
  @apply flex items-center justify-between;
  background-color: transparent;
  border: none;
  .el-date-editor {
    background-color: transparent;
    border: none;
    .el-input__wrapper {
      background-color: #222590;
      box-shadow: none;
      .el-input__inner {
        color: #fff;
      }
    }
  }
}

:deep(.el-radio-button.el-radio-button--small) {
  .el-radio-button__inner {
    background-color: rgb(32, 32, 40);
    color: #fff;
    border-color: rgb(32, 32, 40);
    &:hover {
      background-color: accent-blue;
      border-color: accent-blue;
      color: #fff;
    }
  }
}

.bg-view-body {
  flex: 1;
  display: flex;
  flex-direction: column;
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

.sub-org-table {
  @apply w-full m-0 overflow-y-auto border-separate;
  height: 190px;
  /* 使用 separate 以支持 border-spacing */
  border-spacing: 2px 1px; /* 设置单元格之间的外间距：左右px，上下1px */
  background-color: #050b47;
  tbody {
    @apply w-full overflow-y-auto;
    height: 170px; /* 设置高度，留出thead的高度 */
    tr {
      @apply h-10;
    }
  }
  th,
  td {
    @apply text-center;
    font-size: 16px;
    letter-spacing: 1px;
  }
  th {
    @apply text-white;
  }
}
</style>
