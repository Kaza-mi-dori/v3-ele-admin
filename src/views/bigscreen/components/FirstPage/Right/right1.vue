<template>
  <div class="box1">
    <div class="__left">
      <Item1
        style="margin: 0 auto"
        :amount="oilStorage"
        title="成品油库存"
        :iconUrl="inventory"
      />
    </div>
    <div class="__right">
      <Item1
        style="margin: 0 auto"
        :amount="oilBargain"
        title="成品油交易量"
        :iconUrl="business"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Item1 from "../DescribeItems/Item1.vue";
import inventory from "@/views/bigscreen/img/inventory.png";
import business from "@/views/bigscreen/img/business.png";
import { ref } from "vue";

const oilStorage = ref<string>("254,38");
const oilBargain = ref<string>("254,38");
</script>

<style lang="scss" scoped>
.box1 {
  @apply flex items-center;
  background-image: url("@/views/bigscreen/img/tag_bg.png");
  background-size: 100% 100%;
  width: 100%;
  // height: 176px;
  .__left {
    @apply flex;
    width: 50%;
    height: 100%;
  }
  .__right {
    @apply flex;
    width: 50%;
    height: 100%;
  }
}
</style>
