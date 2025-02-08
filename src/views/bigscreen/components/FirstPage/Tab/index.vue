<template>
  <el-tabs v-bind="attrs">
    <slot />
  </el-tabs>
</template>

<script setup lang="ts">
import { defineProps, useAttrs } from "vue";

const attrs = useAttrs();
</script>

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__header) {
    @apply justify-center;
    margin-bottom: 5px;
  }
  :deep(.el-tabs__nav-wrap) {
    flex: none;
    &::after {
      @apply hidden;
    }
  }
  :deep(.el-tabs__item) {
    @apply text-center;
    padding: 0 20px !important;
    color: white;
    font-size: 1.1em;
    // border: 1px solid $bigscreen-primary-color-1 !important;
    &.is-active {
      color: $bigscreen-primary-color-1 !important;
      &::after {
        content: "";
        display: block;
        height: 3px;
        color: $bigscreen-primary-color-1 !important;
        background-color: $bigscreen-primary-color-1;
        width: calc(100% - 16px);
        transition: transform 0.3s;
        @apply bottom-0 left-2 right-0 absolute;
      }
    }
    &:hover {
      color: $bigscreen-primary-color-1 !important;
    }
  }
  :deep(.el-tabs__active-bar) {
    background-color: $bigscreen-primary-color-1 !important;
  }
}
</style>
