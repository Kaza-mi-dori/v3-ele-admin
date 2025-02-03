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
                  v-model="yearlyReportDetailForm.dataDate"
                  type="year"
                  value-format="YYYY-MM-DD"
                  placeholder="选择数据时间"
                />
                <span v-else>{{ yearlyReportDetailForm.dataDate }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="info-card-level1">
      <div class="__title">
        <span>明细记录</span>
      </div>
      <div class="__content">
        <el-table
          class="g-table-1"
          stripe
          border
          style="width: 100%; overflow-x: auto"
          :data="yearlyReportDetailForm.detailRecords"
        >
          <el-table-column width="200" fixed="left">
            <template #header>
              <span>
                公司名称
                <span v-if="rules.businessType" class="text-red-5">*</span>
              </span>
            </template>
            <template v-slot="scope">
              <el-input v-if="editing" v-model="scope.row.companyName" />
              <span v-else>{{ scope.row.companyName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="purchaseDate" label="采购日期">
            <template v-slot="scope">
              <datePicker
                v-if="editing"
                v-model="scope.row.purchaseDate"
                style="width: 100%"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择采购日期"
              />
              <span v-else>{{ scope.row.purchaseDate }}</span>
            </template>
          </el-table-column>
          <el-table-column width="300" prop="contractNumber" label="合同编号">
            <template v-slot="scope">
              <contractSelector
                v-if="editing"
                v-model="scope.row.contractNumber"
                prop="合同编号"
                propQueryInList
              />
              <span v-else>{{ scope.row.contractNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="productName" label="商品名称">
            <template v-slot="scope">
              <el-input v-if="editing" v-model="scope.row.productName" />
              <span v-else>{{ scope.row.productName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="productType" label="产品类型">
            <template v-slot="scope">
              <el-input v-if="editing" v-model="scope.row.productType" />
              <span v-else>{{ scope.row.productType }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="amount" label="数量">
            <template v-slot="scope">
              <el-input
                v-if="editing"
                v-model="scope.row.amount"
                type="amount"
              />
              <span v-else>{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="price" label="含税单价">
            <template v-slot="scope">
              <el-input v-if="editing" v-model="scope.row.price" type="price" />
              <span v-else>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="totalAmount" label="金额">
            <template v-slot="scope">
              <el-input
                v-if="editing"
                v-model="scope.row.totalAmount"
                type="totalAmount"
              />
              <span v-else>{{ scope.row.totalAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            prop="priceWithoutTax"
            label="不含税单价"
          >
            <template v-slot="scope">
              <el-input
                v-if="editing"
                v-model="scope.row.priceWithoutTax"
                type="priceWithoutTax"
              />
              <span v-else>{{ scope.row.priceWithoutTax }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="taxRate" label="税率">
            <template v-slot="scope">
              <el-input
                v-if="editing"
                v-model="scope.row.taxRate"
                type="taxRate"
              />
              <span v-else>{{ scope.row.taxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="taxAmount" label="税额">
            <template v-slot="scope">
              <el-input
                v-if="editing"
                v-model="scope.row.taxAmount"
                type="taxAmount"
              />
              <span v-else>{{ scope.row.taxAmount }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="w-full">
          <el-button
            v-if="editing"
            icon="plus"
            size="small"
            class="w-full g-button-1"
            @click="handleAddSubRecord"
          >
            新增
          </el-button>
        </div>
      </div>
    </div>
    <div class="info-card-level1">
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
    </div>
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
import datePicker from "@/components/ElBasicPlus/datePicker.vue";
import contractSelector from "@/components/Business/Selector/contract.vue";
import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { type FormInstance } from "element-plus";
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

interface detailRecord {
  /** 公司名称 */
  companyName: string;
  /** 商品名称 */
  productName: string;
  /** 产品类型 */
  productType: string;
  /** 数量 */
  amount: number;
  /** 含税单价 */
  price: number;
  /** 金额 */
  totalAmount: number;
  /** 不含税单价 */
  priceWithoutTax: number;
  /** 税率 */
  taxRate: number;
  /** 税额 */
  taxAmount: number;
  /** 采购日期 */
  purchaseDate: string;
  /** 合同编号 */
  contractNumber: string;
  /** 发票号码 */
  invoiceNumber: string;
  /** 份数 */
  invoiceCopies: number;
  /** 凭证号 */
  voucherNumber: string;
}

const yearlyReportDetailForm = ref({
  name: "采购明细记录",
  dataDate: undefined,
  detailRecords: [] as detailRecord[],
  createdAt: "2021-01-01",
  createdBy: "admin",
  updatedAt: "2021-01-01",
  updatedBy: "admin",
  dataFrom: "系统录入",
  audited: "是",
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

const handleAddSubRecord = () => {
  yearlyReportDetailForm.value.detailRecords.push({
    companyName: "",
    productName: "",
    productType: "",
    amount: 0,
    price: 0,
    totalAmount: 0,
    priceWithoutTax: 0,
    taxRate: 0,
    taxAmount: 0,
    purchaseDate: "",
    contractNumber: "",
    invoiceNumber: "",
    invoiceCopies: 0,
    voucherNumber: "",
  });
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

/** 新增排名记录 */
const addRankRecord = () => {
  const rank = yearlyReportDetailForm.value.rankData.length + 1;
  yearlyReportDetailForm.value.rankData.push({
    rank: rank.toString(),
    name: "",
    profit: "",
    revenue: "",
  });
};

/** 删除排名记录 */
const handleDelete = (row: any) => {
  const index = yearlyReportDetailForm.value.rankData.indexOf(row);
  yearlyReportDetailForm.value.rankData.splice(index, 1);
};

/** 图片预览 */
const handlePictureCardPreview = async (file: any) => {
  console.log("handlePictureCardPreview", file);
};

/** 删除图片 */
const handleRemove = async (file: any) => {
  console.log("handleRemove", file);
};

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
    yearlyReportDetailForm.value = value;
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
