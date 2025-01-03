<template>
  <el-popover placement="top" trigger="hover">
    <template #default>
      <div class="desc-button-content">
        <div class="desc-button-content-title">{{ title }}</div>
      </div>
    </template>
    <template #reference>
      <el-button v-bind="attrs">{{ title }}</el-button>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";
const props = defineProps<{
  title: string;
  desc: string;
}>();

const attrs = useAttrs();
</script>

<style lang="scss" scoped>
.desc-button-content {
  text-align: center;
}
</style>
