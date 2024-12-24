<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Left1 />
      <div class="b-space" />
      <Left2 />
      <div class="b-space" />
      <Left3 />
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
      <div class="b-space" />
      <Right3 />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Left1 from "./LeftSubject/left1.vue";
import Left2 from "./LeftSubject/left2.vue";
import Left3 from "./LeftSubject/left3.vue";
import Model2 from "../FirstPage/Model2/index.vue";
import Middle2 from "../FirstPage/Middle/Middle2/index.vue";
import Middle3 from "./Middle/middle3.vue";
import Right1 from "./Right/right1.vue";
import Right2 from "./Right/right2.vue";
import Right3 from "./Right/right3.vue";

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
  flex: 1;
  display: flex;
  width: 100%;
  // height如果设为100%会导致左右定高，不设则会根据内容撑开
  // 定高可以自适应一屏，但是会使得中间地图无法保持比例，进而导致相对坐标不准确
  height: 100%;
  .b-left,
  .b-middle,
  .b-right {
    display: flex;
    flex-direction: column;
  }
  .b-left {
    flex: 1;
  }
  .b-middle {
    flex: 1.4;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    .middle-item {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
    .flex-grow {
      flex: 5;
    }
    .flex-grow2 {
      flex: 2.5;
    }
  }
  .b-right {
    flex: 1;
  }
}
.b-space {
  width: 0;
  height: 20px;
}
.c-space {
  width: 30px;
  height: 0;
}
.bg-view-body > .c-space:first-child {
  width: 15px;
}
.bg-view-body > .c-space:last-child {
  width: 15px;
}
.model1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
