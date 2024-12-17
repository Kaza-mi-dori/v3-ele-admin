<template>
  <div id="bg-container" ref="container" class="bg-view">
    <div v-if="showOtherContent" class="bg-view-img">
      <img style="position: absolute; top: 0" height="100vh" />
      <div class="bg-view__header">
        <div class="title">
          <div class="__title--text">广投石化驾驶舱</div>
        </div>
      </div>
      <div class="bg-view__body">
        <ScreenIndexContent />
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import ScreenIndexContent from "./index-content.vue";
import { ref, computed } from "vue";
import router from "@/router";
import { businessStore, companyStore } from "@/store";

const businessstore = businessStore();
const companystore = companyStore();

// 根据路由决定显示内容
const showOtherContent = computed(() => {
  return router.currentRoute.value.name == "BigScreenBoard";
});

const initScale = () => {
  const originalWidth = 1920;
  // const originalHeight = 1080;
  // 渲染后读取容器的高度
  const bgContainer = ref<HTMLElement | null>(null);
  const originalHeight = bgContainer.value?.offsetHeight || 1080;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const containerElement = document.getElementById("bg-container");
  if (!containerElement) return;
  const aspectRatio = 1920 / 1080;
  const ratio = windowWidth / windowHeight;
  // console.log(containerElement.computedStyleMap, '&', window.innerWidth)
  const newWidth = window.innerWidth * (originalHeight / windowHeight);

  // console.log('newWidth', newWidth)

  containerElement.style.width = newWidth + "px";

  const scale = windowHeight / originalHeight;
  document.body.style.zoom = scale + "";
  document.styleSheets[document.styleSheets.length - 1].insertRule(
    "canvas { zoom: " + 1 / scale + " !important; }"
  );
  document.styleSheets[document.styleSheets.length - 1].insertRule(
    "canvas { transform: scale(" + scale + ") !important; }"
  );
  document.styleSheets[document.styleSheets.length - 1].insertRule(
    "canvas { transform-origin: 0 0 !important; }"
  );
};

onMounted(() => {
  businessstore.getBusinessReportFormList(businessstore.queryForm);
  companystore.getCompanyReportFormList(companystore.queryForm2);
  // window.addEventListener("resize", () => {
  //   initScale();
  // });
  nextTick(() => {
    initScale();
    // 让所有echarts图表自适应
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  });
});
</script>

<style lang="scss" scoped>
// ::-webkit-scrollbar {
//   width: 6px;
//   height: 6px;
// }
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   -webkit-box-shadow: inset 0 0 5px #7dbaef;
//   background: #7dbaef;
// }
// ::-webkit-scrollbar-track {
//   -webkit-box-shadow: inset 0 0 5px #7dbaef;
//   border-radius: 10px;
//   background: transparent;
// }
.bg-view {
  // min-width: 1750px;
  // min-height: 900px;
  // height: 1080px;
  // height: 100%;
  width: 1920px;
  font-size: 12px;
  color: #bfbfbf;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: "tnum";
  width: 100vw;
  height: 100%;
  overflow: scroll;
  font-family:
    PingFangSC,
    Microsoft YaHei,
    Helvetica Neue,
    Arial,
    sans-serif !important;
  font-weight: 400;
  overscroll-behavior: none;
  scroll-behavior: smooth;
  user-select: none;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
}
.bg-view-img {
  width: 100%;
  // height: 100%;
  background-image: url(./img/bg.jpg);
  background-size: cover;
}
.bg-view__header {
  width: 100%;
  height: 66px;
  display: flex;
  position: relative;
  .title {
    flex: 1;
    height: 66px;
    width: max-content;
    position: relative;
    // top: clamp(10px, 25px, 30%);
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
    .__title--text {
      margin: auto 0;
      font-size: 2.5rem;
      letter-spacing: 6px;
      // line-height: px;
      font-weight: bold;
      text-align: center;
      // color: #70b9fd;
      // 字体颜色从rgb(163,243,250)到rgb(78,149,253)的均匀渐变
      background: linear-gradient(
        to bottom,
        rgb(163, 241, 251),
        rgb(78, 149, 253)
      );
      -webkit-background-clip: text; /* 兼容性设置 */
      -webkit-text-fill-color: transparent; /* 兼容性设置 */
      position: relative;
    }
  }
}
.bg-view__body {
  // height: 100%;
  // height: calc(100% - 66px);
  // overflow-y: auto; /* 纵向滚动条 */
  overflow-y: hidden;
  margin: 20px 0;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
</style>
