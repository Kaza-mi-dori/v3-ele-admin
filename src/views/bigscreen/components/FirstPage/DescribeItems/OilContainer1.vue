<template>
  <div class="oil-container-1">
    <div class="left">
      <div class="name">{{ props.name }}</div>
    </div>
    <div class="right">
      <div class="label">{{ props.value }}</div>
      <div class="remain-bar-container">
        <span class="remain-bar-label">{{ props.percent }}%</span>
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
    padding-bottom: 10px;
    .label {
      @apply text-sm text-yellow-500;
      // 文字方向纵向
    }
    .remain-bar-container {
      @apply w-full h-50px bg-gray-200 relative;
      .remain-bar {
        @apply w-full h-50px bg-gray-200;
      }
      .remain-bar-label {
        @apply absolute top-[1/2] left-0 text-sm text-white;
      }
    }
  }
}
</style>
