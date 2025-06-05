<template>
  <BaseListPage
    :config="pageConfig"
    :loading="loading"
    :tableData="tableData"
    :pagination="pagination"
    @confirm-filter="handleFilter"
    @reset-filter="handleResetFilter"
    @page-change="handlePageChange"
    @add="handleAddRecord"
    @export="onExportExcel"
  >
    <template v-slot:leftOperations>
      <!-- <el-button @click="handleSync">手动同步(测试)</el-button> -->
      <!-- 下拉菜单，当天，过去一周 -->
      <el-dropdown @command="handleClickSync">
        <el-button>
          手动同步数据
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="1">当天数据</el-dropdown-item>
            <el-dropdown-item command="2">过去一周</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template v-slot:table>
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <!-- 表格列定义 -->
        <el-table-column
          v-if="showSelection"
          type="selection"
          width="55"
          align="center"
        />

        <el-table-column
          prop="合同名称"
          label="合同名称"
          sortable
          align="center"
        >
          <template #default="{ row }">{{ row.合同名称 || "-" }}</template>
        </el-table-column>

        <el-table-column
          prop="合同编号"
          label="合同编号"
          sortable
          align="center"
        >
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewDetail(row)">
              {{ row.合同编号 || "-" }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="对方公司名称"
          label="对方公司名称"
          sortable
          align="center"
        />

        <!-- 更多列... -->

        <!-- 操作列 -->
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="{ row }">
            <div class="flex w-full justify-evenly">
              <!-- <el-link
                v-if="checkIsAuditData(row)"
                type="primary"
                @click="handleAudit(row)"
              >
                审核
              </el-link> -->
              <el-link type="primary" @click="handleViewDetail(row)">
                查看
              </el-link>
              <el-link
                v-if="row['状态'] === '有效'"
                type="primary"
                @click="handleResetAudit(row)"
              >
                设为无效
              </el-link>
              <el-link type="danger" @click="handleDelete(row)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 自定义弹窗 -->
    <template #dialogs>
      <exportConfigDialog
        v-model:visible="exportConfigDialogVisible"
        :loading="exportLoading"
        :form="exportForm"
        @confirm="handleConfirmExportConfig"
        @cancel="handleCloseExportConfigDialog"
      />
    </template>

    <!-- 自定义右侧操作 -->
    <template #moreOperations>
      <el-button
        v-if="showSelection"
        icon="delete"
        type="danger"
        :disabled="selectedRows.length === 0"
        @click="handleBatchDelete"
      >
        确认删除
      </el-button>
      <el-dropdown trigger="click" class="ml-4">
        <el-button>
          更多功能
          <el-icon><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toggleDeleteButton">
              <span class="text-red-5">批量删除</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </BaseListPage>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { getDateString } from "@/utils/time";
import { useRouter } from "vue-router";
import BaseListPage from "@/components/FormCRUDTemplate/BaseListPage.vue";
import exportConfigDialog from "@/components/FormCRUDTemplate/components/exportConfigDialog.vue";
import { useListPage } from "@/hooks/useListPage";
import BusinessFormAPI from "@/api/businessForm";
import {
  getDingTalkContractLedger,
  addDingTalkContractLedger,
  deleteDingTalkContractLedger,
  queryDingTalkContractLedger,
  syncDingTalkContractLedger,
} from "@/api/businessStandBook/dingding";

// 页面配置
const pageConfig = {
  title: "泛微合同台账",
  countUnit: "份记录",
  addButtonVisible: true,
  exportVisible: true,
  filterItems: [
    {
      label: "报表时间",
      prop: "时间跨度",
      value: [null, new Date()],
      inputType: "daterange",
      order: 1,
    },
    {
      label: "报表类型",
      prop: "聚合标签",
      value: null,
      options: ["企业年报", "企业月报"],
      inputType: "select",
      order: 3,
    },
    {
      label: "状态",
      prop: "状态",
      value: null,
      options: ["全部", "有效", "无效"],
      inputType: "select",
      order: 3,
    },
  ],
};

const otherDesc = [];

// 使用通用列表逻辑
const {
  loading,
  tableData,
  selectedRows,
  pagination,
  queryForm,
  showSelection,
  loadData,
  handleFilter,
  handleResetFilter,
  handlePageChange,
  handleDelete,
  handleBatchDelete,
  toggleDeleteButton,
} = useListPage({
  fetchListApi: queryDingTalkContractLedger,
  addApi: addDingTalkContractLedger,
  deleteApi: deleteDingTalkContractLedger,
  defaultQuery: {
    页码: 1,
    页容量: 10,
  },
});

// 页面特有的业务逻辑
const router = useRouter();
const exportConfigDialogVisible = ref(false);
const exportLoading = ref(false);
const exportForm = ref({
  type: "企业年报",
  dataTime: new Date().getFullYear() + "",
  enterprise: undefined,
});

const handleSync = (startDate: string, endDate: string) => {
  // console.log("手动同步某天数据");
  syncDingTalkContractLedger(startDate, endDate).then((res) => {
    console.log(res);
  });
};

const handleClickSync = (command: string) => {
  let startDate = new Date();
  let endDate = new Date();
  switch (command) {
    case "1":
      startDate = new Date("2025-05-30");
      endDate = new Date("2025-05-30");
      break;
    case "2":
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      break;
  }
  handleSync(getDateString(startDate), getDateString(endDate));
};

// ... 其他特有方法
const handleViewDetail = (row: any) => {
  router.push({
    name: "ReportForm",
    query: {
      id: row.id,
      ddId: row.钉钉业务id,
      type: "dingdingContractDetail",
    },
  });
};

const checkIsAuditData = (row: any) => {
  return !row.状态 || row.状态 === "无效";
};

// ... 其他业务逻辑方法

// 导出相关
const onExportExcel = () => {
  exportConfigDialogVisible.value = true;
};

const handleConfirmExportConfig = async () => {
  // 特有的导出实现...
};

const handleSelectionChange = (selection: any) => {
  // console.log(selection.length);
  selectedRows.value = selection;
};

const handleCloseExportConfigDialog = () => {
  exportConfigDialogVisible.value = false;
};

const handleAddRecord = () => {
  ElMessage.warning("当前类型报表应由系统管理员添加");
};

const handleAudit = (row: any) => {
  console.log("审核", row);
};

const handleResetAudit = (row: any) => {
  console.log("设为无效", row);
};

// ... 其他方法
</script>
