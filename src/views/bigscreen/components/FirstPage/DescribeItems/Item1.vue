<template>
  <div class="box">
    <div class="box__icon">
      <img :src="props.iconUrl" alt="" />
    </div>
    <div class="box__content">
      <div class="box__title" :style="{ color: props.titleColor }">
        {{ props.title }}
      </div>
      <div class="box__amount" :style="{ color: props.amountColor }">
        <el-statistic :value="animatedAmount" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults, defineProps } from "vue";
import { useTransition } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    title?: string;
    amount?: string;
    iconUrl?: string;
    amountColor?: string;
    titleColor?: string;
    iconWidth?: number;
    iconHeight?: number;
    height?: number;
  }>(),
  {
    amountColor: "rgb(16,253,254)",
    titleColor: "white",
    title: "标题",
    amount: "0",
    iconWidth: 50,
    iconHeight: 50,
    height: 100,
  }
);

const source = ref(0);
const animatedAmount = useTransition(source, {
  duration: 1500,
});

watch(
  () => props.amount,
  (val) => {
    // 将字符串转换为数字
    source.value = parseInt(val, 10);
    // 确保转换后的值不会是 NaN
    if (isNaN(source.value)) {
      source.value = 0;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.box {
  @apply flex justify-between items-center p-5;
  .box__icon {
    width: 50px;
    height: 50px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .box__content {
    margin-left: 20px;
    font-family:
      PingFangSC,
      Microsoft YaHei,
      Helvetica Neue,
      Arial,
      sans-serif !important;
    .box__title {
      font-size: 16px;
      color: #333;
    }
    .box__amount {
      font-size: 16px;
      color: #333;
    }
  }
}

::v-deep(.el-statistic__content) {
  all: unset;
}
</style>
