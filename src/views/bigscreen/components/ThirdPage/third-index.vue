<template>
  <div class="bg-view-img2">
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view1__header">
      <div class="back-btn" @click="goBack">
        <img src="../../img/back_icon.png" alt="" />
        <span>返回</span>
      </div>
      <div class="title">
        <div class="__title--text">{{ title }}</div>
      </div>
    </div>
    <div class="bg-view1__body">
      <router-view v-if="hasPermission" />
      <Deny v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ComponentSize } from "element-plus";
import { OurCompanyEnum, OurCompanyEnumMap } from "@/enums/BusinessEnum";
import sassvariables from "@/styles/variables.module.scss";
import Deny from "@/views/bigscreen/components/Common/Deny/index.vue";

const router = useRouter();
const hasPermission = ref(true);
// 页面动态显示内容，由参数决定
const title: Ref<string> = ref("驾驶舱通用页面");
const moduleName: Ref<string> = ref("合同台账");
const filters: Ref<any> = ref({
  /** 日期起始值 */
  日期晚于: "",
  /** 日期结束值 */
  日期早于: "",
});

const inputValue = ref("");

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
  return months.map((month, index) => ({
    month: month,
    planned: Math.floor(Math.random() * 101), // 计划经营收入
    actual: Math.floor(Math.random() * 101), // 实际经营收入
  }));
};

// 填充表格数据
const chartData = getRandomData();

//更新表格数据
const tableData = ref(chartData);

// 初始化Echarts图表
const chart = shallowRef<echarts.ECharts | null>(null);

const initChart = () => {
  chart.value = echarts.init(
    document.getElementById("chart3-1") as HTMLDivElement
  );
  chart.value.clear();

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["计划经营收入", "实际经营收入"],
      textStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: months,
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
      name: "单位：万元",
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
    series: [
      {
        name: "计划经营收入",
        type: "bar",
        data: chartData.map((item) => item.planned),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: sassvariables["bigscreen-primary-color-9"] },
            { offset: 1, color: sassvariables["bigscreen-primary-color-10"] },
          ]),
        },
        barWidth: "25%",
      },
      {
        name: "实际经营收入",
        type: "bar",
        data: chartData.map((item) => item.actual),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: sassvariables["bigscreen-primary-color-3"] },
            { offset: 1, color: sassvariables["bigscreen-primary-color-4"] },
          ]),
        },
        barWidth: "25%",
      },
    ],
  };
  chart.value.setOption(option);
};

const goBack = () => {
  // 如果路由栈中有上一页，则返回上一页，否则返回首页
  if (window.history.length <= 1) {
    // const route = router.resolve({ path: "/bigScreenBoard/index" });
    router.push({
      name: "BigScreenBoard",
    });
  } else {
    router.go(-1);
  }
};

interface ThirdPageQuery {
  title?: string;
  moduleName?: string;
  year?: string;
  month?: string;
  companyId?: string;
}

const companyIdToName = (companyId: string) => {
  switch (companyId) {
    case "1":
      return OurCompanyEnumMap[OurCompanyEnum.SHBK];
    case "2":
      return OurCompanyEnumMap[OurCompanyEnum.GTSHC];
    case "3":
      return OurCompanyEnumMap[OurCompanyEnum.GDFGS];
    case "4":
      return OurCompanyEnumMap[OurCompanyEnum.GTSHC_ZS];
    case "5":
      return OurCompanyEnumMap[OurCompanyEnum.GTSHC_ZS];
    default:
      return "";
  }
};

onBeforeMount(() => {
  // hasPermission.value = true;
  // TODO 验证权限
  const route = useRoute();
  // 获取路由参数
  const query = route.query;
  // 捕获/thirdPage/(.*)?
  const path = route.path;
  if (path.includes("/thirdPage/")) {
    const params = path.split("/")[3];
    switch (params) {
      case "contract":
        title.value = "合同台账";
        break;
      case "revenue":
        const companyId = query.companyId;
        console.log(companyId);
        if (companyId) {
          title.value = `${companyIdToName(companyId as string)}营收与利润分析`;
        } else {
          title.value = "营收与利润分析";
        }
        break;
      default:
        title.value = "驾驶舱通用页面";
    }
  }
});

onMounted(() => {
  // initChart();
  // window.addEventListener("resize", () => {
  //   chart.value?.resize();
  // });
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
</script>

<style lang="scss" scoped>
.bg-view-img2 {
  @apply flex flex-col w-full;
  // height: 100%;
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
    @apply flex justify-center items-center absolute cursor-pointer;
    left: 30px;
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
    @apply flex flex-1 justify-center items-center;
    .__title--text {
      @apply text-center font-bold relative;
      font-size: 2rem;
      letter-spacing: 6px;
      background: linear-gradient(
        to bottom,
        rgb(251, 254, 254),
        rgb(188, 247, 255)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.bg-view1__body {
  flex-grow: 1;
  padding: 20px 50px 20px 50px;
  ::-webkit-scrollbar {
    @apply hidden;
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
  @apply w-full;
  height: 60px;
}
.header-left {
  @apply absolute z-1;
  font-size: 22px;
  top: 20%;
  left: 3%;
}
.header-right {
  @apply absolute z-1;
  top: -10px;
  right: 5px;
}
:deep(.input-field) {
  background-color: #1c1e57 !important;
  border: 1px solid #21246f !important;
  font-size: 16px;
  .el-input__wrapper {
    background-color: #1c1e57 !important;
  }
  .el-input__inner {
    background-color: #1c1e57 !important;
    color: #7b9de0 !important;
  }
}
.search-button {
  margin-left: 12px;
  background-color: #3550ab;
  color: #bbd4fe;
  font-size: 16px;
  letter-spacing: 1px;
  &:hover {
    @apply opacity-80;
  }
}
.reset-button {
  @apply bg-transparent;
  margin-left: 7px;
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
  @apply bg-transparent;
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

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #272a9b;
  color: #fefefe;
}

:deep(.el-pagination__total) {
  color: #fefefe;
}

:deep(.el-pagination.is-background .el-pager li) {
  background-color: #030542;
  border: 1px solid #4e6ab2;
  color: #fefefe;
}

:deep(.el-pager li.is-active, .el-pager li:hover) {
  color: #272a9b;
}
</style>
