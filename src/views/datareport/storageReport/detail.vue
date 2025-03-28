<!-- 贸易伙伴报表 -->
<template>
  <div class="main-wrapper">
    <!-- <div class="g-title-block-2">
      <div class="__title">年度经营报表</div>
    </div> -->
    <!-- <div class="mb-4 p-10px bg-white">
      <el-button class="g-button-1" type="primary" @click="submitForm">
        提交
      </el-button>
      <el-button class="g-button-1" @click="favoForm">收藏</el-button>
      <el-button class="g-button-1" @click="exportForm">导出</el-button>
    </div> -->
    <div class="info-card-level1">
      <div class="__title">
        <span>基本信息</span>
      </div>
      <div class="__content">
        <el-form
          ref="formRef"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="yearlyReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="数据时间" prop="year">
                <el-date-picker
                  v-if="editing"
                  v-model="yearlyReportDetailForm.dataTime"
                  type="year"
                  value-format="YYYY-MM-DD"
                  placeholder="选择数据时间"
                />
                <span v-else>{{ yearlyReportDetailForm.dataTime }}</span>
              </el-form-item>
            </el-col>
            <!-- 报表类型 -->
            <el-col :span="8">
              <el-form-item label="报表类型">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.aggTag"
                />
                <span v-else>{{ yearlyReportDetailForm.aggTag || "-" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业名称">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.companyName"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.companyName || "-" }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品名称">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.productName"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.productName || "-" }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品类型">
                <el-select
                  v-if="editing"
                  v-model="yearlyReportDetailForm.productTypeName"
                >
                  <el-option label="原油" value="原油" />
                  <el-option label="成品油" value="成品油" />
                </el-select>
                <span v-else>{{ yearlyReportDetailForm.productTypeName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- <div class="info-card-level1">
      <div class="__title">
        <span>附件信息</span>
      </div>
      <div class="__content">
        <div class="flex mb-4 items-center">
          <el-checkbox v-model="allSelected" style="margin-right: 20px">
            全选
          </el-checkbox>
          <el-button>下载</el-button>
          <el-button v-if="editing" type="danger">删除</el-button>
        </div>
        <upload
          :disabled="!editing"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="yearlyReportDetailForm.attachment"
        />
      </div>
    </div> -->
    <div class="info-card-level1">
      <div class="__title">
        <span>当期数据</span>
      </div>
      <div class="__content">
        <el-form
          v-if="yearlyReportDetailForm.businessData"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="yearlyReportDetailForm.businessData"
        >
          <!-- <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="成本金额(元)" prop="cost">
                <span>{{ yearlyReportDetailForm.businessData.cost }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="利润金额(元)" prop="profit">
                <span>{{ yearlyReportDetailForm.businessData.profit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="营收金额(元)" prop="revenue">
                <span>{{ yearlyReportDetailForm.businessData.revenue }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购金额(元)" prop="purchaseAmount">
                <span>
                  {{ yearlyReportDetailForm.businessData.purchaseAmount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购数量(吨)" prop="purchaseCount">
                <span>
                  {{ yearlyReportDetailForm.businessData.purchaseCount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售金额(元)" prop="sellAmount">
                <span>
                  {{ yearlyReportDetailForm.businessData.sellAmount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售量(吨)" prop="sellCount">
                <span>{{ yearlyReportDetailForm.businessData.sellCount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="库存量(吨)" prop="stockAmount">
                <span>
                  {{ yearlyReportDetailForm.businessData.stockAmount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库量(吨)" prop="inStorageAmount">
                <span>
                  {{ yearlyReportDetailForm.businessData.inStorageAmount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出库量(吨)" prop="outStorageAmount">
                <span>
                  {{ yearlyReportDetailForm.businessData.outStorageAmount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="平均采购价(元/吨)" prop="avgPurchasePrice">
                <span>
                  {{ yearlyReportDetailForm.businessData.avgPurchasePrice }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="平均销售价(元/吨)" prop="avgSellPrice">
                <span>
                  {{ yearlyReportDetailForm.businessData.avgSellPrice }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="平均成本(元/吨)" prop="avgCost">
                <span>
                  {{ yearlyReportDetailForm.businessData.avgCost }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="平均毛利率" prop="avgGrossMargin">
                <span>
                  {{ yearlyReportDetailForm.businessData.avgGrossMargin }}
                </span>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- 用表格形式展示每个字段 -->
          <el-table :data="keyValueTable" border style="width: 100%">
            <el-table-column label="指标" prop="key" />
            <el-table-column label="当期值">
              <template #default="scope">
                <span>{{ scope.row.value || "-" }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="同比" prop="同比" />
            <el-table-column label="环比" prop="环比" /> -->
          </el-table>
        </el-form>
      </div>
    </div>
    <!-- 关联子数据
    <div class="info-card-level1">
      <div class="__title">
        <span>关联数据</span>
      </div>
      <div class="__content">
        <el-table
          :data="yearlyReportDetailForm.subDataToDisplay"
          :loading="tableLoading"
          border
          style="width: 100%"
        >
          <el-table-column label="数据时间" prop="数据时间" />
          <el-table-column label="企业名称" prop="企业名称" />
          <el-table-column label="产品名称" prop="产品名称" />
          <el-table-column label="产品类型" prop="产品类型" />
          <el-table-column label="成本金额(元)" prop="成本金额" />
          <el-table-column label="利润金额(元)" prop="利润金额" />
          <el-table-column label="营收金额(元)" prop="营收金额" />
          <el-table-column label="采购金额(元)" prop="采购金额" />
          <el-table-column label="采购数量(吨)" prop="采购数量" />
          <el-table-column label="销售金额(元)" prop="销售金额" />
          <el-table-column label="销售数量(吨)" prop="销售数量" />
          <el-table-column label="库存量(吨)" prop="库存量" />
          <el-table-column label="入库量(吨)" prop="入库量" />
          <el-table-column label="出库量(吨)" prop="出库量" />
          <el-table-column label="平均采购价(元/吨)" prop="平均采购价" />
          <el-table-column label="平均销售价(元/吨)" prop="平均销售价" />
          <el-table-column label="平均成本(元/吨)" prop="平均成本" />
          <el-table-column label="平均毛利率" prop="平均毛利率" />
        </el-table>
      </div>
    </div> -->
    <div class="info-card-level1">
      <div class="__title">
        <span>维护信息</span>
      </div>
      <div class="__content">
        <el-form
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="yearlyReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="创建时间" prop="createdAt">
                <span>{{ yearlyReportDetailForm.createdAt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人" prop="createdBy">
                <span>{{ yearlyReportDetailForm.createdBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新时间" prop="updatedAt">
                <span>{{ yearlyReportDetailForm.updatedAt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新人" prop="updatedBy">
                <span>{{ yearlyReportDetailForm.updatedBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据来源" prop="dataFrom">
                <span>{{ yearlyReportDetailForm.dataFrom }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否审核" prop="audited">
                <span>{{ yearlyReportDetailForm.audited }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { type FormInstance } from "element-plus";
import BusinessFormAPI from "@/api/businessForm";
import upload from "@/components/ElBasicPlus/upload.vue";
import sassvariables from "@/styles/variables.module.scss";

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
  editing: {
    type: Boolean,
    default: false,
  },
});

const formRef = ref<Nullable<FormInstance>>(null);
const { id, editing } = toRefs(props);

const allSelected = ref(false);

const yearlyReportDetailForm = ref({
  name: "产品经营报表",
  dataTime: "2021-01-01",
  companyName: "石化板块",
  productName: "原油产品",
  productTypeName: "原油",
  aggTag: "企业年报",
  businessData: {
    // 利润
    "利润金额(元)": 200,
    // 收入
    "营收金额(元)": 1000,
    // 成本
    "成本金额(元)": 800,
    // 采购量
    "采购金额(元)": 1000,
    // 采购次数
    "采购数量(吨)": 200,
    // 销售金额
    "销售金额(元)": 1000,
    // 销售量
    "销售数量(吨)": 200,
    // 库存量
    "库存量(吨)": 1000,
    // 入库量
    "入库量(吨)": 1000,
    // 出库量
    "出库量(吨)": 1000,
    // 平均采购价
    "平均采购价(元/吨)": 1000,
    // 平均销售价
    "平均销售价(元/吨)": 1000,
    // 平均成本
    "平均成本(元/吨)": 1000,
    // 平均毛利率
    平均毛利率: 1000,
    // 毛利率
    毛利率: 1000,
  },
  subData: [],
  subDataToDisplay: [],
  createdAt: "2021-01-01",
  createdBy: "admin",
  updatedAt: "2021-01-01",
  updatedBy: "admin",
  dataFrom: "系统录入",
  audited: "是",
});

const tableLoading = ref(false);
const keyValueTable = computed(() => {
  return Object.entries(yearlyReportDetailForm.value.businessData).map(
    ([key, value]) => {
      return { key, value };
    }
  );
});

const rules: Ref<GenericRecord> = ref({
  year: [{ required: true, message: "请输入年度", trigger: "blur" }],
  profit: [{ required: true, message: "请输入利润", trigger: "blur" }],
  revenue: [{ required: true, message: "请输入收入", trigger: "blur" }],
  cost: [{ required: true, message: "请输入成本", trigger: "blur" }],
});

const submitForm = () => {
  console.log("submitForm");
};

const favoForm = () => {
  console.log("favoForm");
};

const exportForm = () => {
  console.log("exportForm");
};

// 后端搜索企业接口
let timeout: ReturnType<typeof setTimeout>;
const queryPartnerSearchAsync = (query: string, cb: (args: any) => void) => {
  console.log("queryPartnerSearchAsync", query);
  const result = [
    { value: "永盛石化", label: "永盛石化" },
    { value: "广投石化", label: "广投石化" },
    { value: "中石化", label: "中石化" },
  ];
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(result.filter((item) => item.label.includes(query)));
  }, 1000);
};

const handleSelectPartner = (value: any) => {
  console.log("handleSelectPartner", value);
};
/** 图片预览 */
const handlePictureCardPreview = async (file: any) => {
  console.log("handlePictureCardPreview", file);
};

/** 删除图片 */
const handleRemove = async (file: any) => {
  console.log("handleRemove", file);
};

// watch(
//   () => yearlyReportDetailForm.value.subData,
//   async (newVal) => {
//     if (newVal.length > 0) {
//       tableLoading.value = true;
//       const promises = newVal.map((item: any) => {
//         return BusinessFormAPI.getMonthlyProductReportForm(item);
//       });
//       const results = await Promise.all(promises);
//       yearlyReportDetailForm.value.subDataToDisplay = results.map(
//         (item: any) => {
//           return {
//             数据时间: item["数据日期"],
//             企业名称: item["企业名称"],
//             产品名称: item["产品名称"],
//             产品类型: item["产品类型"],
//             成本金额: item["经营数据"]?.["成本金额"],
//             利润金额: item["经营数据"]?.["利润金额"],
//             营收金额: item["经营数据"]?.["营收金额"],
//             采购金额: item["经营数据"]?.["采购金额"],
//             采购数量: item["经营数据"]?.["采购数量"],
//             销售金额: item["经营数据"]?.["销售金额"],
//             销售数量: item["经营数据"]?.["销售数量"],
//             库存量: item["经营数据"]?.["库存量"],
//             入库量: item["经营数据"]?.["入库量"],
//             出库量: item["经营数据"]?.["出库量"],
//             平均采购价: item["经营数据"]?.["平均采购价"],
//             平均销售价: item["经营数据"]?.["平均销售价"],
//             平均成本: item["经营数据"]?.["平均成本"],
//             平均毛利率: item["经营数据"]?.["平均毛利率"],
//           };
//         }
//       );
//       tableLoading.value = false;
//     }
//   },
//   { deep: true }
// );

// 历史记录功能
const { history, commit, undo, redo } = useManualRefHistory(
  yearlyReportDetailForm,
  { clone: true }
);

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(yearlyReportDetailForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    console.log("setFormValue", value);
    try {
      yearlyReportDetailForm.value = value;
    } catch (error) {
      console.log("setFormValue error", error);
    }
  }
};

const validateForm = () => {
  return formRef.value?.validate();
};

const generateRandomData = () => {
  yearlyReportDetailForm.value = {
    name: "贸易伙伴报表",
    year: "2024-01-01",
    partnerName: "永盛石化",
    partnerType: "供应商",
    totalTradeAmount: "1000",
    tradeAmountYoY: "124",
    tradeAmountMoM: "98",
    createdAt: "2021-01-01",
    createdBy: "admin",
    updatedAt: "2021-01-01",
    updatedBy: "admin",
    dataFrom: "系统录入",
    audited: "是",
  };
};

defineExpose({
  saveForm,
  restoreForm,
  getFormValue,
  setFormValue,
  validateForm,
  generateRandomData,
});
</script>

<style lang="scss" scoped></style>
