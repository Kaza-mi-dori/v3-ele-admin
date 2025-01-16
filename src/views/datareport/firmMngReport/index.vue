<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">企业经营报表</div>
      <div class="__stat">
        <span class="__item">当前有</span>
        <span class="__item">
          <span>
            <span class="text-red-5 mr-2">{{ pagination.total }}</span>
            <span>份报表</span>
          </span>
        </span>
        <!-- <span class="__item">统计指标二</span> -->
      </div>
    </div>
    <!-- 筛选操作区 -->
    <!-- <Filter /> -->
    <div class="search-bar-wrapper">
      <SearchBar
        :itemList="filterItemList"
        @confirmFilter="handleConfirmFilter"
        @reset-filter="handleResetFilter"
      />
    </div>
    <!-- 表格操作区 -->
    <div class="op-block">
      <el-button type="primary" @click="handleAddRecord">新增数据</el-button>
      <div>
        <el-button icon="ArrowUp">导出excel</el-button>
        <el-button icon="ArrowDown">导入excel</el-button>
        <el-dropdown trigger="click" class="ml-4">
          <el-button>
            更多功能
            <el-icon>
              <ArrowDown />
            </el-icon>
          </el-button>
          <template v-slot:dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleBatchDelete">
                <span class="text-red-5">批量删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 表格区 -->
    <el-table
      ref="tableRef"
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
      @selection-change="handleSelectionChange"
    >
      <!-- 选择框列 -->
      <el-table-column type="selection" align="center" width="55">
        <!-- <template v-slot="scope">
          <el-checkbox v-model="scope.row.checked" />
        </template> -->
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60" align="center">
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            #{{ scope.$index + 1 }}
          </el-link>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="name"
        label="报表维度"
        width="120"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <span>
            {{ scope.row.类型 || "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="报表时间"
        width="200"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            {{ scope.row.日期 || "-" }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="企业名称" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.企业名称 || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="状态" sortable align="center">
        <template v-slot="scope">
          <span v-if="scope.row.状态 === '有效'" class="text-green-5">
            <!-- 打勾 -->
            <el-icon>
              <Check />
            </el-icon>
            已审核
          </span>
          <span v-else-if="scope.row.状态 === '无效'" class="text-red-5">
            <!-- 打叉 -->
            <el-icon>
              <Close />
            </el-icon>
            无效
          </span>
          <span v-else class="text-gray-5">
            <!-- 问号 -->
            <el-icon>
              <QuestionFilled />
            </el-icon>
            未审核
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template v-slot="scope">
          <div class="flex w-full justify-evenly">
            <!-- <el-link type="primary" @click="handleViewDetail(scope.row)">
              详情
            </el-link>
            <el-link type="primary" @click="handleViewDetail(scope.row)">
              编辑
            </el-link> -->
            <el-link
              v-if="scope.row['状态'] !== '有效'"
              type="primary"
              @click="handleAudit(scope.row)"
            >
              审核
            </el-link>
            <el-link
              v-if="scope.row['状态'] === '有效'"
              type="primary"
              @click="handleResetAudit(scope.row)"
            >
              设为无效
            </el-link>
            <el-link type="danger" @click="handleDelete(scope.row)">
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
      class="mt-2 flex justify-end mb-4"
      background
      layout="total, prev, pager, next, jumper"
      :total="pagination.total"
      @current-change="handleCurrentChange"
    />
    <!-- 底部操作区 -->
  </div>
</template>

<script setup lang="ts">
import Filter from "@/components/Business/filter.vue";
import SearchBar from "@/components/CustomComponent/SearchBar.vue";
import business from "@/types/business";
import sassvariables from "@/styles/variables.module.scss";
import { ref } from "vue";
import type { Ref } from "vue";
import { useRouter } from "vue-router";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import {
  handleAuditRow,
  handleDeleteRow,
  handleBatchDeleteRows,
} from "@/hooks/useTableOp";
import { ElMessage, ElMessageBox, type TableInstance } from "element-plus";
import { onMounted } from "vue";

const router = useRouter();

type IExampleData = business.IAuditableEntity<Partial<business.IGoods>>;

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  企业名称: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

const loading: Ref<boolean> = ref(false);
const exampleData: Ref<IExampleData[]> = ref([
  {
    name: "商品1",
    from: "供应商1",
    number: "123456",
    type: "类型1",
    status: "状态1",
    audited: true,
    dataFrom: "数据来源1",
    createdAt: "2021-09-01",
    updatedAt: "2021-09-02",
    createdBy: "管理员",
    updatedBy: "管理员",
  },
  {
    name: "商品2",
    from: "供应商2",
    number: "123457",
    type: "类型2",
    status: "状态2",
    audited: false,
    dataFrom: "数据来源2",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-04",
    createdBy: "管理员",
    updatedBy: "管理员",
  },
]);
const tableData = ref([]);
const selectedRows: Ref<any[]> = ref([]);
const tableRef = ref<Nullable<TableInstance>>(null);
const pagination: Ref<any> = ref({
  total: 100,
  pageSizes: [10, 20, 30, 40, 50],
  pageSize: 10,
  currentPage: 1,
});
const handleCurrentChange = (currentPage: number) => {
  pagination.value.currentPage = currentPage;
  initTableData();
};
const handleViewDetail = (row: any) => {
  router.push({
    name: "ReportForm",
    query: {
      id: row.id,
      type: "firmMngReport",
    },
  });
};
const handleDelete = (row: any) => {
  // 确认是否删除
  ElMessageBox.confirm("确定删除该记录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 判断是否为有效数据，如果是则不允许删除(提示)
      if (row.audited) {
        ElMessageBox.alert("已审核数据请联系管理员删除", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }
      // 删除操作
      BusinessFormAPI.deleteCompanyReportForm(row.id).then(() => {
        initTableData();
      });
    })
    .catch(() => {
      // 取消删除
      ElMessage.info("已取消删除");
    });
};
const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  // {
  //   label: "业务维度",
  //   prop: "业务维度",
  //   value: null,
  //   options: ["成品油", "燃料油", "原油", "化工产品", "LNG", "煤炭"],
  //   inputType: "select",
  //   order: 1,
  // },
  {
    label: "企业名称",
    prop: "企业名称",
    value: null,
    selected: null,
    inputType: "input",
    order: 1,
  },
  {
    label: "时间维度",
    prop: "类型",
    value: null,
    options: ["全部", "年", "月", "日"],
    inputType: "select",
    order: 2,
  },
  {
    label: "状态",
    prop: "状态集合",
    value: null,
    options: ["全部", "有效", "无效"],
    inputType: "select",
    order: 2,
  },
  {
    label: "时间跨度",
    prop: "时间跨度",
    value: [null, new Date()],
    selected: null,
    inputType: "daterange",
    order: 3,
  },
]);

const handleConfirmFilter = (value: any) => {
  queryForm.value = {
    ...queryForm.value,
    ...value,
  };
  initTableData();
};

const handleResetFilter = () => {
  queryForm.value = {
    业务维度: undefined,
    状态集合: undefined,
    日期早于: undefined,
    日期晚于: undefined,
    id集合: undefined,
    页码: 1,
    页容量: 20,
  };
  pagination.value.currentPage = 1;
  initTableData();
};

const handleAudit = (row: any) => {
  handleAuditRow(
    row,
    BusinessFormAPI.editCompanyReportForm,
    "状态",
    "有效",
    initTableData
  );
};

const handleResetAudit = (row: any) => {
  handleAuditRow(
    row,
    BusinessFormAPI.editCompanyReportForm,
    "状态",
    "无效",
    initTableData
  );
};

const handleSelectionChange = (selection: any) => {
  selectedRows.value = selection;
};

const initTableData = async () => {
  loading.value = true;
  try {
    const res: any = await BusinessFormAPI.getCompanyReportFormList({
      ...queryForm.value,
      页码: pagination.value.currentPage,
      页容量: pagination.value.pageSize,
    });
    tableData.value = res["当前记录"];
    pagination.value.total = +res["记录总数"];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleExportExcel = () => {
  console.log("导出excel");
};

const handleImportExcel = () => {
  console.log("导入excel");
};

const handleAddRecord = () => {
  router.push({
    name: "ReportForm",
    query: {
      type: "firmMngReport",
    },
  });
};

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  handleBatchDeleteRows(
    selectedRows.value,
    BusinessFormAPI.deleteCompanyReportFormByIds,
    initTableData
  );
};

onMounted(() => {
  initTableData();
});
</script>

<style lang="scss" scoped>
.main-wrapper {
  @apply p-10px;
  height: 100%;
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
