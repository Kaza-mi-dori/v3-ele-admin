<template>
  <div class="flex justify-center">
    <div class="background-container">
      <img :src="entries" class="background-image" />
      <div class="icon-container">
        <img
          v-for="(item, index) in imgArr"
          :key="index"
          :src="item"
          alt=""
          class="entry-icon"
          :class="index % 2 === 0 ? 'floating-up' : 'floating-down'"
          :style="getIconStyle(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import entries from "@/views/bigscreen/img/pic.png";
import yellow from "@/views/bigscreen/img/yellow.png";
import green from "@/views/bigscreen/img/green.png";
import blue from "@/views/bigscreen/img/blue.png";
import purple from "@/views/bigscreen/img/purple.png";
import orange from "@/views/bigscreen/img/orange.png";
import red from "@/views/bigscreen/img/red.png";

const imgArr = ref([yellow, blue, orange, green, purple, red]);
// 用于生成错落布局的样式
const getIconStyle = (index: number) => {
  const positions = [
    { top: -20, left: "25" },
    { top: 15, left: "45" },
    { top: 5, left: "65" },
    { top: 55, left: "15" },
    { top: 90, left: "33" },
    { top: 80, left: "56" },
  ];
  return {
    position: "absolute",
    top: `${positions[index].top}px`,
    left: `${positions[index].left}%`,
  };
};
</script>

<style lang="scss" scoped>
.background-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.background-image {
  display: block;
  width: 100%;
  height: auto;
}
.icon-container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.entry-icon {
  width: 17%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.entry-icon:first-child {
  width: 19%;
}
/* 向上浮动的动画 */
.floating-up {
  animation: float-up 3s ease-in-out infinite;
}
@keyframes float-up {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
/* 向下浮动的动画 */
.floating-down {
  animation: float-down 3s ease-in-out infinite;
}

@keyframes float-down {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}
.entry-icon:hover {
  transform: scale(1.1) !important;
}
.floating-up:hover,
.floating-down:hover {
  animation-play-state: paused; /* 暂停动画 */
}
</style>
