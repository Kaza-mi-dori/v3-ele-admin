<!-- 汉堡按钮组件：展开/收缩菜单  -->
<template>
  <div
    class="px-[15px] flex items-center justify-center color-[var(--el-text-color-regular)]"
    @click="toggleClick"
  >
    <svg-icon
      icon-class="collapse"
      :class="{ hamburger: true, 'is-active': isActive }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  isActive: {
    required: true,
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggleClick"]);

function toggleClick() {
  emit("toggleClick");
}
</script>

<style scoped lang="scss">
.hamburger {
  @apply cursor-pointer align-middle scale-x-[-1];
}

.hamburger.is-active {
  @apply scale-x-100;
}
</style>
