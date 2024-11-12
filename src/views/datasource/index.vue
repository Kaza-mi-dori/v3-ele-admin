<template>
  <div class="main-wrapper bg-white p-4">
    <!-- <h1>指标体系的增删查改</h1> -->
    <!-- <div class="g-title-block-3">
      <span class="__title">指标体系的增删查改</span>
    </div> -->
    <div>
      <div class="flex justify-between mb-4">
        <div>
          <el-input v-model="searchText" placeholder="请输入名称" />
        </div>
        <div>
          <el-button type="primary" icon="Plus" @click="handleAdd">
            新增
          </el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        stripe
        border
        class="w-full"
        :data="exampleData"
        element-loading-text="拼命加载中"
        :header-cell-style="{
          'background-color': sassvariables['custom-table-header-background'],
          color: sassvariables['custom-table-header-color'],
          'text-align': 'center',
        }"
      >
        <el-table-column type="selection" align="center" width="55">
          <template v-slot="scope">
            <el-checkbox v-model="scope.row.checked" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="150" sortable>
          <template v-slot="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="产品来源" width="150" sortable>
          <template v-slot="scope">
            <span>{{ scope.row.dataFrom }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="产品编号" width="150" sortable>
          <template v-slot="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="产品类型" width="150" sortable>
          <template v-slot="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150" sortable>
          <template v-slot="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import sassvariables from "@/styles/variables.module.scss";

const exampleData = ref([
  {
    name: "指标体系1",
    dataFrom: "数据来源1",
    number: "编号1",
    type: "类型1",
    status: "状态1",
  },
  {
    name: "指标体系2",
    dataFrom: "数据来源2",
    number: "编号2",
    type: "类型2",
    status: "状态2",
  },
  {
    name: "指标体系3",
    dataFrom: "数据来源3",
    number: "编号3",
    type: "类型3",
    status: "状态3",
  },
]);

const loading = ref(false);

const searchText = ref("");

const handleAdd = () => {
  console.log("新增");
};

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style lang="scss" scoped>
.g-title-block-3 {
  @apply flex justify-between items-center mb-4 h-8;
  .__title {
    @apply font-bold ml-1 mr-1 text-lg;
  }
}
</style>
