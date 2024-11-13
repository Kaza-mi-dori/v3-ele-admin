<!-- 客商管理 -->
<template>
  <div>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="客户" name="client" />
      <el-tab-pane label="供应商" name="provider" />
    </el-tabs>
    <div class="flex justify-between mb-2">
      <div class="flex">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择"
          class="mr-4"
          style="width: 150px"
        >
          <template v-slot:prefix>
            <span>状态</span>
          </template>
          <el-option label="全部" value="all" />
          <el-option label="正常" value="active" />
          <el-option label="停用" value="inactive" />
        </el-select>
        <el-select
          v-model="searchForm.type"
          placeholder="请选择"
          class="mr-4"
          style="width: 200px"
        >
          <template v-slot:prefix>
            <span>贸易类型</span>
          </template>
          <el-option label="原油" value="all" />
          <el-option label="成品油" value="active" />
          <el-option label="化工产品" value="inactive" />
        </el-select>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </div>
      <div>
        <el-button @click="handleImportExcel">excel导入</el-button>
        <el-button v-if="isSelecting" type="primary">确定导出</el-button>
        <el-button v-if="isSelecting" type="warning" @click="flipSelecting">
          取消导出
        </el-button>
        <el-dropdown trigger="click" class="ml-2 mr-2" @command="handleCommand">
          <el-button icon="ArrowDown">导出</el-button>
          <template v-slot:dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="select">导出选中行</el-dropdown-item>
              <el-dropdown-item command="page">导出当前页</el-dropdown-item>
              <el-dropdown-item command="all">导出全部</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button>新增客商</el-button>
      </div>
    </div>
    <el-table border stripe :data="tableData" style="width: 100%">
      <!-- 选择 -->
      <el-table-column
        v-if="isSelecting"
        key="selecting"
        type="selection"
        width="55"
      />
      <el-table-column prop="name" label="客商名称" fixed="left">
        <template v-slot="{ row }">
          <el-link type="primary" @click="handleClickName">
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="客商类型" />
      <el-table-column prop="yearlyScore" label="年度评分">
        <template v-slot="{ row }">
          <el-progress :percentage="row.yearlyScore" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <el-tag v-if="row.status === 'active'" type="success">正常</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="blocked" label="是否封禁">
        <template v-slot="{ row }">
          <el-tag v-if="row.blocked" type="danger">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bargainAmount" label="交易金额" />
      <el-table-column prop="riskAmount" label="风险金额" />
      <el-table-column prop="contractAmount" label="合同金额" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="操作" width="150px">
        <template v-slot="scope">
          <el-button
            size="small"
            class="mr-2"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-dropdown trigger="click">
            <el-button size="small" icon="ArrowDown">更多</el-button>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="flex justify-end mt-4"
      background
      layout="sizes, total, prev, pager, next"
      :page-sizes="[20, 50, 100, 200, 300, 9999]"
      :total="100"
      :page-size="20"
      @size-change="handleSizeChange"
    />
    <importExcelDialog ref="importExcelDialogRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import importExcelDialog from "@/components/Dialogs/importExcelDialog.vue";

interface Partner {
  id: string;
  no: string;
  name: string;
  businessType?: string;
  isClient: boolean;
  isProvider: boolean;
  type: string;
  phone: string;
  address: string;
  yearlyScore: number;
  status: "active" | "inactive";
  blocked: boolean;
  bargainAmount: number;
  riskAmount: number;
  contractAmount: number;
  purchaseAmount: number;
  saleAmount: number;
  purchaseContract: number;
  saleContract: number;
}

const tableData = ref<Partner[]>([]);
const clientTableData = ref<Partner[]>([
  {
    id: "1",
    no: "1",
    name: "永盛石化",
    type: "石化",
    isClient: true,
    isProvider: true,
    phone: "123456789",
    address: "广州市天河区",
    yearlyScore: 90,
    status: "active",
    blocked: false,
    bargainAmount: 1000,
    riskAmount: 100,
    contractAmount: 1000,
    purchaseAmount: 1000,
    saleAmount: 1000,
    purchaseContract: 1000,
    saleContract: 1000,
  },
  {
    id: "2",
    no: "2",
    name: "广投石化",
    type: "石化",
    isClient: true,
    isProvider: true,
    phone: "123456789",
    address: "广州市天河区",
    yearlyScore: 80,
    status: "active",
    blocked: false,
    bargainAmount: 1000,
    riskAmount: 100,
    contractAmount: 1000,
    purchaseAmount: 1000,
    saleAmount: 1000,
    purchaseContract: 1000,
    saleContract: 1000,
  },
  {
    id: "3",
    no: "3",
    name: "广州石化",
    type: "石化",
    isClient: true,
    isProvider: true,
    phone: "123456789",
    address: "广州市天河区",
    yearlyScore: 70,
    status: "active",
    blocked: false,
    bargainAmount: 1000,
    riskAmount: 100,
    contractAmount: 1000,
    purchaseAmount: 1000,
    saleAmount: 1000,
    purchaseContract: 1000,
    saleContract: 1000,
  },
  {
    id: "4",
    no: "4",
    name: "广东石化",
    type: "石化",
    isClient: true,
    isProvider: true,
    phone: "123456789",
    address: "广州市天河区",
    yearlyScore: 60,
    status: "active",
    blocked: false,
    bargainAmount: 1000,
    riskAmount: 100,
    contractAmount: 1000,
    purchaseAmount: 1000,
    saleAmount: 1000,
    purchaseContract: 1000,
    saleContract: 1000,
  },
]);
const providerTableData = ref<Partner[]>([
  {
    id: "5",
    no: "5",
    name: "中海油",
    type: "石化",
    isClient: true,
    isProvider: true,
    phone: "123456789",
    address: "广州市天河区",
    yearlyScore: 90,
    status: "active",
    blocked: false,
    bargainAmount: 1000,
    riskAmount: 100,
    contractAmount: 1000,
    purchaseAmount: 1000,
    saleAmount: 1000,
    purchaseContract: 1000,
    saleContract: 1000,
  },
  {
    id: "6",
    no: "6",
    name: "中石油",
    type: "石化",
    isClient: true,
    isProvider: true,
    phone: "123456789",
    address: "广州市天河区",
    yearlyScore: 80,
    status: "active",
    blocked: false,
    bargainAmount: 1000,
    riskAmount: 100,
    contractAmount: 1000,
    purchaseAmount: 1000,
    saleAmount: 1000,
    purchaseContract: 1000,
    saleContract: 1000,
  },
  {
    id: "7",
    no: "7",
    name: "中石化",
    type: "石化",
    isClient: true,
    isProvider: true,
    phone: "123456789",
    address: "广州市天河区",
    yearlyScore: 70,
    status: "active",
    blocked: false,
    bargainAmount: 1000,
    riskAmount: 100,
    contractAmount: 1000,
    purchaseAmount: 1000,
    saleAmount: 1000,
    purchaseContract: 1000,
    saleContract: 1000,
  },
]);

const activeTab = ref<string>("client");

const searchForm = ref<GenericRecord>({
  type: "all",
});

const isSelecting = ref<boolean>(false);

const importExcelDialogRef = ref<typeof importExcelDialog | null>(null);

const handleTabClick = (tab: any) => {
  if (tab.name === "client") {
    tableData.value = clientTableData.value;
  } else {
    tableData.value = providerTableData.value;
  }
};

const handleEdit = (index: number, row: any) => {
  console.log("edit", index, row);
};

const handleDelete = (index: number, row: any) => {
  console.log("delete", index, row);
};

const handleClickName = () => {
  console.log("click name");
};

const handleImportExcel = () => {
  if (importExcelDialogRef.value) {
    console.log("importExcelDialogRef", importExcelDialogRef.value);
    importExcelDialogRef.value.open();
  }
};

const handleCommand = (command: string) => {
  switch (command) {
    case "select":
      isSelecting.value = true;
      break;
    case "page":
      console.log("page");
      break;
    case "all":
      console.log("all");
      break;
  }
};

const flipSelecting = () => {
  isSelecting.value = !isSelecting.value;
};

const handleSizeChange = (val: number) => {
  console.log("handleSizeChange", val);
};

onMounted(() => {
  tableData.value = clientTableData.value;
});
</script>
