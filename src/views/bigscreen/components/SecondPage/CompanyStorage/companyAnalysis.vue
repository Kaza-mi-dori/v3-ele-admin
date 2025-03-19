<template>
  <div class="company-analysis">
    <el-select
      v-model="company"
      style="margin-left: 20px; width: 200px"
      placeholder="请选择企业"
      @change="handleCompanyChange"
    >
      <el-option
        v-for="item in companyList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <DashboardHeader :stats="stats" />
    <div class="grid-container">
      <div class="grid-item w-full h-40vh">
        <Model1 title="年累计出库量分析">
          <div id="company-graph-1" style="width: 100%; height: 100%" />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="各油库出库分析">
          <div id="company-graph-2" style="width: 100%; height: 100%" />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="年累计总入库">
          <div id="company-graph-3" style="width: 100%; height: 100%" />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="各油库入库分析">
          <div id="company-graph-4" style="width: 100%; height: 100%" />
        </Model1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DashboardHeader from "../Common/IndexHeader/index.vue";
import Model1 from "@/views/bigscreen/components/SecondPage/Model1/index.vue";
import icon2 from "@/views/bigscreen/img/product_icon2.png";
import sassvariables from "@/styles/variables.module.scss";
import * as echarts from "echarts";
import { useRouter, useRoute } from "vue-router";
import amountIcon from "@/views/bigscreen/img/inventory_icon1.png";
import volumeIcon from "@/views/bigscreen/img/inventory_icon2.png";
import storageIcon from "@/views/bigscreen/img/inventory_icon3.png";
import outIcon from "@/views/bigscreen/img/inventory_icon4.png";
import inIcon from "@/views/bigscreen/img/inventory_icon5.png";
import revenueIcon from "@/views/bigscreen/img/inventory_icon7.png";
import profitIcon from "@/views/bigscreen/img/inventory_icon8.png";

const router = useRouter();
const route = useRoute();
const emit = defineEmits(["companyChange"]);

const company = ref("");
const companyList = ref([
  {
    value: "广投石化",
    label: "广投石化",
  },
  {
    value: "开燃公司",
    label: "开燃公司",
  },
  {
    value: "恒润公司",
    label: "恒润公司",
  },
]);
const companyGraph1 = shallowRef<echarts.ECharts>();
const companyGraph2 = shallowRef<echarts.ECharts>();
const companyGraph3 = shallowRef<echarts.ECharts>();
const companyGraph4 = shallowRef<echarts.ECharts>();

// TODO 根据企业获取库存仓储数据

interface CompanyData {
  name: string;
  // 油库数量
  storageCount: number;
  // 库存量
  companyTotalVolume: number;
  // 库存收入
  companyTotalRevenue: number;
  // 库存利润
  companyTotalProfit: number;
  // 入库量
  companyTotalIn: number;
  // 出库量
  companyTotalOut: number;
  storageDatas?: StorageData[];
  subCompanyDatas?: CompanyData[];
}
interface StorageData {
  name: string;
  // 时间维度（年/月/日）
  timeDimension: string;
  // 时间
  time: string;
  // 库存量
  storageVolume: number;
  // 库存收入
  storageRevenue: number;
  // 库存利润
  storageProfit: number;
  // 入库量
  storageIn: number;
  // 出库量
  storageOut: number;
  // 子数据
  subStorageDatas?: StorageData[];
}

const companyData = ref<CompanyData[]>([]);

const storageData = ref<StorageData[]>([]);

const exampleRemoteData = reactive<any>({});
const pageData = reactive<any>(exampleRemoteData);
const graphData = reactive<any>({
  yearOutStorage: [
    {
      name: "油库A",
      value: 55,
    },
    {
      name: "油库B",
      value: 77,
    },
    {
      name: "油库C",
      value: 88,
    },
    {
      name: "油库D",
      value: 88,
    },
  ],
  yearInStorage: [
    {
      name: "油库A",
      value: 25,
    },
    {
      name: "油库B",
      value: 35,
    },
    {
      name: "油库C",
      value: 45,
    },
    {
      name: "油库D",
      value: 55,
    },
  ],
  yearStorage: [
    {
      name: "油库A",
      value: 550,
    },
    {
      name: "油库B",
      value: 660,
    },
    {
      name: "油库C",
      value: 770,
    },
    {
      name: "油库D",
      value: 880,
    },
  ],
  detailOutStorage: {
    油库A: [
      {
        name: "2025-01",
        value: 50,
      },
      {
        name: "2025-02",
        value: 60,
      },
      {
        name: "2025-03",
        value: 70,
      },
      {
        name: "2025-04",
        value: 110,
      },
    ],
    油库B: [
      {
        name: "2025-01",
        value: 140,
      },
      {
        name: "2025-02",
        value: 122,
      },
      {
        name: "2025-03",
        value: 130,
      },
    ],
  },
  detailInStorage: {
    油库A: [
      {
        name: "2025-01",
        value: 140,
      },
      {
        name: "2025-02",
        value: 122,
      },
      {
        name: "2025-03",
        value: 130,
      },
      {
        name: "2025-04",
        value: 110,
      },
    ],
    油库B: [
      {
        name: "2025-01",
        value: 20,
      },
      {
        name: "2025-02",
        value: 52,
      },
      {
        name: "2025-03",
        value: 10,
      },
    ],
  },
});

const stats = ref([
  {
    value: 6,
    label: "油库数量",
    icon: amountIcon,
  },
  {
    value: 100,
    label: "总库存(吨)",
    icon: storageIcon,
  },
  {
    value: 100,
    label: "年累计出库量(万吨)",
    icon: outIcon,
  },
  {
    value: 100,
    label: "年累计入库量(万吨)",
    icon: inIcon,
  },
  {
    value: 100,
    label: "年累计营收(万元)",
    icon: revenueIcon,
  },
  {
    value: 100,
    label: "年累计利润(万元)",
    icon: profitIcon,
  },
]);

const handleCompanyChange = (companyName: string) => {
  emit("companyChange", companyName);
};

const initLegendClick = () => {
  // 绑定点击事件，跳转油库页面
  companyGraph1.value?.on("click", "series.pie", (params: any) => {
    // console.log(params);
    router.push({
      name: "SingleStorage",
      query: {
        storageName: params.name,
      },
    });
  });
  companyGraph3.value?.on("click", "series.pie", (params: any) => {
    console.log(params);
  });
};

const initAllGraph = () => {
  initGraph1();
  initGraph2();
  initGraph3();
  initGraph4();
};

const initGraph1 = () => {
  if (!companyGraph1.value) {
    companyGraph1.value = echarts.init(
      document.getElementById("company-graph-1")
    );
  }
  companyGraph1.value.clear();
  // 饼图，显示各油库的出库量的比
  // TODO 从companyData中提取
  const data = graphData.yearOutStorage;
  companyGraph1.value.setOption({
    legend: {
      show: true,
      top: "3%",
      textStyle: {
        color: "#fff",
      },
      icon: "circle",
    },
    color: ["#f87171ee", "#fbbf24ee", "#60a5faee"],
    grid: {
      top: "8%",
      bottom: "5%",
      left: "3%",
      containLabel: true,
    },
    labelLine: {
      show: true,
      length: 25,
    },
    emphasis: {
      label: {
        show: true,
        fontWeight: "bold",
      },
    },
    series: {
      name: "年累计总出库",
      type: "pie",
      radius: "60%",
      data: data,
    },
    label: {
      show: true,
      // position: "inside",
      edgeDistance: 20,
      lineHeight: 20,
      color: "#fff",
      textStyle: {
        color: "#fff",
        fontSize: "1rem",
        // fontWeight: "bold",
        align: "center",
        verticalAlign: "middle",
      },
      formatter: "{a} {b}\n{c}",
      rich: {
        a: {
          color: "#fff",
          fontSize: 12,
          lineHeight: 20,
          marginRight: 20,
        },
      },
    },
  });
};

// 1~12月各油库出库折线图
const initGraph2 = () => {
  if (!companyGraph2.value) {
    companyGraph2.value = echarts.init(
      document.getElementById("company-graph-2")
    );
  }
  const data = Object.keys(graphData.detailOutStorage).map((key) => {
    return {
      storageName: key,
      monthData: graphData.detailOutStorage[key].map((data: any) => {
        return {
          name: `${Number(data.name.split("-")[1])}月`,
          value: data.value,
        };
      }),
    };
  });
  const colors = [
    "#f87171ee",
    "#fbbf24ee",
    "#60a5faee",
    "#f87171ee",
    "#fbbf24ee",
    "#60a5faee",
    "#f87171ee",
  ];
  companyGraph2.value.clear();
  companyGraph2.value.setOption({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      show: true,
      top: "3%",
      textStyle: {
        color: "#fff",
      },
    },
    color: colors,
    grid: {
      top: "15%",
      bottom: "3%",
      left: "3%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      boundaryGap: true,
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
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      axisLabel: {
        fontSize: 15,
        color: sassvariables["bigscreen-primary-color-7"],
      },
      // 第一个axis有
    },
    yAxis: {
      type: "value",
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
    // series: [
    //   {
    //     name: "油库A",
    //     type: "line",
    //     symbol: "none", // 不显示折线点的点号
    //     data: data,
    //     lineStyle: {
    //       //
    //       width: 2,
    //     },
    //   },
    //   // 油库B
    //   {
    //     name: "油库B",
    //     type: "line",
    //     symbol: "none", // 不显示折线点的点号
    //     data: [3, 2, 1, 7, 5, 6, 7, 2, 3, 4, 5, 6],
    //     lineStyle: {
    //       //
    //       width: 2,
    //     },
    //   },
    // ],
    series: data.map((item) => {
      return {
        name: item.storageName,
        type: "line",
        symbol: "none", // 不显示折线点的点号
        data: item.monthData.map((data: any) => data.value),
        lineStyle: {
          width: 2,
        },
      };
    }),
  });
};

const initGraph3 = () => {
  if (!companyGraph3.value) {
    companyGraph3.value = echarts.init(
      document.getElementById("company-graph-3")
    );
  }
  companyGraph3.value.clear();
  const data = [
    {
      name: "油库A",
      value: 55,
    },
    {
      name: "油库B",
      value: 77,
    },
    {
      name: "油库C",
      value: 88,
    },
  ];
  companyGraph3.value.setOption({
    legend: {
      show: true,
      top: "3%",
      textStyle: {
        color: "#fff",
      },
      icon: "circle",
    },
    color: ["#f87171ee", "#fbbf24ee", "#60a5faee"],
    grid: {
      top: "8%",
      bottom: "5%",
      left: "3%",
      containLabel: true,
    },
    labelLine: {
      show: true,
      length: 25,
    },
    emphasis: {
      label: {
        show: true,
        fontWeight: "bold",
      },
    },
    series: {
      name: "年累计总出库",
      type: "pie",
      radius: "60%",
      data: data,
    },
    label: {
      show: true,
      // position: "inside",
      edgeDistance: 20,
      lineHeight: 20,
      color: "#fff",
      textStyle: {
        color: "#fff",
        fontSize: "1rem",
        // fontWeight: "bold",
        align: "center",
        verticalAlign: "middle",
      },
      formatter: "{a} {b}\n{c}",
      rich: {
        a: {
          color: "#fff",
          fontSize: 12,
          lineHeight: 20,
          marginRight: 20,
        },
      },
    },
  });
};

const initGraph4 = () => {
  if (!companyGraph4.value) {
    companyGraph4.value = echarts.init(
      document.getElementById("company-graph-4")
    );
  }
  companyGraph4.value.clear();
  const data = Object.keys(graphData.detailInStorage).map((key) => {
    return {
      storageName: key,
      monthData: graphData.detailInStorage[key].map((data: any) => {
        return {
          name: `${Number(data.name.split("-")[1])}月`,
          value: data.value,
        };
      }),
    };
  });
  companyGraph4.value.setOption({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      show: true,
      top: "3%",
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      top: "15%",
      bottom: "3%",
      left: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
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
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      axisLabel: {
        fontSize: 15,
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    yAxis: {
      type: "value",
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
    // series: [
    //   {
    //     name: "油库A",
    //     type: "line",
    //     smooth: true, // 设置线条为圆滑
    //     symbol: "none", // 不显示折线点的点号
    //     data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
    //     lineStyle: {
    //       color: sassvariables["bigscreen-primary-color-8"],
    //     },
    //   },
    //   // 油库B
    //   {
    //     name: "油库B",
    //     type: "line",
    //     smooth: true, // 设置线条为圆滑
    //     symbol: "none", // 不显示折线点的点号
    //     data: [300, 200, 100, 700, 500, 600, 700, 800, 900, 1000, 1100, 1200],
    //     lineStyle: {
    //       color: sassvariables["bigscreen-primary-color-7"],
    //     },
    //   },
    // ],
    series: data.map((item) => {
      return {
        name: item.storageName,
        type: "line",
        symbol: "none", // 不显示折线点的点号
        data: item.monthData.map((data: any) => data.value),
        lineStyle: {
          width: 2,
        },
      };
    }),
  });
};

const initData = async () => {
  if (route.query.company) {
    company.value = route.query.company as string;
  }
  // TODO 根据companyName获取公司数据
};

onMounted(async () => {
  await initData();
  initAllGraph();
  initLegendClick();
  window.addEventListener("resize", () => {
    companyGraph1.value?.resize();
    companyGraph2.value?.resize();
    companyGraph3.value?.resize();
    companyGraph4.value?.resize();
  });
});
</script>

<style scoped lang="scss">
.company-analysis {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px;
}
.grid-container {
  @apply flex-grow-1;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  padding: 20px;
  .grid-item {
    border: 1px solid #1e3a8a;
    border-radius: 5px;
  }
}

:deep(.el-select) {
  .el-select__wrapper {
    background: #0a1a3e;
    border: 1px solid #1e3a8a;
    .el-select__placeholder {
      color: #fff;
    }
  }
}
</style>
