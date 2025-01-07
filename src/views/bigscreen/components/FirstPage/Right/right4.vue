<template>
  <Model1 class="model1" title="监控视频">
    <div class="flex justify-between items-center mb-2 mr-2 pl-5">
      <el-select
        v-model="monitorArea"
        class="monitor-selector"
        style="width: 200px"
        placeholder="请选择"
      >
        <el-option label="监控1" value="1" />
        <el-option label="监控2" value="2" />
        <el-option label="监控3" value="3" />
        <el-option label="监控4" value="4" />
      </el-select>
      <a class="text-sm link" @click="onCheckMore">更多>></a>
    </div>
    <div class="box1">
      <div v-for="k in 4" :key="k" class="item-box">
        <span>监控{{ k }}</span>
      </div>
    </div>
  </Model1>
</template>

<script setup lang="ts">
import Item1 from "../DescribeItems/Item1.vue";
import inventory from "@/views/bigscreen/img/inventory.png";
import business from "@/views/bigscreen/img/business.png";
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  // 受控属性，如果传入则改变一次
  monitorAreaProp: {
    type: String,
    default: "1",
  },
});

const oilStorage = ref<string>("254,38");
const oilBargain = ref<string>("254,38");
const monitorArea = ref<string>("1");
const router = useRouter();
const onCheckMore = async () => {
  const route = router.resolve({
    name: "Monitor",
  });
  window.open(route.href, "_blank");
};

watch(
  () => props.monitorAreaProp,
  (newVal) => {
    monitorArea.value = newVal;
  }
);
</script>

<style lang="scss" scoped>
.box1 {
  // 四宫格布局
  @apply flex items-center w-full flex-wrap pl-4 pr-4 pt-2;
  .item-box {
    width: calc(50% - 10px);
    margin: 5px;
    height: 100px;
    border: 1px solid #fff;
  }
}

.link {
  color: $bigscreen-primary-color-1;
  &:hover {
    text-decoration: underline;
  }
}

.model1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.monitor-selector) {
  .el-select__wrapper {
    // border: 1px solid #fff;
    background-color: transparent;
    .el-select__selected-item.el-select__placeholder {
      color: #fff;
    }
  }
}
</style>
