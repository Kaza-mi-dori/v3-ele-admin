<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">合同结算</div>
      <div class="__stat">
        <span class="__item">你有</span>
        <span class="__item">统计指标一</span>
        <span class="__item">统计指标二</span>
      </div>
    </div>
    <!-- 筛选操作区 -->
    <!-- <Filter /> -->
    <div class="search-bar-wrapper">
      <SearchBar
        :itemList="filterItemList"
        @confirmFilter="handleConfirmFilter"
      />
    </div>
    <!-- 表格操作区 -->
    <div class="op-block">
      <div>
        <el-button type="primary" @click="handleAddRecord">新增</el-button>
      </div>
      <div>
        <el-button>导出excel</el-button>
        <el-button>导入excel</el-button>
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
      <el-table-column prop="date" label="日期" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="结算单号" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="结算类型" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <div class="w-full flex justify-evenly">
            <el-button type="text" @click="handleViewDetail(scope.row)">
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
      class="mt-2 flex justify-end"
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

const router = useRouter();

type IExampleData = {
  name: string;
  number: string;
  date: string;
  type: string;
  status: string;
  audited: boolean;
};

const loading: Ref<boolean> = ref(false);
const exampleData: Ref<IExampleData[]> = ref([
  {
    name: "结算一",
    number: "123456789",
    date: "2022-01-01",
    type: "采购",
    status: "待审核",
    audited: false,
  },
  {
    name: "结算二",
    number: "987654321",
    date: "2022-01-02",
    type: "销售",
    status: "已审核",
    audited: true,
  },
  {
    name: "结算三",
    number: "123456789",
    date: "2022-01-03",
    type: "采购",
    status: "待审核",
    audited: false,
  },
]);
const pagination: Ref<any> = ref({
  total: 100,
  pageSizes: [10, 20, 30, 40, 50],
  pageSize: 10,
  currentPage: 1,
});
const handleCurrentChange = (currentPage: number) => {
  pagination.value.currentPage = currentPage;
};
const handleViewDetail = (row: IExampleData) => {
  console.log(row);
};
const handleAddRecord = () => {
  router.push({
    name: "ReportForm",
    query: {
      type: "settlementDetail",
    },
  });
};
const handleDeleteRecord = () => {
  console.log("删除");
};
const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  {
    label: "结算类型",
    prop: "type",
    value: null,
    options: ["全部", "采购", "销售"],
    inputType: "select",
    order: 1,
  },
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
    value: null,
    selected: null,
    inputType: "date",
    order: 3,
  },
  {
    label: "结算单号",
    prop: "number",
    value: null,
    selected: null,
    inputType: "input",
  },
]);
const handleConfirmFilter = (filter: any) => {
  console.log(filter);
};
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
