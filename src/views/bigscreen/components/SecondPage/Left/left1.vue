<template>
  <Model1 class="model1" title="合同总数与金额">
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
import Model1 from "../Model1/index.vue";
import yellowBg from "@/views/bigscreen/img/yellow2_bg.png";
import blueBg from "@/views/bigscreen/img/blue2_bg.png";
import greenBg from "@/views/bigscreen/img/green2_bg.png";
import redBg from "@/views/bigscreen/img/red2_bg.png";
import { ref } from "vue";
import { useTransition } from "@vueuse/core";

// 定义背景图片数组
const backgroundImages = [yellowBg, blueBg, greenBg, redBg];
const numColors = ["#fed971", "#4fdefe", "#4df0b8", "#fe8787"];

const props = defineProps<{
  outContractData?: {
    label: string;
    value: string;
    unit: string;
  }[];
}>();

// 定义合同数据
const contractData = ref([
  {
    label: "合同总金额",
    value: "355480",
    unit: "万元",
  },
  {
    label: "合同总数",
    value: "3556",
    unit: "份",
  },
  {
    label: "采购合同",
    value: "55480",
    unit: "份",
  },
  {
    label: "销售合同",
    value: "556",
    unit: "份",
  },
]);

const outputValues = ref([]);

onMounted(() => {
  if (props.outContractData) {
    console.log("props.outContractData", props.outContractData);
    contractData.value = [
      {
        label: "合同总金额",
        value: props.outContractData[0].value,
        unit: props.outContractData[0].unit,
      },
      {
        label: "合同总数",
        value: props.outContractData[1].value,
        unit: props.outContractData[1].unit,
      },
      {
        label: "采购合同数",
        value: props.outContractData[2].value,
        unit: props.outContractData[2].unit,
      },
      {
        label: "销售合同数",
        value: props.outContractData[3].value,
        unit: props.outContractData[3].unit,
      },
    ];
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
  }
});
</script>

<style lang="scss" scoped>
.model1 {
  @apply flex flex-1 flex-col h-full;
}
.model-body {
  @apply flex-1 relative;
  .model-body__bg {
    @apply absolute h-full;
    margin: 10px;
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
      width: calc(50% - 25px);
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
      @apply flex flex-col justify-center items-start absolute text-left;
      top: 50%; // 调整文字位置
      left: 15px; // 适当调整文字位置
      transform: translateY(-50%); // 垂直居中
      font-size: 19px;
      padding-left: 15px;
      padding-top: 10px;
      padding-bottom: 10px;
      color: #ffffff;
    }
    .content-value {
      @apply flex justify-center items-center;
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
