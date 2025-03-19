<template>
  <div class="company-analysis">
    <!-- <el-select
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
    </el-select> -->
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
          <Tab
            v-model="activeOutStorageProductName"
            @tab-click="handleOutStorageProductNameChange"
          >
            <el-tab-pane label="原油" name="原油" />
            <el-tab-pane label="汽柴油" name="汽柴油" />
          </Tab>
          <div
            id="company-graph-4"
            style="width: 100%; height: calc(100% - 40px)"
          />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="各油品入库分析">
          <Tab
            v-model="activeInStorageProductName"
            @tab-click="handleInStorageProductNameChange"
          >
            <el-tab-pane label="原油" name="原油" />
            <el-tab-pane label="汽柴油" name="汽柴油" />
          </Tab>
          <div
            id="company-graph-5"
            style="width: 100%; height: calc(100% - 40px)"
          />
        </Model1>
      </div>
      <div class="grid-item w-full h-40vh">
        <Model1 title="各油品库存分析">
          <Tab
            v-model="activeStorageProductName"
            @tab-click="handleStorageProductNameChange"
          >
            <el-tab-pane label="原油" name="原油" />
            <el-tab-pane label="汽柴油" name="汽柴油" />
          </Tab>
          <div
            id="company-graph-6"
            style="width: 100%; height: calc(100% - 40px)"
          />
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
import { businessStoreHook } from "@/store/modules/business";
import Tab from "@/views/bigscreen/components/FirstPage/Tab/index.vue";
import amountIcon from "@/views/bigscreen/img/inventory_icon1.png";
import volumeIcon from "@/views/bigscreen/img/inventory_icon2.png";
import storageIcon from "@/views/bigscreen/img/inventory_icon3.png";
import outIcon from "@/views/bigscreen/img/inventory_icon4.png";
import inIcon from "@/views/bigscreen/img/inventory_icon5.png";
import { TabsPaneContext } from "element-plus";
const router = useRouter();
const route = useRoute();

const businessStore = businessStoreHook();

const company = ref("");
const companyList = ref([
  {
    value: "1",
    label: "企业1",
  },
]);

const activeOutStorageProductName = ref<string>("原油");
const activeInStorageProductName = ref<string>("原油");
const activeStorageProductName = ref<string>("原油");

// 页面所需要的数据
interface StorageReport {
  // 组织当日数据(年累计)
  storageNumber: number;
  totalStorageRevenue: number;
  totalStorageProfit: number;
  // 累计出库
  totalOutStorageVolume: number;
  // 累计入库
  totalInStorageVolume: number;
  // 库存量
  totalStorageVolume: number;
  // 分产品数据
  subProductDatas?: StorageReport[];
  // 分组织数据
  subCompanyDatas?: StorageReport[];
}

const companyGraph1 = shallowRef<echarts.ECharts>();
const companyGraph2 = shallowRef<echarts.ECharts>();
const companyGraph3 = shallowRef<echarts.ECharts>();
const companyGraph4 = shallowRef<echarts.ECharts>();
const companyGraph5 = shallowRef<echarts.ECharts>();
const companyGraph6 = shallowRef<echarts.ECharts>();

// 数据库中应该有tagType tagName subDataId
// 页面中数据应要求放在json的key中直接标明
// 应该有一张子数据表，存储某张统计报表使用了哪些子数据
// 同时要有一张配置表存储某个类型的报表的聚合规则
// 方案1 聚合只发生在同一张数据表，id不需要区分不同表，服务也只需要写一张表
// 方案2 聚合发生在不同数据表，id需要区分不同表，服务需要写多张表
// Aggregation_Category 提示常用的交集、并集、差集聚合规则
// relation_type	枚举	"single", "intersection", "union"（表示是否是单一分类，或是交集/并集）
// related_categories	JSON	记录参与计算的分类 ID

const exampleRemoteData = {
  // 日报数据→月报数据→年报数据
  storageNumber: 100,
  totalStorageRevenue: 100,
  totalStorageProfit: 100,
  totalOutStorageVolume: 100,
  totalInStorageVolume: 100,
  totalStorageVolume: 100,
  subProductDatas: {
    原油: [
      {
        id: 1, // 产品年报ID
        orgName: "石化板块",
        // ruleId: 1, // 聚合规则ID
        // relation_type: "single", // 聚合规则类型
        // related_categories: [1, 2], // 参与计算的分类ID
        // tagType: "productType",
        // tagName: "原油", // 统计口径，应该是tag
        productName: "原油产品A",
        totalOutStorageVolume: 100,
        totalInStorageVolume: 100,
        totalStorageVolume: 100,
        storageNumber: 100,
        totalStorageRevenue: 100,
        totalStorageProfit: 100,
      },
      {
        id: 2, // 产品年报ID
        orgName: "石化板块",
        // tagType: "productType",
        // tagName: "原油", // 统计口径，应该是tag
        productName: "原油产品B",
        totalOutStorageVolume: 80,
        totalInStorageVolume: 80,
        totalStorageVolume: 80,
        storageNumber: 80,
        totalStorageRevenue: 80,
        totalStorageProfit: 80,
      },
    ],
    汽柴油: [
      {
        id: 1, // 产品年报ID
        orgName: "石化板块",
        // tagType: "productType",
        // tagName: "汽柴油", // 统计口径，应该是tag
        productName: "#92汽油",
        totalOutStorageVolume: 100,
        totalInStorageVolume: 100,
        totalStorageVolume: 100,
        storageNumber: 100,
        totalStorageRevenue: 100,
        totalStorageProfit: 100,
      },
      {
        id: 2, // 产品年报ID
        orgName: "石化板块",
        // tagType: "productType",
        // tagName: "汽柴油", // 统计口径，应该是tag
        productName: "#0柴油",
        totalOutStorageVolume: 80,
        totalInStorageVolume: 80,
        totalStorageVolume: 80,
        storageNumber: 80,
        totalStorageRevenue: 80,
        totalStorageProfit: 80,
      },
    ],
  },
  subCompanyDatas: [
    {
      id: 5,
      orgName: "广投石化",
      totalOutStorageVolume: 80,
      totalInStorageVolume: 80,
      totalStorageVolume: 80,
      storageNumber: 80,
      totalStorageRevenue: 80,
      totalStorageProfit: 80,
      subProductDatas: {
        原油: [
          {
            id: 1,
            orgName: "广投石化",
            // tagType: "productType",
            // tagName: "原油", // 统计口径，应该是tag
            prodcutName: "原油产品A",
            totalOutStorageVolume: 80,
            totalInStorageVolume: 80,
            totalStorageVolume: 80,
            storageNumber: 80,
            totalStorageRevenue: 80,
            totalStorageProfit: 80,
          },
        ],
        汽柴油: [
          {
            id: 1,
            orgName: "广投石化",
            productName: "#92汽油",
            totalOutStorageVolume: 80,
            totalInStorageVolume: 80,
            totalStorageVolume: 80,
            storageNumber: 80,
            totalStorageRevenue: 80,
            totalStorageProfit: 80,
          },
        ],
      },
    },
    {
      id: 6,
      orgName: "开燃公司",
      totalOutStorageVolume: 80,
      totalInStorageVolume: 80,
      totalStorageVolume: 80,
      storageNumber: 80,
      totalStorageRevenue: 80,
      totalStorageProfit: 80,
      subProductDatas: {
        原油: [
          {
            id: 1,
            orgName: "开燃公司",
            productName: "原油产品A",
            totalOutStorageVolume: 80,
            totalInStorageVolume: 80,
            totalStorageVolume: 80,
            storageNumber: 80,
            totalStorageRevenue: 80,
            totalStorageProfit: 80,
          },
        ],
        汽柴油: [
          {
            id: 1,
            orgName: "开燃公司",
            productName: "#92汽油",
            totalOutStorageVolume: 80,
            totalInStorageVolume: 80,
            totalStorageVolume: 80,
            storageNumber: 80,
            totalStorageRevenue: 80,
            totalStorageProfit: 80,
          },
        ],
      },
    },
    {
      id: 7,
      orgName: "桂盛桂轩",
      totalOutStorageVolume: 80,
      totalInStorageVolume: 80,
      totalStorageVolume: 80,
      storageNumber: 80,
      totalStorageRevenue: 80,
      totalStorageProfit: 80,
      subProductDatas: {
        原油: [
          {
            id: 1,
            orgName: "桂盛桂轩",
            productName: "原油产品A",
            totalOutStorageVolume: 80,
            totalInStorageVolume: 80,
            totalStorageVolume: 80,
            storageNumber: 80,
            totalStorageRevenue: 80,
            totalStorageProfit: 80,
          },
        ],
        汽柴油: [
          {
            id: 1,
            orgName: "桂盛桂轩",
            productName: "#92汽油",
            totalOutStorageVolume: 80,
            totalInStorageVolume: 80,
            totalStorageVolume: 80,
            storageNumber: 80,
            totalStorageRevenue: 80,
            totalStorageProfit: 80,
          },
        ],
      },
    },
  ],
};

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

const pageData = reactive<any>(exampleRemoteData);
const graphData = reactive<any>({
  yearOutStorage: [
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
  ],
  yearInStorage: [
    {
      name: "广投石化",
      value: 25,
    },
    {
      name: "开燃公司",
      value: 35,
    },
    {
      name: "桂盛桂轩",
      value: 45,
    },
    {
      name: "恒润",
      value: 55,
    },
  ],
  yearStorage: [
    {
      name: "广投石化",
      value: 550,
    },
    {
      name: "开燃公司",
      value: 660,
    },
    {
      name: "桂盛桂轩",
      value: 770,
    },
    {
      name: "恒润",
      value: 880,
    },
  ],
  detailOutStorage: {
    原油: [
      {
        name: "广投石化",
        value: 15,
      },
      {
        name: "开燃公司",
        value: 14,
      },
      {
        name: "桂盛桂轩",
        value: 20,
      },
      {
        name: "恒润",
        value: 25,
      },
    ],
    汽柴油: [
      {
        name: "广投石化",
        value: 15,
      },
      {
        name: "开燃公司",
        value: 14,
      },
      {
        name: "桂盛桂轩",
        value: 20,
      },
      {
        name: "恒润",
        value: 25,
      },
    ],
  },
  detailInStorage: {
    原油: [
      {
        name: "广投石化",
        value: 240,
      },
      {
        name: "开燃公司",
        value: 230,
      },
      {
        name: "桂盛桂轩",
        value: 220,
      },
      {
        name: "恒润",
        value: 210,
      },
    ],
    汽柴油: [
      {
        name: "广投石化",
        value: 140,
      },
      {
        name: "开燃公司",
        value: 122,
      },
      {
        name: "桂盛桂轩",
        value: 130,
      },
      {
        name: "恒润",
        value: 110,
      },
    ],
  },
  detailStorage: {
    原油: [
      {
        name: "广投石化",
        value: 550,
      },
      {
        name: "开燃公司",
        value: 660,
      },
      {
        name: "桂盛桂轩",
        value: 770,
      },
      {
        name: "恒润",
        value: 880,
      },
    ],
    汽柴油: [
      {
        name: "广投石化",
        value: 150,
      },
      {
        name: "开燃公司",
        value: 140,
      },
      {
        name: "桂盛桂轩",
        value: 130,
      },
      {
        name: "恒润",
        value: 110,
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
    label: "总库容(吨)",
    icon: volumeIcon,
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
]);

const handleCompanyChange = () => {
  // console.log(company.value);
  // TODO 根据企业获取库存仓储数据
  // initAllGraph();
};

// 出库产品名称切换
const handleOutStorageProductNameChange = (tab: TabsPaneContext) => {
  activeOutStorageProductName.value = tab.paneName as string;
  initGraph4();
};

// 入库产品名称切换
const handleInStorageProductNameChange = (tab: TabsPaneContext) => {
  activeInStorageProductName.value = tab.paneName as string;
  initGraph5();
};

// 库存产品名称切换
const handleStorageProductNameChange = (tab: TabsPaneContext) => {
  activeStorageProductName.value = tab.paneName as string;
  initGraph6();
};

const initLegendClick = () => {
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
    router.push({
      name: "CompanyStorage",
      query: {
        company: params.name,
      },
    });
  });
  companyGraph3.value?.on("click", "series.pie", (params: any) => {
    router.push({
      name: "CompanyStorage",
      query: {
        company: params.name,
      },
    });
  });
  companyGraph4.value?.on("click", "series.bar", (params: any) => {
    router.push({
      name: "CompanyStorage",
      query: {
        company: params.name,
      },
    });
  });
  companyGraph5.value?.on("click", "series.bar", (params: any) => {
    router.push({
      name: "CompanyStorage",
      query: {
        company: params.name,
      },
    });
  });
  companyGraph6.value?.on("click", "series.bar", (params: any) => {
    router.push({
      name: "CompanyStorage",
      query: {
        company: params.name,
      },
    });
  });
};

const initAllGraph = () => {
  initGraph1();
  initGraph2();
  initGraph3();
  initGraph4();
  initGraph5();
  initGraph6();
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
  const data = graphData.yearInStorage;
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
  const data = graphData.yearStorage;
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
        data: graphData.detailOutStorage[activeOutStorageProductName.value],
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
        data: graphData.detailInStorage[activeInStorageProductName.value],
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
        data: graphData.detailStorage[activeStorageProductName.value],
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            return color[params.dataIndex];
          },
        },
      },
    ],
  });
};

const testQuery = (cache: any) => {
  // console.log(cache);
  // 根据组织名、年份获取年出库
  // 优化点1： 自由选择子数据维度
  // 优化点2： 自由选择产品
  const yearCache = cache.yearCache;
  const year = 2025;
  const orgName = "广投石化";
  const yearData = yearCache.byStorageName[orgName][year];
  console.log(yearData);
  // 根据产品名获取年出库
  const productName = "#0柴油";
  const yearPData = yearCache.byProduct[productName][year];
  console.log(yearPData);
  // 根据组织名、年份、产品名获取年入库
  console.log(yearCache.byProductAndStorageName[productName][year][orgName]);
};

/**
 * 查询库存仓储数据统一接口
 * 时间维度：年/月/日
 * 组织维度：组织名
 * 产品维度：产品名
 * 包含子产品维度
 * 包含子事件维度
 * @param cache
 * @param timeDimension
 * @param orgName
 * @param productName
 * @param subProductName
 * @param subEventName
 */
function queryStorageAggData(
  cache: any,
  timeDimension: string,
  orgName: string,
  productName: string,
  subProductName: string,
  subEventName: string
) {}

const initData = async () => {};

onMounted(async () => {
  // const cache = businessStore.getLocalStorageDatabase();
  // testQuery(cache);
  // initStorageData();
  await initData();
  initAllGraph();
  initLegendClick();
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
