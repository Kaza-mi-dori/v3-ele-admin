<template>
  <div
    v-loading="loading"
    class="bg-view-img2"
    element-loading-text="页面加载中"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    spinner="loader"
  >
    <canvas
      id="second-page-bg-canvas-1"
      style="position: absolute; z-index: 0; top: 0; left: 0"
    />
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view1__header">
      <div class="title">
        <div class="__title--text">{{ title }}驾驶舱</div>
      </div>
    </div>
    <div class="bg-view1__body">
      <router-view v-if="hasPermission" />
      <Deny v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { businessSubjects } from "../constants";
import { StarrySky } from "@/views/bigscreen/components/Common/DynamicBG/starrySky";
import { nextTick } from "vue";
import Deny from "@/views/bigscreen/components/Common/Deny/index.vue";

const route = useRoute();
const title = ref("");
const loading = ref(true);
const hasPermission = ref(true);
const starrySky = new StarrySky();
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
    nextTick(() => {
      const canvas = document.getElementById(
        "second-page-bg-canvas-1"
      ) as HTMLCanvasElement;
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      starrySky.setCanvas(canvas);
      starrySky.init();
    });
  }, 1000);
  const routeName = route.name as string;
  const paramName = routeName.charAt(0).toLowerCase() + routeName.slice(1);
  const matchedItem = businessSubjects.find(
    (item: { name: string | string[] }) => item.name === paramName
  );
  // console.log(matchedItem);
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
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
    }
  }
}
.bg-view1__body {
  flex-grow: 1;
  // overflow-y: hidden;
  padding: 20px 50px 50px 50px;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
</style>
