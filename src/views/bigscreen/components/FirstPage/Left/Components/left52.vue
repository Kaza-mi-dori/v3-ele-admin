<template>
  <div class="flex flex-wrap" style="align-content: flex-start">
    <!-- <div class="box" v-for="item in data" :key="item.title">
      <div class="title-box">
        <img :src="require('@/views/bigscreen/img/left_icon1.png')" class="title-icon" />
        <span>{{ item.title }}</span>
      </div>
      <div class="annual-total">
        <span>年度累计</span>
        <span class="year-num">{{ item.value }}</span>
        <span>{{ item.unit }}</span>
      </div>
    </div> -->
    <Item3
      v-for="item in data"
      :key="item.title"
      style="width: 30%"
      :title="item.title"
      :amount="item.value + ''"
      :unit="item.unit"
      :iconUrl="inventory"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import inventory from "@/views/bigscreen/img/inventory.png";
import Item3 from "@/views/bigscreen/components/FirstPage/DescribeItems/Item3.vue";
async function initChart() {}

const data = ref<any[]>([
  { title: "成品油(年)", value: 100, unit: "万吨" },
  { title: "化工产品(年)", value: 50, unit: "万吨" },
  { title: "原油(年)", value: 100, unit: "万吨" },
  { title: "LNG(年)", value: 50, unit: "万吨" },
  { title: "煤炭(年)", value: 100, unit: "万吨" },
  { title: "燃料油(年)", value: 50, unit: "万吨" },
]);

onMounted(() => {
  initChart();
});
</script>
