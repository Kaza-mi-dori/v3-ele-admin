<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Left1
        :outContractData="[
          {
            label: '合同总金额',
            value: '117093.04',
            unit: '万元',
          },
          {
            label: '合同总数',
            value: '733',
            unit: '份',
          },
          {
            label: '采购合同数',
            value: '30',
            unit: '份',
          },
          {
            label: '销售合同数',
            value: '703',
            unit: '份',
          },
        ]"
      />
      <div class="b-space" />
      <Left2
        :outContractData="{
          fulfilled: 192.32,
          unfulfilled: 12.42,
          total: 204.74,
        }"
      />
      <div class="b-space" />
      <Left3 :outContractData="[703, 30, 0, 0, 0, 0]" />
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
      <Right1
        :outTradePartners="[
          {
            company: '必达能源',
            amount: 6661,
            ratio: 6661 / 97188.68,
          },
          {
            company: '广西万宸',
            amount: 6279,
            ratio: 6279 / 97188.68,
          },
          {
            company: '延长壳牌（广东）',
            amount: 5043,
            ratio: 5043 / 97188.68,
          },
          {
            company: '启通石化',
            amount: 3584,
            ratio: 3584 / 97188.68,
          },
          {
            company: '与桂同行',
            amount: 3120,
            ratio: 3120 / 97188.68,
          },
        ]"
      />
      <div class="b-space" />
      <Right2 />
      <div class="b-space" />
      <Right3 />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Left1 from "@/views/bigscreen/components/SecondPage/Left/left1.vue";
import Left2 from "@/views/bigscreen/components/SecondPage/Left/left2.vue";
import Left3 from "@/views/bigscreen/components/SecondPage/Left/left3.vue";
import Model2 from "@/views/bigscreen/components/FirstPage/Model2/index.vue";
import Middle2 from "@/views/bigscreen/components/FirstPage/Middle/Middle2/index.vue";
import Middle3 from "@/views/bigscreen/components/SecondPage/Middle/middle3.vue";
import Right1 from "@/views/bigscreen/components/SecondPage/Right/right1.vue";
import Right2 from "@/views/bigscreen/components/SecondPage/Right/right2.vue";
import Right3 from "@/views/bigscreen/components/SecondPage/Right/right3.vue";

import { ref } from "vue";

const totalData = ref([
  {
    year: "89199",
    month: "89199",
  },
  {
    year: "97188",
    month: "97188",
  },
  {
    year: "97188",
    month: "97188",
  },
  {
    year: "-",
    month: "-",
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
    flex: 1;
  }
  .b-middle {
    @apply flex flex-1.4 flex-col justify-between relative;
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
// .model1 {
//   @apply flex flex-1 flex-col h-full;
// }
</style>
