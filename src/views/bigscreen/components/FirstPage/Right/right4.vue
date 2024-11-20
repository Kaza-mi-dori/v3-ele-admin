<template>
  <Model1 class="model1" title="监控视频">
    <div class="box1">
      <div v-for="k in 4" :key="k" class="item-box" />
    </div>
  </Model1>
</template>

<script setup lang="ts">
import Item1 from "../DescribeItems/Item1.vue";
import inventory from "@/views/bigscreen/img/inventory.png";
import business from "@/views/bigscreen/img/business.png";
import { ref } from "vue";

const oilStorage = ref<string>("254,38");
const oilBargain = ref<string>("254,38");
</script>

<style lang="scss" scoped>
.box1 {
  // 四宫格布局
  @apply flex items-center w-full flex-wrap;
  .item-box {
    width: 220px;
    height: 80px;
  }
}

.model1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
