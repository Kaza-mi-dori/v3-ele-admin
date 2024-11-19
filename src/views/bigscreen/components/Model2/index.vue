<template>
  <div class="middle1-box">
    <img class="middle1-bg" src="../../img/tag2.png" alt="" />
    <div class="content-wrapper">
      <div class="content-box" v-for="(item, index) in totalData" :key="index">
        <div class="content-item">
          <div class="title-box">
            <img class="title-icon" :src="titleArr[index].icon" />
            <div>{{ titleArr[index].title }}</div>
          </div>
          <div class="annual-total">
            <div>年度累计</div>
            <div class="year-num">{{ formatNumber(item.year) }}</div>
            <div>万元</div>
          </div>
          <div class="monthly-total">
            <div>本月累计</div>
            <div class="month-num">{{ formatNumber(item.month) }}</div>
            <div>万元</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import buyIcon from "../../img/buy.png";
import sellIcon from "../../img/sell.png";
import incomeIcon from "../../img/income.png";

import { ref, defineProps } from "vue";

// 接收父组件传入的数据
defineProps({
  totalData: {
    type: Array,
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
  position: relative; /* 确保父元素的布局设置好 */
  width: 100%; /* 父元素宽度占满父容器 */
  height: 100%; /* 父元素高度占满父容器 */
  .middle1-bg {
    position: absolute; /* 使图像脱离文档流 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 使图像覆盖整个父容器，并保持比例 */
  }
  .content-wrapper {
    display: flex;
    height: 100%;
    justify-content: center; /* 平均分配每个div之间的空间 */
    align-items: center;
    padding: 0 10px;
  }
  .content-box {
    flex: 1;
    z-index: 1; /* 确保文字在背景图片上方 */
    color: #fdfdfc;
    font-size: 14px;
  }
  .title-box,
  .annual-total,
  .monthly-total {
    display: flex;
  }
  .annual-total {
    margin-top: 5px;
  }
  .monthly-total {
    margin-top: 3px;
  }
  .title-box {
    display: flex;
    align-items: center;
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
