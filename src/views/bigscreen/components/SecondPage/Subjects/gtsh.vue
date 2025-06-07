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
            value: '47.10',
            unit: '万吨',
          },
        ]"
      />
      <div class="b-space" />
      <Left2
        :data="[
          {
            name: '采购合同',
            value: 202,
          },
          {
            name: '销售合同',
            value: 4487,
          },
        ]"
      />
      <div class="b-space" />
      <Left3
        :data="{
          [BusinessEnumMap[BusinessEnum.CPY]]: {
            history: [0, 0, 0, 0, 481796.63],
            planAmount: 1500000,
            sellAmount: 481796.63,
          },
          [BusinessEnumMap[BusinessEnum.YY]]: {
            history: [0, 0, 0, 0, 1289045],
            planAmount: 2700000,
            sellAmount: 1289045,
          },
          [BusinessEnumMap[BusinessEnum.RLY]]: {
            history: [0, 0, 0, 0, 1850000],
            planAmount: 400000,
            sellAmount: 85204.32,
          },
          // [BusinessEnumMap[BusinessEnum.HGCP]]: {
          //   history: [0, 0, 0, 0, 285900],
          //   planAmount: 400000,
          //   sellAmount: 85204.32,
          // },
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
              actual: 287494.07,
            },
            {
              planned: 300000.0,
              actual: 497332.44,
            },
            {
              planned: 320000.0,
              actual: 378560.92,
            },
            {
              planned: 341666.6667,
              actual: 392971.37,
            },
            {
              planned: 341666.6667,
              actual: 299687.92,
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
            order: 1,
            name: 'KINGBACK TRADING LIMITED',
            value: 11.42,
            unit: '亿元',
          },
          {
            order: 2,
            name: 'DYNAMIC TRADING CO. LIMITED',
            value: 6.78,
            unit: '亿元',
          },
          {
            order: 3,
            name: '香港荣盛',
            value: 4.12,
            unit: '亿元',
          },
          {
            order: 4,
            name: '大连广宏能源有限公司',
            value: 2.19,
            unit: '亿元',
          },
          {
            order: 5,
            name: '浙江浙石化销售有限公司',
            value: 0.72,
            unit: '亿元',
          },
          {
            order: 6,
            name: '恒力能源',
            value: 0.62,
            unit: '亿元',
          },
        ]"
      />
      <div class="b-space" />
      <Right2
        :data="[
          {
            transactionVolume: 287494.07,
            tradingVolume: 62.44,
            date: '1月',
          },
          {
            transactionVolume: 784826.51,
            tradingVolume: 179.91,
            date: '2月',
          },
          {
            transactionVolume: 1163387.43,
            tradingVolume: 273.66,
            date: '3月',
          },
          {
            transactionVolume: 1556358.8,
            tradingVolume: 368.64,
            date: '4月',
          },
          {
            transactionVolume: 1856046.72,
            tradingVolume: 739.88,
            date: '5月',
          },
        ]"
      />
      <div class="b-space" />
      <Right3
        :data="[
          {
            profit: 167.74,
          },
          {
            profit: 3216.55,
          },
          {
            profit: 2660.77,
          },
          {
            profit: 3822.8,
          },
          {
            profit: 1758.34,
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
import { BusinessEnum, BusinessEnumMap } from "@/enums/BusinessEnum";

// 单向传递公司名称给子组件
const companyName = provide("companyName", "广投石化");

// TODO 统一获取数据后单向传递
const subData = reactive({});

const totalData = ref([
  {
    year: "1526318.76",
    month: "385708.09",
  },
  {
    year: "1556358.8",
    month: "392971.37",
  },
  {
    year: "1556358.8",
    month: "392971.37",
  },
  {
    year: "9867.86",
    month: "3822.8",
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
