<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">合同台账</div>
      <div class="__stat">
        <span class="__item">共有</span>
        <span class="__item">
          <span class="text-blue-5 inline-block ml-1 mr-1">
            {{ pagination.total }}
          </span>
          条合同记录
        </span>
        <!-- <span class="__item">
          <span class="text-red-5 inline-block ml-1 mr-1">
            {{ riskAmount }}
          </span>
          ,条合同可能存在风险
        </span> -->
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
        <el-button icon="ArrowUp" disabled>导出excel</el-button>
        <el-button icon="ArrowDown" disabled>导入excel</el-button>
        <el-popover
          v-model:visible.sync="popoverVisible"
          placement="bottom"
          width="150"
          trigger="click"
        >
          <template v-slot:reference>
            <el-button>筛选显示列</el-button>
          </template>
          <el-checkbox-group v-model="checkedColumns">
            <el-checkbox label="来源" />
            <el-checkbox label="名称" />
            <el-checkbox label="合同编号" />
            <el-checkbox label="合同类型" />
            <el-checkbox label="合同类别" />
            <el-checkbox label="状态" />
            <el-checkbox label="履约期限" />
            <el-checkbox label="是否审核" />
            <el-checkbox label="有履约风险" />
            <el-checkbox label="金额" />
            <el-checkbox label="税率" />
            <el-checkbox label="税额" />
            <el-checkbox label="币种" />
            <el-checkbox label="我方名称" />
            <el-checkbox label="合同相对方" />
            <el-checkbox label="说明" />
          </el-checkbox-group>
        </el-popover>
        <el-dropdown class="ml-2">
          <el-button>
            更多功能
            <el-icon>
              <ArrowDown />
            </el-icon>
          </el-button>
          <template v-slot:dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="showImportDingTalkContractLedgerDialog">
                <span>导入钉钉台账</span>
              </el-dropdown-item>
              <el-dropdown-item @click="handleBatchAudit">
                <span>批量审核</span>
              </el-dropdown-item>
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
      :data="exampleData"
      row-key="id"
      element-loading-text="拼命加载中"
      :header-cell-style="{
        'background-color': sassvariables['custom-table-header-background'],
        color: sassvariables['custom-table-header-color'],
        'text-align': 'center',
      }"
      :row-class-name="tableRowCustom"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55">
        <!-- <template v-slot="scope">
          <el-checkbox v-model="scope.row.checked" />
        </template> -->
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('来源')"
        key="数据源"
        prop="数据源"
        label="数据来源"
        width="150"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.数据源 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('名称')"
        key="合同名称"
        prop="合同名称"
        label="合同名称"
        width="350"
        sortable
        align="center"
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            {{ scope.row.合同名称 || "-" }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('合同编号')"
        key="合同编号"
        prop="合同编号"
        label="合同编号"
        width="150"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.合同编号 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('合同类型')"
        key="合同类型"
        prop="合同类型"
        label="合同类型"
        width="150"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.合同类型 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-if="checkedColumns.includes('合同类别')"
        key="category"
        prop="category"
        label="合同类别"
        width="150"
        sortable align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="number"
        label="状态"
        sortable
        align="center"
        width="150"
      >
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
      <el-table-column
        v-if="checkedColumns.includes('履约期限')"
        key="date"
        prop="date"
        label="履约期限"
        width="150"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <span>{{ (scope.row.内容 && scope.row.内容.履约期限) || "-" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-if="checkedColumns.includes('是否审核')"
        key="audited"
        prop="audited"
        label="是否审核"
        width="150"
        sortable align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.audited ? "是" : "否" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        v-if="checkedColumns.includes('有履约风险')"
        key="isRisk"
        prop="isRisk"
        label="有履约风险"
        width="100"
        align="center"
      >
        <template v-slot="scope">
          <el-tag
            v-if="scope.row.isRisk"
            type="danger"
            effect="dark"
            size="small"
          >
            是
          </el-tag>
          <el-tag v-else effect="dark" size="small">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('金额')"
        key="含税金额"
        prop="含税金额"
        label="含税金额(万元)"
        width="150"
        align="right"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.含税金额 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-if="checkedColumns.includes('税率')"
        key="tax"
        prop="tax"
        label="税率"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.tax }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        v-if="checkedColumns.includes('税额')"
        key="taxAmount"
        prop="taxAmount"
        label="税额"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.taxAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('币种')"
        key="currency"
        prop="currency"
        label="币种"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        v-if="checkedColumns.includes('我方名称')"
        key="我方名称"
        prop="我方名称"
        label="我方名称"
        min-width="200"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.我方名称 || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('合同相对方')"
        key="合同相对方"
        prop="相对人名称"
        label="合同相对方"
        min-width="200"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.相对人名称 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('说明')"
        key="description"
        prop="description"
        label="合同说明"
        sortable
        align="center"
        min-width="150"
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <span>{{ scope.row.内容 ? scope.row.内容.合同说明 : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <div class="w-full flex justify-evenly">
            <!-- <el-button type="text" @click="handleViewDetail(scope.row)">
              详情
            </el-button>
            <el-button type="text">编辑</el-button> -->
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
      class="mt-2 pb-4 flex justify-end"
      background
      layout="total, prev, sizes, pager, next, jumper"
      :page-sizes="pagination.pageSizes"
      :total="pagination.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 底部操作区 -->
    <ImportExcelDialog
      ref="importExcelDialogRef"
      :uploadUrl="uploadDingTalkContractLedgerExcelUrl"
      :uploadName="'Excel文件'"
      @submit="handleImportDingTalkContractLedgerExcel"
    />
  </div>
</template>

<script setup lang="ts">
import Filter from "@/components/Business/filter.vue";
import SearchBar from "@/components/CustomComponent/SearchBar.vue";
import business from "@/types/business";
import sassvariables from "@/styles/variables.module.scss";
import BusinessStandbookAPI from "@/api/businessStandBook";
import {
  handleDeleteRow,
  handleAuditRow,
  handleBatchAuditRows,
  handleBatchDeleteRows,
} from "@/hooks/useTableOp";
import { ref } from "vue";
import type { Ref } from "vue";
import { toThousands } from "@/utils";
import { useRouter } from "vue-router";
import ImportExcelDialog from "@/components/Dialogs/importExcelDialog.vue";
import { getToken } from "@/utils/auth";
import { ElMessage, type TableInstance } from "element-plus";
const router = useRouter();
const uploadDingTalkContractLedgerExcelUrl =
  import.meta.env.VITE_APP_API_URL_DEV +
  "/Api/Business/ContractLedgerShow/ReadFromDingExcel";
const uploadDingTalkContractLedgerExcelHeaders = {
  Authorization: getToken(),
};
const popoverVisible: Ref<boolean> = ref(false);
const checkedColumns: Ref<string[]> = ref([
  "来源",
  "名称",
  "合同编号",
  "合同类型",
  "合同类别",
  "状态",
  "履约期限",
  "是否审核",
  "有履约风险",
  "金额",
  "合同相对方",
  "说明",
]);

type IExampleData = business.IAuditableEntity<business.IContract>;

const loading: Ref<boolean> = ref(false);
const exampleData: Ref<IExampleData[]> = ref([]);
const selectedRows: Ref<any[]> = ref([]);
const tableRef = ref<Nullable<TableInstance>>(null);
const queryForm: Ref<any> = ref({
  状态集合: undefined,
  数据源集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  页码: 1,
  页容量: 10,
});
const pagination: Ref<any> = ref({
  total: 100,
  pageSizes: [10, 20, 30, 40, 50],
  pageSize: 10,
  currentPage: 1,
});
const riskAmount = ref(0);
const importDingTalkContractLedgerDialogVisible = ref(false);
const importExcelDialogRef = ref<InstanceType<typeof ImportExcelDialog>>();
/** 表格操作回调 */
const handleCurrentChange = (currentPage: number) => {
  pagination.value.currentPage = currentPage;
  initTableData();
};

const handleSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize;
  initTableData();
};

const handleViewDetail = (row: IExampleData) => {
  router.push({
    name: "ReportForm",
    query: {
      type: "contractDetail",
      id: row.id,
    },
  });
};
const handleAddRecord = () => {
  router.push({
    name: "ReportForm",
    query: {
      type: "contractDetail",
    },
  });
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
    BusinessStandbookAPI.editContractLedgerRecord,
    "状态",
    "有效",
    initTableData
  );
};

const handleResetAudit = (row: any) => {
  handleAuditRow(
    row,
    BusinessStandbookAPI.editContractLedgerRecord,
    "状态",
    "无效",
    initTableData
  );
};

const handleDelete = (row: IExampleData) => {
  handleDeleteRow(row, BusinessStandbookAPI.deleteContractLedgerRecord, () => {
    initTableData();
  });
};
const tableRowCustom = ({ row, rowIndex }: any) => {
  return row.isRisk ? "danger-row" : "";
};
const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  {
    label: "合同类型",
    prop: "type",
    value: null,
    options: ["全部", "采购", "销售"],
    inputType: "select",
    order: 1,
  },
  {
    label: "状态",
    prop: "状态",
    value: null,
    options: ["全部", "待审核", "已审核"],
    inputType: "select",
    order: 2,
  },
  {
    label: "日期",
    prop: "daterange",
    value: [null, null],
    inputType: "daterange",
    order: 3,
  },
  // {
  //   label: "合同编号",
  //   prop: "number",
  //   value: null,
  //   selected: null,
  //   inputType: "input",
  // },
  {
    label: "数据来源",
    prop: "数据源",
    value: null,
    options: ["全部", "泛微系统", "钉钉", "其他"],
    inputType: "select",
  },
]);
const handleConfirmFilter = (filter: any) => {
  const params = {
    页码: pagination.value.currentPage,
    页容量: pagination.value.pageSize,
    ...filter,
  };
  if (params["daterange"]) {
    params["日期早于"] = params["daterange"][1];
    params["日期晚于"] = params["daterange"][0];
    delete params["daterange"];
  }
  params["状态集合"] = params["状态"]
    ? params["状态"] === "全部"
      ? undefined
      : [params["状态"]]
    : undefined;
  queryForm.value = params;
  initTableData();
};

const handleSelectionChange = (selection: any) => {
  console.log(selection);
  selectedRows.value = selection;
};

const initTableData = () => {
  loading.value = true;
  BusinessStandbookAPI.getContractLedgerRecordList({
    ...queryForm.value,
    页码: pagination.value.currentPage,
    页容量: pagination.value.pageSize,
  })
    .then((res: any) => {
      exampleData.value = res["当前记录"];
      pagination.value.total = +res["记录总数"];
      loading.value = false;
    })
    .catch((err) => {
      console.error(err);
      loading.value = false;
    });
};

const showImportDingTalkContractLedgerDialog = () => {
  importExcelDialogRef.value?.open();
};

const handleImportDingTalkContractLedgerExcel = async (data: any) => {
  importExcelDialogRef.value?.setSubmitLoading(true);
  BusinessStandbookAPI.batchAddEditContractLedgerRecord(data)
    .then((res: any) => {
      importExcelDialogRef.value?.setSubmitLoading(false);
      importExcelDialogRef.value?.handleClose();
      ElMessage.success("导入成功");
      initTableData();
    })
    .catch((err) => {
      importExcelDialogRef.value?.setSubmitLoading(false);
      ElMessage.error("导入失败");
      console.error(err);
    });
};

const handleBatchAudit = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要审核的数据");
    return;
  }
  handleBatchAuditRows(
    selectedRows.value,
    BusinessStandbookAPI.editContractLedgerRecord,
    "状态",
    "有效",
    initTableData
  );
};

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  handleBatchDeleteRows(
    selectedRows.value,
    BusinessStandbookAPI.deleteContractLedgerRecordByIds,
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

// 表格行样式
// 风险合同
:deep(.el-table) {
  .danger-row {
    background-color: #f8d9ca !important;
  }
}
</style>
