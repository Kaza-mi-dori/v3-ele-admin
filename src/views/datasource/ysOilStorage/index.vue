<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">永盛油库库存记录</div>
      <div class="__stat">
        <span class="__item">当前有</span>
        <span class="__item">
          <span>
            <span class="text-red-5 mr-2">{{ pagination.total }}</span>
            <span>条记录</span>
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
      <el-button type="primary" disabled @click="handleAddRecord">
        新增数据
      </el-button>
      <div>
        <el-button icon="ArrowUp" disabled>导出excel</el-button>
        <el-button icon="ArrowDown" disabled>导入excel</el-button>
        <!-- <el-dropdown trigger="click" class="ml-4">
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
        </el-dropdown> -->
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
    >
      <!-- <el-table-column type="selection" align="center" width="55">
        <template v-slot="scope">
          <el-checkbox v-model="scope.row.checked" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60" align="center">
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            #{{ scope.$index + 1 }}
          </el-link>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="时间"
        label="发生时间"
        sortable
        align="center"
        width="180"
        fixed="left"
      >
        <template v-slot="scope">
          <el-link type="primary" @click="handleViewDetail(scope.row)">
            {{ scope.row.时间 }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="类型" label="类型" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.类型 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="编号" label="编号" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.编号 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="单号" label="单号" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.单号 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="批号" label="批号" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.批号 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="产品名" label="产品名" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.产品名 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="车船名" label="车船名" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.车船名 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="入库" label="入库" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.入库 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="出库" label="出库" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.出库 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="结存" label="结存" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.结存 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="客户" label="客户" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.客户 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="提货人" label="提货人" sortable align="center">
        <template v-slot="scope">
          <span>{{ scope.row.提货人 }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="number" label="状态" sortable align="center">
        <template v-slot="scope">
          <span v-if="scope.row.状态 === '有效'" class="text-green-5">
            <el-icon>
              <Check />
            </el-icon>
            已审核
          </span>
          <span v-else-if="scope.row.状态 === '无效'" class="text-red-5">
            <el-icon>
              <Close />
            </el-icon>
            无效
          </span>
          <span v-else class="text-gray-5">
            <el-icon>
              <QuestionFilled />
            </el-icon>
            未审核
          </span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="操作" fixed="right" width="200">
        <template v-slot="scope">
          <div class="flex w-full justify-evenly">
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
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      class="mt-2 flex justify-end mb-4"
      background
      layout="total, prev, pager, next, jumper, sizes"
      :page-sizes="pagination.pageSizes"
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
import { ysERPDataAPI, type ysERPDataQuery } from "@/api/ysERP";
import { handleAuditRow, handleDeleteRow } from "@/hooks/useTableOp";
import { ElMessage, ElMessageBox, type TableInstance } from "element-plus";
import { onMounted } from "vue";

const router = useRouter();

type IExampleData = business.IAuditableEntity<Partial<business.IGoods>>;

const queryForm: Ref<Partial<ysERPDataQuery> & PageQueryDev> = ref({
  id: undefined,
  日期: undefined,
  类型: undefined,
  编号: undefined,
  单号: undefined,
  批号: undefined,
  产品名: undefined,
  罐号: undefined,
  车船名: undefined,
  入库: undefined,
  出库: undefined,
  结存: undefined,
  客户: undefined,
  提货人: undefined,
  页码: 1,
  页容量: 20,
});

const loading: Ref<boolean> = ref(false);
const exampleData: Ref<any[]> = ref([]);
const tableData = ref([]);
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
  // router.push({
  //   name: "ReportForm",
  //   query: {
  //     id: row.id,
  //     type: "firmReport",
  //   },
  // });
  console.log(row);
};

// const handleAudit = (row: any) => {
//   handleAuditRow(
//     row,
//     BusinessFormAPI.editCompanyDescForm,
//     "状态",
//     "有效",
//     initTableData
//   );
// };

// const handleResetAudit = (row: any) => {
//   handleAuditRow(
//     row,
//     BusinessFormAPI.editCompanyDescForm,
//     "状态",
//     "无效",
//     initTableData
//   );
// };

const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  // {
  //   label: "罐号",
  //   prop: "罐号",
  //   value: null,
  //   inputType: "input",
  //   order: 1,
  // },
  // {
  //   label: "状态",
  //   prop: "状态",
  //   value: null,
  //   options: ["全部", "有效", "无效"],
  //   inputType: "select",
  //   order: 2,
  // },
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
    // ...value,
    // 状态集合: value["状态"]
    //   ? value["状态"] === "全部"
    //     ? undefined
    //     : [value["状态"]]
    //   : undefined,
    时间晚于: value["时间跨度"]?.[0]
      ? value["时间跨度"]?.[0] + " 00:00:00"
      : undefined,
    时间早于: value["时间跨度"]?.[1]
      ? value["时间跨度"]?.[1] + " 23:59:59"
      : undefined,
  };
  initTableData();
};

const handleResetFilter = () => {
  queryForm.value = {
    ...queryForm.value,
    时间早于: undefined,
    时间晚于: undefined,
    页码: 1,
  };
  pagination.value.currentPage = 1;
  initTableData();
};

const initTableData = async () => {
  loading.value = true;
  try {
    const res: any = await ysERPDataAPI.getStorageHisotryList({
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
      type: "firmReport",
    },
  });
};

// const handleBatchDelete = () => {
//   // console.log("批量删除");
//   const selected = tableData.value.filter((item: any) => item.checked);
//   // console.log(selected);
//   if (!selected?.length) {
//     ElMessageBox.alert("请选择要删除的数据", "提示", {
//       confirmButtonText: "确定",
//       type: "warning",
//     });
//     return;
//   }
//   ElMessageBox.confirm("确定批量删除选中的数据吗？", "提示", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning",
//   }).then(() => {
//     const ids = selected.map((item: any) => item.id);
//     // 批量调用删除接口
//     const deleteTasks = ids.map((id: any) =>
//       BusinessFormAPI.deleteCompanyDescForm(id)
//     );
//     Promise.all(deleteTasks).then(() => {
//       tableRef?.value?.clearSelection();
//       initTableData();
//     });
//   });
// };

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
