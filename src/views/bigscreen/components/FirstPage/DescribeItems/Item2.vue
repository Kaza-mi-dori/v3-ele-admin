<template>
  <div class="box">
    <div class="__header">
      <img :src="props.icon" height="20" style="margin-left: 5px" />
      <div class="__title">{{ props.title }}</div>
    </div>
    <div class="__content">
      <div class="__left">
        <div class="text1">
          <span class="__number">{{ formatNumber(props.fulfilled) }}</span>
          <span class="__unit">{{ props.unit || "万元" }}</span>
        </div>
        <div class="text2">
          <span class="__desc">同比</span>
          <span
            :class="{ __number: true, up: props.yoy > 0, down: props.yoy < 0 }"
          >
            {{ props.yoy }}%
          </span>
          <el-icon v-if="props.yoy > 0" color="#f44a4d">
            <CaretTop />
          </el-icon>
          <el-icon
            v-else-if="props.yoy < 0"
            class="el-icon-arrow-down"
            color="#33a062"
          >
            <CaretBottom />
          </el-icon>
        </div>
        <div class="text2">
          <span class="__desc">目标额</span>
          <span class="__number">
            {{ formatNumber(props.target) + (props.unit || "万元") }}
          </span>
        </div>
        <div class="monthly-total">
          <div class="scale">月</div>
          <span class="month-num">
            {{ formatNumber(props.monthTotal) }}
          </span>
          <span class="__unit">{{ props.unit || "万元" }}</span>
        </div>
      </div>
      <div class="__right">
        <div ref="graphRef" style="height: 80%" />
        <div class="text">
          <span>完成率</span>
        </div>
      </div>
    </div>
    <div class="__footer" />
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import "echarts-liquidfill";
import sassvariables from "@/styles/variables.module.scss";
import header from "@/views/bigscreen/img/left_box1_top.png";
import center from "@/views/bigscreen/img/left_box1_center.png";
import bottom from "@/views/bigscreen/img/left_box1_bottom.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  /** 标题 */
  title: string;
  /** 图标base64 */
  icon: string;
  /** 目标额 */
  target: number;
  /** 实际完成额 */
  fulfilled: number;
  /** 同比 */
  yoy: number;
  /** 本月累计 */
  monthTotal: number;
  /** 单位 */
  unit?: string;
}>();

const router = useRouter();

const graphRef = ref<HTMLElement>();
const chartRef = shallowRef<echarts.ECharts>();

const formatNumber = (num: number | string): string => {
  if (Number(num) > 10000) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return num ? num.toString() : "-"; // 直接返回原始数字，不格式化
  }
};

const fulfilledPercent = computed(() => {
  if (
    props.target === 0 ||
    props.target === null ||
    props.target === undefined
  ) {
    return 0; // 如果目标额为0或者无效值，直接返回0%
  }
  const percent = (props.fulfilled / props.target) * 100;
  return isNaN(percent) ? 0 : Number(percent.toFixed(1)); // 确保不会返回 NaN
});

function handleClick(params: any) {
  const route = router.resolve({
    name: props.title === "累计营收" ? "RevenueAnalysis" : "ProfitAnalysis",
    query: {
      module: props.title,
    },
  });
  window.open(route.href, "_blank");
}

function initChart() {
  if (!chartRef.value) {
    chartRef.value = echarts.init(graphRef.value as HTMLDivElement);
    chartRef.value.getZr().on("click", handleClick);
  }
  chartRef.value.clear();
  const option = {
    series: [
      {
        type: "liquidFill",
        name: props.title,
        data: [
          {
            value: fulfilledPercent.value / 100,
            direction: "left",
            itemStyle: {
              color: "#6C683E",
            },
          },
          fulfilledPercent.value / 100,
        ],
        radius: "80%",
        outline: {
          show: false,
        },
        backgroundStyle: {
          color: "transparent",
          borderColor: "#156ACF",
          borderWidth: 1,
          shadowColor: "rgba(0, 0, 0, 0.4)",
          shadowBlur: 20,
        },
        color: [
          new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: "#EB8A00" },
            { offset: 0.8, color: "#D65305" },
          ]),
        ],
        label: {
          position: ["50%", "50%"],
          formatter: function () {
            return `${fulfilledPercent.value}%`;
          },
          fontSize: 16,
          color: sassvariables["bigscreen-primary-color-1"],
        },
        waveAnimation: fulfilledPercent.value > 0, // 只有在完成率大于0时启用水波动画
        animationEasingUpdate: "cubicOut", // 波动动画的缓动效果
        amplitude: fulfilledPercent.value > 0 ? 10 : 0, // 增加波动幅度，让水波效果更明显
        phase: fulfilledPercent.value > 0 ? 1 : 0, // 设置波浪初始偏移，实现水波从左向右滚动的效果
      },
    ],
  };
  chartRef.value.setOption(option);
}

// 监听fulfilledPercent的变化
watch(fulfilledPercent, (newValue) => {
  initChart(); // 当完成率变化时，重新初始化图表
});

onMounted(() => {
  initChart();
  // 监听窗口变化，重置图表
  window.addEventListener("resize", () => {
    try {
      chartRef.value?.resize();
    } catch (e) {
      console.log(e);
    }
  });
});
</script>

<style lang="scss" scoped>
$number-color-1: #fffe95;

.box {
  @apply flex flex-col justify-center items-center w-full h-full;
  box-sizing: border-box;
  // background-color: rgba(0, 0, 0, 0.5);
  // border-radius: 10px;
  color: white;
  font-size: 20px;
  .__header {
    @apply flex items-center w-full;
    padding: 5px;
    background-image: url("@/views/bigscreen/img/left_box1_top.png");
    background-size: 100% 100%;
    .__titleIcon {
      width: 20px;
      height: 20px;
      background-color: red;
      border-radius: 50%;
    }
    .__title {
      @apply ml-2 flex-1;
    }
  }
  .__content {
    @apply flex flex-1 justify-center items-center w-full;
    background-image: url("@/views/bigscreen/img/left_box1_center.png");
    background-size: 100% 100%;
    .__left {
      text-align: center;
      .text1 {
        margin-bottom: 10px;
      }
      .monthly-total {
        @apply flex items-center;
        margin-top: 5px;
        font-size: 1em;
        .scale {
          margin-right: 5px;
          font-size: 0.9em;
          &::after {
            // 下划线
            content: "";
            display: block;
            width: 100%;
            height: 2px;
            background-color: #ffffff;
          }
        }
        .__unit {
          font-size: 0.8em;
        }
      }
      .month-num {
        color: $number-color-1;
        font-size: 0.9em;
        font-weight: bold;
        /** 勾边 */
        margin: 0 5px;
      }
    }
    .__right {
      width: 40%;
      height: 150px;
      .text {
        text-align: center;
        font-size: 14px;
        color: #66a8cb;
        margin-top: -5px;
      }
    }
  }
  .__footer {
    height: 10px;
    width: 100%;
    background-image: url("@/views/bigscreen/img/left_box1_bottom.png");
    background-size: 100% 100%;
  }
}

.text1 {
  .__number {
    color: $number-color-1;
    font-size: 1.2em;
    font-weight: bold;
    /** 勾边 */
    margin: 0 5px;
  }
  .__unit {
    font-size: 0.8em;
  }
}

.text2 {
  @apply flex items-center;
  font-size: 0.8em;
  .__desc {
    @apply text-left;
    width: 3em;
    margin-right: 5px;
  }
  .__number {
    color: $bigscreen-primary-color-1;
    &.up {
      color: #f44a4d;
    }
    &.down {
      color: #33a062;
    }
  }
}
</style>
