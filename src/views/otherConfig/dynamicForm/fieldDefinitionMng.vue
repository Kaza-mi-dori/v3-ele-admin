<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">表单字段定义</div>
      <div class="__stat">
        <span class="__item">当前共定义了</span>
        <span class="__item">
          <span>
            <span class="text-red-5 mr-2">{{ pagination.total || 0 }}</span>
            <span>个字段</span>
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
      row-key="id"
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
      <!-- 关联表单 -->
      <el-table-column
        prop="表单定义编号"
        label="所属表单"
        align="center"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.表单定义编号 }}</span>
        </template>
      </el-table-column>
      <!-- 编号 -->
      <el-table-column
        prop="编号"
        label="编号"
        align="center"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.编号 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="类型"
        label="字段类型"
        align="center"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.类型 }}</span>
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
      <!-- 描述 -->
      <el-table-column prop="描述" label="描述" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.描述 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 时间精度 -->
      <el-table-column prop="时间精度" label="时间精度" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.时间精度 || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <div class="w-full flex justify-evenly">
            <el-button type="text" @click="handleViewDetail(scope.row)">
              详情
            </el-button>
            <el-button type="text" @click="handleUpdateDetail(scope.row)">
              编辑
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
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增数据定义" width="30%" center>
      <el-form
        ref="itemFormRef"
        :model="itemForm"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="类别" prop="type">
          <el-select v-model="itemForm.type" disabled placeholder="请选择">
            <el-option label="其他数据" value="其他数据" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="itemForm.name"
            placeholder="请输入数据大类名称(例如：市场日数据)"
          />
        </el-form-item>
        <el-form-item label="数据细分名称1" prop="name2">
          <el-input
            v-model="itemForm.name2"
            placeholder="请输入数据细分名称(例如: 原油价格)"
          />
        </el-form-item>
        <el-form-item label="数据细分名称2" prop="name3">
          <el-input
            v-model="itemForm.name3"
            placeholder="请输入数据细分名称(例如: 中海油报价)"
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input
            v-model="itemForm.unit"
            placeholder="请输入单位，如：元/吨"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="itemForm.status" placeholder="请选择">
            <el-option label="正常" value="正常" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="order">
          <el-input
            v-model="itemForm.order"
            type="number"
            placeholder="请输入显示顺序"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="itemForm.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="submitItemLoading"
            @click="onSubmitItemForm"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import sassvariables from "@/styles/variables.module.scss";
import { DynamicFormFieldAPI } from "@/api/dynamicForm/definition";

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40, 50],
  total: 0,
});

const tableData = ref([]);
const loading = ref(false);
const itemForm = ref({});
const itemFormRef = ref();
const dialogVisible = ref(false);
const submitItemLoading = ref(false);
const rules = ref({});

const filterItemList = ref([
  {
    label: "类别",
    prop: "type",
    type: "select",
    options: [
      {
        label: "其他数据",
        value: "其他数据",
      },
    ],
  },
]);

const handleConfirmFilter = () => {
  console.log(filterItemList.value);
};

const handleResetFilter = () => {
  console.log("reset");
};

const handleAddRecord = () => {
  console.log("add");
};

const handleViewDetail = (row: any) => {
  console.log(row);
};

const handleUpdateDetail = (row: any) => {
  console.log(row);
};

const handleDeleteRecord = (row: any) => {
  console.log(row);
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

onMounted(() => {
  // console.log("mounted");
  DynamicFormFieldAPI.getDynamicFormFieldList({
    页面: pagination.value.currentPage,
    页容量: pagination.value.pageSize,
  }).then((res: any) => {
    // console.log(res);
    tableData.value = res["当前记录"] || [];
    pagination.value.total = res["记录总数"] || 0;
  });
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
