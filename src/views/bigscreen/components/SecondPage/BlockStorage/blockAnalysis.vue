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
        <Model1 title="年累计总出库">
          <div id="company-graph-1" style="width: 100%; height: 100%" />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="年累计总入库">
          <div id="company-graph-2" style="width: 100%; height: 100%" />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="库存量">
          <div id="company-graph-3" style="width: 100%; height: 100%" />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="各油品出库分析">
          <div id="company-graph-4" style="width: 100%; height: 100%" />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="各油品入库分析">
          <div id="company-graph-5" style="width: 100%; height: 100%" />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="各油品库存分析">
          <div id="company-graph-6" style="width: 100%; height: 100%" />
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

const router = useRouter();
const route = useRoute();

const company = ref("");
const companyList = ref([
  {
    value: "1",
    label: "企业1",
  },
]);

const companyGraph1 = shallowRef<echarts.ECharts>();
const companyGraph2 = shallowRef<echarts.ECharts>();
const companyGraph3 = shallowRef<echarts.ECharts>();
const companyGraph4 = shallowRef<echarts.ECharts>();
const companyGraph5 = shallowRef<echarts.ECharts>();
const companyGraph6 = shallowRef<echarts.ECharts>();

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

const stats = ref([
  {
    value: 6,
    label: "油库数量",
    icon: icon2,
  },
  {
    value: 100,
    label: "总库存(吨)",
    icon: icon2,
  },
  {
    value: 100,
    label: "年累计出库量(万吨)",
    icon: icon2,
  },
  {
    value: 100,
    label: "年累计入库量(万吨)",
    icon: icon2,
  },
  {
    value: 100,
    label: "年累计营收(万元)",
    icon: icon2,
  },
  {
    value: 100,
    label: "年累计利润(万元)",
    icon: icon2,
  },
]);

const handleCompanyChange = () => {
  // console.log(company.value);
  // TODO 根据企业获取库存仓储数据
  // initAllGraph();
};

const initAllGraph = () => {
  initGraph1();
  initGraph2();
  initGraph3();
  initGraph4();
  initGraph5();
  initGraph6();
  // 绑定点击事件
  companyGraph1.value?.on("click", "series.pie", (params: any) => {
    // console.log(params);
    router.push({
      name: "CompanyStorage",
      query: {
        company: params.name,
      },
    });
  });
  companyGraph2.value?.on("click", "series.pie", (params: any) => {
    console.log(params);
  });
  companyGraph3.value?.on("click", "series.pie", (params: any) => {
    console.log(params);
  });
  companyGraph4.value?.on("click", "series.bar", (params: any) => {
    console.log(params);
  });
  companyGraph5.value?.on("click", "series.bar", (params: any) => {
    console.log(params);
  });
  companyGraph6.value?.on("click", "series.bar", (params: any) => {
    console.log(params);
  });
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
  const data = [
    {
      name: "广投石化",
      value: 55,
    },
    {
      name: "开燃公司",
      value: 77,
    },
    {
      name: "桂盛桂轩",
      value: 88,
    },
    {
      name: "恒润",
      value: 88,
    },
  ];
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
  const data = [
    {
      name: "广投石化",
      value: 55,
    },
    {
      name: "开燃公司",
      value: 77,
    },
    {
      name: "桂盛桂轩",
      value: 88,
    },
    {
      name: "恒润",
      value: 88,
    },
  ];
  companyGraph2.value.setOption({
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

const initGraph3 = () => {
  if (!companyGraph3.value) {
    companyGraph3.value = echarts.init(
      document.getElementById("company-graph-3")
    );
  }
  companyGraph3.value.clear();
  const data = [
    {
      name: "广投石化",
      value: 55,
    },
    {
      name: "开燃公司",
      value: 77,
    },
    {
      name: "桂盛桂轩",
      value: 88,
    },
    {
      name: "恒润",
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
  const color = ["#f87171ee", "#fbbf24ee", "#60a5faee", "#10b981ee"];
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
      data: ["广投石化", "开燃公司", "桂盛桂轩", "恒润"],
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
      min: 0,
      max: 10,
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
        data: [100, 200, 300, 400],
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            return color[params.dataIndex];
          },
        },
      },
    ],
  });
};

const initGraph5 = () => {
  if (!companyGraph5.value) {
    companyGraph5.value = echarts.init(
      document.getElementById("company-graph-5")
    );
  }
  companyGraph5.value.clear();
  const color = ["#f87171ee", "#fbbf24ee", "#60a5faee", "#10b981ee"];
  companyGraph5.value.setOption({
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
      data: ["广投石化", "开燃公司", "桂盛桂轩", "恒润"],
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
        show: true,
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
    },
    series: [
      {
        type: "bar",
        barWidth: "50%",
        data: [100, 200, 300, 400],
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            return color[params.dataIndex];
          },
        },
      },
    ],
  });
};

const initGraph6 = () => {
  if (!companyGraph6.value) {
    companyGraph6.value = echarts.init(
      document.getElementById("company-graph-6")
    );
  }
  companyGraph6.value.clear();
  const color = ["#f87171ee", "#fbbf24ee", "#60a5faee", "#10b981ee"];
  companyGraph6.value.setOption({
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
      data: ["广投石化", "开燃公司", "桂盛桂轩", "恒润"],
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
        show: true,
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
    },
    series: [
      {
        type: "bar",
        barWidth: "50%",
        data: [100, 200, 300, 400],
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            return color[params.dataIndex];
          },
        },
      },
    ],
  });
};

onMounted(() => {
  initAllGraph();
  window.addEventListener("resize", () => {
    companyGraph1.value?.resize();
    companyGraph2.value?.resize();
    companyGraph3.value?.resize();
    companyGraph4.value?.resize();
    companyGraph5.value?.resize();
    companyGraph6.value?.resize();
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
  grid-template-columns: repeat(3, 1fr);
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
