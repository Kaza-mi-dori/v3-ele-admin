<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">采购业务台账</div>
      <div class="__stat">
        <span class="__item">当前有</span>
        <span class="__item">
          <span>
            <span class="text-red-5 mr-2">{{ pagination.total }}</span>
            <span>份记录</span>
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
                <span>批量审核</span>
              </el-dropdown-item>
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
      <el-table-column
        prop="公司名称"
        label="公司名称"
        width="150"
        align="center"
      />
      <el-table-column prop="日期" label="日期" width="150" align="center" />
      <el-table-column
        prop="合同编号"
        label="合同编号"
        width="150"
        align="center"
      />
      <el-table-column
        prop="商品名称"
        label="商品名称"
        width="150"
        align="center"
      />
      <el-table-column prop="数量" label="数量" width="150" align="center" />
      <el-table-column
        prop="含税单价"
        label="含税单价"
        width="150"
        align="center"
      />
      <el-table-column prop="金额" label="金额" width="150" align="center" />
      <el-table-column
        prop="不含税单价"
        label="不含税单价"
        width="150"
        align="center"
      />
      <el-table-column prop="税率" label="税率" width="150" align="center" />
      <el-table-column prop="税额" label="税额" width="150" align="center" />
      <el-table-column prop="状态" label="状态" width="150" align="center">
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
      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <div class="w-full flex justify-evenly">
            <!-- <el-button type="text" @click="handleViewDetail(scope.row)">
              详情
            </el-button>
            <el-button type="text">编辑</el-button> -->
            <el-link type="primary" @click="handleAudit(scope.row)">
              审核
            </el-link>
            <el-link
              v-if="scope.row['状态'] === '有效'"
              type="primary"
              @click="handleResetAudit(scope.row)"
            >
              设为无效
            </el-link>
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
import { handleAuditRow, handleDeleteRow } from "@/hooks/useTableOp";
import { ref } from "vue";
import type { Ref } from "vue";
import { useRouter } from "vue-router";
import BusinessStandbookAPI from "@/api/businessStandBook";
const router = useRouter();

type ISellRecord = {
  id: string;
  公司名称: string;
  日期: string;
  合同编号: string;
  商品名称: string;
  商品类型: string;
  数量: string;
  含税单价: string;
  金额: string;
  不含税单价: string;
  税率: string;
  税额: string;
};

const loading: Ref<boolean> = ref(false);
const queryParams: Ref<any> = ref({});
const exampleData: Ref<any[]> = ref([]);
const tableData = ref<any[]>([]);
const pagination: Ref<any> = ref({
  total: 0,
  pageSizes: [10, 20, 30, 40, 50],
  pageSize: 10,
  currentPage: 1,
});
const handleCurrentChange = (currentPage: number) => {
  pagination.value.currentPage = currentPage;
  initTableData();
};
const handleViewDetail = (row: business.IPurchaseRecord) => {
  // console.log(row);
  router.push({
    name: "ReportForm",
    query: {
      type: "purchaseDetail",
      id: row.id,
    },
  });
};
const handleAddRecord = () => {
  router.push({
    name: "ReportForm",
    query: {
      type: "purchaseDetail",
    },
  });
};
const handleDeleteRecord = (row: any) => {
  handleDeleteRow(
    row,
    BusinessStandbookAPI.deleteSettlementLedgerRecord,
    () => {
      initTableData();
    }
  );
};
const handleAudit = (row: any) => {
  handleAuditRow(
    row,
    BusinessStandbookAPI.editSettlementLedgerRecord,
    "状态",
    "有效",
    initTableData
  );
};
const handleResetAudit = (row: any) => {
  handleAuditRow(
    row,
    BusinessStandbookAPI.editSettlementLedgerRecord,
    "状态",
    "无效",
    initTableData
  );
};
const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  {
    label: "结算类型",
    prop: "结算类型",
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
    label: "结算日期",
    prop: "结算日期",
    value: [null, null],
    selected: null,
    inputType: "daterange",
    order: 3,
  },
  {
    label: "结算单号",
    prop: "结算单号",
    value: null,
    selected: null,
    inputType: "input",
  },
]);

const initTableData = () => {
  loading.value = true;
  BusinessStandbookAPI.getSettlementLedgerRecordList(queryParams.value)
    .then((res: any) => {
      tableData.value = res?.当前记录;
      pagination.value.total = parseInt(res?.记录总数);
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
      ElMessage.error("获取数据失败");
    });
};

const handleConfirmFilter = (filter: any) => {
  queryParams.value = {
    ...filter,
    页码: pagination.value.currentPage,
    页容量: pagination.value.pageSize,
  };
  if (queryParams.value["状态"] && queryParams.value["状态"] !== "全部") {
    queryParams.value["状态集合"] = [queryParams.value["状态"]];
  }
  if (queryParams.value["结算日期"]) {
    queryParams.value["日期早于"] = queryParams.value["结算日期"][0];
    queryParams.value["日期晚于"] = queryParams.value["结算日期"][1];
  }
  pagination.value.currentPage = 1;
  initTableData();
};

const handleResetFilter = () => {
  queryParams.value = {};
  pagination.value.currentPage = 1;
  initTableData();
};

onMounted(() => {
  // initTableData();
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
