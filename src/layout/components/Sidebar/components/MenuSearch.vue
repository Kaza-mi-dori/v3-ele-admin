<template>
  <div ref="searchMenuModalRef" class="container">
    <el-input
      ref="searchInputRef"
      v-model="searchKeyword"
      size="large"
      placeholder="输入菜单名称关键字搜索"
      clearable
      @keyup.enter="selectActiveResult"
      @input="updateSearchResults"
      @keydown.up.prevent="navigateResults('up')"
      @keydown.down.prevent="navigateResults('down')"
      @keydown.esc="closeSearchModal"
    >
      <template #append>
        <el-button type="primary">搜索</el-button>
      </template>
    </el-input>
    <!-- 搜索结果 -->
    <div class="search-result">
      <div v-if="displayResults.length > 0" class="result-items-container">
        <div
          v-for="(item, index) in displayResults"
          :key="item.path"
          :class="{ active: index === activeIndex, 'result-item': true }"
          @click="navigateToRoute(item)"
        >
          <div class="__icon">
            <el-icon v-if="item.icon && item.icon.startsWith('el-icon')">
              <component :is="item.icon.replace('el-icon-', '')" />
            </el-icon>
            <svg-icon v-else-if="item.icon" :icon-class="item.icon" />
            <svg-icon v-else icon-class="menu" />
          </div>
          <div class="__title">{{ item.title }}</div>
        </div>
      </div>
      <el-empty v-else description="暂无数据" />
    </div>
    <!-- 常用的 -->
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { usePermissionStore } from "@/store";
import { isExternal } from "@/utils";
import { RouteRecordRaw } from "vue-router";

const permissionStore = usePermissionStore();
const isModalVisible = ref(false);
const searchKeyword = ref("");
const searchInputRef = ref();
const excludedRoutes = ref(["/redirect", "/login", "/401", "/404"]);
const menuItems = ref<SearchItem[]>([]);
const searchResults = ref<SearchItem[]>([]);
const activeIndex = ref(-1);
const emit = defineEmits(["closePanel"]);
const searchMenuModalRef = ref<HTMLElement>();

interface SearchItem {
  title: string;
  path: string;
  name?: string;
  icon?: string;
  redirect?: string;
}

// 打开搜索模态框
function openSearchModal() {
  searchKeyword.value = "";
  activeIndex.value = -1;
  isModalVisible.value = true;
  setTimeout(() => {
    searchInputRef.value.focus();
  }, 100);
}

// 关闭搜索模态框
function closeSearchModal() {
  // isModalVisible.value = false;
  emit("closePanel");
}

// 更新搜索结果
function updateSearchResults() {
  activeIndex.value = -1;
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    searchResults.value = menuItems.value.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );
  } else {
    searchResults.value = [];
  }
}

// 显示搜索结果
const displayResults = computed(() => searchResults.value);

// 执行搜索
function selectActiveResult() {
  if (displayResults.value.length > 0 && activeIndex.value >= 0) {
    navigateToRoute(displayResults.value[activeIndex.value]);
  }
}

// 导航搜索结果
function navigateResults(direction: string) {
  if (displayResults.value.length === 0) return;

  if (direction === "up") {
    activeIndex.value =
      activeIndex.value <= 0
        ? displayResults.value.length - 1
        : activeIndex.value - 1;
  } else if (direction === "down") {
    activeIndex.value =
      activeIndex.value >= displayResults.value.length - 1
        ? 0
        : activeIndex.value + 1;
  }
}

// 跳转到
function navigateToRoute(item: SearchItem) {
  closeSearchModal();
  if (isExternal(item.path)) {
    window.open(item.path, "_blank");
  } else {
    router.push(item.path);
  }
}

function loadRoutes(routes: RouteRecordRaw[], parentPath = "") {
  routes.forEach((route) => {
    const path = route.path.startsWith("/")
      ? route.path
      : `${parentPath}/${route.path}`;
    if (excludedRoutes.value.includes(route.path) || isExternal(route.path))
      return;

    if (route.children) {
      loadRoutes(route.children, path);
    } else if (route.meta?.title) {
      const title =
        route.meta.title === "dashboard" ? "首页" : route.meta.title;
      menuItems.value.push({
        title,
        path,
        name: typeof route.name === "string" ? route.name : undefined,
        icon: route.meta.icon,
        redirect:
          typeof route.redirect === "string" ? route.redirect : undefined,
      });
    }
  });
}

// 初始化路由数据
onMounted(() => {
  loadRoutes(permissionStore.routes);
});
</script>

<style lang="scss" scoped>
.container {
  width: 70%;
  min-width: 800px;
  min-height: 300px;
  margin: 0 auto;
}

.search-result {
  max-height: 400px;
  .result-items-container {
    @apply flex flex-gap-2 flex-wrap w-full mt-4;
    .result-item {
      line-height: 36px;
      width: calc(25% - 1rem);
      text-align: left;
      cursor: pointer;
      @apply flex items-center w-200px items-center;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      .__icon {
        text-align: center;
        width: 32px;
        color: white;
        background-color: #4880ff;
        border-radius: 5px 0 0 5px;
      }
      .__title {
        padding-left: 0.5rem;
        flex: 1;
        font-size: 1rem;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &.active {
        background-color: #e6f7ff;
      }
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: start;

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2px;
    margin-right: 0.4em;
    color: #909399;
    background: rgb(125 125 125 / 10%);
    border: 0;
    border-radius: 2px;
    box-shadow:
      inset 0 -2px 0 0 #cdcde6,
      inset 0 0 1px 1px #fff,
      0 1px 2px 1px rgb(30 35 90 / 40%);
  }

  span {
    font-size: 12px;
    color: #909399;
  }
}
</style>
