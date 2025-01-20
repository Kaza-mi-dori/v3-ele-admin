<template>
  <div class="third-content">
    <div class="content-header">
      <div class="title-bg-container">
        <img class="title-bg" src="../../../img/tit.png" alt="" />
        <div class="header-left">利润统计分析</div>
        <div class="header-right">
          <el-select
            v-model="year"
            style="width: 250px"
            class="input-field"
            size="large"
            placeholder="请选择"
            @change="onChangeYear"
          >
            <el-option
              v-for="d in 10"
              :key="d"
              :value="currentYear + 1 - d"
              :label="currentYear + 1 - d"
            />
          </el-select>
          <el-button type="primary" size="large" class="search-button">
            搜索
          </el-button>
          <el-button plain size="large" class="reset-button">重置</el-button>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div id="chart-profit-1" style="flex: 1; height: 300px; margin: auto" />
      <div id="chart-profit-2" style="flex: 1; height: 300px; margin: auto" />
    </div>
    <div class="content-form">
      <el-table
        class="g-table-2"
        stripe
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        style="width: 100%"
        height="480"
        @current-change="handleCurrentRowChange"
      >
        <el-table-column label="企业名称" prop="企业名称" />
        <el-table-column label="累计利润(万元)" prop="累计利润" />
        <el-table-column label="占比(%)" prop="占比" />
        <el-table-column label="目标利润(万元)" prop="目标利润" />
        <el-table-column label="年度目标完成率(%)" prop="目标完成率" />
        <el-table-column label="同比增长(%)" prop="同比增长" />
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :size="size"
        background
        layout="total, sizes, prev, pager, next"
        style="margin-top: 10px; display: flex; justify-content: center"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { ComponentSize, formatter } from "element-plus";
import { OurCompanyEnum, OurCompanyFullNameMap } from "@/enums/BusinessEnum";
import { companyStoreHook } from "@/store";

const router = useRouter();
const companyStore = companyStoreHook();
// 页面动态显示内容，由参数决定
const title: Ref<string> = ref("广投石化驾驶舱");
const moduleName: Ref<string> = ref("合同台账");
const filters: Ref<any> = ref({
  /** 日期起始值 */
  日期晚于: "",
  /** 日期结束值 */
  日期早于: "",
});

const inputValue = ref("");
const currentYear = new Date().getFullYear();
const year = ref();

// 每个类别对应的数据系列
const months = [
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

// 随机生成收入数据
const getRandomData = () => {
  // return months.map((month, index) => ({
  //   month: month,
  //   planned: Math.floor(Math.random() * 101), // 计划经利润入
  //   actual: Math.floor(Math.random() * 101), // 实际经利润入
  // }));
  return [
    {
      企业名称: "广投石化",
      累计利润: "1000",
      占比: "33.33%",
      目标利润: "3000",
      目标完成率: "66.67%",
      同比增长: "10%",
    },
    {
      企业名称: "广东广投石化有限公司",
      累计利润: "1000",
      占比: "33.33%",
      目标利润: "3000",
      目标完成率: "66.67%",
      同比增长: "10%",
    },
    {
      企业名称: "广投石化(舟山)有限公司",
      累计利润: "1000",
      占比: "33.33%",
      目标利润: "3000",
      目标完成率: "66.67%",
      同比增长: "10%",
    },
    {
      企业名称: "永盛仓储有限公司",
      累计利润: "1000",
      占比: "33.33%",
      目标利润: "3000",
      目标完成率: "66.67%",
      同比增长: "10%",
    },
  ];
};

// 填充表格数据
const chartData = getRandomData();

const profitData = ref(chartData);

//更新表格数据
const tableData = ref<any[]>(chartData);

// 初始化Echarts图表
const chart = shallowRef<echarts.ECharts | null>(null);
const chart2 = shallowRef<echarts.ECharts | null>(null);

function dataFilterOne(res: any) {
  tableData.value.forEach((item: any, index: number) => {
    // 找到res中对应的公司
    const company = res.find((data: any) => data?.企业名称 === item.企业名称);
    if (company) {
      // 在内容-详情下找到业态类型为“总体”这一条
      const overall = company.内容.详情.find(
        (item: any) => item.业态类型 === "总体"
      );
      item.累计利润 = overall?.累计利润金额 || 0;
      item.占比 = company.占比;
      item.目标利润 = company.利润基准值 || 0;
      item.目标完成率 =
        (overall?.累计利润金额 || 0) / (company.利润基准值 || 0);
      item.同比增长 = company.同比增长 || 0;
    } else {
      item.累计利润 = 0;
      item.占比 = 0;
      item.目标利润 = 0;
      item.目标完成率 = 0;
      item.同比增长 = 0;
    }
  });
  // reduce计算占比
  const total = tableData.value.reduce((acc, item) => acc + item.累计利润, 0);
  tableData.value.forEach((item) => {
    item.占比 = ((item.累计利润 / total) * 100).toFixed(2);
  });
}

const onChangeYear = (value: any) => {
  Promise.all(
    Object.keys(OurCompanyFullNameMap).map((company) =>
      companyStore.getFirmReportMap(company as OurCompanyEnum, value.toString())
    )
  ).then((res) => {
    dataFilterOne(res);
    profitData.value = [];
    tableData.value.forEach((item) => {
      profitData.value.push({
        企业名称: item.企业名称,
        累计利润: item.累计利润,
        占比: item.占比,
        目标利润: item.目标利润,
        目标完成率: item.目标完成率,
        同比增长: item.同比增长,
      });
    });
    console.log("profitData", profitData.value);
    initChart1();
    initChart2();
  });
};

// 左侧图
const initChart1 = () => {
  if (!chart.value) {
    chart.value = echarts.init(
      document.getElementById("chart-profit-1") as HTMLDivElement
    );
  }
  chart.value.clear();

  // 饼状图

  const option = {
    title: {
      text: "利润构成分布",
      left: "center",
      top: 20,
      textStyle: {
        color: "#fff",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: profitData.value.map((item) => item.企业名称),
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        name: "企业",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: profitData.value.map((item) => ({
          value: item.累计利润,
          name: item.企业名称,
        })),
        label: {
          show: true,
          // 颜色暗些
          color: "#eee",
          fontSize: 16,
          formatter: "{b} : {c}万元 ({d}%)",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  chart.value.setOption(option);
};

// 右侧图
const initChart2 = () => {
  if (!chart2.value) {
    chart2.value = echarts.init(
      document.getElementById("chart-profit-2") as HTMLDivElement
    );
  }
  chart2.value.clear();

  // 柱状图，整体利润的过去五年的情况
  const option = {
    // title: {
    //   text: "各主体目标完成情况",
    //   left: "center",
    //   top: 20,
    //   textStyle: {
    //     color: "#fff",
    //   },
    // },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    // 橙色与蓝色
    color: ["#FFA500", "#00BFFF"],
    legend: {
      data: ["累计利润", "目标利润"],
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: profitData.value.map((item) => item.企业名称),
      axisLabel: {
        fontSize: 14,
        color: "#fff",
      },
    },
    yAxis: {
      type: "value",
      name: "单位：万元",
      nameTextStyle: {
        color: "#fff",
        fontSize: 15,
      },
      axisLine: {
        show: true, // 显示坐标轴线
        lineStyle: {
          color: "#fff",
        },
      },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          type: "dashed", // 虚线
          color: "#fff",
        },
      },
      axisLabel: {
        fontSize: 14,
        color: "#fff",
      },
    },
    series: [
      {
        type: "bar",
        barWidth: "40%",
        barGap: "10%", // 柱体间距
        data: profitData.value.map((item) => item.累计利润),
        name: "累计利润",
        // 显示标签
        label: {
          show: true,
          position: "top",
          color: "#fff",
          textStyle: {
            fontSize: "1rem",
          },
        },
      },
      {
        type: "bar",
        barWidth: "40%",
        barGap: "10%", // 柱体间距
        data: profitData.value.map((item) => item.目标利润),
        name: "目标利润",
        // 显示标签
        label: {
          show: true,
          position: "top",
          color: "#fff",
          textStyle: {
            fontSize: "1rem",
          },
        },
      },
    ],
  };
  chart2.value.setOption(option);
};

const goBack = () => {
  router.go(-1);
};

async function initTableData() {
  tableData.value = getRandomData();
}

onMounted(async () => {
  const route = router.currentRoute.value;
  moduleName.value = route.query.module as string;
  if (route.query.year) {
    year.value = parseInt(route.query.year as string);
    filters.value = {
      ...filters.value,
      日期晚于: `${year.value}-01-01`,
      日期早于: `${year.value}-12-31`,
    };
  }
  if (route.query.filters) {
    const params = JSON.parse(route.query.filters as string);
    filters.value = {
      ...filters.value,
      ...params,
    };
  }
  await initTableData();
  setTimeout(() => {
    initChart1();
    initChart2();
  }, 100);
  window.addEventListener("resize", () => {
    chart.value?.resize();
  });
});

const currentPage = ref(1); //当前页
const pageSize = ref(10); //每页大小
const pageSizes = ref([10, 20, 50, 100]);
const size = ref<ComponentSize>("default");

const handleSizeChange = (val: number) => {
  pageSize.value = val;
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};
const handleCurrentRowChange = (val: any) => {
  console.log(val);
  // TODO: 点击行后显示过去五年的数据弹窗
};
</script>

<style lang="scss" scoped>
.bg-view-img2 {
  @apply flex flex-col w-full h-full;
  background-color: #030542;
}
.bg-view1__header {
  height: 66px;
  @apply flex items-center w-full relative;
  background-image: url(../../img/tit_bg.png);
  background-repeat: no-repeat;
  background-size: 80% 100%;
  background-position: center;
  .back-btn {
    left: 30px;
    @apply flex justify-center items-center absolute;
    padding: 8px 15px;
    background-image: url(../../img/back.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    &:active {
      transform: scale(0.95);
    }
    img {
      width: 15px;
    }
    span {
      font-size: 1rem;
      color: #40c7f4;
      margin-left: 6px;
      transition: transform 0.1s;
    }
  }
  .title {
    @apply flex justify-center items-center flex-1;
    .__title--text {
      font-size: 2rem;
      letter-spacing: 6px;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(
        to bottom,
        rgb(251, 254, 254),
        rgb(188, 247, 255)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
    }
  }
}
.bg-view1__body {
  flex-grow: 1;
  margin: 20px 50px 50px 50px;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
.breadcrumb-box {
  @apply flex items-center;
  color: #d5e2fb;
  img {
    width: 20px;
  }
  .breadcrumb-title {
    font-size: 1rem;
    margin-left: 10px;
    transition: transform 0.1s;
    letter-spacing: 2px;
  }
}
.content-header {
  margin-top: 20px;
}
.title-bg-container {
  @apply relative w-full;
}
.title-bg {
  width: 100%;
  height: 60px;
}
.header-left {
  font-size: 22px;
  position: absolute;
  top: 20%;
  left: 3%;
  z-index: 1;
}
.header-right {
  position: absolute;
  top: -10px;
  right: 5px;
  z-index: 1;
}
:deep(.input-field) {
  background-color: #1c1e57 !important;
  border: 1px solid #21246f !important;
  font-size: 16px;
  .el-input__wrapper {
    padding-top: 2px;
    padding-bottom: 2px;
    background-color: #1c1e57 !important;
  }
  .el-input__inner {
    background-color: #1c1e57 !important;
    color: #7b9de0 !important;
  }
  .el-select__wrapper {
    background-color: #1c1e57 !important;
    .el-select__placeholder {
      color: #e3e3e3 !important;
    }
  }
}
.search-button {
  margin-left: 12px;
  background-color: #3550ab;
  color: #bbd4fe;
  font-size: 16px;
  letter-spacing: 1px;
  &:hover {
    opacity: 0.8;
  }
}
.reset-button {
  margin-left: 7px;
  background-color: transparent;
  color: #bbd4fe;
  font-size: 16px;
  border: 2px solid #3550ab;
  &:hover {
    background-color: #3550ab;
    color: #fff;
  }
}
.content-middle {
  margin-top: 20px;
  @apply flex justify-center flex-gap-2;
  canvas {
    width: 100%;
  }
}
.content-form {
  margin-top: 20px;
}

:deep(.el-breadcrumb) {
  color: #d5e2fb;
  font-size: 16px;
  margin: 0 3px;
  letter-spacing: 1px;
}
:deep(.el-breadcrumb__separator.el-icon) {
  margin: 0 2px;
}
:deep(.el-breadcrumb__separator) {
  color: #d5e2fb;
}
:deep(.el-breadcrumb__inner) {
  color: #d5e2fb;
}
:deep(
    .el-breadcrumb__item:last-child .el-breadcrumb__inner,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover
  ) {
  color: #519cec;
}

:deep(.el-table) {
  background-color: #11134e;
  color: #7b9de0;
}

:deep(.el-table th) {
  background-color: #1b1d67;
  color: #5289ee;
}

:deep(.el-table.is-scrolling-none th.el-table-fixed-column--left) {
  background-color: #1b1d67;
}

:deep(.el-table td) {
  color: #7b9de0;
}

:deep(.el-table tr) {
  background-color: transparent;
}

:deep(.el-table th.el-table__cell.is-leaf) {
  border-bottom: none;
}

:deep(
    .el-table--striped
      .el-table__body
      tr.el-table__row--striped
      td.el-table__cell
  ) {
  background: #1c1e57;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border-bottom: none;
}

:deep(.el-pagination.is-background .el-pagination__sizes) {
  .el-select {
    .el-select__wrapper {
      background-color: transparent;
      .el-select__placeholder {
        color: #fefefe;
      }
    }
  }
}

:deep(.el-pagination.is-background .btn-prev, ) {
  background-color: #272a9b !important;
}

:deep(.el-pagination.is-background .btn-next) {
  background-color: #272a9b !important;
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #272a9b;
  color: #fefefe;
}

:deep(.el-pagination__total) {
  color: #fefefe;
}

:deep(.el-pagination.is-background .el-pager li) {
  background-color: transparent;
  border: 1px solid #4e6ab2;
  color: #fefefe;
}

:deep(.el-pager li.is-active, .el-pager li:hover) {
  color: #272a9b;
}

:deep(.el-table__inner-wrapper:before) {
  display: none;
}

:deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #272a9b inset;
}

:deep(.el-select__wrapper.is-hovering:not(.is-focused)) {
  box-shadow: 0 0 0 2px #272a9b inset;
}

:deep(
    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
  ) {
  background-color: #272786 !important;
}

// :deep(.el-table) {
//   // 高亮当前行的背景色为#1c1e57
//   .el-table__body tr.current-row {
//     background-color: #1c1e57 !important;
//   }
// }
:deep(.g-table-2.el-table) {
  // 行距拉高
  .cell {
    line-height: 36px !important;
    font-size: 16px;
  }
}
</style>
