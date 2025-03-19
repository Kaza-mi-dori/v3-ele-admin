<template>
  <div class="process-ring-container">
    <img
      :src="finishRing"
      width="200"
      height="200"
      class="process-ring__ring"
    />
    <div class="process-ring__value">{{ value }}{{ unit || "" }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import finishRing from "@/views/bigscreen/img/finish.png";
const props = defineProps<{
  value: number | string;
  unit?: string;
}>();
</script>

<style lang="scss" scoped>
.process-ring-container {
  position: relative;
  .process-ring__ring {
    width: 220px;
    height: 220px;
  }
  .process-ring__value {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -25%);
    font-size: 1.1rem;
    font-weight: bold;
    color: $bigscreen-primary-color-1;
    // 动画
    animation: brightness 2.5s infinite;
    @keyframes brightness {
      0% {
        filter: brightness(0.75);
      }
      50% {
        filter: brightness(1.5);
      }
      100% {
        filter: brightness(0.75);
      }
    }
  }
}
</style>
