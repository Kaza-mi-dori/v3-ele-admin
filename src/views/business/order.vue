<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">订单台账</div>
      <div class="__stat">
        <span class="__item">共有</span>
        <span class="__item">
          <span class="text-red-5 inline-block ml-1 mr-1">
            {{ pagination.total }}
          </span>
          条记录
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
      <el-table-column prop="name" label="名称" align="center">
        <template v-slot="scope">
          <el-link
            type="primary"
            @click="() => handleClickRecord(scope.row, router)"
          >
            {{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="dataFrom" label="订单来源" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.dataFrom }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="no" label="订单编号" align="center" sortable>
        <template v-slot="scope">
          <span>{{ scope.row["订单编号"] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="订单类型" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row["内容"]?.["订单类型"] || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row["状态"] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <div class="w-full flex justify-evenly">
            <el-button
              type="text"
              @click="handleClickRecord(scope.row, router)"
            >
              详情
            </el-button>
            <el-button type="text">编辑</el-button>
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
import { ref } from "vue";
import type { Ref } from "vue";
import { useRouter } from "vue-router";
import {
  handleClickRecord,
  handleAuditRow,
  handleDeleteRow,
} from "@/hooks/useTableOp";
import BusinessStandbookAPI from "@/api/businessStandBook";

const router = useRouter();

type IExampleData = business.IAuditableEntity<Partial<business.IOrder>>;

const loading: Ref<boolean> = ref(false);
const queryParams: Ref<any> = ref({
  状态集合: undefined,
  日期早于: null,
  日期晚于: null,
});
const exampleData: Ref<IExampleData[]> = ref([
  {
    name: "订单1",
    from: "供应商1",
    no: "123456",
    category: "订单类型1",
    type: "采购",
    status: "已下单",
    audited: true,
    dataFrom: "数据来源1",
    createdAt: "2021-09-01",
    updatedAt: "2021-09-02",
    createdBy: "管理员",
    updatedBy: "管理员",
  },
  {
    name: "订单2",
    from: "供应商2",
    no: "654321",
    type: "销售",
    category: "订单类型2",
    status: "已结单2",
    audited: false,
    dataFrom: "数据来源2",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-04",
    createdBy: "管理员",
    updatedBy: "管理员",
  },
]);
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
const handleViewDetail = (row: IExampleData) => {
  router.push({
    name: "ReportForm",
    query: {
      type: "orderDetail",
      id: row.id,
    },
  });
};
const handleAddRecord = () => {
  router.push({
    name: "ReportForm",
    query: {
      type: "orderDetail",
    },
  });
};
const handleDeleteRecord = () => {
  console.log("删除");
};
const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  // {
  //   label: "订单类型",
  //   prop: "type",
  //   value: null,
  //   options: ["全部", "采购", "销售"],
  //   inputType: "select",
  //   order: 1,
  // },
  {
    label: "状态",
    prop: "status",
    value: null,
    options: ["全部", "待审核", "已审核"],
    inputType: "select",
    order: 2,
  },
  {
    label: "日期",
    prop: "date",
    value: [null, null],
    selected: null,
    inputType: "daterange",
    order: 3,
  },
  {
    label: "订单编号",
    prop: "number",
    value: null,
    selected: null,
    inputType: "input",
  },
]);
const handleConfirmFilter = (filter: any) => {
  const { type, status, date, number } = filter;
  queryParams.value = {
    日期早于: date[0],
    日期晚于: date[1],
  };
  if (type && type !== "全部") {
    queryParams.value.订单类型 = type;
  }
  if (status && status !== "全部") {
    queryParams.value.状态集合 = [status];
  }
  if (number) {
    queryParams.value.订单编号 = number;
  }
  initTableData();
};
const handleResetFilter = () => {
  queryParams.value = {
    日期早于: undefined,
    日期晚于: undefined,
    状态集合: undefined,
    订单编号: undefined,
  };
  pagination.value.currentPage = 1;
  initTableData();
};

const initTableData = () => {
  loading.value = true;
  BusinessStandbookAPI.getOrderLedgerRecordList({
    页码: pagination.value.currentPage,
    页容量: pagination.value.pageSize,
    ...queryParams.value,
  })
    .then((data: any) => {
      exampleData.value = data?.["当前记录"] || [];
      pagination.value.total = parseInt(data?.["记录总数"] || "0");
    })
    .catch((err) => {
      ElMessage.error("获取数据失败");
      exampleData.value = [];
      pagination.value.total = 0;
    })
    .finally(() => {
      loading.value = false;
    });
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
