<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Left1
        :data="[
          {
            label: '今日采购量',
            value: '0',
            unit: '万吨',
          },
          {
            label: '今日销售量',
            value: '2696.58',
            unit: '吨',
          },
          {
            label: '总库存量',
            value: '5.73',
            unit: '万吨',
          },
        ]"
      />
      <div class="b-space" />
      <Left2
        :data="[
          {
            name: '采购合同',
            value: 30,
          },
          {
            name: '销售合同',
            value: 808,
          },
        ]"
      />
      <div class="b-space" />
      <Left3
        :data="{
          history: [0, 0, 1764002, 2324936, 285900],
          planAmount: 0,
          sellAmount: 285900,
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
              planned: 280000.0,
              actual: 287651.14,
            },
            {
              planned: 300000.0,
              actual: 0,
            },
            {
              planned: 320000.0,
              actual: 0,
            },
          ]"
        />
      </div>
    </div>
    <div class="c-space" />
    <div class="b-right">
      <Right1
        :data="[
          { order: 1, name: '香港荣盛', value: 11.28, unit: '亿元' },
          {
            order: 2,
            name: 'GALAXY UNIVERSAL LIMITED',
            value: 9.02,
            unit: '亿元',
          },
          {
            order: 3,
            name: 'DYNAMIC TRADING CO., LIMITED',
            value: 7.13,
            unit: '亿元',
          },
          {
            order: 4,
            name: 'GATHER STRENGTH INTERNATIONAL TRADING PTE. LTD.',
            value: 4.25,
            unit: '亿元',
          },
          {
            order: 5,
            name: '浙江浙石化销售有限公司',
            value: 4.01,
            unit: '亿元',
          },
          {
            order: 6,
            name: '荣和君泰（大连）国际贸易有限公司',
            value: 1.73,
            unit: '亿元',
          },
          {
            order: 7,
            name: '荣和君泰（大连）国际贸易有限公司',
            value: 0.56,
            unit: '亿元',
          },
          {
            order: 8,
            name: '荣和君泰（大连）国际贸易有限公司',
            value: 0.52,
            unit: '亿元',
          },
        ]"
      />
      <div class="b-space" />
      <Right2 />
      <div class="b-space" />
      <Right3
        :data="[
          {
            profit: -2284.19,
          },
        ]"
      />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Left1 from "@/views/bigscreen/components/SecondPage/LeftSubject/left1.vue";
import Left2 from "@/views/bigscreen/components/SecondPage/LeftSubject/left2.vue";
import Left3 from "@/views/bigscreen/components/SecondPage/LeftSubject/left3.vue";
import Model2 from "@/views/bigscreen/components/SecondPage/Model2/index.vue";
import Middle2 from "@/views/bigscreen/components/SecondPage/Middle/Middle2/index.vue";
import Middle3 from "@/views/bigscreen/components/SecondPage/Middle/middle3.vue";
import Right1 from "@/views/bigscreen/components/SecondPage/Right/right1.vue";
import Right2 from "@/views/bigscreen/components/SecondPage/Right/right2.vue";
import Right3 from "@/views/bigscreen/components/SecondPage/Right/right3.vue";

import { ref } from "vue";

// TODO 统一获取数据后单向传递
const subData = reactive({});

const totalData = ref([
  {
    year: "78937.61",
    month: "78937.61",
  },
  {
    year: "118744.26",
    month: "118744.26",
  },
  {
    year: "287651.14",
    month: "287651.14",
  },
  {
    year: "-2284.19",
    month: "-2284.19",
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
      @apply flex flex-1 justify-center items-center;
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
  @apply w-0;
  height: 20px;
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
// .model1 {
// @apply flex flex-1 flex-col h-full;
// }
</style>
