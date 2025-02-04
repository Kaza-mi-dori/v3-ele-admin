<template>
  <Model1 class="model1" title="贸易伙伴交易金额TOP5">
    <!-- <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="table-header" style="width: 70px">排行</th>
            <th class="table-header">公司</th>
            <th class="table-header" style="width: 140px">交易额(万元)</th>
            <th class="table-header" style="width: 140px">交易额占比(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in tradePartners"
            :key="index"
            class="table-row"
          >
            <td class="table-cell cell1">{{ index + 1 }}</td>
            <td class="table-cell cell2">{{ item.company }}</td>
            <td class="table-cell">{{ item.amount }}</td>
            <td class="table-cell">{{ (item.ratio * 100).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div> -->
    <div id="chart-right-2" style="height: 200px" />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import sassvariables from "@/styles/variables.module.scss";
import { ref, computed } from "vue";

const props = defineProps<{
  data?: { company: string; amount: number; ratio: number }[];
}>();

const tradePartners = ref([
  { company: "公司A", amount: 96, ratio: 10.23 },
  { company: "公司B", amount: 82, ratio: 8.23 },
  { company: "公司C", amount: 76, ratio: 7.23 },
  { company: "公司D", amount: 56, ratio: 5.23 },
  { company: "公司E", amount: 30, ratio: 3.23 },
]);

const chart = shallowRef<echarts.ECharts | null>(null);

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
      data: data.map((item: any) => item.name),
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
        data: data.map((item) => item.value),
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
  if (props.data) {
    tradePartners.value = props.data;
  }
  initChart(tradePartners.value);
  window.addEventListener("resize", () => {
    chart.value?.resize();
  });
});
</script>

<style lang="scss" scoped>
.model1 {
  @apply flex flex-1 flex-col h-full;
}

.table-wrapper {
  border: 2px solid #3486da;
  padding: 1px;
  margin: 20px 10px 0 10px;
}

.table {
  width: 100%;
  height: 190px;
  border-collapse: separate; /* 使用 separate 以支持 border-spacing */
  border-spacing: 2px 1px; /* 设置单元格之间的外间距：左右2px，上下1px */
  margin: 0;
  background-color: #050b47;
  overflow-y: auto;
}

.table tbody {
  width: 100%;
  height: 170px; /* 设置高度，留出thead的高度 */
  overflow-y: auto;
}

.table-header,
.table-cell {
  text-align: center;
  border: 2px solid #1a4790; /* 单元格边框 */
  font-size: 16px;
  letter-spacing: 1px;
}

.table-header {
  background-color: #0f2465;
  font-size: 17px;
  font-weight: bold;
  color: #3184d6;
}

.table-cell {
  background-color: #050b47;
  color: #fff;
}

.cell1 {
  color: #3184d6;
  font-size: 17px;
}

.cell2 {
  @apply text-left;
  padding-left: 5px;
}

.table td,
.table th {
  @apply relative;
}

// .table-row {
//   transition: background-color 0.3s ease; /* 添加过渡效果 */
// }

// .table-row:hover {
//   background-color: rgba(15, 36, 101, 0.5);
// }
</style>
