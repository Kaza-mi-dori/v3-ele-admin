<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="title-block">
      <div class="__title">地图节点</div>
      <div class="__stat">
        <span class="__item">当前共有</span>
        <span class="__item">
          <span>
            <span class="text-red-5 mr-2">{{ pagination.total }}</span>
            <span>个节点</span>
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
      class="mt-2 pb-4 flex justify-end"
      background
      layout="total, prev, pager, next, jumper, sizes"
      :total="pagination.total"
      @current-change="handleCurrentChange"
    />
    <!-- 底部操作区 -->
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增配置点" width="30%" center>
      <el-form ref="itemFormRef" :model="itemForm" :rules="rules">
        <el-form-item label="类别" prop="type">
          <el-select v-model="itemForm.type" placeholder="请选择">
            <el-option
              v-for="(value, key) of MapElementEnumMap"
              :key="key"
              :label="value"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="itemForm.name"
            placeholder="请输入名称, 大屏上将显示这里的内容"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="itemForm.description"
            placeholder="请输入描述, 大屏上将显示这里的内容"
          />
        </el-form-item>
        <el-form-item v-if="itemForm.id" label="坐标" prop="location">
          <el-input
            v-model="itemForm.location"
            disabled
            placeholder="在大屏地图上的坐标"
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
import { GsLocationAPI } from "@/api/config/gsLocation";
import { onMounted } from "vue";
import { ref } from "vue";
import type { Ref } from "vue";
import { ElMessage, ElForm } from "element-plus";
import { useRouter } from "vue-router";
import { MapElementEnumMap, MapElementEnum } from "@/enums/BusinessEnum";

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
  id: null,
  type: undefined,
  name: "",
  description: "",
  location: "",
});
const itemFormRef = ref<InstanceType<typeof ElForm>>();
const rules = ref({
  type: [{ required: true, message: "请选择类别", trigger: "blur" }],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
});
const submitItemLoading = ref(false);
const GAS_ENUM_VALUE = MapElementEnumMap[MapElementEnum.GAS_STATION];
const STORAGE_ENUM_VALUE = MapElementEnumMap[MapElementEnum.OIL_DEPOT];
const BOAT_ENUM_VALUE = MapElementEnumMap[MapElementEnum.OIL_SHIP];
const queryParams: {
  名称: string | undefined;
  类型集合: number[] | undefined;
} = {
  名称: undefined,
  类型集合: undefined,
};
const handleCurrentChange = (currentPage: number) => {
  pagination.value.currentPage = currentPage;
  initTableData();
};
const handleViewDetail = (row: ItableData) => {
  console.log(row);
};
const handleUpdateDetail = (row: any) => {
  dialogVisible.value = true;
  itemForm.value = {
    id: row.id,
    type: row.类型,
    name: row.名称,
    description: row.描述,
    location: row.坐标,
  };
};
const handleAddRecord = () => {
  itemForm.value = {
    id: null,
    type: undefined,
    name: "",
    description: "",
    location: "",
  };
  dialogVisible.value = true;
};
const handleDeleteRecord = (row: any) => {
  // console.log("删除");
  ElMessageBox.confirm("此操作将永久删除该节点, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      GsLocationAPI.deleteMapElement(row.id).then(() => {
        ElMessage.success("删除成功");
        initTableData();
      });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};
const filterItemList: Ref<business.IBuisnessFilterItem[]> = ref([
  {
    label: "类型",
    prop: "类型",
    value: null,
    options: Object.values(MapElementEnumMap),
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
  queryParams["类型集合"] = filter.类型
    ? filter.类型 === "全部"
      ? undefined
      : [filter.类型]
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
  const params = {
    ...queryParams,
    页码: pagination.value.currentPage,
    页容量: pagination.value.pageSize,
  };
  const res: any = await GsLocationAPI.getMapElementList(params);
  tableData.value = res["当前记录"];
  pagination.value.total = +res["记录总数"];
  loading.value = false;
};

const onSubmitItemForm = async () => {
  itemFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      submitItemLoading.value = true;
      const submitData = {
        id: itemForm.value.id,
        名称: itemForm.value.name,
        描述: itemForm.value.description,
        坐标: itemForm.value.location,
        类型: itemForm.value.type,
      };
      const op = itemForm.value.id
        ? GsLocationAPI.updateMapElement
        : GsLocationAPI.addMapElement;
      const res = await op(submitData);
      ElMessage.success("操作成功");
      dialogVisible.value = false;
      initTableData();
      submitItemLoading.value = false;
      itemForm.value = {
        id: null,
        location: "",
        type: undefined,
        name: "",
        description: "",
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
