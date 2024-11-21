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
    justify-content: center;
    margin-bottom: 5px;
  }
  :deep(.el-tabs__nav-wrap) {
    flex: none;
    &::after {
      display: none;
    }
  }
  :deep(.el-tabs__item) {
    padding: 0 20px !important;
    text-align: center;
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
        position: absolute;
        bottom: 0;
        left: 8px;
        right: 0;
        width: calc(100% - 16px);
        transition: transform 0.3s;
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
