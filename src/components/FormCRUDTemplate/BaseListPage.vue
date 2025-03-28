<template>
  <div class="base-list-page">
    <!-- 标题区域 -->
    <div class="title-block">
      <div class="__title">{{ config.title }}</div>
      <div class="__stat">
        <slot name="statistics">
          <span class="__item">当前有</span>
          <span class="__item">
            <span class="text-red-5 mr-2">{{ pagination.total }}</span>
            <span>{{ config.countUnit || "条记录" }}</span>
          </span>
          <span v-for="(item, index) in otherDesc" :key="index" class="__item">
            <span class="text-red-5 mr-2">{{ item.total }}</span>
            <span>{{ item.desc }}</span>
          </span>
        </slot>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="search-bar-wrapper">
      <slot name="filter">
        <SearchBar
          :itemList="config.filterItems"
          @confirmFilter="handleConfirmFilter"
          @reset-filter="handleResetFilter"
        />
      </slot>
    </div>

    <!-- 操作区域 -->
    <div class="op-block">
      <slot name="leftOperations">
        <el-button
          v-if="config.addButtonVisible"
          type="primary"
          @click="$emit('add')"
        >
          {{ config.addButtonText || "新增数据" }}
        </el-button>
      </slot>
      <slot name="rightOperations">
        <div>
          <el-button
            v-if="config.exportVisible"
            icon="ArrowUp"
            @click="$emit('export')"
          >
            {{ config.exportButtonText || "导出excel" }}
          </el-button>
          <slot name="moreOperations" />
        </div>
      </slot>
    </div>

    <!-- 表格区域 -->
    <!-- <el-table
      ref="tableRef"
      v-loading="loading"
      stripe
      border
      class="w-full"
      :data="tableData"
      @selection-change="(selection) => $emit('selection-change', selection)"
    >
      <slot />
    </el-table> -->
    <slot name="table" />

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      class="mt-2 flex justify-end mb-4"
      background
      layout="total, prev, pager, next, jumper"
      :total="pagination.total"
      @current-change="(page) => $emit('page-change', page)"
    />

    <!-- 其他自定义插槽 -->
    <slot name="dialogs" />
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/components/CustomComponent/SearchBar.vue";
import { ref } from "vue";
import { ElTable } from "element-plus";

const emit = defineEmits([
  "add",
  "export",
  "page-change",
  "selection-change",
  "confirm-filter",
  "reset-filter",
]);
const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  tableData: {
    type: Array,
    required: true,
  },
  pagination: {
    type: Object,
    required: true,
  },
  otherDesc: {
    type: Array,
    required: false,
  },
});
const tableRef = ref<InstanceType<typeof ElTable>>();
const loading = ref(false);
const pagination = computed(() => props.pagination);

// 在这一层
const handleConfirmFilter = (value: any) => {
  emit("confirm-filter", value);
};

const handleResetFilter = () => {
  emit("reset-filter");
};
</script>

<style scoped lang="scss">
.main-wrapper {
  @apply p-10px h-full;
}

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
    @apply flex;
    .__item {
      @apply m-1 text-sm text-gray-5;
    }
  }
}
// 检索区外部
.search-bar-wrapper {
  @apply bg-white rounded-md shadow-sm;
  // margin: 10px;
}

.op-block {
  @apply flex justify-between;
  margin-block: 10px;
}

.table-header-custom {
  background-color: lightcyan !important;
}
</style>
