<template>
  <div class="bg-view-img2">
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view1__header">
      <div class="title">
        <div class="__title--text">{{ title }}分析</div>
      </div>
    </div>
    <div class="bg-view1__body">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BusinessTypeScreen1 from "./BusinessTypeScreen1.vue";
import {
  BusinessFormatEnum,
  BusinessFormatEnumMap,
} from "@/enums/BusinessEnum";
import { businessFormats } from "../constants";

const route = useRoute();
const title = ref("");

onMounted(() => {
  const paramName = route.params.typeName;
  const matchedItem = businessFormats.find(
    (item: { name: string | string[] }) => item.name === paramName
  );
  console.log(matchedItem);
  if (matchedItem) {
    title.value =
      matchedItem.label ===
        BusinessFormatEnumMap[BusinessFormatEnum.GAS_STATION] ||
      matchedItem.label === BusinessFormatEnumMap[BusinessFormatEnum.STORAGE]
        ? "油站与仓储运营"
        : matchedItem.label;
  }
});
</script>

<style lang="scss" scoped>
.bg-view-img2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  background-color: #030542;
}
.bg-view1__header {
  width: 100%;
  height: 66px;
  display: flex;
  position: relative;
  .title {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(../../img/tit_bg.png);
    background-repeat: no-repeat;
    background-size: 80% 100%;
    background-position: center;
    .__title--text {
      font-size: 2rem;
      letter-spacing: 6px;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(
        to bottom,
        rgb(251, 254, 254),
        rgb(188, 247, 255)
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
    }
  }
}
.bg-view1__body {
  // flex-grow: 1;
  // overflow-y: hidden;
  // margin: 20px 50px 50px 50px;
  padding: 20px 0 20px 0;
  // height: calc(100% - 66px);
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
</style>
