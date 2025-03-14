<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">表单定义</div>
      <div class="__stat">
        <span class="__item">当前共定义了</span>
        <span class="__item">
          <span>
            <span class="text-red-5 mr-2">{{ pagination.total || 0 }}</span>
            <span>个表单</span>
          </span>
        </span>
      </div>
    </div>
    <!-- 筛选操作区 -->
    <!-- <Filter /> -->
    <div class="search-bar-wrapper">
      <SearchBar
        :itemList="filterItemList"
        @confirmFilter="handleConfirmFilter"
        @resetFilter="handleResetFilter"
      />
    </div>
    <!-- 表格操作区 -->
    <div class="op-block">
      <div>
        <el-button type="primary" @click="handleAddRecord">新增</el-button>
      </div>
      <div>
        <el-button icon="ArrowUp">导出excel</el-button>
        <el-button icon="ArrowDown">导入excel</el-button>
        <el-dropdown class="ml-2">
          <el-button>
            更多功能
            <el-icon>
              <ArrowDown />
            </el-icon>
          </el-button>
          <template v-slot:dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <span class="text-red-5">批量删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 表格区 -->
    <el-table
      v-loading="loading"
      stripe
      border
      class="w-full"
      :data="tableData"
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
      <!-- 编号 -->
      <el-table-column prop="编号" label="编号" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.编号 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column
        prop="名称"
        label="名称"
        width="150"
        align="center"
        sortable
      >
        <template v-slot="scope">
          <el-link type="primary" @click="handleUpdateDetail(scope.row)">
            {{ scope.row.名称1 || "-" }}
          </el-link>
        </template>
      </el-table-column>
      <!-- 类型 -->
      <el-table-column
        prop="类型"
        label="类型"
        align="center"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.类型 }}</span>
        </template>
      </el-table-column>
      <!-- 表名 -->
      <el-table-column
        prop="表名"
        label="表名"
        width="150"
        align="center"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.表名 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 描述 -->
      <el-table-column
        prop="描述"
        label="描述"
        width="150"
        align="center"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.描述 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 数据时间类型 -->
      <el-table-column
        prop="数据时间类型"
        label="数据时间类型"
        align="center"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.数据时间类型 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 启用行级权限 -->
      <el-table-column
        prop="开启行级权限"
        label="开启行级权限"
        align="center"
        width="150"
      >
        <template v-slot="scope">
          <span>{{ scope.row.开启行级权限 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <div class="w-full flex justify-evenly">
            <el-button type="text" @click="handleViewDetail(scope.row)">
              详情
            </el-button>
            <el-link type="danger" @click="handleDeleteRecord(scope.row)">
              删除
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      class="mt-2 pb-4 flex justify-end"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pagination.pageSizes"
      :total="pagination.total"
      @current-change="handleCurrentChange"
      @size-change="handleDataSizeChange"
    />
    <!-- 底部操作区 -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DynamicFormAPI } from "@/api/dynamicForm";
import { handleDeleteRow } from "@/hooks/useTableOp";
import sassvariables from "@/styles/variables.module.scss";
import { useRouter } from "vue-router";

const router = useRouter();

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40, 50],
  total: 0,
});

const tableData = ref([]);
const loading = ref(false);
const itemForm = ref({
  type: "",
  name: "",
  name2: "",
  name3: "",
  unit: "",
  status: "",
  order: "",
});
const itemFormRef = ref();
const dialogVisible = ref(false);
const submitItemLoading = ref(false);
const rules = ref({});

const filterItemList = ref([
  {
    label: "类别",
    prop: "type",
    type: "select",
    options: [],
  },
]);

const handleConfirmFilter = () => {
  console.log(filterItemList.value);
};

const handleResetFilter = () => {
  console.log("reset");
};

const handleAddRecord = () => {
  // console.log("add");
  router.push({
    name: "DynamicFormDefinitionDetail",
  });
};

const handleViewDetail = (row: any) => {
  // itemForm.value = row;
  // dialogVisible.value = true;
  router.push({
    name: "DynamicFormDefinitionDetail",
    query: {
      id: row.id,
    },
  });
};

const handleEditRecord = (row: any) => {
  // console.log(row);
  dialogVisible.value = true;
};

const handleUpdateDetail = (row: any) => {
  console.log(row);
};

const handleDeleteRecord = (row: any) => {
  handleDeleteRow(row, DynamicFormAPI.deleteDynamicFormDefinition, () => {
    initTableData();
  });
};

const handleCurrentChange = (currentPage: number) => {
  console.log(currentPage);
};

const handleDataSizeChange = (pageSize: number) => {
  console.log(pageSize);
};

const handleExportExcel = () => {
  console.log("export");
};

const initTableData = async () => {
  const res: any = await DynamicFormAPI.getDynamicFormDefinitionList({
    page: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  });
  tableData.value = res["当前记录"] || [];
  pagination.value.total = res["记录总数"] || 0;
};

onMounted(() => {
  initTableData();
});
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
