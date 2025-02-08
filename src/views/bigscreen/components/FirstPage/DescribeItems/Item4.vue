<template>
  <div class="box">
    <img class="item3-bg" :src="props.bgImg" />
    <div class="content-item">
      <div class="title-box">
        <img class="title-icon" src="../../../img/left_icon3.png" height="20" />
        <div>{{ props.title }}</div>
      </div>
      <div class="annual-total">
        <div class="scale">年</div>
        <div class="year-num">{{ formatNumber(props.yearTotal) }}</div>
        <div>{{ props.yearUnit || "万元" }}</div>
      </div>
      <div class="monthly-total">
        <div class="scale">月</div>
        <div class="month-num">{{ formatNumber(props.monthTotal) }}</div>
        <div>{{ props.monthUnit || "万元" }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
$bg-color-1: #ffffff;
.box {
  @apply justify-center items-center w-full h-full relative box-border;
  color: white;
  font-size: 20px;
  padding: 15px 10px;

  .item3-bg {
    /* 使图像覆盖整个父容器，并保持比例 */
    @apply w-full h-full absolute top-0 left-0 object-cover;
  }
  .content-item {
    @apply flex-1 z-1;
    font-size: 16px;
  }
  .title-box,
  .annual-total,
  .monthly-total {
    @apply flex;
  }
  .annual-total {
    margin-top: 5px;
    .scale {
      margin-right: 5px;
      &::after {
        // 下划线
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background-color: $bg-color-1;
      }
    }
  }
  .monthly-total {
    margin-top: 3px;
    .scale {
      margin-right: 5px;
      &::after {
        @apply w-full;
        // 下划线
        content: "";
        display: block;
        height: 1px;
        background-color: $bg-color-1;
      }
    }
  }
  .title-box {
    @apply flex items-center;
    font-size: 20px;
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
    // 边界闪光效果动画
    animation: shine 2s infinite;
    @keyframes shine {
      0% {
        filter: brightness(1);
      }
      50% {
        filter: brightness(1.5);
      }
      100% {
        filter: brightness(1);
      }
    }
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
