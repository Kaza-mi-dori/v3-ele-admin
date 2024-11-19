<template>
  <div ref="container" class="bg-view">
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view__header">
      <div class="header-left header-left-right">
        <!-- 使用计算属性显示前一半元素 -->
        <div v-for="item in businessTypeArrLeft" :key="item.id">
          <div
            class="type-item"
            :class="{ active: selectedTypeId === item.id }"
            @click="selectType(item.id)"
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
            @click="selectType(item.id)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-view__body">
      <Screen1 />
    </div>
  </div>
</template>

<script setup lang="ts">
import Screen1 from "./Screen1.vue";
import { ref, computed } from "vue";

interface navItem {
  id: number;
  label: string;
}

const businessTypeArr: Ref<navItem[]> = ref([
  { id: 1, label: "LNG" },
  { id: 2, label: "燃料油" },
  { id: 3, label: "成品油" },
  { id: 4, label: "化工产品" },
  { id: 5, label: "原油" },
  { id: 6, label: "煤炭" },
]);

const selectedTypeId = ref<number | null>(null); // 当前选中item

const selectType = (id: number) => {
  selectedTypeId.value = id;
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
</script>

<style lang="scss" scoped>
.bg-view {
  min-width: 1750px;
  min-height: 900px;
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
  .title {
    width: max-content;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
    .__title--text {
      font-size: 2rem;
      letter-spacing: 4px;
      line-height: 48px;
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
    width: 97px;
    height: 30px;
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
  height: 100%;
  margin: 20px;
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
