<template>
  <div v-loading="loading" class="w-full">
    <div class="search-bar mb-4 ml-4">
      <div class="flex gap-2">
        <el-date-picker
          v-model="datatime"
          :type="timeTabValue === 'year' ? 'year' : 'month'"
          placeholder="请选择月份"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <TextTab v-model="timeTabValue" style="transform: translateY(30%)" />
      <span class="text-date-desc">数据截止日期：{{ dataTimeText }}</span>
    </div>
    <div class="bg-view-body pl-4 pr-4">
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
                    @click="handleMetricItemClick(item)"
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
                    @change="handleGraphTypeChange"
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
            <div class="flex gap-2 justify-center">
              <div
                v-if="hasSubOrg"
                id="revenue-analysis-chart-3"
                style="height: 250px; width: 100%"
              />
              <div
                v-if="hasProduct"
                id="profit-analysis-chart-3"
                style="height: 250px; width: 100%"
              />
            </div>
          </div>
        </div>
      </Model1>
      <!-- <div class="b-space" /> -->
      <div class="flex gap-2">
        <Model1 v-if="hasSubOrg" class="model1" title="下属企业营收分析">
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
                  <tr>
                    <td>桂盛桂轩</td>
                    <td>1000</td>
                    <td>1000</td>
                    <td>1000</td>
                    <td>1000</td>
                  </tr>
                  <tr>
                    <td>恒润</td>
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
        <!-- todo 按照是不是有数据来决定是否显示 -->
        <Model1 v-if="hasProduct" class="model1" title="产品营收分析">
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
                  <tr>
                    <td>桂盛桂轩</td>
                    <td>1000</td>
                    <td>1000</td>
                    <td>1000</td>
                    <td>1000</td>
                  </tr>
                  <tr>
                    <td>恒润</td>
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
  </div>
</template>

<script setup lang="ts">
import Model1 from "../../Model1/index.vue";
import TextTab from "@/views/bigscreen/components/SecondPage/Common/TextTab/index.vue";
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
    title: "累计",
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
// 时间维度
const timeTabValue = ref("year");
const graphType = ref("bar"); // chart1的柱状图/折线图切换开关
const chart2 = shallowRef();
const chart3 = shallowRef();
const chart4 = shallowRef();
const chart5 = shallowRef();
const chart6 = shallowRef();
const liquidFill = shallowRef();
const fulfilledPercent = ref(20);
const datatime = ref(new Date());
const dataTimeText = ref(
  new Date(datatime.value).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  })
);
// 以起止时间表示查询的数据
const queryData = ref({
  startDate: "",
  endDate: "",
});
const loading = ref(false);
// 是否有下属企业
const hasSubOrg = ref(false);
// 是否有产品
const hasProduct = ref(true);

// 如果timeTabValue为year，则显示年份，否则显示月份
watch(timeTabValue, (newVal, oldVal) => {
  console.log(newVal, oldVal);
  if (newVal !== oldVal) {
    // TODO 重新查询数据
    // 如果是月→年，则提取年份并查询年份数据
    try {
      if (newVal === "year") {
        // TODO 查询年份数据
        const year = datatime.value.getFullYear();
        queryData.value.startDate = `${year}-01-01`;
        queryData.value.endDate = `${year}-12-31`;
        // TODO 查询年份数据
        handleSearch();
      }
      // 如果是年→月，则查询【当月】数据
      if (newVal === "month") {
        // TODO 查询月份数据
        const year = datatime.value.getFullYear();
        const month = datatime.value.getMonth() + 1;
        queryData.value.startDate = `${year}-${month}-01`;
        queryData.value.endDate = `${year}-${month}-31`;
        handleSearch();
      }
    } catch (error) {
      console.error(error);
    }
  }
});

// 处理点击事件
const handleMetricItemClick = (item: any) => {
  // 如果item.title为1月【时间】，则显示1月数据
  if (item.title === "1月") {
    // TODO 显示1月数据
  }
};

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

const initChart1 = (type: string = "bar") => {
  if (!chart1.value) {
    chart1.value = echarts.init(
      document.getElementById("revenue-analysis-chart-1")
    );
  }
  chart1.value.clear();
  // 绑定点击事件
  chart1.value.on("click", "series.bar", (params: any) => {
    // TODO 点击事件, 按照月份原地更新
    // 获取当前月份
    const month = params.name.split("月")[0];
    // 更新月份
    timeTabValue.value = "month";
    // 更新月份
    datatime.value = new Date(new Date().getFullYear(), month - 1, 1);
    handleSearch();
  });
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
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
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
  // 折线图
  const optionLine = {
    ...option,
    series: [
      {
        ...option.series[0],
        type: "line",
        markLine: {
          lineStyle: {
            type: "dashed",
            color: sassvariables["bigscreen-primary-color-7"],
          },
        },
      },
      {
        ...option.series[1],
        type: "line",
        data: [110, 220],
      },
    ],
  };
  chart1.value.setOption(type === "bar" ? option : optionLine);
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
// 下属企业营收分析
const initChart3 = () => {
  // 如果hasSubOrg为false，则不初始化
  if (!hasSubOrg.value) {
    return;
  }
  if (!chart3.value) {
    chart3.value = echarts.init(
      document.getElementById("revenue-analysis-chart-3")
    );
  }
  // 绑定点击事件
  chart3.value.on("click", "series.pie", (params: any) => {
    console.log(params);
    // TODO 点击事件, 判断穿透到什么地方
  });
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
        label: {
          show: true,
          formatter: "{b}\n{c}",
          color: "#fff",
          fontSize: 15,
        },
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

const handleGraphTypeChange = () => {
  initChart1(graphType.value);
};

// 产品营收分析
const initChart4 = () => {
  // 如果hasProduct为false，则不初始化
  if (!hasProduct.value) {
    return;
  }
  if (!chart4.value) {
    chart4.value = echarts.init(
      document.getElementById("profit-analysis-chart-3")
    );
  }
  chart4.value.clear();
  // 绑定点击事件
  chart4.value.on("click", "series.pie", (params: any) => {
    console.log(params);
    // TODO 点击事件, 判断穿透到什么地方
  });
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
        label: {
          show: true,
          formatter: "{b}\n{c}",
          color: "#fff",
          fontSize: 15,
        },
        data: [
          { value: 1048, name: "原油" },
          { value: 735, name: "成品油" },
          { value: 580, name: "化工产品" },
          { value: 484, name: "其他" },
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
  const text = new Date(datatime.value).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });
  const currentMonth = new Date().getMonth() + 1;
  // 如果timeTabValue为year:
  // 如果为当前年份，则显示当前年份，否则显示~年12月
  // 如果timeTabValue为month:
  // 显示该月份
  dataTimeText.value =
    timeTabValue.value === "year"
      ? new Date().getFullYear() === Number(text.substring(0, 4))
        ? text.substring(0, 4) + `年${currentMonth}月`
        : text.substring(0, 4) + "年12月"
      : text;
};

const initData = async () => {
  // TODO 查询相关数据
  // 根据路由参数、时间、时间类型，查询相关数据
};

const initialize = async () => {
  await initData();
  initChart1();
  // initChart2();
  initChart3();
  initChart4();
  // initChart5();
  // initChart6();
  initLiquidFill();
};

onMounted(async () => {
  await initialize();
  window.addEventListener("resize", () => {
    try {
      chart1.value.resize();
      // chart2.value.resize();
      chart3.value.resize();
      chart4.value.resize();
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
  @apply flex items-end justify-between px-4;
  padding-top: 0;
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
  .text-date-desc {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  @apply w-full m-0 overflow-y-auto;
  height: 190px;
  /* 使用 separate 以支持 border-spacing */
  border-spacing: 2px 1px; /* 设置单元格之间的外间距：左右px，上下1px */
  border-collapse: collapse;
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
  }
  th {
    @apply text-[#9CC9F0] bg-[#07488C] lh-loose;
    letter-spacing: 1px;
  }
  td {
    @apply lh-normal bg-transparent;
  }
  tr:nth-child(2n) {
    @apply bg-[#05082B];
  }
}
</style>
