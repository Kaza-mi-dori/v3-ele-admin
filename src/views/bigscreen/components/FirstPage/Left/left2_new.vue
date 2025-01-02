<template>
  <div class="flex flex-gap-2 w-full justify-between h-full">
    <DescribeItem2 v-bind="revenueData" style="flex: 1" />
    <DescribeItem2 v-bind="profitData" style="flex: 1" />
  </div>
</template>

<script lang="ts" setup>
import DescribeItem2 from "../DescribeItems/Item2.vue";
import Coin from "@/views/bigscreen/img/left_icon1.png";
import WrappedGift from "@/views/bigscreen/img/left_icon2.png";

const revenueData = ref<any>({
  title: "累计营收",
  yoy: -36.53,
  fulfilled: 2043700,
  target: 3999100,
  monthTotal: 1000,
  icon: Coin,
});
const profitData = ref<any>({
  title: "累计利润",
  yoy: -31.26,
  fulfilled: -5500,
  target: 15000,
  monthTotal: 100,
  icon: WrappedGift,
});

onMounted(() => {
  // initChart();
});
</script>

<style lang="scss" scoped></style>
