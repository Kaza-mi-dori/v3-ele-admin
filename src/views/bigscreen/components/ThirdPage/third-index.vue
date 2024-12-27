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
      <!-- <div class="breadcrumb-box">
        <img src="../../img/home.png" alt="" />
        <span class="breadcrumb-title">您所在的位置：</span>
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
          <el-breadcrumb-item>标题标题</el-breadcrumb-item>
          <el-breadcrumb-item>标题标题</el-breadcrumb-item>
          <el-breadcrumb-item>标题标题</el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
      <!-- <div class="third-content">
        <div class="content-header">
          <div class="title-bg-container">
            <img class="title-bg" src="../../img/tit.png" alt="" />
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
              <el-button plain size="large" class="reset-button">
                重置
              </el-button>
            </div>
          </div>
        </div>
        <div class="content-middle">
          <div id="chart3-1" style="width: 80%; height: 300px; margin: auto" />
        </div>
        <div class="content-form">
          <el-table
            stripe
            :data="
              tableData.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            style="width: 100%"
            height="480"
          >
            <el-table-column label="月份" prop="month" />
            <el-table-column label="计划经营收入" prop="planned" />
            <el-table-column label="实际经营收入" prop="actual" />
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
      </div> -->
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { ComponentSize } from "element-plus";
import sassvariables from "@/styles/variables.module.scss";

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
          color: "#27518D",
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
          color: "#27518D",
        },
      },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          type: "dashed", // 虚线
          color: "#27518D",
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
            { offset: 0, color: "#25DDA7" },
            { offset: 1, color: "#249E55" },
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
  router.go(-1);
};

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
    cursor: pointer;
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
