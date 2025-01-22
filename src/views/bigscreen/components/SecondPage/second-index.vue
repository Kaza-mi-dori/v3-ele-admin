<template>
  <div
    v-loading="loading"
    class="bg-view-img2"
    element-loading-text="页面加载中"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    spinner="loader"
  >
    <canvas
      id="second-page-bg-canvas"
      style="position: absolute; z-index: 0; top: 0; left: 0"
    />
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view1__header">
      <div class="title">
        <div class="__title--text">广投石化{{ title }}驾驶舱</div>
      </div>
    </div>
    <div class="bg-view1__body">
      <template v-if="hasPermission">
        <Screen2 v-if="title === '市场信息'" />
        <!-- <Screen1 v-else /> -->
        <router-view v-else />
      </template>
      <Deny v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Screen1 from "./Screen1.vue";
import Screen2 from "./Screen2.vue";
import { allBusinessTypes, businessTypeRouteNameMap } from "../constants";
import Deny from "@/views/bigscreen/components/Common/Deny/index.vue";

const route = useRoute();
const title = ref("");
const loading = ref(true);
const hasPermission = ref(true);
const canvas = ref<HTMLCanvasElement | null>(null);

class Part {
  x: number;
  y: number;
  ix: number;
  iy: number;
  vx: number;
  vy: number;
  a: number;
  dist: number;
  constructor(
    x: number,
    y: number,
    ix: number,
    iy: number,
    vx: number,
    vy: number,
    a: number,
    dist: number
  ) {
    this.x = x;
    this.y = y;
    this.ix = ix;
    this.iy = iy;
    this.vx = vx;
    this.vy = vy;
    this.a = a;
    this.dist = dist;
  }
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBgCanvas() {
  const canvas = document.getElementById("second-page-bg-canvas");
  if (canvas && canvas instanceof HTMLCanvasElement) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const w = canvas.width;
      const h = canvas.height;
      const part_count = 600;
      const P: Part[] = [];
      const angle = 0.01;
      const centerX = w / 2;
      const centerY = h / 2;
      for (let i = 0; i < part_count; i++) {
        const x = random(0, w);
        const y = random(0, h);
        const ix = random(0, w);
        const iy = random(0, h);
        const vx = random(-1, 1);
        const vy = random(-1, 1);
        const a = 1;
        const dist = part_count / 10 + i;
        P.push(new Part(x, y, ix, iy, vx, vy, a, dist));
      }
      ctx.fillStyle = "#030542";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      function bg() {
        if (ctx) {
          ctx.fillStyle = "#000000";
          ctx.globalAlpha = 0.9;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      function draw() {
        for (let i = 0; i < P.length; i++) {
          const p = P[i];
          p.a += 0.01;
          p.x = centerX + Math.cos(i + p.a) * p.dist * i * 0.1;
          p.y = centerY + Math.sin(i + p.a) * p.dist * i * 0.1;
          if (ctx) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(p.x, p.y, 3, 3);
          }
        }
      }

      function animate() {
        bg();
        draw();
        requestAnimationFrame(animate);
      }
      animate();
    }
  }
}
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
    nextTick(() => {
      // 控制是否显示canvas背景
      setBgCanvas();
    });
  }, 1000);
  const paramName = route.query.businessName;
  const matchedItem = allBusinessTypes.find(
    (item: { name: string | string[] }) => item.name === paramName
  );
  if (matchedItem) {
    title.value = matchedItem.label;
  }
});
</script>

<style lang="scss" scoped>
.bg-view-img2 {
  @apply flex flex-col w-full;
  // height: 100%;
  background-color: #030542;
}
.bg-view1__header {
  height: 66px;
  @apply flex w-full relative;
  .title {
    @apply flex flex-1 items-center justify-center;
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
/* HTML: <div class="loader"></div> */
.loader-container {
  @apply flex justify-center items-center w-full h-full absolute;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  z-index: 1000;
}
/* HTML: <div class="loader"></div> */
.loader {
  width: 100px;
  aspect-ratio: 1;
  --c: no-repeat linear-gradient(#4369b1 0 0);
  background:
    var(--c) 0% 50%,
    var(--c) 50% 50%,
    var(--c) 100% 50%;
  background-size: 20% 100%;
  animation: l1 1s infinite linear;
}
@keyframes l1 {
  0% {
    background-size:
      20% 100%,
      20% 100%,
      20% 100%;
  }
  33% {
    background-size:
      20% 10%,
      20% 100%,
      20% 100%;
  }
  50% {
    background-size:
      20% 100%,
      20% 10%,
      20% 100%;
  }
  66% {
    background-size:
      20% 100%,
      20% 100%,
      20% 10%;
  }
  100% {
    background-size:
      20% 100%,
      20% 100%,
      20% 100%;
  }
}
</style>
