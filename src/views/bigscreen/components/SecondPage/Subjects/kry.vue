<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Left1
        :data="[
          {
            label: '合同总金额',
            value: '949',
            unit: '万元',
          },
          {
            label: '已履行金额',
            value: '755',
            unit: '万元',
          },
          {
            label: '未履行金额',
            value: '194.3',
            unit: '万元',
          },
        ]"
      />
      <div class="b-space" />
      <Left2
        :data="[
          {
            name: '采购合同',
            value: '0',
          },
          {
            name: '销售合同',
            value: '19',
          },
        ]"
      />
      <div class="b-space" />
      <Left3
        :data="{
          history: [0, 0, 0, 31860, 949],
          planAmount: 0,
          sellAmount: 949,
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
              actual: 592.13,
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
            company: '广西庚辰石化有限公司',
            amount: 249.14,
            ratio: Number((249.14 / 949) * 100).toFixed(2),
          },
          {
            company: '广西建富成品油销售有限公司',
            amount: 162.9,
            ratio: Number((162.9 / 949) * 100).toFixed(2),
          },
          {
            company: '广西中油海航能源有限公司',
            amount: 106.2,
            ratio: Number((106.2 / 949) * 100).toFixed(2),
          },
          {
            company: '广西高投石油化工',
            amount: 85.49,
            ratio: Number((85.49 / 949) * 100).toFixed(2),
          },
          {
            company: '佳孚石化',
            amount: 24.92,
            ratio: Number((24.92 / 949) * 100).toFixed(2),
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
    year: "592.13",
    month: "592.13",
  },
  {
    year: "592.13",
    month: "592.13",
  },
  {
    year: "-142.67",
    month: "-142.67",
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
