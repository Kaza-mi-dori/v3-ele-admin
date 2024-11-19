<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <div class="b-space" />
      <Model1 class="model1" title="企业宣传"></Model1>
      <div class="b-space" />
      <Left2 class="left2" title="合同总数与金额"></Left2>
      <div class="b-space" />
      <Model1 class="model1" title="合同执行情况"></Model1>
      <div class="b-space" />
      <Model1 class="model1" title="合同类型"></Model1>
      <div class="b-space" />
    </div>
    <div class="c-space" />
    <div class="b-middle">
      <div class="b-space" />
      <div class="middle-item">
        <Model2 class="middle1" :totalData="totalData" />
      </div>
      <div class="b-space" />
      <div class="middle-item flex-grow">
        <Middle2 class="middle2" />
      </div>
      <div class="b-space" />
      <div class="middle-item">利润</div>
      <div class="b-space" />
      <div class="middle-item flex-large">价格</div>
      <div class="b-space" />
    </div>
    <div class="c-space" />
    <div class="b-right"></div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Model1 from "./components/Model1/index.vue";
import Left2 from "./components/Left/Left2/index.vue";
import Model2 from "./components/Model2/index.vue";
import Middle2 from "./components/Middle/Middle2/index.vue";
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
    justify-content: space-between;
    position: relative;
    .middle-item {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      border: 1px solid #ccc;
    }
    .flex-grow {
      flex: 3;
    }
    .flex-large {
      flex: 2;
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
  flex: 0.5;
}
</style>
