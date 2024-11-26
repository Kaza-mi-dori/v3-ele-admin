<template>
  <Model1 class="model1" title="油品经营分析">
    <div
      id="chart2-middle-3"
      style="height: 180px; width: 100%; margin-top: -10px"
    />
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
</script>

<style lang="scss" scoped>
.model1 {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}
</style>
