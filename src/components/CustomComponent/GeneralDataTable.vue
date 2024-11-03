<!-- 主要为对应台账管理，表头应该有筛选按钮，重点在列的定义 -->
<template>
  <div>
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">标题</div>
      <div class="__stat">
        <span class="__item">统计指标一</span>
        <span class="__item">统计指标二</span>
      </div>
    </div>
    <!-- 筛选操作区 -->
    <div class="filter-block">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        style="width: 200px"
      />
      <el-select
        v-model="selectedItems"
        multiple
        placeholder="请选择"
        style="width: 200px"
      >
        <el-option
          v-for="item in selectableOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <!-- 表格操作区 -->
    <div class="op-block">
      <el-button type="primary" @click="handleFilter">更多条件</el-button>
    </div>
    <!-- 表格区 -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const date = ref("");
const selectedItems = ref([]);
const selectableOptions = ["选项一", "选项二", "选项三"];
const handleFilter = () => {
  console.log("更多条件");
};
</script>

<style lang="scss" scoped>
.title-block {
  @apply m-1;
  .__title {
    @apply text-xl font-bold relative pl-3 mb-2;
    &::after {
      @apply block h-full w-1.25 bg-blue-5 absolute left-0 top-0;
      content: "";
    }
  }
  .__stat {
    @apply flex pl-3;
    .__item {
      @apply m-1 text-sm text-gray-5;
    }
  }
}

.filter-block {
  @apply flex m-1 items-center pl-3;
  .el-date-picker,
  .el-select {
    @apply m-1;
  }
}

.op-block {
  @apply flex m-1 items-center justify-end;
}
</style>
