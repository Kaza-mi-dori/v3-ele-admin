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
                v-if="hasSubOrg"
                id="revenue-analysis-chart-31"
                style="height: 250px; width: 100%"
              />
              <div
                v-if="hasProduct"
                id="profit-analysis-chart-3"
                style="height: 250px; width: 100%"
              />
              <div
                v-if="hasProduct"
                id="profit-analysis-chart-41"
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
                  <tr v-for="item in table1Data" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.value[0] }}</td>
                    <td>{{ item.value[1] }}</td>
                    <td>{{ item.value[2] }}</td>
                    <td>{{ item.value[3] }}</td>
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
                  <tr v-for="item in table2Data" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.value[0] }}</td>
                    <td>{{ item.value[1] }}</td>
                    <td>{{ item.value[2] }}</td>
                    <td>{{ item.value[3] }}</td>
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
import * as echarts from "echarts";
import "echarts-liquidfill";
import MetricItem from "@/views/bigscreen/components/SecondPage/Common/MetricItem/index.vue";
import sassvariables from "@/styles/variables.module.scss";
import { ref, onMounted, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { getDateOfOneYear, getDateOfOneYearToNow } from "@/utils/time";
import { revenueData, businessStoreHook } from "@/store/modules/business";
import {
  initCache,
  clearCache,
  queryOrgData,
  queryProductTypeData,
  queryCompanyData,
  queryOrgAndProductTypeData,
  queryProductData,
  type AggregatedData,
} from "@/store/utils/agg-utils";
import { OurCompanyEnumMap } from "@/enums/BusinessEnum";
import { fulfillArray } from "@/utils";
import { dateTableEmits } from "element-plus/es/components/calendar/src/date-table";

const businessStore = businessStoreHook();

// 数据结果
interface TimeSpanDataResult {
  // 时间维度
  timeSpan: any;
  // 时间
  dataTime: string;
  // 指标
  keyIndexType: string;
  // 组织名
  org: string;
  // 产品类型
  productType?: string;
  // 产品细项
  product?: string;
  // 当期计划值 当期实际值 累计值 环比 环比增长 同比增长 同比增幅
  plan: number;
  real: number;
  accumulated: number;
  pOverPRate: number;
  pOverPValue: number;
  pToPRate: number;
  pToPValue: number;
  // 下属企业数据；产品数据；下属时间段数据
  subOrg?: TimeSpanDataResult[];
  subProduct?: TimeSpanDataResult[]; // 对企业是产品类型，对产品是分项产品
  subData?: TimeSpanDataResult[];
}

// 查询参数
interface TimeSpanDataQuery {
  keyIndexType: string;
  timeSpan: "year" | "month" | "season" | "day";
  dataTime: string;
  org: string;
  productType?: string; // 方便中间件组织用
  product?: string;
  // 是否包含下属企业信息
  withSubOrgResult?: boolean;
  // 是否包含产品信息
  withProductResult?: boolean;
  // 下属时间段数据维度
  subDataTimeSpan?: "year" | "month" | "season" | "day";
}

// 示例
// 查询2024年石化板块营收数据，包含下属企业信息和产品信息
const exampleQuery: TimeSpanDataQuery = {
  keyIndexType: "revenue",
  timeSpan: "year",
  dataTime: "2024-01-01",
  org: "石化板块",
  withSubOrgResult: true,
  withProductResult: true,
};

// 示例返回
const exampleResult: TimeSpanDataResult = {
  timeSpan: "year",
  dataTime: "2024-01-01",
  org: "石化板块",
  keyIndexType: "revenue",
  plan: 1000000,
  real: 1000000,
  accumulated: 1000000,
  pOverPRate: 100,
  pOverPValue: 1000000,
  pToPRate: 100,
  pToPValue: 1000000,
  subOrg: [
    {
      timeSpan: "month",
      dataTime: "2024-01-01",
      keyIndexType: "revenue",
      org: "广投石化",
      plan: 1000000,
      real: 1000000,
      accumulated: 1000000,
      pOverPRate: 100,
      pOverPValue: 1000000,
      pToPRate: 100,
      pToPValue: 1000000,
      subOrg: [],
      subProduct: [],
      subData: [],
    },
  ],
  subProduct: [
    {
      timeSpan: "month",
      dataTime: "2024-01-01",
      keyIndexType: "revenue",
      org: "石化板块",
      productType: "原油",
      product: "原油1",
      plan: 1000000,
      real: 1000000,
      accumulated: 1000000,
      pOverPRate: 100,
      pOverPValue: 1000000,
      pToPRate: 100,
      pToPValue: 1000000,
      subOrg: [],
      subProduct: [],
      subData: [],
    },
  ],
};

const router = useRouter();
const route = useRoute();

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

const chart1 = shallowRef();
// 时间维度
const timeTabValue = ref("year");
const graphType = ref("bar"); // chart1的柱状图/折线图切换开关
const chart2 = shallowRef();
const chart3 = shallowRef();
const chart3Timer = ref<NodeJS.Timeout | null>(null);
const chart3ActiveIndex = ref(0);
const chart31 = shallowRef();
const chart4 = shallowRef();
const chart41 = shallowRef();
const chart4Timer = ref<NodeJS.Timeout | null>(null);
const chart4ActiveIndex = ref(0);
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
const hasSubOrg = ref(true);
// 是否有产品
const hasProduct = ref(true);
// 产品名（路由参数）
const productName = ref("");
// 企业名（路由参数）
const subOrgName = ref("");

const yearData = {
  liquidFill: {
    fulfilledPercent: 0,
  },
  metricItem: [
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
  ],
  chart1: {
    dataPlan: [0, 0],
    dataReal: [0, 0],
  },
  chart2: {
    data: [0, 0],
  },
  chart3: {
    data: [],
  },
  chart31: {
    dataTarget: [],
    dataActual: [],
  },
  chart4: {
    data: [],
  },
  chart41: {
    dataTarget: [0, 0],
    dataActual: [0, 0],
  },
  table1: [],
  table2: [],
};

let data = reactive(yearData);
const table1Data = toRef(data, "table1");
const table2Data = toRef(data, "table2");

// 如果timeTabValue为year，则显示年份，否则显示月份
watch(timeTabValue, (newVal, oldVal) => {
  // console.log(newVal, oldVal);
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
            // value: fulfilledPercent.value / 100,
            value: data.liquidFill.fulfilledPercent / 100,
            direction: "left",
            itemStyle: {
              color: "#6C683E",
            },
          },
          // fulfilledPercent.value / 100,
          data.liquidFill.fulfilledPercent / 100,
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
            // return `${fulfilledPercent.value}%`;
            return `${data.liquidFill.fulfilledPercent}%`;
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
  // 根据timeTabValue的值，更新chart1的x轴
  let monthData = [];
  if (timeTabValue.value === "year") {
    monthData = [
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
    ];
  } else {
    // 只显示当前月份
    const currentYear = datatime.value.getFullYear();
    const currentMonth = datatime.value.getMonth() + 1;
    monthData = [`${currentYear}-${currentMonth.toString().padStart(2, "0")}`];
  }

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
      data: monthData,
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
        // barWidth: "25%",
        barWidth: 30,
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
        // data: [100, 200],
        data: data.chart1.dataPlan,
      },
      {
        type: "bar",
        name: "实际经营收入",
        // barWidth: "25%",
        barWidth: 30,
        barGap: "35%",
        // data: [110, 220],
        data: data.chart1.dataReal,
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
        // data: [110, 220],
        data: data.chart1.data,
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
        data: data.chart3.data,
      },
    ],
  };
  chart3.value.setOption(option);
};

// 下属企业营收与计划营收对比
const initChart31 = () => {
  if (!chart31.value) {
    chart31.value = echarts.init(
      document.getElementById("revenue-analysis-chart-31")
    );
  }
  chart31.value.clear();
  const target = data.chart31.dataTarget;
  const actual = data.chart31.dataActual;
  // 实际渲染的y应该都是0~100%，但是tooltip显示的是实际值
  // 所以需要先归一化，让整个y轴最大值为100%
  const normalizedActual = actual.map((item, index) => ({
    ...item,
    value: (item.value / target[index].value) * 100,
  }));
  const option = {
    legend: {
      show: true,
      textStyle: {
        color: "white",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      top: "50px",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      show: true,
      // formatter: "{b}: {c}%",
      // 使用target和actual的值
      // formatter: (params: any) => {
      //   return `${params.name}<br />
      //   计划值：${target[params.dataIndex].value}万元<br />
      //   实际值：${actual[params.dataIndex].value}万元<br />
      //   完成率：${normalizedActual[params.dataIndex].value.toFixed(2)}%`;
      // },
      trigger: "axis",
      axisPointer: {
        show: true,
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: target.map((item) => item.name),
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
      name: "完成值（万元）",
      // min: 0,
      // max: 100,
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
    // 计划营收值永远是100%，实际营收值是归一化后的值
    // 计划营收值在最底层，颜色较淡，实际营收值在上面，颜色较深
    series: [
      {
        // type: "bar",
        // stack: "a",
        // z: 3,
        type: "line",
        name: "完成值",
        data: actual,
        // data: normalizedActual,
        // itemStyle: {
        //   color: (params: any) => {
        //     return params.data.color;
        //   },
        // },
        width: 2,
        label: {
          show: true,
          formatter: ({ dataIndex }: any) => {
            return actual[dataIndex].value;
          },
          fontSize: 14,
          fontWeight: "bold",
          color: "white",
          position: "top",
        },
        itemStyle: {
          // 深橙色
          color: "#ff8c00",
        },
        barWidth: "45%",
      },
      {
        //   type: "bar",
        //   stack: "a",
        //   silent: true,
        //   z: 2,
        type: "line",
        name: "计划值",
        lineStyle: {
          type: "dashed",
        },
        data: target,
        itemStyle: {
          // color: "lightgray",
          color: "#aa8c00cc",
        },
        barWidth: "45%",
      },
    ],
  };
  chart31.value.setOption(option);
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
        data: data.chart4.data,
      },
    ],
  };
  chart4.value.setOption(option);
};

// 产品营收与计划营收对比
const initChart41 = () => {
  if (!chart41.value) {
    chart41.value = echarts.init(
      document.getElementById("profit-analysis-chart-41")
    );
  }
  const colors = ["#ff8c00", "#aa8c00cc"];
  chart41.value.clear();
  const target = data.chart41.dataTarget;
  const actual = data.chart41.dataActual;
  const normalizedActual = actual.map((item, index) => ({
    ...item,
    value: (item.value / target[index].value) * 100,
    color: colors[index],
  }));
  const option = {
    legend: {
      show: true,
    },
    grid: {
      left: "3%",
      right: "4%",
      top: "50px",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      show: true,
      // formatter: "{b}: {c}%",
      // 使用target和actual的值
      formatter: (params: any) => {
        return `${params[0].name}<br />
        计划值：${target[params[0].dataIndex].value}万元<br />
        实际值：${actual[params[0].dataIndex].value}万元<br />
        完成率：${normalizedActual[params[0].dataIndex].value.toFixed(2)}%`;
      },
      trigger: "axis",
      axisPointer: {
        show: true,
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: target.map((item) => item.name),
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
      name: "计划完成率（%）",
      min: 0,
      interval: 25,
      max: 150,
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
    // 计划营收值永远是100%，实际营收值是归一化后的值
    // 计划营收值在最底层，颜色较淡，实际营收值在上面，颜色较深
    series: [
      {
        type: "bar",
        stack: "a",
        z: 3,
        data: normalizedActual,
        itemStyle: {
          color: (params: any) => {
            return params.data.color;
          },
        },
        label: {
          show: true,
          formatter: ({ dataIndex }: any) => {
            return actual[dataIndex].value;
          },
          fontSize: 14,
          fontWeight: "bold",
          color: "white",
          position: "top",
        },
        markLine: {
          show: true,
          symbol: "none",
          data: [
            {
              name: "目标值",
              yAxis: 100,
            },
          ],
          lineStyle: {
            // color: sassvariables["bigscreen-primary-color-7"],
            type: "solid",
            width: 2,
            color: "orange",
          },
          label: {
            show: false,
          },
        },
        barWidth: "45%",
      },
      // {
      //   type: "bar",
      //   stack: "a",
      //   silent: true,
      //   z: 2,
      //   data: target,
      //   itemStyle: {
      //     color: "lightgray",
      //   },
      //   barWidth: "45%",
      // },
    ],
  };
  chart41.value.setOption(option);
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

// 初始化图3的轮播效果
const initChart3Animation = () => {
  // 先清除
  chart3Timer.value && clearInterval(chart3Timer.value);
  chart3Timer.value = setInterval(() => {
    for (const i in chart3.value.getOption().series[0].data) {
      chart3.value.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: i,
      });
    }
    chart3.value.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: chart3ActiveIndex.value,
    });
    chart31.value.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: chart3ActiveIndex.value,
    });
    chart3ActiveIndex.value++;
    if (
      chart3.value.getOption().series?.[0]?.data &&
      chart3ActiveIndex.value >= chart3.value.getOption().series[0].data.length
    ) {
      chart3ActiveIndex.value = 0;
    }
  }, 3000);
};

// 初始化图4的轮播效果
const initChart4Animation = () => {
  // 先清除
  chart4Timer.value && clearInterval(chart4Timer.value);
  chart4Timer.value = setInterval(() => {
    for (const i in chart4.value.getOption().series[0].data) {
      chart4.value.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: i,
      });
    }
    chart4.value.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: chart4ActiveIndex.value,
    });
    chart41.value.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: chart4ActiveIndex.value,
    });
    chart4ActiveIndex.value++;
    if (
      chart4.value.getOption().series?.[0]?.data &&
      chart4ActiveIndex.value >= chart4.value.getOption().series[0].data.length
    ) {
      chart4ActiveIndex.value = 0;
    }
  }, 3000);
};

// 统一初始化轮播效果
const initAnimation = () => {
  if (timeTabValue.value === "year") {
    initChart3Animation();
    initChart4Animation();
  }
};

// 根据路由参数、时间、时间类型，构建查询参数
const buildQueryParams = () => {
  // 测试数据：组织
  const queryParams = {
    keyIndexType: "营收",
    timeDimension: timeTabValue.value === "year" ? "年" : "月",
    companyName: route.query.companyName || "石化板块",
    fromYear: 2025,
    toYear: 2025,
    fromMonth: 1,
    toMonth: 12,
    category: route.query.productType || undefined,
    product: undefined,
    withSubTimeData: true,
    withSubOrgData: true,
    withSubProductData: false,
    withSubProductTypeData: true,
  };

  // // 测试数据：产品类型
  // const queryParams = {
  //   keyIndexType: "营收",
  //   timeDimension: timeTabValue.value === "year" ? "年" : "月",
  //   companyName: undefined,
  //   fromYear: 2025,
  //   toYear: 2025,
  //   fromMonth: 1,
  //   toMonth: 12,
  //   category: "原油类",
  //   product: undefined,
  //   withSubTimeData: true,
  //   withSubOrgData: true,
  //   withSubProductData: true,
  //   withSubProductTypeData: false,
  // };

  // 如果有时间
  if (datatime.value) {
    if (timeTabValue.value === "year") {
      queryParams.fromYear = new Date(datatime.value).getFullYear();
      queryParams.toYear = new Date(datatime.value).getFullYear();
    } else {
      queryParams.fromMonth = new Date(datatime.value).getMonth() + 1;
      queryParams.toMonth = new Date(datatime.value).getMonth() + 1;
    }
  }

  // if (route.query.category) {
  //   queryParams.category = route.query.category;
  // }
  // if (route.query.product) {
  //   queryParams.product = route.query.product;
  // }
  return queryParams;
};

const initData = async () => {
  // TODO 校验查询参数合法性
  const queryParams = buildQueryParams();
  const testData: AggregatedData[] = await businessStore.queryKeyIndexData(
    queryParams.keyIndexType as "营收" | "利润",
    queryParams.timeDimension as "年" | "月",
    queryParams.companyName as string | undefined,
    queryParams.fromYear as number,
    queryParams.toYear as number,
    queryParams.fromMonth as number,
    queryParams.toMonth as number,
    queryParams.category as string | undefined,
    queryParams.product as string | undefined,
    queryParams.withSubTimeData as boolean,
    queryParams.withSubOrgData as boolean,
    queryParams.withSubProductData as boolean,
    queryParams.withSubProductTypeData as boolean
  );
  console.log(testData);
  // TODO 将数据放入组件
  if (testData?.[0]) {
    data = {
      liquidFill: {
        fulfilledPercent: Number(
          ((testData[0].实际值 / testData[0].计划值) * 100).toFixed(2)
        ),
      },
      metricItem: [
        {
          title: "累计",
          value: Number(testData[0].年累计值.toFixed(2)),
          unit: "万元",
        },
        {
          title: "环比增幅",
          value: Number((testData[0].年累计值环比增幅 || 0).toFixed(2)),
          unit: "%",
        },
        {
          title: "同比增长",
          value: Number((testData[0].年累计值同比 || 0).toFixed(2)),
          unit: "万元",
        },
        {
          title: "同比增幅",
          value: Number((testData[0].年累计值同比增幅 || 0).toFixed(2)),
          unit: "%",
        },
      ],
      chart1: {
        // TODO 通用化
        dataReal:
          timeTabValue.value === "year"
            ? testData[0].subTimeData?.map((item: any) => item.实际值)
            : [testData[0].实际值],
        dataPlan:
          timeTabValue.value === "year"
            ? testData[0].subTimeData?.map((item: any) => item.计划值)
            : [testData[0].计划值],
      },
      chart2: {
        data: [100, 200],
      },
      chart3: {
        data: testData[0].subOrgData?.map((item: any) => {
          return {
            name: item.维度值,
            value: item.实际值,
          };
        }),
      },
      chart31: {
        dataTarget: fulfillArray(testData[0].subOrgData).map((item: any) => {
          return {
            name: item.维度值,
            value: item.计划值,
          };
        }),
        dataActual: fulfillArray(testData[0].subOrgData).map((item: any) => {
          return {
            name: item.维度值,
            value: item.实际值,
          };
        }),
      },
      chart4: {
        data: fulfillArray(testData[0].subProductTypeData).map((item: any) => {
          return {
            name: item.维度值,
            value: item.实际值,
          };
        }),
      },
      chart41: {
        dataTarget: fulfillArray(testData[0].subProductTypeData).map(
          (item: any) => {
            return {
              name: item.维度值,
              value: item.计划值,
            };
          }
        ),
        dataActual: fulfillArray(testData[0].subProductTypeData).map(
          (item: any) => {
            return {
              name: item.维度值,
              value: item.实际值,
            };
          }
        ),
      },
      table1: fulfillArray(testData[0].subOrgData).map((item: any) => {
        return {
          name: item.维度值,
          value: [
            item.实际值,
            item.同比增幅,
            item.环比值,
            item.计划值
              ? ((item.实际值 / item.计划值) * 100).toFixed(2) + "%"
              : "",
          ],
        };
      }),
      table2: fulfillArray(
        testData[0].subProductTypeData,
        {
          name: "维度值",
          value: [0, 0, 0, 0],
        },
        4
      ).map((item: any) => {
        return {
          name: item.维度值,
          value: [
            item.实际值,
            item.同比增幅,
            item.环比值,
            item.计划值
              ? ((item.实际值 / item.计划值) * 100).toFixed(2) + "%"
              : "",
          ],
        };
      }),
    };
    table1Data.value = data.table1;
    table2Data.value = data.table2;
    metricItemData.value = data.metricItem;
  } else {
    data = yearData;
    table1Data.value = [];
    table2Data.value = [];
    metricItemData.value = yearData.metricItem;
  }

  // if (timeTabValue.value === "year") {
  //   data = yearData;
  // } else {
  //   data = monthData;
  // }
};

// 绑定各个图例的点击事件
const initLegendClick = () => {
  // 绑定逐月营收的点击事件
  chart1.value.on("click", "series.bar", (params: any) => {
    const { name } = params;
    const month = name.split("月")[0];
    // 触发切换日期 + 重新搜索数据
    datatime.value = new Date(new Date().getFullYear(), month - 1, 1);
    // handleSearch();
  });
  // 绑定图例的点击事件
  chart3.value.on("mouseover", (params: any) => {
    chart3Timer.value && clearInterval(chart3Timer.value);
  });
  chart3.value.on("mouseout", (params: any) => {
    initChart3Animation();
  });
  chart3.value.on("click", "series.pie", (params: any) => {
    const { name } = params;
    if (!Object.values(OurCompanyEnumMap).includes(name)) return;
    const nextRoute = router.resolve({
      name: "Revenue",
      query: {
        companyName: name,
      },
    });
    window.open(nextRoute.href, "_blank");
  });
  chart4.value.on("mouseover", (params: any) => {
    chart4Timer.value && clearInterval(chart4Timer.value);
  });
  chart4.value.on("mouseout", (params: any) => {
    initChart4Animation();
  });
  chart4.value.on("click", "series.pie", (params: any) => {
    const { name } = params;
    const nextRoute = router.resolve({
      name: "Revenue",
      query: {
        companyName: route.query.companyName,
        productType: name,
      },
    });
    window.open(nextRoute.href, "_blank");
  });
};

const initialize = async () => {
  await initData();
  initChart1();
  // initChart2();
  initChart3();
  initChart31();
  initChart4();
  initChart41();
  // initChart5();
  // initChart6();
  initLiquidFill();
  // 初始化轮播效果
  initAnimation();
  // 绑定各个图例的点击事件
  initLegendClick();
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
  // 根据路由参数、时间、时间类型，查询相关数据
  // TODO 查询完毕后调用initialize
  initialize();
};

onMounted(async () => {
  // testFunc();
  await initialize();
  window.addEventListener("resize", () => {
    try {
      chart1.value.resize();
      // chart2.value.resize();
      chart3.value.resize();
      chart31.value.resize();
      chart4.value.resize();
      chart41.value.resize();
      // chart5.value.resize();
      // chart6.value.resize();
      liquidFill.value.resize();
    } catch (error) {
      console.log(error);
    }
  });
});

// watch(
//   () => route.query.companyName,
//   (newVal) => {
//     if (newVal) {
//       initialize();
//     }
//   }
// );

onBeforeUnmount(() => {
  chart3Timer.value && clearInterval(chart3Timer.value);
  chart4Timer.value && clearInterval(chart4Timer.value);
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
