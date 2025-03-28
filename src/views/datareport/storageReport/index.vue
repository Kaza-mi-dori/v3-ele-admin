<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">企业库存报表</div>
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
        <el-button icon="ArrowUp" @click="onExportExcel">导出excel</el-button>
        <el-button icon="Download" @click="handleGetExcelTemplate">
          获取excel模板
        </el-button>
        <el-button icon="ArrowDown" @click="handleImportExcel">
          导入excel
        </el-button>
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
      <!-- 时间维度 -->
      <el-table-column prop="name" label="时间维度" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.时间维度 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 聚合标签 -->
      <el-table-column prop="name" label="报表类型" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.聚合模式 || "产品库存日报" }}</span>
        </template>
      </el-table-column>
      <!-- 数据日期 -->
      <el-table-column prop="name" label="数据日期" sortable align="center">
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            <span>{{ scope.row.数据日期 || "-" }}</span>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="企业名称" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.企业名称 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 产品类型 -->
      <el-table-column prop="name" label="产品类型" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.产品类型 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 产品名称 -->
      <el-table-column prop="name" label="产品名称" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.产品名称 || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="状态" label="状态" sortable align="center">
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
              v-if="checkIsAuditData(scope.row)"
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
    <!-- 导入excel -->
    <importExcelDialog
      ref="importExcelDialogRef"
      :upload-url="uploadUrl"
      :headers="uploadHeaders"
    />
    <!-- 选择导出条件 -->
    <el-dialog
      ref="exportConfigDialogRef"
      v-model="exportConfigDialogVisible"
      :close-on-click-modal="false"
      title="选择导出内容"
      width="50%"
      @close="handleCloseExportConfigDialog"
    >
      <el-form :model="exportForm" label-width="120px" label-position="top">
        <!-- 企业 -->
        <el-form-item label="企业">
          <el-radio-group v-model="exportForm.enterprise">
            <el-radio
              v-for="(value, key) in OurCompanyEnumMap"
              :key="key"
              :label="value"
            />
          </el-radio-group>
        </el-form-item>
        <!-- 企业年报还是企业月报 -->
        <el-form-item label="报表维度">
          <el-radio-group v-model="exportForm.timeScale">
            <el-radio label="年" />
            <el-radio label="月" />
            <el-radio label="日" />
          </el-radio-group>
        </el-form-item>
        <!-- 数据时间(根据企业月报或者企业年报选择) -->
        <el-form-item label="数据时间">
          <el-date-picker
            v-if="exportFormTimeScale !== 'day'"
            v-model="exportForm.dataTime"
            :type="exportFormTimeScale === 'year' ? 'year' : 'month'"
            :value-format="exportFormTimeScale === 'year' ? 'YYYY' : 'YYYY-MM'"
          />
          <el-date-picker
            v-else
            v-model="exportForm.dataTime"
            type="daterange"
            :value-format="'YYYY-MM-DD'"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseExportConfigDialog">取消</el-button>
        <el-button
          type="primary"
          :loading="exportLoading"
          :disabled="isDisabledExport"
          @click="handleConfirmExportConfig"
        >
          确认导出
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Filter from "@/components/Business/filter.vue";
import SearchBar from "@/components/CustomComponent/SearchBar.vue";
import business from "@/types/business";
import sassvariables from "@/styles/variables.module.scss";
import importExcelDialog from "@/components/Dialogs/importExcelDialog.vue";
import { OurCompanyEnumMap } from "@/enums/BusinessEnum";
import { ref } from "vue";
import type { Ref } from "vue";
import { useRouter } from "vue-router";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import { ElMessage, ElMessageBox, type TableInstance } from "element-plus";
import {
  handleDeleteRow,
  handleAuditRow,
  handleBatchDeleteRows,
} from "@/hooks/useTableOp";
import { onMounted } from "vue";
import { getToken } from "@/utils/auth";
import { getDateString } from "@/utils/time";
const router = useRouter();

const uploadUrl =
  import.meta.env.VITE_APP_BASE_API + "/excel/PartnerReportImport";
const uploadHeaders = {
  Authorization: getToken(),
};

type IExampleData = business.IAuditableEntity<Partial<business.IGoods>>;

const queryForm: Ref<any & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

const importExcelDialogRef = ref<InstanceType<typeof importExcelDialog>>();
const loading: Ref<boolean> = ref(false);
const tableData = ref([]);
const selectedRows: Ref<any[]> = ref([]);
const tableRef = ref<Nullable<TableInstance>>(null);
const pagination: Ref<any> = ref({
  total: 100,
  pageSizes: [10, 20, 30, 40, 50],
  pageSize: 10,
  currentPage: 1,
});

const exportConfigDialogVisible: Ref<boolean> = ref(false);
const exportForm: Ref<any> = ref({
  enterprise: undefined,
  timeScale: undefined,
  dataTime: undefined,
});
const exportFormTimeScale = computed(() => {
  return exportForm.value.timeScale &&
    exportForm.value.timeScale.indexOf("年") > -1
    ? "year"
    : exportForm.value.timeScale &&
        exportForm.value.timeScale.indexOf("月") > -1
      ? "month"
      : "day";
});
const exportLoading: Ref<boolean> = ref(false);
const isDisabledExport = computed(() => {
  return (
    !exportForm.value.enterprise ||
    !exportForm.value.timeScale ||
    !exportForm.value.dataTime
  );
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
      type: "storageReportDetailForm",
    },
  });
};
const handleDelete = (row: any) => {
  // todo: 判断是否有数据管理权限
  // if(!hasDataManagePermission) { return; }
  handleDeleteRow(row, BusinessFormAPI.deleteDailyStorageReportForm, () => {
    initTableData();
  });
};

const checkIsAuditData = (row: any) => {
  return !row.状态 || row.状态 === "无效";
};

const handleAudit = async (row: any) => {
  // 先获取详情数据
  await BusinessFormAPI.getDailyStorageReportForm(row.id).then((res) => {
    // console.log(res);
    handleAuditRow(
      row,
      BusinessFormAPI.editDailyStorageReportForm,
      "状态",
      "有效",
      () => {
        initTableData();
      }
    );
  });
};

const handleResetAudit = (row: any) => {
  handleAuditRow(
    row,
    BusinessFormAPI.editDailyStorageReportForm,
    "状态",
    "无效",
    () => {
      initTableData();
    }
  );
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
    label: "报表时间",
    prop: "时间跨度",
    value: [null, new Date()],
    selected: null,
    inputType: "daterange",
    order: 1,
  },
  {
    label: "时间维度",
    prop: "时间维度",
    value: null,
    options: ["年", "月", "日"],
    selected: null,
    inputType: "select",
    order: 2,
  },
  {
    label: "状态",
    prop: "状态",
    value: null,
    options: ["全部", "有效", "无效"],
    inputType: "select",
    order: 3,
  },
]);

const handleConfirmFilter = (value: any) => {
  queryForm.value = {
    ...queryForm.value,
    ...value,
    状态集合: value["状态"]
      ? value["状态"] === "全部"
        ? undefined
        : [value["状态"]]
      : undefined,
    日期晚于: value["时间跨度"]?.[0],
    日期早于: value["时间跨度"]?.[1],
  };
  initTableData();
};

const handleResetFilter = () => {
  queryForm.value = {
    伙伴名称: undefined,
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

const handleSelectionChange = (selection: any) => {
  selectedRows.value = selection;
};

const initTableData = async () => {
  loading.value = true;
  try {
    const res: any = await BusinessFormAPI.getCorporateStorageReportList({
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

const onExportExcel = () => {
  // console.log("导出excel");
  exportConfigDialogVisible.value = true;
};

const handleCloseExportConfigDialog = () => {
  exportConfigDialogVisible.value = false;
};

const handleConfirmExportConfig = async () => {
  // console.log(exportForm.value);
  exportLoading.value = true;
  const query = {
    数据日期: undefined,
    数据日期晚于: undefined,
    数据日期早于: undefined,
    企业名称: exportForm.value.enterprise,
    时间维度: exportForm.value.timeScale,
  };
  if (exportForm.value.timeScale === "日") {
    query["数据日期晚于"] = getDateString(
      new Date(exportForm.value.dataTime[0])
    );
    query["数据日期早于"] = getDateString(
      new Date(exportForm.value.dataTime[1])
    );
  } else {
    query.数据日期 = getDateString(new Date(exportForm.value.dataTime));
  }
  handleExportExcel(query);
  await handleCloseExportConfigDialog();
  exportLoading.value = false;
  ElMessage.success("开始下载，请稍后...");
};

const handleExportExcel = async (query: any) => {
  try {
    const res = await BusinessFormAPI.exportDailyStorageReportForm({
      ...query,
    });
    const fileName = decodeURI(
      `库存报表导出(${query.企业名称})` + getDateString(new Date()) + ".xlsx"
    );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
    const blob = new Blob([res.data], {
      type: fileType,
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

/**
 * 导入excel，具体逻辑在子组件中实现
 *
 **/
const handleImportExcel = () => {
  // console.log("导入excel");
  importExcelDialogRef.value?.open();
};

/**
 * 获取excel模板
 */
const handleGetExcelTemplate = () => {
  BusinessFormAPI.getDailyStorageReportImportTemplate().then((res: any) => {
    const fileName = decodeURI("库存日报录入模板.xlsx");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
    const blob = new Blob([res.data], {
      type: fileType,
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  });
};

const handleAddRecord = () => {
  router.push({
    name: "ReportForm",
    query: {
      type: "partnerReport",
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
    BusinessFormAPI.deleteDailyStorageReportFormByIds,
    initTableData
  );
};

onMounted(() => {
  initTableData();
});
</script>

<style lang="scss" scoped>
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
