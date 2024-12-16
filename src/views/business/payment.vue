<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">款项台账</div>
      <div class="__stat">
        <span class="__item">当前有</span>
        <span class="__item">
          <span class="text-blue-5 inline-block ml-1 mr-1">
            {{ pagination.total }}
          </span>
          条记录
        </span>
        <span class="__item">统计指标二</span>
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
      <div>
        <el-button type="primary" @click="handleAddRecord">新增</el-button>
      </div>
      <div>
        <el-button icon="ArrowUp" disabled>导出excel</el-button>
        <el-button icon="ArrowDown" disabled>导入excel</el-button>
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
      <!-- <el-table-column prop="name" label="名称" sortable>
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            {{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="dataFrom"
        label="款项编号"
        width="150"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            {{ scope.row.款项编号 }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="款项订单"
        align="center"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <!-- <span>{{ scope.row.orderNo }}</span> -->
          <el-link
            v-if="scope.row.orderNo"
            type="primary"
            @click="handleViewOrderDetail(scope.row)"
          >
            {{ scope.row.订单编号 }}
          </el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="款项类别"
        width="150"
        sortable
        align="center"
      >
        <template v-slot="scope">
          <div class="flex items-center justify-center">
            <span>
              {{ (scope.row.内容 && scope.row.内容.款项类型) || "-" }}
            </span>
            <!-- 付款为向上红箭头，回款为向下绿箭头 -->
            <el-icon
              v-if="scope.row.内容 && scope.row.内容.款项类型 === '付款'"
              class="text-red-5"
            >
              <Top />
            </el-icon>
            <el-icon
              v-else-if="scope.row.内容 && scope.row.内容.款项类型 === '回款'"
              class="text-green-5"
            >
              <Bottom />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="type" label="款项类型" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column> -->
      <!-- 款项时间 -->
      <el-table-column prop="date" label="款项时间" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.内容.款项时间 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 款型状态 -->
      <el-table-column prop="status" label="款项状态" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.内容.款项状态 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 金额 -->
      <el-table-column prop="amount" label="金额" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.内容.款项金额 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column prop="remark" label="款项说明" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.内容.款项说明 || "-" }}</span>
        </template>
      </el-table-column>
      <!-- 数据状态 -->
      <el-table-column prop="status" label="数据状态" width="150" sortable>
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
import BusinessStandbookAPI from "@/api/businessStandBook";
import { handleDeleteRow, handleAuditRow } from "@/hooks/useTableOp";
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

type IExampleData = business.IAuditableEntity<Partial<business.IPayment>>;

const queryForm: Ref<any> = ref({
  id集合: undefined,
  数据源集合: undefined,
  状态集合: undefined,
  日期晚于: undefined,
  日期早于: undefined,
});

const loading: Ref<boolean> = ref(false);
const tableData: Ref<any[]> = ref([]);
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
const handleViewDetail = (row: IExampleData) => {
  router.push({
    name: "ReportForm",
    query: {
      type: "paymentDetail",
      id: row.id,
    },
  });
};
const handleViewOrderDetail = (row: IExampleData) => {
  console.log(row);
};
const handleAudit = (row: any) => {
  handleAuditRow(
    row,
    BusinessStandbookAPI.editPaymentLedgerRecord,
    "状态",
    "有效",
    initTableData
  );
};

const handleResetAudit = (row: any) => {
  handleAuditRow(
    row,
    BusinessStandbookAPI.editPaymentLedgerRecord,
    "状态",
    "无效",
    initTableData
  );
};

const handleDelete = (row: IExampleData) => {
  handleDeleteRow(row, BusinessStandbookAPI.deletePaymentLedgerRecord, () => {
    initTableData();
  });
};
const handleAddRecord = () => {
  router.push({
    name: "ReportForm",
    query: {
      type: "paymentDetail",
    },
  });
};
const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  {
    label: "款项类型",
    prop: "type",
    value: null,
    options: ["全部", "付款", "回款"],
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
  //   label: "日期",
  //   prop: "date",
  //   value: null,
  //   selected: null,
  //   inputType: "date",
  //   order: 3,
  // },
  // {
  //   label: "订单编号",
  //   prop: "number",
  //   value: null,
  //   selected: null,
  //   inputType: "input",
  // },
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

const handleResetFilter = () => {
  queryForm.value = {
    id集合: undefined,
    数据源集合: undefined,
    状态集合: undefined,
    日期晚于: undefined,
    日期早于: undefined,
  };
  initTableData();
};

const initTableData = () => {
  loading.value = true;
  BusinessStandbookAPI.getPaymentLedgerRecordList({
    ...queryForm.value,
    页码: pagination.value.currentPage,
    页容量: pagination.value.pageSize,
  })
    .then((res: any) => {
      tableData.value = res["当前记录"];
      pagination.value.total = +res["记录总数"];
      loading.value = false;
    })
    .catch((err: any) => {
      ElMessage.error(err);
      loading.value = false;
    });
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
