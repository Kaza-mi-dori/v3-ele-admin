<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left" style="z-index: 1">
      <Left1 />
      <div class="b-space" />
      <!-- <Left2 class="left2" title="合同总数与金额" /> -->
      <Left2 class="left4" />
      <div class="b-space" />
      <Left3 class="left3" />
      <div class="b-space" />
      <!-- <Left4 /> -->
      <Left5 />
    </div>
    <div class="c-space" />
    <div class="b-middle">
      <!-- <div class="middle-item">
        <Model2 class="middle1" :totalData="totalData" />
      </div>
      <div class="b-space" /> -->
      <div class="middle-item flex-grow">
        <Middle2 class="middle2" @changeMonitor="onChangeMonitor" />
      </div>
      <div class="b-space" />
      <div class="middle-item" style="margin-bottom: 10px">
        <Middle3 />
      </div>
      <div class="b-space" />
      <div class="middle-item">
        <Middle4 />
      </div>
    </div>
    <div class="c-space" />
    <div class="b-right" style="z-index: 1">
      <Right1 />
      <div class="b-space" />
      <Right2 style="flex: 0.6" />
      <div class="b-space" />
      <right3New style="flex: 0.8" />
      <div class="b-space" />
      <Right4 style="flex: 0.6" :monitorAreaProp="currentMonitor" />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Left1 from "./components/FirstPage/Left/left1.vue";
import Left2 from "./components/FirstPage/Left/left2_new.vue";
import Left4 from "./components/FirstPage/Left/left4.vue";
import Left3 from "./components/FirstPage/Left/left3_new.vue";
import Left5 from "./components/FirstPage/Left/left5.vue";
import Model2 from "./components/FirstPage/Model2/index.vue";
import Middle2 from "./components/FirstPage/Middle/Middle2/index.vue";
import Middle3 from "./components/FirstPage/Middle/Middle3/index.vue";
import Right1 from "./components/FirstPage/Right/right1.vue";
import Right2 from "./components/FirstPage/Right/right2.vue";
import right3New from "./components/FirstPage/Right/right3-new.vue";
import Right4 from "./components/FirstPage/Right/right4.vue";
import Middle4 from "../bigscreen/components/FirstPage/Middle/Middle4/index.vue";
import Map from "./components/FirstPage/Map/index.vue";
import { provide } from "vue";

const currentMonitor = ref<any>();

const onChangeMonitor = (geometry: any) => {
  console.log("handleClickGeo", geometry);
};

provide("currentMonitor", currentMonitor);

// 加载腾讯地图api
const initTMapApi = () => {
  const script = document.createElement("script");
  script.src =
    "https://map.qq.com/api/js?v=2.exp&key=4TYBZ-V2WCQ-IKX52-BEW3F-SDCA6-7DFMN";
  script.onload = () => {
    console.log("腾讯地图api加载完成");
  };
  script.async = true;
  document.body.appendChild(script);
};

// onBeforeMount(() => {
//   initTMapApi();
// });
</script>

<style lang="scss" scoped>
.bg-view-body {
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
  // height如果设为100%会导致左右定高，不设则会根据内容撑开
  // 定高可以自适应一屏，但是会使得中间地图无法保持比例，进而导致相对坐标不准确
  height: 100%;
  // padding-bottom: 20px;
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
      // flex: 1;
      align-items: center;
      justify-content: center;
    }
    .flex-grow {
      flex: 3;
    }
  }
  .b-right {
    flex: 1;
  }
}
.b-space {
  width: 0;
  height: 10px;
}
.c-space {
  width: 25px;
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
.left2 {
  flex: 0.75;
}
.left3 {
  flex: 0.4;
}
.left4 {
  flex: 0.6;
}
</style>
