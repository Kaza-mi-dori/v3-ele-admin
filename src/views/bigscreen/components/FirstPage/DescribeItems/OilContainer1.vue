<template>
  <div class="oil-container-1">
    <div class="left">
      <div class="name">{{ props.name }}</div>
    </div>
    <div class="right">
      <div class="label">{{ props.value }}</div>
      <div class="remain-bar-container">
        <div class="remain-bar-label">{{ props.percent }}%</div>
        <div class="remain-bar" :style="{ height: `${props.percent}%` }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

/**
 * props包括:
 * 1.是否在顶部显示具体指标
 * 2.百分比值
 * 3.指标值
 * 4.名称
 */

const props = defineProps<{
  isShowTitle: boolean;
  percent: number;
  value: number;
  name: string;
  unit: string;
}>();
</script>

<style scoped lang="scss">
.oil-container-1 {
  @apply flex items-center justify-center w-full flex-gap-1;
  .left {
    .name {
      @apply text-sm text-white;
      // 文字方向纵向
      writing-mode: vertical-rl;
    }
  }
  .right {
    @apply text-center;
    padding-bottom: 10px;
    .label {
      @apply text-sm text-yellow-500;
      // 文字方向纵向
    }
    .remain-bar-container {
      @apply w-55px h-55px bg-gray-200 relative text-center;
      .remain-bar {
        @apply w-full bg-red-400 absolute bottom-0 left-0;
        height: 0;
        transition: height 1s linear;
      }
      .remain-bar-label {
        @apply absolute flex items-center justify-center h-full w-full text-sm text-black font-bold z-1;
      }
    }
  }
}
</style>
