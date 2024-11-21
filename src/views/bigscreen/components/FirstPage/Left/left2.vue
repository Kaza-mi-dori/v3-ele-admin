<template>
  <div class="model-box">
    <div class="model-header">
      <img class="model-header__bg" src="@/views/bigscreen/img/box2_top.png" />
      <div v-if="showHeader" class="model-title">
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
        <div v-for="(item, index) in contractData" :key="index">
          <img :src="backgroundImages[index]" alt="" />
          <div class="body-content">
            <div>{{ item.label }}</div>
            <div class="content-value">
              <div class="content-num">{{ formatNumber(item.value) }}</div>
              <div class="content-unit">{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import yellowBg from "@/views/bigscreen/img/yellow_bg.png";
import blueBg from "@/views/bigscreen/img/blue_bg.png";
import greenBg from "@/views/bigscreen/img/green_bg.png";
import redBg from "@/views/bigscreen/img/red_bg.png";
import { h, ref, shallowRef } from "vue";

// 定义背景图片数组
const backgroundImages = [yellowBg, blueBg, greenBg, redBg];

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
// 定义合同数据
const contractData = ref([
  {
    label: "合同总金额",
    value: "355480",
    unit: "万元",
  },
  {
    label: "合同总数",
    value: "2460",
    unit: "份",
  },
  {
    label: "采购合同",
    value: "980",
    unit: "份",
  },
  {
    label: "销售合同",
    value: "1480",
    unit: "份",
  },
]);
const formatNumber = (num: number | string): string => {
  // 判断是否需要格式化
  if (Number(num) > 10000) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return num.toString(); // 直接返回原始数字，不格式化
  }
};
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
      padding-left: 5px;
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
      }
      .body-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* 水平居中 */
        justify-content: center; /* 垂直居中 */
        text-align: left; /* 文字居中 */
        font-size: 14px;
        padding-left: 15px;
        color: #ffffff;
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
:deep(.el-input__prefix) {
  display: none;
}
:deep(.el-input__wrapper) {
  background-color: #0d2555;
  color: #7fa1f1;
  border-color: #0d2555;
  box-shadow: 0 0 0 1px #0d2555 inset;
}
/* 输入框内的文字颜色 */
:deep(.el-input__inner) {
  color: #7fa1f1;
  background-color: #0d2555;
}
/* 占位符的颜色 */
:deep(.el-input__inner::placeholder) {
  color: #7fa1f1;
}
</style>
