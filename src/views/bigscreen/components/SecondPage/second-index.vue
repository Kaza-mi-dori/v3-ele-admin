<template>
  <div class="bg-view-img2">
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view1__header">
      <div class="title">
        <div class="__title--text">广投石化{{ title }}驾驶舱</div>
      </div>
    </div>
    <div class="bg-view1__body">
      <Screen2 v-if="title === '市场信息'" />
      <Screen1 v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Screen1 from "./Screen1.vue";
import Screen2 from "./Screen2.vue";
import { businessTypes } from "../constants";

const route = useRoute();
const title = ref("");

onMounted(() => {
  const paramName = route.params.businessName;
  const matchedItem = businessTypes.find(
    (item: { name: string | string[] }) => item.name === paramName
  );

  if (matchedItem) {
    title.value = matchedItem.label;
  }
});
</script>

<style lang="scss" scoped>
.bg-view-img2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
    background-image: url(../../img/tit_bg.png);
    background-repeat: no-repeat;
    background-size: 80% 100%;
    background-position: center;
    .__title--text {
      margin: auto 0;
      font-size: 2rem;
      letter-spacing: 6px;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(
        to bottom,
        rgb(251, 254, 254),
        rgb(188, 247, 255)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
    }
  }
}
.bg-view1__body {
  flex-grow: 1;
  overflow-y: hidden;
  margin: 20px 50px 50px 50px;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
@keyframes light-up {
  0% {
    left: 0;
    opacity: 0.4;
  }
  100% {
    left: 84%;
    opacity: 0;
  }
}
</style>
