<template>
  <div class="container">
    <div class="bar-block">
      <div
        v-for="(item, index) in barArr"
        :key="index"
        class="__bar"
        :style="{
          width: item.percent + '%',
          backgroundColor: item.color,
        }"
      />
    </div>
    <div class="desc-block">
      <span v-for="item in textArr" :key="item" class="__text">{{ item }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import variables from "@/styles/variables.module.scss";

const props = defineProps<{
  data: {
    category: string;
    total: number;
    finished: number;
  };
}>();

interface barItem {
  percent: number;
  color: string;
}

const barArr = ref<barItem[]>([]);
const textArr = ref<string[]>([]);

watch(
  () => props.data,
  (newVal) => {
    console.log(newVal);
    const { total, finished } = newVal;
    barArr.value = [
      {
        percent: (finished / total) * 100,
        color: variables["bigscreen-primary-color-1"],
      },
      {
        percent: ((total - finished) / total) * 100,
        color: variables["bigscreen-primary-color-2"],
      },
    ];
    textArr.value = [
      props.data.category + ": 已履行" + finished,
      total - finished + "未履行",
    ];
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.container {
  @apply w-50% p-4;
  .bar-block {
    @apply flex;
    .__bar {
      @apply h-2 mb-3px;
      &:not(:last-child) {
        margin-right: 5px;
      }
      border-radius: 5px;
    }
  }
  .desc-block {
    @apply flex justify-between;
    .__text {
      @apply text-sm;
      color: #7194db;
      &:first-child {
        font-weight: bold;
      }
    }
  }
}
</style>
