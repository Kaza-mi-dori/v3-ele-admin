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
