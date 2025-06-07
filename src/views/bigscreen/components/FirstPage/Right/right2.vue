<template>
  <div>
    <Model1 class="model1" title="贸易伙伴交易金额排行">
      <!-- <div
        id="chart-right-2"
        style="
          width: 100%;
          padding-top: 10px;
          padding-right: 20px;
          padding-left: 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
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
          <div class="__name" :title="item.name">{{ item.name }}</div>
          <el-progress
            class="__progress"
            :percentage="(item.ratio || 0) * 100"
            :text-inside="true"
            :show-text="false"
            color="rgb(11,215,223)"
            :stroke-width="20"
          >
            <span>{{ item.value }}</span>
            <span>{{ item.unit }}</span>
          </el-progress>
        </div>
      </div> -->
      <!-- <div id="chart-right-2" style="height: 200px" /> -->
      <div id="chart-right-2" style="height: 200px" />
    </Model1>
  </div>
</template>

<script setup lang="ts">
import no1 from "@/views/bigscreen/img/no1.png";
import no2 from "@/views/bigscreen/img/no2.png";
import no3 from "@/views/bigscreen/img/no3.png";
import no4 from "@/views/bigscreen/img/no4.png";
import Model1 from "../../FirstPage/Model1/index.vue";
import * as echarts from "echarts";
import sassvariables from "@/styles/variables.module.scss";
import { ref, computed } from "vue";

interface Rank {
  order?: number;
  name: string;
  value: number;
  unit: string;
  ratio?: number;
}

const totalData = ref({
  name: "总金额",
  value: 35.66,
  unit: "亿元",
});

const chart = shallowRef<echarts.ECharts | null>(null);

const rankData: Ref<Rank[]> = ref([
  { order: 1, name: "KINGBACK TRADING LIMITED", value: 11.42, unit: "亿元" },
  {
    order: 2,
    name: "DYNAMIC TRADING CO. LIMITED",
    value: 6.78,
    unit: "亿元",
  },
  {
    order: 3,
    name: "香港荣盛",
    value: 4.12,
    unit: "亿元",
  },
  {
    order: 4,
    name: "大连广宏能源有限公司",
    value: 2.19,
    unit: "亿元",
  },
  { order: 5, name: "浙江浙石化销售有限公司", value: 0.72, unit: "亿元" },
  {
    order: 6,
    name: "恒力能源",
    value: 0.62,
    unit: "亿元",
  },
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
    rankDataToDisplay.value = newVal
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        ...item,
        ratio: (item.value / totalData.value.value).toFixed(3),
        order: index + 1,
      }))
      .slice(0, 5);
  },
  { immediate: true, deep: true }
);

const initChart = (data: any) => {
  if (!chart.value) {
    chart.value = echarts.init(
      document.getElementById("chart-right-2") as HTMLDivElement
    );
    // 绑定事件
    // chart.value.on("click", "series.bar", clickBarCb);
  }
  // 清空图表
  chart.value.clear();
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "2%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: rankData.value.map((item: any) => item.name),
      axisLine: {
        lineStyle: {
          color: sassvariables["bigscreen-primary-color-8"],
        },
      },
      axisLabel: {
        fontSize: 14,
        color: sassvariables["bigscreen-primary-color-7"],
        interval: 0,
        formatter: (value: string) => {
          if (value.length > 4) {
            return value.slice(0, 4) + "...";
          }
          return value;
        },
      },
    },
    yAxis: {
      // type: "category",
      type: "value",
      name: "单位：亿元",
      nameTextStyle: {
        color: sassvariables["bigscreen-primary-color-7"],
        fontSize: 15,
      },
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
        fontSize: 14,
        color: sassvariables["bigscreen-primary-color-7"],
      },
    },
    series: [
      {
        name: "交易金额",
        type: "bar",
        data: rankData.value.map((item) => item.value),
        label: {
          show: true,
          position: "top",
          color: "#fff",
          textStyle: {
            fontSize: "1rem",
          },
          // 格式化标签
          formatter: ({ value }: { value: number }) => {
            const num = value.toFixed(1);
            return `${num}`;
          },
        },
      },
    ],
  };
  chart.value.setOption(option);
};

onMounted(() => {
  const data = [
    { name: "永盛石化", value: 1000 },
    { name: "广投石化", value: 2000 },
    { name: "中石化", value: 3000 },
    { name: "中石油", value: 4000 },
    { name: "中石化", value: 5000 },
  ];
  initChart(data);
  window.addEventListener("resize", () => {
    chart.value?.resize();
  });
});
</script>

<style lang="scss" scoped>
.model1 {
  @apply flex flex-1 flex-col h-full;
}

:deep(.el-progress.el-progress--line.el-progress--without-text.__progress)
  .el-progress-bar
  > .el-progress-bar__outer {
  background-color: #192d56 !important;
  > .el-progress-bar__inner {
    // 动画时间延后2s并设置动画
    animation: progress-animation 1s ease !important;
    @keyframes progress-animation {
      from {
        width: 0;
      }
      to {
      }
    }
  }
}

.rank-item {
  @apply flex justify-between items-center;
  margin-bottom: 5px;

  .order {
    width: 30px;
    height: 25px;
    @apply flex items-center pl-[5px] font-bold;
    font-size: 14px;
    margin-right: 10px;
    color: #fff;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .__name {
    @apply text-left overflow-hidden;
    font-size: 14px;
    color: #7b9eeb;
    flex-grow: 1; // 让公司名称部分占满剩余的空间
    max-width: 200px; // 设置最大宽度
    white-space: nowrap; // 禁止换行
    text-overflow: ellipsis; // 超出部分显示省略号
  }

  .__progress {
    width: 65%;
    margin-left: 5px;
  }

  .__value {
    font-size: 14px;
    color: #7b9eeb;
    min-width: 45px; // 设置一个最小宽度，以保证有足够空间显示百分比
    @apply text-right;
  }
}
</style>
