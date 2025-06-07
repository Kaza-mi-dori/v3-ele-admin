<template>
  <div class="metric-item">
    <div class="metric-item__title" :style="titleStyle">{{ title }}</div>
    <div class="metric-item__value" :style="valueStyle">
      {{ Number(value).toFixed(2) }}
      <span v-if="unit" class="metric-item__unit">{{ unit }}</span>
    </div>
    <img v-if="arrowLine" :src="ArrowLine" class="metric-item__arrow-line" />
  </div>
</template>

<script setup lang="ts">
import ArrowLine from "@/views/bigscreen/img/arrow_line.png";
const props = defineProps<{
  title: string;
  value: number | string;
  unit?: string;
  titleColor?: string;
  valueColor?: string;
  arrowLine?: boolean;
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
$value-color: #4d8be7;

.metric-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .metric-item__title {
    font-size: 1rem;
    color: $title-color;
  }
  .metric-item__value {
    font-size: 1.5rem;
    font-weight: bold;
    color: $value-color;
  }
  .metric-item__arrow-line {
    position: absolute;
    bottom: -0.8em;
    left: -2em;
    width: 110%;
    height: 100%;
  }
}
</style>
