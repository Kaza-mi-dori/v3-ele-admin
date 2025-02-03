<template>
  <div class="logo flex">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
      <router-link
        :key="+collapse"
        class="wh-full flex-center"
        to="/"
        @mouseenter="onClickLogo"
      >
        <img :src="logo" class="w20px h20px" />
        <span v-if="!collapse" class="title">
          <!-- {{ defaultSettings.title }} -->
          数据采集及可视化平台
        </span>
      </router-link>
    </transition>
    <div
      v-if="showPanel"
      ref="MenuSearchRef"
      class="panel"
      :style="{
        left: collapse
          ? sassvariables['sidebar-width-collapsed']
          : sassvariables['sidebar-width'],
      }"
    >
      <div class="panel-header">
        <div class="title">智慧导航</div>
        <el-icon
          class="absolute right-0 cursor-pointer z-1002 color-white bg-red top-0"
          @click="onClosePanel"
        >
          <Close />
        </el-icon>
      </div>
      <div class="panel-body">
        <MenuSearch @close-panel="onClosePanel" />
      </div>
      <div class="panel-footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import defaultSettings from "@/settings";
import logo from "@/assets/logo.png";
import sassvariables from "@/styles/variables.module.scss";
import MenuSearch from "./MenuSearch.vue";

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const showPanel = ref(false);
const MenuSearchRef = ref();

function onClickLogo(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  showPanel.value = true;
}

function onClosePanel() {
  showPanel.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (
    MenuSearchRef.value &&
    !MenuSearchRef.value.contains(e.target as Node) &&
    e.target !== MenuSearchRef.value &&
    showPanel.value
  ) {
    showPanel.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $navbar-height;
  background-color: $sidebar-logo-background;

  .title {
    flex-shrink: 0; /* 防止容器在空间不足时缩小 */
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    // color: white;
    color: black;
  }

  .panel {
    position: fixed;
    top: 0;
    width: 80%;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: all 0.3s;
    padding: 10px;
    border-radius: 5px;
    .panel-header {
      padding: 10px;
      background-color: $sidebar-logo-background;
      line-height: 1.5rem;
      @apply relative w-full text-center;
      .title {
        width: 10rem;
        margin: 0 auto;
        font-size: 1.2rem;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1px;
          transition: all ease 0.5s;
          animation: colorChange 3s infinite;
          @keyframes colorChange {
            0% {
              background-color: #fff;
            }
            50% {
              background-color: #4880ff;
            }
            100% {
              background-color: #fff;
            }
          }
        }
        &::after {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1px;
          transition: all ease 0.5s;
          animation: colorChange 3s infinite;
          @keyframes colorChange {
            0% {
              background-color: #fff;
            }
            50% {
              background-color: #4880ff;
            }
            100% {
              background-color: #fff;
            }
          }
        }
      }
    }
  }
}

.layout-top,
.layout-mix {
  .logo {
    width: $sidebar-width;
  }

  &.hideSidebar {
    .logo {
      width: $sidebar-width-collapsed;
    }
  }
}
</style>
