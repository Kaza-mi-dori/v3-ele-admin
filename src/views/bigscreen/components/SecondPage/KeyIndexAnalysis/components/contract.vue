<template>
  <div v-loading="loading" class="w-full">
    <!-- <div class="search-bar mb-4 ml-4">
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
    </div> -->
    <DashboardHeader :stats="stats" />
    <div class="bg-view-body pl-4 pr-4">
      <div class="grid grid-cols-3 gap-4 flex-1">
        <Model1 class="model1" title="采购合同各企业占比">
          <div
            id="contract-analysis-chart-1"
            style="height: 400px; width: 100%"
          />
        </Model1>
        <Model1 class="model1" title="销售合同各企业占比">
          <div
            id="contract-analysis-chart-2"
            style="height: 400px; width: 100%"
          />
        </Model1>
        <Model1 class="model1" title="仓储合同各企业占比">
          <div
            id="contract-analysis-chart-3"
            style="height: 400px; width: 100%"
          />
        </Model1>
      </div>
      <!-- <div class="b-space" /> -->
      <div class="grid grid-cols-3 gap-4 flex-1">
        <!-- 占两列  minmax(0, 1fr)表示最小宽度为0，最大宽度为1fr，即占满剩余空间 -->
        <Model1 class="model1 col-span-2" title="运输合同各企业占比">
          <div class="model-body">
            <div class="model-body__content">
              <div class="flex gap-2 justify-center">
                <div
                  id="contract-analysis-chart-4"
                  style="height: 400px; width: 50%"
                />
                <div
                  id="contract-analysis-chart-5"
                  style="height: 400px; width: 50%"
                />
              </div>
            </div>
          </div>
        </Model1>
        <Model1 class="model1" title="违规合同各企业占比">
          <div class="model-body">
            <div class="model-body__content">
              <div class="flex gap-2 justify-center">
                <div
                  id="contract-analysis-chart-6"
                  style="height: 400px; width: 100%"
                />
              </div>
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
import DashboardHeader from "@/views/bigscreen/components/SecondPage/Common/IndexHeader2/index.vue";
import icon2 from "@/views/bigscreen/img/product_icon2.png";
import { ref, onMounted, shallowRef } from "vue";
import * as echarts from "echarts";
import "echarts-liquidfill";
import MetricItem from "@/views/bigscreen/components/SecondPage/Common/MetricItem/index.vue";
import sassvariables from "@/styles/variables.module.scss";
import { getDateOfOneYear, getDateOfOneYearToNow } from "@/utils/time";
import purchasAmountIcon from "@/views/bigscreen/img/contract_icon1.png";
import sellAmountIcon from "@/views/bigscreen/img/contract_icon2.png";
import totalCountIcon from "@/views/bigscreen/img/contract_icon3.png";
import fulfilledCountIcon from "@/views/bigscreen/img/contract_icon4.png";
import fulfillingCountIcon from "@/views/bigscreen/img/contract_icon5.png";
import riskCountIcon from "@/views/bigscreen/img/contract_icon6.png";
import { OurCompanyEnumMap } from "@/enums/BusinessEnum";
import { useRouter } from "vue-router";

const router = useRouter();

const stats = ref([
  {
    value: 800,
    label: "采购合同总金额",
    unit: "万元",
    icon: purchasAmountIcon,
  },
  {
    value: 100,
    label: "销售合同总金额",
    unit: "万元",
    icon: sellAmountIcon,
  },
  {
    value: 80,
    label: "合同总数",
    unit: "份",
    icon: totalCountIcon,
  },
  {
    value: 60,
    label: "已完成合同数",
    unit: "份",
    icon: fulfilledCountIcon,
  },
  {
    value: 20,
    label: "未履行合同数",
    unit: "份",
    icon: fulfillingCountIcon,
  },
  {
    value: 2,
    label: "风险违约合同数",
    unit: "份",
    icon: riskCountIcon,
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
const hasSubOrg = ref(true);
// 是否有产品
const hasProduct = ref(true);
// 产品名（路由参数）
const productName = ref("");
// 企业名（路由参数）
const subOrgName = ref("");

const yearData = {
  purchaseContractDetail: [
    { name: "广投石化", value: 1000 },
    { name: "开燃公司", value: 200 },
    { name: "桂盛桂轩", value: 300 },
    { name: "恒润", value: 400 },
  ],
  saleContractDetail: [
    { name: "广投石化", value: 830 },
    { name: "开燃公司", value: 100 },
    { name: "桂盛桂轩", value: 400 },
    { name: "恒润", value: 444 },
  ],
  transportContractDetail: [
    { name: "广投石化", value: 412 },
    { name: "开燃公司", value: 300 },
    { name: "桂盛桂轩", value: 110 },
    { name: "恒润", value: 90 },
  ],
  storageContractDetail: [
    { name: "广投石化", value: 120 },
    { name: "开燃公司", value: 1000 },
    { name: "桂盛桂轩", value: 1000 },
    { name: "恒润", value: 1000 },
  ],
  riskContractDetail: [
    { name: "广投石化", value: 40 },
    { name: "开燃公司", value: 10 },
  ],
};

const monthData = {
  liquidFill: {
    fulfilledPercent: 50,
  },
  chart1: {
    data: [30, 20],
  },
  chart2: {
    data: [30, 20],
  },
  chart3: {
    data: [30, 20],
  },
  chart4: {
    data: [30, 20],
  },
  table1: {
    data: [
      {
        name: "广投石化",
        value: [20, 30, 20, 10],
      },
      {
        name: "开燃公司",
        value: [100, 30, 20, 60],
      },
      {
        name: "桂盛桂轩",
        value: [200, 300, 200, 100],
      },
      {
        name: "恒润",
        value: [200, 300, 200, 100],
      },
    ],
  },
  table2: {
    data: [
      {
        name: "原油",
        value: [20, 30, 20, 10],
      },
      {
        name: "成品油",
        value: [20, 30, 20, 10],
      },
      {
        name: "化工产品",
        value: [20, 30, 20, 10],
      },
      {
        name: "其他",
        value: [20, 30, 20, 10],
      },
    ],
  },
};
let data = reactive(yearData);

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

const initChart1 = (type: string = "bar") => {
  if (!chart1.value) {
    chart1.value = echarts.init(
      document.getElementById("contract-analysis-chart-1")
    );
  }
  chart1.value.clear();
  // 柱状图
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
        // roseType: "radius",
        label: {
          show: true,
          formatter: "{b}\n{c}",
          color: "#fff",
          fontSize: 15,
        },
        data: data.purchaseContractDetail,
      },
    ],
  };
  // 折线图
  chart1.value.setOption(option);
};
const initChart2 = () => {
  if (!chart2.value) {
    chart2.value = echarts.init(
      document.getElementById("contract-analysis-chart-2")
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
        // roseType: "radius",
        label: {
          show: true,
          formatter: "{b}\n{c}",
          color: "#fff",
          fontSize: 15,
        },
        data: data.saleContractDetail,
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
      document.getElementById("contract-analysis-chart-3")
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
        // roseType: "radius",
        label: {
          show: true,
          formatter: "{b}\n{c}",
          color: "#fff",
          fontSize: 15,
        },
        data: data.transportContractDetail,
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
      document.getElementById("contract-analysis-chart-4")
    );
  }
  chart4.value.clear();
  // 柱形图，利润逐月分析，两个柱子一个是计划值一个是完成值
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
        data: data.transportContractDetail,
      },
    ],
  };
  chart4.value.setOption(option);
};

const initChart5 = () => {
  if (!chart5.value) {
    chart5.value = echarts.init(
      document.getElementById("contract-analysis-chart-5")
    );
  }
  // 同比环比折线 1-12月
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
        data: data.transportContractDetail,
      },
    ],
  };
  chart5.value.setOption(option);
};

// 利润构成分析，饼图
const initChart6 = () => {
  if (!chart6.value) {
    chart6.value = echarts.init(
      document.getElementById("contract-analysis-chart-6")
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
        radius: ["40%", "60%"],
        // roseType: "radius",
        label: {
          show: true,
          formatter: "{b}\n{c}",
          color: "#fff",
          fontSize: 15,
        },
        data: data.riskContractDetail,
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
  // 根据路由参数、时间、时间类型，查询相关数据
  // TODO 查询完毕后调用initialize
  initialize();
};

const initLegendClick = () => {
  // 绑定点击事件
  chart1.value.on("click", "series.pie", (params: any) => {
    // TODO 点击事件, 判断是否为合法可穿透组织名
    // 如果是则穿透到下一级合同分析页
    const { name } = params;
    if (Object.values(OurCompanyEnumMap).includes(name)) {
      router.push({
        name: "ContractList",
        query: { companyName: name },
      });
    }
  });
  chart2.value.on("click", "series.pie", (params: any) => {
    console.log(params);
  });
  chart3.value.on("click", "series.pie", (params: any) => {
    console.log(params);
  });
  chart4.value.on("click", "series.pie", (params: any) => {
    console.log(params);
  });
  chart5.value.on("click", "series.pie", (params: any) => {
    console.log(params);
  });
  chart6.value.on("click", "series.pie", (params: any) => {
    console.log(params);
  });
};

const initData = async () => {
  // TODO 查询相关数据
  // 根据组织名、时间(年份或月份)、时间类型(年或月)，查询相关数据
  // 如果路由参数有值，则查询相关数据
};

const initialize = async () => {
  await initData();
  initChart1();
  initChart2();
  initChart3();
  initChart4();
  initChart5();
  initChart6();
  // initLiquidFill();
};

onMounted(async () => {
  await initialize();
  initLegendClick();
  window.addEventListener("resize", () => {
    try {
      chart1.value.resize();
      chart2.value.resize();
      chart3.value.resize();
      chart4.value.resize();
      chart5.value.resize();
      chart6.value.resize();
      // liquidFill.value.resize();
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

// :deep(.model1) {
//   .model-body {
//     @apply flex-1;
//   }
//   .model-footer {
//     .model-footer__bg {
//       height: auto;
//     }
//   }
// }

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
