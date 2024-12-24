<template>
  <div class="box">
    <img class="item3-bg" :src="props.bgImg" />
    <div class="content-item">
      <div class="title-box">
        <img class="title-icon" src="../../../img/left_icon3.png" height="18" />
        <div>{{ props.title }}</div>
      </div>
      <div class="annual-total">
        <div>年度累计</div>
        <div class="year-num">{{ formatNumber(props.yearTotal) }}</div>
        <div>{{ props.yearUnit || "万元" }}</div>
      </div>
      <div class="monthly-total">
        <div>本月累计</div>
        <div class="month-num">{{ formatNumber(props.monthTotal) }}</div>
        <div>{{ props.monthUnit || "万元" }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  /** 标题 */
  title: string;
  /** 背景图base64 */
  bgImg: string;
  /** 年度累计 */
  yearTotal: number;
  /** 本月累计 */
  monthTotal: number;
  /** 本月累计单位 */
  /** 年度累计单位 */
  yearUnit: string;
  monthUnit: string;
}>();

const formatNumber = (num: number | string): string => {
  if (Number(num) > 10000) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return num.toString(); // 直接返回原始数字，不格式化
  }
};
</script>

<style lang="scss" scoped>
.box {
  position: relative; /* 确保父元素的布局设置好 */
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  color: white;
  font-size: 20px;
  padding: 15px 10px;

  .item3-bg {
    position: absolute; /* 使图像脱离文档流 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 使图像覆盖整个父容器，并保持比例 */
  }
  .content-item {
    flex: 1;
    z-index: 1; /* 确保文字在背景图片上方 */
    font-size: 16px;
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
    font-size: 18px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
  }
  .title-icon {
    width: 17px;
    height: 17px;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
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
