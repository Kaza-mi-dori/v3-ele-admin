<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Left1
        :data="[
          {
            label: '累计采购金额',
            value: '69.13',
            unit: '亿元',
          },
          {
            label: '累计销售金额',
            value: '61.72',
            unit: '亿元',
          },
          {
            label: '合同履行金额',
            value: '61.22',
            unit: '亿元',
          },
        ]"
      />
      <div class="b-space" />
      <Left2
        :data="[
          {
            name: '采购合同',
            value: 221,
          },
          {
            name: '销售合同',
            value: 251,
          },
        ]"
      />
      <div class="b-space" />
      <Left3
        :data="{
          history: [0, 0, 0, 617213.38, 0],
          planAmount: 0,
          sellAmount: 617213.38,
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
              actual: 3691.19,
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
            company: '安元实业',
            amount: 189872.0,
            ratio: Number((189872 / 577800).toFixed(3)),
          },
          {
            company: '深圳宝峰',
            amount: 39952.0,
            ratio: Number((39952 / 577800).toFixed(3)),
          },
          {
            company: '胜帮（杭州）能源',
            amount: 39871.25,
            ratio: Number((39871.25 / 577800).toFixed(3)),
          },
          {
            company: '新疆西部物产贸易',
            amount: 30217.3,
            ratio: Number((30217.3 / 577800).toFixed(3)),
          },
          {
            company: '大榭能源化工（淮北）',
            amount: 28161.6,
            ratio: Number((28161.6 / 577800).toFixed(3)),
          },
        ]"
      />
      <div class="b-space" />
      <Right2 />
      <div class="b-space" />
      <Right3
        :data="[
          {
            profit: 122.81,
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

const totalData = ref([
  {
    year: "-",
    month: "-",
  },
  {
    year: "3691.19",
    month: "3691.19",
  },
  {
    year: "3691.19",
    month: "3691.19",
  },
  {
    year: "122.81",
    month: "122.81",
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
//   @apply flex flex-1 flex-col h-full;
// }
</style>
