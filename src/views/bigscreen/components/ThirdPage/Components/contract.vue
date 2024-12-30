<template>
  <div class="third-content">
    <div class="content-header">
      <div class="title-bg-container">
        <img class="title-bg" src="../../../img/tit.png" alt="" />
        <div class="header-left">{{ moduleName }}统计</div>
        <div class="header-right">
          <el-input
            v-model="inputValue"
            size="large"
            style="width: 250px"
            class="input-field"
            placeholder="请输入"
            clearable
          />
          <el-button type="primary" size="large" class="search-button">
            搜索
          </el-button>
          <el-button plain size="large" class="reset-button">重置</el-button>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div id="chart3-1" style="width: 80%; height: 300px; margin: auto" />
    </div>
    <div class="content-form">
      <el-table
        class="g-table-2"
        stripe
        :data="tableData"
        style="width: 100%"
        height="480"
        @current-change="handleCurrentChange"
      >
        <el-table-column label="签订时间" prop="签署日期" />
        <el-table-column label="合同类型" prop="合同类型" />
        <el-table-column label="合同编号" prop="合同编号" />
        <el-table-column label="合同名称" prop="合同名称" />
        <el-table-column label="合同金额(含税)(万元)" prop="含税金额" />
        <el-table-column label="相对方" prop="相对人名称" />
        <el-table-column label="我方" prop="我方名称" />
      </el-table>
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :size="size"
        background
        layout="total, sizes, prev, pager, next"
        style="margin-top: 10px; display: flex; justify-content: center"
        :total="pagination.total"
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
import { ArrowRight } from "@element-plus/icons-vue";
import { ComponentSize } from "element-plus";
import BusinessStandbookAPI from "@/api/businessStandBook";

const router = useRouter();

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

const tableData: Ref<[]> = ref([]);
// 初始化Echarts图表
const chart = shallowRef<echarts.ECharts | null>(null);

const initChart = () => {
  if (!chart.value) {
    chart.value = echarts.init(
      document.getElementById("chart3-1") as HTMLDivElement
    );
  }
  chart.value.clear();

  // 饼状图
  const option = {
    title: {
      text: "合同类型分布",
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
      data: ["销售", "采购", "运输", "仓储", "装卸"],
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        name: "合同类型",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: [
          { value: 335, name: "销售" },
          { value: 310, name: "采购" },
          { value: 234, name: "运输" },
          { value: 135, name: "仓储" },
          { value: 1548, name: "装卸" },
        ],
        label: {
          show: true,
          // 颜色暗些
          color: "#eee",
          fontSize: 16,
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

const goBack = () => {
  router.go(-1);
};

const queryForm: Ref<any> = ref({
  状态集合: undefined,
  数据源集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  页码: 1,
  页容量: 10,
});

const pagination: Ref<any> = ref({
  total: 100,
  pageSizes: [10, 20, 50, 100],
  pageSize: 10, // //每页大小
  currentPage: 1, // 当前页
});

async function initTableData() {
  BusinessStandbookAPI.getContractLedgerRecordList({
    ...queryForm.value,
    页码: pagination.value.currentPage,
    页容量: pagination.value.pageSize,
  })
    .then((res: any) => {
      tableData.value = res["当前记录"];
      pagination.value.total = +res["记录总数"];
    })
    .catch((err) => {
      console.error(err);
    });
};

onMounted(async () => {
  const route = router.currentRoute.value;
  if (route.query.filters) {
    const params = JSON.parse(route.query.filters as string);
    filters.value = {
      ...filters.value,
      ...params,
    };
  }
  await initTableData();
  initChart();
  window.addEventListener("resize", () => {
    chart.value?.resize();
  });
});

const size = ref<ComponentSize>("default");

const handleSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize;
  initTableData();
};
const handleCurrentChange = (currentPage: number) => {
  pagination.value.currentPage = currentPage;
  initTableData();
};
</script>

<style lang="scss" scoped>
.bg-view-img2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #030542;
}
.bg-view1__header {
  width: 100%;
  height: 66px;
  display: flex;
  position: relative;
  background-image: url(../../img/tit_bg.png);
  background-repeat: no-repeat;
  background-size: 80% 100%;
  background-position: center;
  align-items: center;
  .back-btn {
    position: absolute;
    left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
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
  display: flex;
  align-items: center;
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
  position: relative;
  width: 100%;
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
