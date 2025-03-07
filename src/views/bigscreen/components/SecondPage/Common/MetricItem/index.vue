<template>
  <div class="metric-item">
    <div class="metric-item__title" :style="titleStyle">{{ title }}</div>
    <div class="metric-item__value" :style="valueStyle">
      {{ value }}
      <span v-if="unit" class="metric-item__unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: number | string;
  unit?: string;
  titleColor?: string;
  valueColor?: string;
}>();

const titleStyle = computed(() => {
  return {
    color: props.titleColor,
  };
});

const valueStyle = computed(() => {
  return {
    color: props.valueColor,
  };
});
</script>

<style lang="scss" scoped>
$title-color: #fff;
$value-color: #2660b8;

.metric-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .metric-item__title {
    font-size: 16px;
    color: $title-color;
  }
  .metric-item__value {
    font-size: 24px;
    font-weight: bold;
    color: $value-color;
  }
}
</style>
