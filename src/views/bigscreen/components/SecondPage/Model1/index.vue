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
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .model-title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    .model-title__bg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .model-title__text {
      font-size: 22px;
      color: #fff;
      z-index: 1; /* 确保文字在背景图片上方 */
      font-family: 黑体;
      letter-spacing: 0.5px;
    }
  }
  .title__bg2 {
    background-image: url(../../../img/tit_small2_bg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .title__bg1 {
    background-image: url(../../../img/tit_small_bg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .model-body {
    flex: 1;
    position: relative;
    .model-body__bg {
      width: 100%;
      height: 100%; /* 确保背景图片覆盖整个容器 */
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-repeat: repeat; /* 水平和垂直方向重复 */
      background-size: auto; /* 让图片保持原始大小 */
    }
    .model-body__content {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
  .model-footer {
    .model-footer__bg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
