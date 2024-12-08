<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">数据定义</div>
      <div class="__stat">
        <span class="__item">当前共定义了</span>
        <span class="__item">
          <span>
            <span class="text-red-5 mr-2">{{ pagination.total }}</span>
            <span>个数据</span>
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
        prop="类型"
        label="类型"
        align="center"
        width="150"
        sortable
      >
        <template v-slot="scope">
          <span>{{ scope.row.类型 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="名称"
        label="名称"
        width="150"
        align="center"
        sortable
      >
        <template v-slot="scope">
          <el-link type="primary" @click="handleUpdateDetail(scope.row)">
            {{ scope.row.名称 }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="描述" label="描述" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.描述 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template v-slot="scope">
          <div class="w-full flex justify-evenly">
            <!-- <el-button type="text" @click="handleViewDetail(scope.row)">
              详情
            </el-button>
            <el-button type="text">编辑</el-button> -->
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
      class="mt-2 flex justify-end"
      background
      layout="total, prev, pager, next, jumper"
      :total="pagination.total"
      @current-change="handleCurrentChange"
    />
    <!-- 底部操作区 -->
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增数据定义" width="30%" center>
      <el-form
        ref="itemFormRef"
        :model="itemForm"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="类别" prop="type">
          <el-select v-model="itemForm.type" disabled placeholder="请选择">
            <el-option label="其他数据" value="其他数据" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="itemForm.name"
            placeholder="请输入数据大类名称(例如：市场日数据)"
          />
        </el-form-item>
        <el-form-item label="数据细分名称1" prop="name2">
          <el-input
            v-model="itemForm.name2"
            placeholder="请输入数据细分名称(例如: 原油价格)"
          />
        </el-form-item>
        <el-form-item label="数据细分名称2" prop="name3">
          <el-input
            v-model="itemForm.name3"
            placeholder="请输入数据细分名称(例如: 中海油报价)"
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input
            v-model="itemForm.unit"
            placeholder="请输入单位，如：元/吨"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="itemForm.status" placeholder="请选择">
            <el-option label="正常" value="正常" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="order">
          <el-input
            v-model="itemForm.order"
            type="number"
            placeholder="请输入显示顺序"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="itemForm.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="submitItemLoading"
            @click="onSubmitItemForm"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Filter from "@/components/Business/filter.vue";
import SearchBar from "@/components/CustomComponent/SearchBar.vue";
import business from "@/types/business";
import sassvariables from "@/styles/variables.module.scss";
import { DataDefinitionAPI } from "@/api/dataIndices/dataDefinition";
import { onMounted } from "vue";
import { ref } from "vue";
import type { Ref } from "vue";
import { ElMessage, ElForm } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

type ItableData = {
  name: string;
  number: string;
  date: string;
  type: string;
  status: string;
  audited: boolean;
};

const loading: Ref<boolean> = ref(false);
const tableData: Ref<any[]> = ref([]);
const pagination: Ref<any> = ref({
  total: 0,
  pageSizes: [10, 20, 30, 40, 50],
  pageSize: 10,
  currentPage: 1,
});
const dialogVisible = ref(false);
const itemForm = ref({
  id: undefined,
  /** 类型 */
  type: "其他数据",
  /** 状态 */
  status: "正常",
  /** 显示顺序 */
  order: 1,
  /** 名称1 */
  name: undefined,
  /** 名称2 */
  name2: undefined,
  /** 名称3 */
  name3: undefined,
  /** 单位 */
  unit: undefined,
  /** 描述 */
  description: undefined,
});
const itemFormRef = ref<InstanceType<typeof ElForm>>();
const rules = ref({
  type: [{ required: true, message: "请选择类别", trigger: "blur" }],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
  // description: [{ required: true, message: "请输入描述", trigger: "blur" }],
});
const submitItemLoading = ref(false);
const GAS_ENUM_VALUE = 1;
const STORAGE_ENUM_VALUE = 2;
const queryParams: {
  名称: string | undefined;
  类型集合: number[] | undefined;
} = {
  名称: undefined,
  类型集合: undefined,
};
const handleCurrentChange = (currentPage: number) => {
  pagination.value.currentPage = currentPage;
};
const handleViewDetail = (row: ItableData) => {
  console.log(row);
};
const handleUpdateDetail = (row: any) => {
  dialogVisible.value = true;
  itemForm.value = {
    id: row.id,
    type: row["类型"],
    status: row["状态"],
    order: row["显示顺序"],
    name: row["名称"],
    name2: row["名称2"],
    name3: row["名称3"],
    description: row["描述"],
    unit: row["单位"],
  };
};
const handleAddRecord = () => {
  itemForm.value = {
    id: undefined,
    type: "其他数据",
    name: undefined,
    name2: undefined,
    name3: undefined,
    status: "正常",
    unit: undefined,
    order: 1,
    description: undefined,
  };
  dialogVisible.value = true;
};
const handleDeleteRecord = (row: any) => {
  // console.log("删除");
};
const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  {
    label: "类型",
    prop: "类型",
    value: null,
    options: ["全部", "油库", "加油站"],
    inputType: "select",
    order: 1,
  },
  {
    label: "名称",
    prop: "名称",
    value: null,
    selected: null,
    inputType: "input",
    order: 2,
  },
]);
const handleConfirmFilter = (filter: any) => {
  queryParams.名称 = filter.名称;
  // queryParams.类型 = filter.type === "全部" ? undefined : filter.type;
  console.log(filter);
  queryParams["类型集合"] = filter.type
    ? filter.type === "全部"
      ? undefined
      : [filter.type]
    : undefined;
  initTableData();
};

const handleResetFilter = () => {
  queryParams.名称 = undefined;
  queryParams["类型集合"] = undefined;
  pagination.value.currentPage = 1;
  initTableData();
};

const initTableData = async () => {
  loading.value = true;
  // const params = {
  //   ...queryParams,
  //   页码: pagination.value.currentPage,
  //   页容量: pagination.value.pageSize,
  // };
  const res: any = await DataDefinitionAPI.getAllDataDefinition();
  tableData.value = res["当前记录"];
  pagination.value.total = res["记录总数"];
  loading.value = false;
};

const onSubmitItemForm = async () => {
  itemFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      submitItemLoading.value = true;
      const submitData = {
        id: itemForm.value.id,
        类型: itemForm.value.type,
        名称: itemForm.value.name,
        名称2: itemForm.value.name2,
        名称3: itemForm.value.name3,
        状态: itemForm.value.status,
        单位: itemForm.value.unit,
        描述: itemForm.value.description,
        显示顺序: itemForm.value.order,
      };
      const op = itemForm.value.id
        ? DataDefinitionAPI.updateDataDefinition
        : DataDefinitionAPI.addDataDefinition;
      const res = await op(submitData);
      ElMessage.success("操作成功");
      dialogVisible.value = false;
      initTableData();
      submitItemLoading.value = false;
      itemForm.value = {
        id: undefined,
        type: "其他数据",
        name: undefined,
        name2: undefined,
        name3: undefined,
        status: "正常",
        unit: undefined,
        order: 1,
        description: undefined,
      };
    }
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
