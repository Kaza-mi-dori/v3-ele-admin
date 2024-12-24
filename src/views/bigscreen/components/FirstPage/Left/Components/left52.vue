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
      style="width: 30%; margin: 10px"
      :title="item.title"
      :amount="item.value + ''"
      :unit="item.unit"
      :iconUrl="item.iconUrl"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import icon1 from "@/views/bigscreen/img/product_icon1.png";
import icon2 from "@/views/bigscreen/img/product_icon2.png";
import icon3 from "@/views/bigscreen/img/product_icon3.png";
import icon4 from "@/views/bigscreen/img/product_icon4.png";
import icon5 from "@/views/bigscreen/img/product_icon5.png";
import icon6 from "@/views/bigscreen/img/product_icon6.png";
import Item3 from "@/views/bigscreen/components/FirstPage/DescribeItems/Item3.vue";
async function initChart() {}

const data = ref<any[]>([
  { title: "成品油", value: 100, unit: "万吨", iconUrl: icon1 },
  { title: "化工产品", value: 50, unit: "万吨", iconUrl: icon2 },
  { title: "原油", value: 100, unit: "万吨", iconUrl: icon3 },
  { title: "LNG", value: 50, unit: "万吨", iconUrl: icon4 },
  { title: "煤炭", value: 100, unit: "万吨", iconUrl: icon5 },
  { title: "燃料油", value: 50, unit: "万吨", iconUrl: icon6 },
]);

onMounted(() => {
  initChart();
});
</script>
