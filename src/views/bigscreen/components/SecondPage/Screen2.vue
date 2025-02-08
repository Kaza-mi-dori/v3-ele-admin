<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Left1 />
      <div class="b-space" />
      <Left2 />
    </div>
    <div class="c-space" />
    <div class="b-middle">
      <div class="middle-item">
        <Model2 class="middle1" :totalData="totalData" />
      </div>
      <div class="b-space" />
      <div class="middle-item flex-grow">
        <Middle2 class="middle2" :showTotalNum="false" />
      </div>
      <div class="b-space" />
      <div class="middle-item flex-grow2">
        <Middle3 />
      </div>
    </div>
    <div class="c-space" />
    <div class="b-right">
      <Right1 />
      <div class="b-space" />
      <Right2 />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Left1 from "./Left/left21.vue";
import Left2 from "./Left/left22.vue";
import Model2 from "../FirstPage/Model2/index.vue";
import Middle2 from "../FirstPage/Middle/Middle2/index.vue";
import Middle3 from "./Middle/middle23.vue";
import Right1 from "./Right/right21.vue";
import Right2 from "./Right/right22.vue";

import { ref } from "vue";

const totalData = ref([
  {
    year: "25438",
    month: "25438",
  },
  {
    year: "25438",
    month: "25438",
  },
  {
    year: "25438",
    month: "25438",
  },
  {
    year: "25438",
    month: "25438",
  },
]);
</script>

<style lang="scss" scoped>
.bg-view-body {
  // height如果设为100%会导致左右定高，不设则会根据内容撑开
  // 定高可以自适应一屏，但是会使得中间地图无法保持比例，进而导致相对坐标不准确
  @apply flex flex-1 w-full h-full;
  .b-left,
  .b-middle,
  .b-right {
    @apply flex flex-col;
  }
  .b-left {
    @apply flex-1;
  }
  .b-middle {
    flex: 1.4;
    @apply flex flex-col justify-between relative;
    .middle-item {
      @apply flex flex-1 items-center justify-center;
    }
    .flex-grow {
      flex: 5;
    }
    .flex-grow2 {
      flex: 2.5;
    }
  }
  .b-right {
    @apply flex-1;
  }
}
.b-space {
  height: 20px;
  @apply w-0;
}
.c-space {
  width: 30px;
  @apply h-0;
}
.bg-view-body > .c-space:first-child {
  width: 15px;
}
.bg-view-body > .c-space:last-child {
  width: 15px;
}
.model1 {
  @apply flex flex-1 flex-col h-full;
}
</style>
