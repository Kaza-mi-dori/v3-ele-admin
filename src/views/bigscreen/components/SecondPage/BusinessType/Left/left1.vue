<template>
  <Model1 class="model1" title="仓储动向">
    <div class="model-body">
      <div class="model-body__content">
        <div
          v-for="(item, index) in contractData"
          :key="index"
          class="item-box"
        >
          <img :src="backgroundImages[index]" alt="" />
          <div class="body-content">
            <div>{{ item.label }}</div>
            <div class="content-value">
              <div class="content-num" :style="{ color: numColors[index] }">
                <el-statistic :value="outputValues[index]" />
              </div>
              <div class="content-unit">{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/SecondPage/Model1/index.vue";
import yellowBg from "@/views/bigscreen/img/yellow2_bg.png";
import blueBg from "@/views/bigscreen/img/blue2_bg.png";
import greenBg from "@/views/bigscreen/img/green2_bg.png";
import redBg from "@/views/bigscreen/img/red2_bg.png";
import { ref } from "vue";
import { useTransition } from "@vueuse/core";

// 定义背景图片数组
const backgroundImages = [yellowBg, blueBg, greenBg, redBg];
const numColors = ["#fed971", "#4fdefe", "#4df0b8", "#fe8787"];

// 定义营收数据
const contractData = ref([
  {
    label: "今日出库量",
    value: "30",
    unit: "万吨",
  },
  {
    label: "总库存量",
    value: "156",
    unit: "万吨",
  },
  {
    label: "库存周转率",
    value: "5.6",
    unit: "次/年",
  },
]);

const outputValues = ref([]);

contractData.value.forEach((item) => {
  const source = ref(0); // 初始值为 0
  const decimalPlaces = item.value.toString().includes(".")
    ? item.value.toString().split(".")[1].length
    : 0; // 获取小数位数

  const output = useTransition(source, {
    duration: 2000, // 动画持续时间
  });

  // 使用 Intl.NumberFormat 添加分隔符，并保持小数位数
  const formattedOutput = computed(() => {
    const numberFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
    return numberFormatter.format(output.value);
  });

  source.value = Number(item.value); // 设置目标值
  outputValues.value.push(formattedOutput); // 存储格式化后的值
});
</script>

<style lang="scss" scoped>
.model1 {
  @apply flex flex-1 flex-col h-full;
}
.model-body {
  flex: 1;
  position: relative;
  .model-body__bg {
    height: 100%;
    margin: 10px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .model-body__content {
    // 四宫格布局
    @apply flex items-center w-full flex-wrap pl-4 pr-4 pt-4;
    .item-box {
      position: relative; // 文字定位在图片上
      width: calc(33% - 25px);
      margin: 10px;
      height: 85px;
    }
    .item-box:nth-child(2n-1) {
      margin-right: 15px;
    }
    img {
      width: 120%;
      height: 100%;
      object-fit: cover; // 确保图片比例适用容器
    }
    .body-content {
      position: absolute; // 使文字定位
      top: 50%; // 调整文字位置
      left: 15px; // 适当调整文字位置
      transform: translateY(-50%); // 垂直居中
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      text-align: left;
      font-size: 19px;
      padding-left: 15px;
      padding-top: 10px;
      padding-bottom: 10px;
      color: #ffffff;
    }
    .content-value {
      display: flex;
      align-items: center;
      justify-content: center;
      .content-num {
        font-size: 21px;
        font-weight: bold;
      }
      .content-unit {
        margin-left: 5px;
        font-size: 16px;
      }
    }
  }
}
::v-deep(.el-statistic__content) {
  all: unset;
}
</style>
