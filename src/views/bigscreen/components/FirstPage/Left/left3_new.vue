<template>
  <div class="left3-box">
    <div class="flex flex-gap-2 w-full justify-between">
      <DescribeItem4 v-bind="data1" style="flex: 1" />
      <DescribeItem4 v-bind="data2" style="flex: 1" />
      <DescribeItem4 v-bind="data3" style="flex: 1" />
    </div>
    <div class="flex flex-gap-2 w-full justify-between mt-[10px]">
      <DescribeItem4 v-bind="data4" style="flex: 1" />
      <DescribeItem4 v-bind="data5" style="flex: 1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DescribeItem4 from "../DescribeItems/Item4.vue";
import block1 from "@/views/bigscreen/img/left_block1.png";
import block2 from "@/views/bigscreen/img/left_block2.png";
import block3 from "@/views/bigscreen/img/left_block3.png";
import block4 from "@/views/bigscreen/img/left_block4.png";
import block5 from "@/views/bigscreen/img/left_block5.png";

const data1 = ref<any>({
  title: "累计采购",
  bgImg: block1,
  yearTotal: 256.36,
  monthTotal: 256.36,
  monthUnit: "万元",
  yearUnit: "亿元",
});
const data2 = ref<any>({
  title: "累计销售",
  bgImg: block2,
  yearTotal: 256.36,
  monthTotal: 256.36,
  monthUnit: "万元",
  yearUnit: "亿元",
});
const data3 = ref<any>({
  title: "累计毛利率",
  bgImg: block3,
  yearTotal: 256.36,
  monthTotal: 256.36,
  monthUnit: "万元",
  yearUnit: "亿元",
});
const data4 = ref<any>({
  title: "累计营收",
  bgImg: block4,
  yearTotal: 256.36,
  monthTotal: 256.36,
  monthUnit: "万元",
  yearUnit: "亿元",
});
const data5 = ref<any>({
  title: "累计利润",
  bgImg: block5,
  yearTotal: 256.36,
  monthTotal: 256.36,
  monthUnit: "万元",
  yearUnit: "亿元",
});
</script>

<style lang="scss" scoped>
.left3-box {
  width: 100%;
  height: 100%;
}
</style>
