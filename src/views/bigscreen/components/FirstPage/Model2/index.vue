<template>
  <div class="middle1-box">
    <img class="middle1-bg" src="../../../img/tag2.png" alt="" />
    <div class="content-wrapper">
      <div v-for="(item, index) in totalData" :key="index" class="content-box">
        <div class="content-item">
          <div class="title-box">
            <img class="title-icon" :src="titleArr[index].icon" />
            <div>{{ titleArr[index].title }}</div>
          </div>
          <div class="annual-total">
            <div class="scale">年度累计</div>
            <div class="year-num">{{ formatNumber(item.year) }}</div>
            <div>{{ item.yearUnit || "万元" }}</div>
          </div>
          <div class="monthly-total">
            <div class="scale">本月累计</div>
            <div class="month-num">{{ formatNumber(item.month) }}</div>
            <div>{{ item.monthUnit || "万元" }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import buyIcon from "../../../img/buy.png";
import sellIcon from "../../../img/sell.png";
import incomeIcon from "../../../img/income.png";

import { ref, defineProps } from "vue";

// 接收父组件传入的数据
const props = defineProps({
  totalData: {
    type: Array<any>,
    required: true,
    default: () => [],
  },
});

const titleArr = ref([
  {
    title: "累计采购",
    icon: buyIcon,
  },
  {
    title: "累计销售",
    icon: sellIcon,
  },
  {
    title: "累计营收",
    icon: incomeIcon,
  },
  {
    title: "累计利润",
    icon: incomeIcon,
  },
]);

const formatNumber = (num: number | string): string => {
  if (Number(num) > 10000) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return num.toString(); // 直接返回原始数字，不格式化
  }
};
</script>

<style lang="scss" scoped>
.middle1-box {
  @apply relative w-full h-full;
  .middle1-bg {
    @apply absolute w-full h-full top-0 left-0;
    object-fit: cover; /* 使图像覆盖整个父容器，并保持比例 */
  }
  .content-wrapper {
    @apply flex justify-center items-center h-full;
    padding: 0 10px;
  }
  .content-box {
    @apply flex-1 z-1;
    color: #ffffff;
    font-size: 14px;
  }
  .title-box,
  .annual-total,
  .monthly-total {
    @apply flex;
  }
  .annual-total {
    margin-top: 5px;
  }
  .monthly-total {
    margin-top: 3px;
  }
  .title-box {
    @apply flex items-center;
    font-size: 16px;
  }
  .title-icon {
    width: 17px;
    height: 17px;
    margin-right: 5px;
    display: block;
  }
  .year-num,
  .month-num {
    margin: 0 5px;
  }
  .year-num {
    color: #12f5fb;
  }
  .month-num {
    color: #d6e337;
  }
}
</style>
