<template>
  <div class="box">
    <div class="box__icon">
      <img :src="props.iconUrl" alt="" />
    </div>
    <div class="box__content">
      <div class="box__title">
        {{ props.title }}
      </div>
      <div class="box__amount">
        <el-statistic :value="animatedAmount" />
        <span class="__unit">{{ props.unit }}</span>
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
    unit?: string;
  }>(),
  {
    amountColor: "rgb(16,253,254)",
    titleColor: "white",
    title: "标题",
    amount: "0",
    iconWidth: 50,
    iconHeight: 50,
    height: 100,
    unit: "万吨",
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
$title-text-color-bright: #b6d7db;
$title-text-color: #9dc1d0;
$number-color: #2abfff;
.box {
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 10px;
  background-image: url("@/views/bigscreen/img/product_box.png");
  background-size: 100% 100%;
  .box__icon {
    width: 30px;
    height: 30px;
    text-align: right;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .box__content {
    margin-left: 10px;
    text-align: left;
    font-family:
      PingFangSC,
      Microsoft YaHei,
      Helvetica Neue,
      Arial,
      sans-serif !important;
    .box__title {
      font-size: 16px;
      color: $title-text-color-bright;
    }
    .box__amount {
      display: flex;
      align-items: baseline;
      font-size: 1rem;
      color: $number-color;
      .__unit {
        margin-left: 10px;
        color: $title-text-color;
        font-size: 0.8rem;
      }
    }
  }
}

::v-deep(.el-statistic__content) {
  all: unset;
}
</style>
