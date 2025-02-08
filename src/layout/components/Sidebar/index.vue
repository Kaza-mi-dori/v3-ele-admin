<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <!-- 混合布局顶部  -->
    <div v-if="isMixLayout" class="flex w-full">
      <SidebarLogo v-if="sidebarLogo" :collapse="isSidebarCollapsed" />
      <SidebarMixTopMenu class="flex-1" />
      <NavbarRight />
    </div>

    <!-- 顶部布局顶部 || 左侧布局左侧 -->
    <template v-else>
      <SidebarLogo v-if="sidebarLogo" :collapse="isSidebarCollapsed" />
      <el-scrollbar>
        <SidebarMenu :menu-list="permissionStore.routes" base-path="" />
        <el-icon
          :class="{ 'resize-trigger': true, collapsed: !isSidebarOpened }"
          @click="toggleSideBar"
        >
          <DArrowLeft />
        </el-icon>
      </el-scrollbar>
      <!-- 顶部布局导航 -->
      <NavbarRight v-if="isTopLayout" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { LayoutEnum } from "@/enums/LayoutEnum";
import { useSettingsStore, usePermissionStore, useAppStore } from "@/store";
import NavbarRight from "../Navbar/components/NavbarRight.vue";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarLogo = computed(() => settingsStore.sidebarLogo);
const layout = computed(() => settingsStore.layout);

const isMixLayout = computed(() => layout.value === LayoutEnum.MIX);
const isTopLayout = computed(() => layout.value === LayoutEnum.TOP);
const isSidebarCollapsed = computed(() => !appStore.sidebar.opened);
// 展开/收缩菜单
function toggleSideBar() {
  appStore.toggleSidebar();
}

// 侧边栏是否打开
const isSidebarOpened = computed(() => appStore.sidebar.opened);
</script>

<style lang="scss" scoped>
.has-logo {
  .el-scrollbar {
    height: calc(100vh - $navbar-height);
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
    padding-right: 5px;
    @apply relative;
    .resize-trigger {
      @apply absolute cursor-pointer right-5;
      font-size: 12px;
      bottom: 10px;
      color: var(--el-text-color-primary);
      :hover {
        @apply cursor-pointer bg-gray-10 border-radius-10;
      }
      &.collapsed {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
