<!-- 库存台账 -->
<template>
  <div class="main-wrapper">
    <!-- 标题 -->
    <!-- 统计数据区 -->
    <div class="g-title-block">
      <div class="__title">库存台账</div>
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
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="goodsName" label="商品名称" />
      <el-table-column prop="goodsCode" label="商品编码" />
      <el-table-column prop="goodsType" label="商品分类" />
      <el-table-column prop="goodsUnit" label="计量单位" />
      <el-table-column prop="goodsPrice" label="单价" />
      <el-table-column prop="goodsStock" label="库存" />
      <el-table-column prop="goodsAmount" label="金额" />
      <el-table-column prop="location" label="仓库" />
      <el-table-column prop="shelf" label="货架" />
      <el-table-column prop="description" label="备注" />
      <!-- <el-table-column prop="createdBy" label="创建人" />
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column prop="updatedBy" label="更新人" />
      <el-table-column prop="updatedAt" label="更新时间" /> -->
      <el-table-column prop="dataFrom" label="数据来源" />
      <el-table-column prop="audited" label="是否审核" />
      <el-table-column prop="goodsStock" label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import business from "@/types/business";
import { useRouter } from "vue-router";

const router = useRouter();

const goodsTypeList = ref([
  {
    value: "食品",
    label: "食品",
  },
  {
    value: "饮料",
    label: "饮料",
  },
]);

const goodsSourceSysList: Ref<GenericRecord[]> = ref([
  {
    value: "泛微",
    label: "泛微",
  },
  {
    value: "库区ERP",
    label: "库区ERP",
  },
  {
    value: "本系统",
    label: "本系统",
  },
]);

const filterItemList = ref([
  {
    label: "商品名称",
    type: "input",
    model: "goodsName",
  },
  {
    label: "统计来源",
    type: "select",
    model: "goodsSource",
    options: goodsSourceSysList.value,
  },
  {
    label: "商品编码",
    type: "input",
    model: "goodsCode",
  },
  {
    label: "商品分类",
    type: "radio",
    model: "goodsType",
    options: goodsTypeList.value,
  },
]);

const searchForm = ref({
  goodsName: "",
  goodsCode: "",
  goodsType: "",
  goodsSource: "",
});

// interface IStockRecord {
//     id: string;
//     no: string;
//     date: string;
//     // goods?: IGoods;
//     goodsId: string;
//     goodsName: string;
//     goodsCode: string;
//     goodsType: string; // 货品类别：原材料、半成品、成品、油品、非油品之类
//     goodsUnit: string;
//     goodsPrice: 10;
//     goodsStock: 100;
//     goodsAmount: 1000; // 货品金额
//     location: string; // 仓库位置 1号仓库、2号仓库
//     shelf: string; // 货架 仅为概念，实际上可能是某个区域、某个油罐等
//     description: string; // 备注
//   }

const tableData: Ref<business.IAuditableEntity<business.IStockRecord>[]> = ref([
  {
    id: "1",
    no: "123456",
    date: "2021-09-01",
    onway: false,
    goodsId: "1",
    goodsName: "汽油#92",
    goodsCode: "001",
    goodsType: "油品",
    goodsUnit: "吨",
    goodsPrice: 10,
    goodsStock: 100,
    goodsAmount: 1000,
    location: "永盛钦州库",
    shelf: "A1",
    description: "这是汽油#92",
    createdBy: "管理员",
    updatedBy: "管理员",
    createdAt: "2021-09-01",
    updatedAt: "2021-09-02",
    dataFrom: "泛微",
    audited: true,
  },
  {
    id: "2",
    no: "654321",
    date: "2021-09-02",
    onway: false,
    goodsId: "2",
    goodsName: "柴油#0",
    goodsCode: "002",
    goodsType: "油品",
    goodsUnit: "吨",
    goodsPrice: 10,
    goodsStock: 100,
    goodsAmount: 1000,
    location: "永盛钦州库",
    shelf: "A2",
    description: "这是柴油#0",
    createdBy: "管理员",
    updatedBy: "管理员",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-04",
    dataFrom: "泛微",
    audited: false,
  },
  {
    id: "3",
    no: "987654",
    date: "2021-09-03",
    onway: false,
    goodsId: "3",
    goodsName: "汽油#95",
    goodsCode: "003",
    goodsType: "油品",
    goodsUnit: "吨",
    goodsPrice: 10,
    goodsStock: 100,
    goodsAmount: 1000,
    location: "永盛钦州库",
    shelf: "A3",
    description: "这是汽油#95",
    createdBy: "管理员",
    updatedBy: "管理员",
    createdAt: "2021-09-05",
    updatedAt: "2021-09-06",
    dataFrom: "泛微",
    audited: true,
  },
  {
    id: "4",
    no: "123456",
    date: "2021-09-04",
    onway: false,
    goodsId: "4",
    goodsName: "柴油#10",
    goodsCode: "004",
    goodsType: "油品",
    goodsUnit: "吨",
    goodsPrice: 10,
    goodsStock: 100,
    goodsAmount: 1000,
    location: "广东库",
    shelf: "A4",
    description: "这是柴油#10",
    createdBy: "管理员",
    updatedBy: "管理员",
    createdAt: "2021-09-07",
    updatedAt: "2021-09-08",
    dataFrom: "本系统",
    audited: false,
  },
]);

const handleAddRecord = () => {
  router.push({
    name: "ReportForm",
    query: {
      type: "storageDetail",
    },
  });
};
const handleViewDetail = (row: any) => {
  console.log(row);
};

const handleDeleteRecord = (row: any) => {
  console.log(row);
};

const search = () => {
  console.log(searchForm.value);
};

const reset = () => {
  searchForm.value.goodsName = "";
  searchForm.value.goodsCode = "";
  searchForm.value.goodsType = "";
};

const handleConfirmFilter = () => {
  search();
};

const handleEdit = (row: any) => {
  console.log(row);
};

const handleDelete = (row: any) => {
  console.log(row);
};

onMounted(() => {
  console.log("mounted");
});
</script>

<style lang="scss" scoped>
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
