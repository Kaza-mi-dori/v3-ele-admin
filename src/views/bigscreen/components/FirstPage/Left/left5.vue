<template>
  <div class="model1">
    <div class="custom-tab">
      <div class="__header">
        <span class="title">
          <el-select
            v-model="year"
            size="small"
            class="year-select"
            @change="onChangeYear"
          >
            <el-option v-for="item in years" :key="item" :value="item" />
          </el-select>
        </span>
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
    <div class="content" style="min-height: 320px">
      <template v-if="selectedItem === '经营主体'">
        <Left51 style="flex: 1" :year="year" />
      </template>
      <template v-else-if="selectedItem === '主营产品'">
        <Left52 style="flex: 1; margin: auto 0" :year="year" />
      </template>
      <template v-else-if="selectedItem === '业态类型'">
        <div class="flex flex-gap-2 flex-1">
          <Left53 style="flex: 1" :year="year" />
          <Left54 style="flex: 1" :year="year" />
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

const currentYear = new Date().getFullYear(); //
const years = ref(Array.from({ length: 10 }, (_, i) => currentYear - i));
const year = ref(currentYear);

const onClickItem = (item: string) => {
  selectedItem.value = item;
};

// const onChangeYear = (value: number) => {
//   console.log(value);
// };
</script>

<style lang="scss" scoped>
$color-primary: #42cdff;
$color-active: #fff;

.model1 {
  @apply flex flex-1 flex-col h-full;
}

:deep(.year-select) {
  width: 100px;
  &.el-select {
    .el-select__wrapper {
      background-color: transparent !important;
      border: none;
      color: white;
      font-size: 1rem;
      .el-select__placeholder {
        color: white;
      }
    }
  }
}

:deep(.el-tabs) {
  .el-tabs__header.is-top {
    /** 设置背景 */
    background-image: url("@/views/bigscreen/img/left_box2_top.png");
    background-size: 100% 100%;
  }
  .el-tabs__item.is-top {
    /** 选中时根据是否为第一个元素设置不同背景图 */
    @apply p-0;
    margin-right: 10px;

    &:not(:nth-child(2)).is-active {
      @apply pl-2.5;
      color: $color-active;
      background-size: 100% 100%;
      padding-right: 20px;
      background-image: url("@/views/bigscreen/img/left_tab2.png");
    }
    &:nth-child(2).is-active {
      @appply pl-[5px];
      color: $color-active;
      background-size: 100% 100%;
      padding-right: 20px;
      background-image: url("@/views/bigscreen/img/left_tab1.png") !important;
    }
  }
}

.custom-tab {
  @apply flex;
  background-size: 100% 100%;
  .__header {
    @apply flex items-center w-full;
    background-image: url("@/views/bigscreen/img/left_box2_top.png");
    padding: 5px 0;
    .custom-tab-pane {
      @apply text-center cursor-pointer;
      width: 100px;
      font-size: 0.9rem;
      color: $color-primary;
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
    .title {
      font-size: 18px;
      color: #fff;
      z-index: 1;
      margin: 0 1rem;
      font-family: 黑体;
      @apply text-center;
    }
  }
}

.content {
  /** 设置背景 */
  background-image: url("@/views/bigscreen/img/left_box2_center.png");
  @apply flex items-center;
}
.footer {
  height: 10px;
  width: 100%;
  background-image: url("@/views/bigscreen/img/left_box2_bottom.png");
  background-size: 100% 100%;
}
</style>
