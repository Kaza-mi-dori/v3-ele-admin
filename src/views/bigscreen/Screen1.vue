<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Model1 class="model1" title="企业宣传" />
      <div class="b-space" />
      <Model1 class="model1" title="合同执行情况" />
      <div class="b-space" />
      <Model1 class="model1" title="合同类型" />
      <div class="b-space" />
    </div>
    <div class="c-space" />
    <div class="b-middle" />
    <div class="c-space" />
    <div class="b-right">
      <Right1 />
      <div class="b-space" />
      <Right2 />
      <div class="b-space" />
      <Right3 />
      <div class="b-space" />
      <Right4 />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Model1 from "./components/Model1/index.vue";
import Right1 from "./components/FirstPage/Right/right1.vue";
import Right2 from "./components/FirstPage/Right/right2.vue";
import Right3 from "./components/FirstPage/Right/right3.vue";
import Right4 from "./components/FirstPage/Right/right4.vue";
</script>

<style lang="scss" scoped>
.bg-view-body {
  flex: 1;
  display: flex;
  width: 100%;
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
    position: relative;
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
  width: 10px;
  height: 0;
}
.model1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
