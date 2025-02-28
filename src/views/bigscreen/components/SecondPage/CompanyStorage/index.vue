<template>
  <div class="bg-view-img2">
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view1__header">
      <div class="title">
        <div class="__title--text">企业仓储分析</div>
      </div>
    </div>
    <div class="bg-view1__body">
      <CompanyAnalysis />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import CompanyAnalysis from "./companyAnalysis.vue";

const route = useRoute();
const title = ref("");

onMounted(() => {
  const paramName = route.params.typeName;
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
  @apply w-full flex relative;
  height: 66px;
  .title {
    @apply flex flex-1 justify-center items-center;
    background-image: url(../../../img/tit_bg.png);
    background-repeat: no-repeat;
    background-size: 80% 100%;
    background-position: center;
    .__title--text {
      @apply text-center font-bold relative;
      font-size: 2rem;
      letter-spacing: 6px;
      background: linear-gradient(
        to bottom,
        rgb(251, 254, 254),
        rgb(188, 247, 255)
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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
    @apply hidden;
  }
  scrollbar-width: none;
}
</style>
