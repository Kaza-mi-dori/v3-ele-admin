<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Left1
        :data="[
          {
            label: '采购总金额',
            value: '34031.42',
            unit: '万元',
          },
          {
            label: '销售总金额',
            value: '31284.96',
            unit: '万元',
          },
          {
            label: '销售合同数',
            value: '135',
            unit: '份',
          },
        ]"
      />
      <div class="b-space" />
      <Left2
        :data="[
          {
            name: '采购合同',
            value: '10',
          },
          {
            name: '销售合同',
            value: '18',
          },
        ]"
      />
      <div class="b-space" />
      <Left3
        :data="{
          history: [0, 0, 0, 322966.85, 31284.96],
          planAmount: 0,
          sellAmount: 31284.96,
        }"
      />
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
        <Middle3
          :data="[
            {
              planned: 0,
              actual: 17354.43,
            },
          ]"
        />
      </div>
    </div>
    <div class="c-space" />
    <div class="b-right">
      <Right1
        :data="[
          {
            company: '东恒启卓',
            amount: 34859.01,
            ratio: '-',
          },
          {
            company: '置诚化工商贸',
            amount: 24051.41,
            ratio: '-',
          },
          {
            company: '豫东石油',
            amount: 18550.29,
            ratio: '-',
          },
          {
            company: '中化石油湖北',
            amount: 10328.67,
            ratio: '-',
          },
          {
            company: '岚桥石化',
            amount: 10379.05,
            ratio: '-',
          },
        ]"
      />
      <div class="b-space" />
      <Right2 />
      <div class="b-space" />
      <Right3
        :data="[
          {
            profit: 86.62,
          },
        ]"
      />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Left1 from "./Components/gtshgd/LeftSubject/left1.vue";
import Left2 from "./Components/gtshgd/LeftSubject/left2.vue";
import Left3 from "./Components/gtshgd/LeftSubject/left3.vue";
import Model2 from "@/views/bigscreen/components/SecondPage/Model2/index.vue";
import Middle2 from "./Components/gtshgd/Middle/Middle2/index.vue";
import Middle3 from "./Components/gtshgd/Middle/middle3.vue";
import Right1 from "./Components/gtshgd/Right/right1.vue";
import Right2 from "./Components/gtshgd/Right/right2.vue";
import Right3 from "./Components/gtshgd/Right/right3.vue";

import { ref } from "vue";

const totalData = ref([
  {
    year: "-",
    month: "-",
  },
  {
    year: "17354.43",
    month: "17354.43",
  },
  {
    year: "17354.43",
    month: "17354.43",
  },
  {
    year: "86.62",
    month: "86.62",
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
