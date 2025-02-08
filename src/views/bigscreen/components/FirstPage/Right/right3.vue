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
          @click="handleType(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import entries from "@/views/bigscreen/img/pic.png";
import yellow from "@/views/bigscreen/img/yellow.png";
import green from "@/views/bigscreen/img/green.png";
import blue from "@/views/bigscreen/img/blue.png";
import purple from "@/views/bigscreen/img/purple.png";
import orange from "@/views/bigscreen/img/orange.png";
import red from "@/views/bigscreen/img/red.png";
import { businessTypes2, navItem } from "../../constants";

const businessTypeArr = ref<navItem[]>(businessTypes2);

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

const handleType = (index: number) => {
  const selectedBusinessType = businessTypeArr.value[index];
  const businessName = selectedBusinessType.name;
  const route = router.resolve({
    name: "Business",
    params: { businessName },
  });
  window.open(route.href, "_blank");
};
</script>

<style lang="scss" scoped>
.background-container {
  @apply relative w-full h-full flex flex-wrap justify-center items-center;
}
.background-image {
  @apply block w-full h-auto;
}
.icon-container {
  @apply absolute w-full h-full z-1;
}
.entry-icon {
  @apply cursor-pointer;
  width: 17%;
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
