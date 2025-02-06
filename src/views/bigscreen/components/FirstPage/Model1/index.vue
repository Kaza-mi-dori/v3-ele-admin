<template>
  <div class="model-box">
    <div class="model-title" v-if="showHeader">
      <img v-if="showSpecialTitleBg" class="model-title__bg" src="../../../img/box3_top.png" />
      <img v-else class="model-title__bg" src="../../../img/box1_top.png" />
      <div class="model-title__text">{{ title }}</div>
    </div>
    <div class="model-body">
      <img class="model-body__bg" src="../../../img/box1_center.png" />
      <div class="model-body__content">
        <slot name="customTool" />
        <slot />
      </div>
    </div>
    <div class="model-footer">
      <img class="model-footer__bg" src="../../../img/box1_bottom.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "Model",
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showSpecialTitleBg: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.model-box {
  @apply flex flex-col w-full h-full relative;
  .model-title {
    @apply flex items-center relative;
    height: 50px;
    padding: 0 15px;
    .model-title__bg {
      @apply w-full h-full absolute top-0 bottom-0 left-0 right-0;
    }
    .model-title__text {
      font-size: 18px;
      color: #fff;
      z-index: 1; /* 确保文字在背景图片上方 */
      font-family: 黑体;
      text-align: center; /* 防止内容过多时对齐异常 */
      height: 50px;
      margin-top: 5px;
    }
  }
  .model-body {
    @apply flex-1 relative;
    .model-body__bg {
      @apply w-full h-full absolute top-0 bottom-0 left-0 right-0; /* 确保背景图片覆盖整个容器 */
      background-repeat: repeat; /* 水平和垂直方向重复 */
      background-size: auto; /* 让图片保持原始大小 */
    }
    .model-body__content {
      @apply w-full h-full relative;
    }
  }
  .model-footer {
    .model-footer__bg {
      @apply w-full h-full;
    }
  }
}
</style>
