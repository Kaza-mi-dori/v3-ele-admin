<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <div class="b-space" />
      <Model1 class="model1" title="企业宣传"></Model1>
      <div class="b-space" />
      <Model2 class="model2" title="合同总数与金额"></Model2>
      <div class="b-space" />
      <Model1 class="model1" title="合同执行情况"></Model1>
      <div class="b-space" />
      <Model1 class="model1" title="合同类型"></Model1>
      <div class="b-space" />
    </div>
    <div class="c-space" />
    <div class="b-middle"></div>
    <div class="c-space" />
    <div class="b-right"></div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Model1 from "./components/Model1/index.vue";
import Model2 from "./components/Model2/index.vue";
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
.model2 {
  flex: 0.5;
}
</style>
