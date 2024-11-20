<template>
  <div>
    <Model1 class="model1" title="贸易金额交易伙伴TOP5">
      <div
        id="chart-right-2"
        style="
          width: 100%;
          padding-top: 10px;
          padding-right: 10px;
          padding-left: 10px;
        "
      >
        <div
          v-for="item in rankDataToDisplay"
          :key="item.order"
          class="rank-item"
        >
          <div
            class="order"
            :style="{ backgroundImage: getImageByRank(item.order) }"
          >
            <span>{{ item.order }}</span>
          </div>
          <div class="__name">{{ item.name }}</div>
          <el-progress
            class="__progress"
            :percentage="(item.ratio || 0) * 100"
            :show-text="false"
            color="rgb(11,215,223)"
            :stroke-width="10"
          />
          <div class="__value">
            <span>{{ item.value }}</span>
            <span>{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </Model1>
  </div>
</template>

<script setup lang="ts">
import no1 from "@/views/bigscreen/img/no1.png";
import no2 from "@/views/bigscreen/img/no2.png";
import no3 from "@/views/bigscreen/img/no3.png";
import no4 from "@/views/bigscreen/img/no4.png";
import Model1 from "../../Model1/index.vue";
import * as echarts from "echarts";
import { ref, computed } from "vue";

interface Rank {
  order?: number;
  name: string;
  value: number;
  unit: string;
  ratio?: number;
}

const rankData: Ref<Rank[]> = ref([
  { order: 1, name: "A公司", value: 5000, unit: "万元" },
  { order: 2, name: "B公司", value: 4000, unit: "万元" },
  { order: 3, name: "C公司", value: 3000, unit: "万元" },
  { order: 4, name: "D公司", value: 2000, unit: "万元" },
  { order: 5, name: "E公司", value: 1000, unit: "万元" },
]);

const rankDataToDisplay: Ref<Rank[]> = ref([]);

const getImageByRank = (order: number | undefined) => {
  switch (order) {
    case 1:
      return `url(${no1})`;
    case 2:
      return `url(${no2})`;
    case 3:
      return `url(${no3})`;
    case 4:
    default:
      return `url(${no4})`;
  }
};

watch(
  () => rankData.value,
  (newVal) => {
    rankDataToDisplay.value = newVal.sort((a, b) => b.value - a.value);
    rankDataToDisplay.value = rankDataToDisplay.value
      .map((item, index) => ({
        ...item,
        ratio: item.value / rankDataToDisplay.value[0].value,
        order: index + 1,
      }))
      .slice(0, 5);
  },
  { immediate: true, deep: true }
);

const initChart = (data: any) => {
  const myChart = echarts.init(document.getElementById("chart-right-2"));
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: "category",
      data: data.map((item: any) => item.name),
    },
    series: [
      {
        name: "2011年",
        type: "bar",
        data: data.map((item: any) => item.value),
      },
    ],
  };
  myChart.setOption(option);
};

onMounted(() => {
  const data = [
    { name: "永盛石化", value: 1000 },
    { name: "广投石化", value: 2000 },
    { name: "中石化", value: 3000 },
    { name: "中石油", value: 4000 },
    { name: "中石化", value: 5000 },
  ];
  // initChart(data);
});
</script>

<style lang="scss" scoped>
.model1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

::v-deep
  .el-progress.el-progress--line.el-progress--without-text.__progress
  .el-progress-bar
  > .el-progress-bar__outer {
  background-color: inherit !important;
}

.rank-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;

  .order {
    width: 30px;
    height: 25px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    padding-left: 5px;
    color: #fff;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .__name {
    font-size: 14px;
    color: #fff;
    margin-right: 3em;
  }

  .__progress {
    width: 55%;
  }

  .__value {
    font-size: 14px;
    margin-left: 2em;
    color: #fff;
  }
}
</style>
