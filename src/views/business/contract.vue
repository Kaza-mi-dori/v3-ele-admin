<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">合同台账</div>
      <div class="__stat">
        <span class="__item">共有</span>
        <span class="__item">
          <span class="inline-block ml-1 mr-1">{{ pagination.total }}</span>
          条合同记录,
        </span>
        <span class="__item">
          <span class="text-red-5 inline-block ml-1 mr-1">
            {{ riskAmount }}
          </span>
          条合同可能存在风险
        </span>
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
            <el-checkbox label="合同单号" />
            <el-checkbox label="合同类型" />
            <el-checkbox label="合同类别" />
            <el-checkbox label="状态" />
            <el-checkbox label="签订日期" />
            <el-checkbox label="是否审核" />
            <el-checkbox label="有履约风险" />
            <el-checkbox label="金额" />
            <el-checkbox label="税率" />
            <el-checkbox label="税额" />
            <el-checkbox label="币种" />
            <el-checkbox label="合作伙伴" />
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
      :row-class-name="tableRowCustom"
    >
      <el-table-column
        v-if="checkedColumns.includes('来源')"
        key="dataFrom"
        prop="dataFrom"
        label="来源"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.dataFrom }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('名称')"
        key="name"
        prop="name"
        label="名称"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            {{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('合同单号')"
        key="no"
        prop="no"
        label="合同单号"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('合同类型')"
        key="type"
        prop="type"
        label="合同类型"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('合同类别')"
        key="category"
        prop="category"
        label="合同类别"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('状态')"
        key="status"
        prop="status"
        label="状态"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('签订日期')"
        key="date"
        prop="date"
        label="签订日期"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('是否审核')"
        key="audited"
        prop="audited"
        label="是否审核"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.audited ? "是" : "否" }}</span>
        </template>
      </el-table-column>
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
        key="amount"
        prop="amount"
        label="金额(万元)"
        width="120"
        align="right"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column
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
      </el-table-column>
      <el-table-column
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
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('合作伙伴')"
        key="partner"
        prop="partner"
        label="合作伙伴"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.partner }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedColumns.includes('说明')"
        key="description"
        prop="description"
        label="说明"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <div class="w-full flex justify-evenly">
            <!-- <el-button type="text" @click="handleViewDetail(scope.row)">
              详情
            </el-button>
            <el-button type="text">编辑</el-button> -->
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
import BusinessStandbookAPI from "@/api/businessStandBook";
import { ref } from "vue";
import type { Ref } from "vue";
import { toThousands } from "@/utils";
import { useRouter } from "vue-router";

const router = useRouter();

const popoverVisible: Ref<boolean> = ref(false);
const checkedColumns: Ref<string[]> = ref([
  "来源",
  "名称",
  "合同单号",
  "合同类型",
  "合同类别",
  "状态",
  "签订日期",
  "是否审核",
  "有履约风险",
  "金额",
  "合作伙伴",
  "说明",
]);

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
    amount: toThousands(10000000),
    currency: "CNY",
    partner: "供应商1",
    isRisk: true,
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
    isRisk: false,
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
    isRisk: false,
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
const riskAmount = ref(1);

/** 表格操作回调 */
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
      type: "contractDetail",
    },
  });
};
const handleDelete = (row: IExampleData) => {
  // 确认是否删除
  ElMessageBox.confirm("确定删除该记录吗？", "提示", {
    type: "warning",
  })
    .then(() => {
      loading.value = true;
      BusinessStandbookAPI.deleteContractLedgerRecord(row.id)
        .then(() => {
          loading.value = false;
          ElMessage.success("删除成功");
        })
        .catch((err) => {
          loading.value = false;
          ElMessage.error("删除失败" + err);
        });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
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
    prop: "status",
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
  {
    label: "合同单号",
    prop: "number",
    value: null,
    selected: null,
    inputType: "input",
  },
  {
    label: "数据来源",
    prop: "dataFrom",
    value: null,
    options: ["全部", "泛微系统", "钉钉", "其他"],
    inputType: "select",
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

// 表格行样式
// 风险合同
:deep(.el-table) {
  .danger-row {
    background-color: #f8d9ca !important;
  }
}
</style>
