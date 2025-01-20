<!-- 大屏在无权限时显示 -->
<template>
  <div class="flex justify-center items-center h-screen">
    <div class="text-2xl font-bold">您没有访问该页面的权限，请联系管理员</div>
  </div>
</template>

<style lang="scss" scoped>
.deny {
  @apply w-full h-full;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
