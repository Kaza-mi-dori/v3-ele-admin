<template>
  <div class="model-box">
    <div
      v-if="showHeader"
      class="model-title"
      :class="[showSpecialTitleBg ? 'title__bg2' : 'title__bg1']"
    >
      <img
        v-if="showSpecialTitleBg"
        class="model-title__bg"
        src="../../../img/box22_top.png"
      />
      <img v-else class="model-title__bg" src="../../../img/box21_top.png" />
      <div class="model-title__text">{{ title }}</div>
    </div>
    <div class="model-body">
      <img
        v-if="showSpecialTitleBg"
        class="model-title__bg"
        src="../../../img/box22_center.png"
      />
      <img class="model-body__bg" src="../../../img/box21_center.png" />
      <div class="model-body__content">
        <slot name="customTool" />
        <slot />
      </div>
    </div>
    <div class="model-footer">
      <img
        v-if="showSpecialTitleBg"
        class="model-title__bg"
        src="../../../img/box22_bottom.png"
      />
      <img class="model-footer__bg" src="../../../img/box21_bottom.png" />
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
    @apply flex justify-center items-center relative;
    height: 40px;
    .model-title__bg {
      @apply w-full h-full absolute top-0 bottom-0 left-0 right-0;
    }
    .model-title__text {
      font-size: 1.3rem;
      color: #fff;
      // // 勾边
      // text-shadow: 0 0 5px #000;
      // 边缘阴影
      -webkit-text-stroke: 1px #d1d1d1;
      z-index: 1; /* 确保文字在背景图片上方 */
      font-family: 黑体;
      letter-spacing: 0.5px;
      filter: brightness(1.1);
    }
  }
  .title__bg2 {
    background-image: url(../../../img/tit_small2_bg.png);
    background-repeat: no-repeat;
    background-size: 75% 100%;
    background-position: center;
  }
  .title__bg1 {
    background-image: url(../../../img/tit_small_bg.png);
    background-repeat: no-repeat;
    background-size: 75% 100%;
    background-position: center;
  }
  .model-body {
    @apply flex-1 relative;
    .model-body__bg {
      @apply absolute w-full h-full top-0 bottom-0 left-0 right-0;
      background-repeat: repeat; /* 水平和垂直方向重复 */
      background-size: auto; /* 让图片保持原始大小 */
    }
    .model-body__content {
      @apply w-full h-full relative;
      // @apply flex flex-col justify-center items-center;
    }
  }
  .model-footer {
    height: 20px;
    .model-footer__bg {
      @apply w-full h-full;
    }
  }
}
</style>
