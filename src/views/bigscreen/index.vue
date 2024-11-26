<template>
  <div id="bg-container" ref="container" class="bg-view">
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view__header">
      <div class="header-left header-left-right">
        <!-- 使用计算属性显示前一半元素 -->
        <div v-for="item in businessTypeArrLeft" :key="item.id">
          <div
            class="type-item"
            :class="{ active: selectedTypeId === item.id }"
            @click="handleType(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <div class="title">
        <div class="__title--text">广投石化驾驶舱</div>
      </div>
      <div class="header-right header-left-right">
        <!-- 使用计算属性显示后一半元素 -->
        <div v-for="item in businessTypeArrRight" :key="item.id">
          <div
            class="type-item"
            :class="{ active: selectedTypeId === item.id }"
            @click="handleType(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-view__body">
      <ScreenIndexContent />
    </div>
  </div>
</template>

<script setup lang="ts">
import ScreenIndexContent from "./index-content.vue";
import { ref, computed } from "vue";
import { businessTypes, navItem } from "./components/constants";

const businessTypeArr = ref<navItem[]>(businessTypes);

const selectedTypeId = ref<number | null>(null); // 当前选中item

const handleType = (item: any) => {
  selectedTypeId.value = item.id;
};

// 计算属性，获取数组的前一半
const businessTypeArrLeft = computed(() => {
  const midIndex = Math.ceil(businessTypeArr.value.length / 2);
  return businessTypeArr.value.slice(0, midIndex);
});

// 计算属性，获取数组的后一半
const businessTypeArrRight = computed(() => {
  const midIndex = Math.ceil(businessTypeArr.value.length / 2);
  return businessTypeArr.value.slice(midIndex);
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
.bg-view {
  // min-width: 1750px;
  // min-height: 900px;
  // height: 1080px;
  width: 1920px;
  font-size: 12px;
  color: #bfbfbf;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: "tnum";
  width: 100vw;
  // height: 100vh;
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
  background-image: url(./img/bg.jpg);
  background-size: cover;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
}
.bg-view__header {
  width: 100%;
  height: 66px;
  display: flex;
  position: relative;
  .header-left-right {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    width: 30%;
    height: 52px;
  }
  // .header-left {
  //   display: flex;
  //   justify-content: center; /* 水平居中 */
  //   align-items: center; /* 垂直居中 */
  //   position: absolute;
  //   left: clamp(10px, 20%, 50px);
  //   top: clamp(5px, 10px, 33px);
  // }
  // .header-right {
  //   display: flex;
  //   justify-content: center; /* 水平居中 */
  //   align-items: center; /* 垂直居中 */
  //   position: absolute;
  //   right: clamp(10px, 20%, 50px);
  //   top: clamp(5px, 10px, 33px);
  // }
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
  .type-item {
    background-image: url(./img/nav1.png);
    background-repeat: no-repeat; /* 防止背景图片重复 */
    background-size: cover; /* 背景图片填充整个元素，保持比例 */
    width: 100px;
    height: 42px;
    margin-right: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #d6dde6;
    font-size: 14px;
    cursor: pointer;
    &.active {
      background-image: url(./img/nav2.png);
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
