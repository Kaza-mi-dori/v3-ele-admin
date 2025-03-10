<template>
  <el-tabs v-bind="attrs" v-model="activeTab">
    <el-tab-pane
      v-for="item in items"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    />
  </el-tabs>
</template>

<script setup lang="ts">
import { defineProps, useAttrs, defineEmits, ref, computed } from "vue";

const attrs = useAttrs();
const emit = defineEmits(["update:modelValue"]);

const activeTab = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  separator: {
    type: String,
    default: "/",
  },
  items: {
    type: Array as PropType<{ label: string; name: string }[]>,
    default: () => [
      {
        label: "全年",
        name: "year",
      },
      {
        label: "单月",
        name: "month",
      },
    ],
  },
});
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
    @apply text-center text-gray-400 py-0 px-2;
    @apply h-10 after:content-['/'] after:ml-4 after:text-white last:after:content-none;
    // padding: 0 20px !important;
    font-size: 1.1rem;
    // border: 1px solid $bigscreen-primary-color-1 !important;
    &.is-active {
      @apply text-lg;
      color: white;
      // &::after {
      //   content: "";
      //   display: block;
      //   height: 3px;
      //   color: $bigscreen-primary-color-1 !important;
      //   background-color: $bigscreen-primary-color-1;
      //   width: calc(100% - 16px);
      //   transition: transform 0.3s;
      //   @apply bottom-0 left-2 right-0 absolute;
      // }
    }
    &:hover {
      color: white !important;
    }
  }
  :deep(.el-tabs__active-bar) {
    display: none;
    background-color: white !important;
  }
}
</style>
