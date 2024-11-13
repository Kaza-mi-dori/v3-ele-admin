<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">合同台账</div>
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
      <el-button>导出excel</el-button>
      <el-button icon="Arrow-down">更多功能</el-button>
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
      <el-table-column prop="dataFrom" label="来源" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.dataFrom }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="no" label="合同单号" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="合同类型" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="合同类别" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="签订日期" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataFrom" label="信息来源" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.dataFrom }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="audited" label="是否审核" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.audited ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税率" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.tax }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="税额" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.taxAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="currency" label="币种" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="partner" label="合作伙伴" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.partner }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="说明" width="150" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <el-button type="text" @click="handleViewDetail(scope.row)">
            详情
          </el-button>
          <el-button type="text">编辑</el-button>
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

type IExampleData = business.IAuditableEntity<business.IContract>;

/**
 *   interface IContract {
    id: string;
    no: string; // 编号
    name: string; // 名称
    amount: number; // 金额（含税)
    tax: number; // 税率
    taxAmount: number; // 税额
    description: string; // 说明
    currency: string; // 币种
    partner: string; // 合作伙伴(相对人)
    status: string; // 合同状态
    date: string; // 签订日期
    from: string; // 合同信息来源，如：泛微、钉钉
    goodsDetails: any[]; // 商品明细
  }
 */

const loading: Ref<boolean> = ref(false);
const exampleData: Ref<IExampleData[]> = ref([
  {
    id: "1",
    name: "合同一",
    no: "123456789",
    date: "2022-01-01",
    type: "采购",
    status: "待审核",
    dataFrom: "泛微系统",
    audited: true,
    category: "成品油-车单销售合同", // 数据字典加以规范
    tax: 0.06,
    taxAmount: 1000,
    amount: 10000,
    currency: "CNY",
    partner: "供应商1",
    description: "这是合同一的说明",
    createdAt: "2021-09-01",
    updatedAt: "2021-09-02",
    createdBy: "管理员",
    updatedBy: "管理员",
  },
  {
    id: "2",
    name: "合同二",
    no: "987654321",
    date: "2022-01-02",
    type: "销售",
    status: "已审核",
    dataFrom: "泛微系统",
    audited: true,
    category: "原油-原油销售合同", // 数据字典加以规范
    tax: 0.06,
    taxAmount: 1000,
    amount: 10000,
    currency: "CNY",
    partner: "供应商2",
    description: "这是合同二的说明",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-04",
    createdBy: "管理员",
    updatedBy: "管理员",
  },
  {
    id: "3",
    name: "合同三",
    no: "123456789",
    date: "2022-01-03",
    type: "采购",
    status: "待审核",
    dataFrom: "钉钉",
    audited: false,
    category: "化工产品-化工产品采购合同", // 数据字典加以规范
    tax: 0.06,
    taxAmount: 1000,
    amount: 10000,
    currency: "CNY",
    partner: "供应商3",
    description: "这是合同三的说明",
    createdAt: "2021-09-05",
    updatedAt: "2021-09-06",
    createdBy: "管理员",
    updatedBy: "管理员",
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
    label: "合同单号",
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
  @apply flex justify-end;
  margin: 10px;
}

.table-header-custom {
  background-color: lightcyan !important;
}
</style>
