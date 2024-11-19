<template>
  <div class="model-box">
    <div class="model-header">
      <img class="model-header__bg" src="../../img/box2_top.png" />
      <div class="model-title" v-if="showHeader">
        <div class="model-title__text">{{ title }}</div>
      </div>
      <div class="model-select">
        <div class="demo-date-picker">
          <div class="block">
            <el-date-picker
              v-model="timeCondition"
              type="date"
              placeholder="请选择"
              size="small"
              style="width: 100px"
              :prefix-icon="customPrefix"
              class="custom-date-picker"
              popper-class="elDatePicker"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="model-body">
      <div class="model-body__content">
        <div>
          <img src="../../img/yellow_bg.png" alt="" />
          <div class="body-content">
            <div>合同总金额</div>
            <div class="content-value">
              <div class="content-num">355,480</div>
              <div class="content-unit">万元</div>
            </div>
          </div>
        </div>
        <div>
          <img src="../../img/blue_bg.png" alt="" />
          <div class="body-content">
            <div>合同总数</div>
            <div class="content-value">
              <div class="content-num">2460</div>
              <div class="content-unit">份</div>
            </div>
          </div>
        </div>
        <div>
          <img src="../../img/green_bg.png" alt="" />
          <div class="body-content">
            <div>采购合同</div>
            <div class="content-value">
              <div class="content-num">980</div>
              <div class="content-unit">份</div>
            </div>
          </div>
        </div>
        <div>
          <img src="../../img/red_bg.png" alt="" />
          <div class="body-content">
            <div>销售合同</div>
            <div class="content-value">
              <div class="content-num">1480</div>
              <div class="content-unit">份</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, shallowRef } from "vue";
defineProps({
  title: {
    type: String,
    default: "Model",
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
});
const timeCondition = ref("");
const customPrefix = shallowRef({
  render() {
    return h("p", "");
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
  .model-header {
    display: flex;
    justify-content: space-between;
    .model-header__bg {
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .model-title {
      position: relative;
      display: flex;
      align-items: center; /* 垂直居中 */
      height: 33px;
      padding: 0 15px;
      .model-title__text {
        font-size: 18px;
        color: #fff;
        z-index: 1; /* 确保文字在背景图片上方 */
        font-family: 黑体;
        text-align: center; /* 防止内容过多时对齐异常 */
      }
    }
  }
  .model-select {
    margin: auto 0;
  }
  .model-body {
    flex: 1;
    position: relative;
    .model-body__bg {
      height: 100%;
      margin: 10px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .model-body__content {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 100%;
      height: 100%;
      div {
        flex: 1;
        position: relative;
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        object-fit: cover; /* 确保图片按比例填充整个区域 */
      }
      .body-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* 水平居中 */
        justify-content: center; /* 垂直居中 */
        text-align: left; /* 文字居中 */
        font-size: 15px;
        padding-left: 15px;
      }
      .content-value {
        display: flex;
        align-items: center; /* 使数值和单位垂直居中 */
        justify-content: center;
        .content-num {
          font-size: 17px;
        }
        .content-unit {
          margin-left: 5px;
          font-size: 14px;
        }
      }
    }
  }
  .demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
    margin-right: 15px;
  }
}
::v-deep .el-input__prefix {
  display: none;
}
::v-deep .el-input__wrapper {
  background-color: #0d2555;
  color: #7fa1f1;
  border-color: #0d2555;
  box-shadow: 0 0 0 1px #0d2555 inset;
}
/* 输入框内的文字颜色 */
::v-deep .el-input__inner {
  color: #7fa1f1;
  background-color: #0d2555;
}
/* 占位符的颜色 */
::v-deep .el-input__inner::placeholder {
  color: #7fa1f1;
}
</style>
