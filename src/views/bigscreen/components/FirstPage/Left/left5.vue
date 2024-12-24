<template>
  <div class="model1">
    <div class="custom-tab">
      <div class="__header">
        <div
          v-for="item of items"
          :key="item"
          :class="{
            'custom-tab-pane': true,
            'is-active': item === selectedItem,
          }"
          @click="onClickItem(item)"
        >
          <div>{{ item }}</div>
        </div>
      </div>
    </div>
    <div class="content" style="min-height: 250px">
      <template v-if="selectedItem === '经营主体'">
        <Left51 />
      </template>
      <template v-else-if="selectedItem === '主营产品'">
        <Left52 style="margin: auto 0" />
      </template>
      <template v-else-if="selectedItem === '业态类型'">
        <div class="flex flex-gap-2">
          <Left53 style="flex: 1" />
          <Left54 style="flex: 1" />
        </div>
      </template>
    </div>
    <div class="footer" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import tabBg from "@/views/bigscreen/img/left_tab2.png";
import tabBgFirst from "@/views/bigscreen/img/left_tab1.png";
import boxTop from "@/views/bigscreen/img/left_box2_top.png";
import Left51 from "./Components/left51.vue";
import Left52 from "./Components/left52.vue";
import Left53 from "./Components/left53.vue";
import Left54 from "./Components/left54.vue";

const items = ref(["经营主体", "主营产品", "业态类型"]);
const selectedItem = ref("经营主体");

// const props = defineProps<{
//   title: string;
//   icon: string;
//   target: number;
//   fulfilled: number;
//   yoy: number;
// }>();

const onClickItem = (item: string) => {
  selectedItem.value = item;
};
</script>

<style lang="scss" scoped>
$color-primary: #42cdff;
$color-active: #fff;

.model1 {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}

:deep(.el-tabs) {
  .el-tabs__header.is-top {
    /** 设置背景 */
    background-image: url("@/views/bigscreen/img/left_box2_top.png");
    background-size: 100% 100%;
  }
  .el-tabs__item.is-top {
    /** 选中时根据是否为第一个元素设置不同背景图 */
    padding: 0;
    margin-right: 10px;

    &:not(:nth-child(2)).is-active {
      color: #fff;
      background-size: 100% 100%;
      padding-left: 10px;
      padding-right: 20px;
      background-image: url("@/views/bigscreen/img/left_tab2.png");
    }
    &:nth-child(2).is-active {
      color: #fff;
      background-size: 100% 100%;
      padding-left: 5px;
      padding-right: 20px;
      background-image: url("@/views/bigscreen/img/left_tab1.png") !important;
    }
  }
}

.custom-tab {
  display: flex;
  background-size: 100% 100%;
  .__header {
    width: 100%;
    display: flex;
    background-image: url("@/views/bigscreen/img/left_box2_top.png");
    align-items: center;
    padding: 5px 0;
    .custom-tab-pane {
      width: 100px;
      font-size: 0.9rem;
      text-align: center;
      color: $color-primary;
      cursor: pointer;
      transition: all 0.3s;
      &:not(:nth-child(1)).is-active {
        color: $color-active;
        background-size: 100% 100%;
        background-image: url("@/views/bigscreen/img/left_tab2.png");
      }
      &:nth-child(1).is-active {
        color: $color-active;
        background-size: 100% 100%;
        background-image: url("@/views/bigscreen/img/left_tab1.png") !important;
      }
    }
  }
}

.content {
  /** 设置背景 */
  background-image: url("@/views/bigscreen/img/left_box2_center.png");
}
.footer {
  height: 10px;
  width: 100%;
  background-image: url("@/views/bigscreen/img/left_box2_bottom.png");
  background-size: 100% 100%;
}
</style>
