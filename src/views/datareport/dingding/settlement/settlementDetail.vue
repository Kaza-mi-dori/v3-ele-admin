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
            <el-col :span="24">
              <el-form-item label="结算名称" prop="SettlementName">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.settlementName"
                />
                <span v-else>{{ yearlyReportDetailForm.settlementName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算类型" prop="settlementType">
                <el-select
                  v-if="editing"
                  v-model="yearlyReportDetailForm.settlementType"
                  class="w-full"
                >
                  <el-option label="结算" value="结算" />
                  <el-option label="预付款" value="预付款" />
                  <el-option label="质保金" value="质保金" />
                </el-select>
                <span v-else>
                  {{ yearlyReportDetailForm.settlementType }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算总额" prop="settlementAmount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.settlementAmount"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.settlementAmount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="钉钉合同编号" prop="dingContractNumber">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.dingContractNumber"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.dingContractNumber }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>主要内容</span>
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
            <el-col :span="24">
              <el-form-item prop="mainCotent">
                <template #label>
                  <span class="mr-4">正文内容</span>
                  <el-button
                    icon="FullScreen"
                    circle
                    @click="toggleFullScreen"
                  />
                </template>
                <el-input
                  v-model="yearlyReportDetailForm.description"
                  :readonly="!editing"
                  type="textarea"
                  :autosize="{ minRows: 10, maxRows: 20 }"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
    <el-dialog
      v-model="mainContentFullScreenVisible"
      width="95%"
      title="结算主要内容"
      top="2vh"
    >
      <div>
        <el-input
          v-model="yearlyReportDetailForm.description"
          type="textarea"
          readonly
          style="cursor: not-allowed"
          :autosize="{ minRows: 10, maxRows: 40 }"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import datePicker from "@/components/ElBasicPlus/datePicker.vue";
import SettlementSelector from "@/components/Business/Selector/Settlement.vue";
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

interface DetailRecord {
  /** 结算名称 */
  settlementName: string;
  /** 结算类型 */
  settlementType: string;
  /** 结算总额 */
  settlementAmount: number;
  /** 钉钉合同编号 */
  dingContractNumber: string;
  /** 正文说明 */
  description: string;

  content: {
    /** 主要内容 */
    mainCotent: string;
    /** 结算金额 */
    settlementAmount: string;
    /** 其他内容 */
    [key: string]: any;
  };
  /** 创建时间 */
  createdAt: string;
  /** 创建人 */
  createdBy: string;
  /** 更新时间 */
  updatedAt: string;
  updatedBy: string;
  /** 数据来源 */
  dataFrom: string;
  /** 是否审核 */
  audited: string;
}

const yearlyReportDetailForm = ref<DetailRecord>({
  settlementName: "",
  settlementType: "",
  settlementAmount: 0,
  dingContractNumber: "",
  description: "",
  content: {
    mainCotent: "",
    settlementAmount: "",
  },
  createdAt: "",
  createdBy: "",
  updatedAt: "",
  updatedBy: "",
  dataFrom: "",
  audited: "",
});

const rules: Ref<GenericRecord> = ref({
  year: [{ required: true, message: "请输入年度", trigger: "blur" }],
  profit: [{ required: true, message: "请输入利润", trigger: "blur" }],
  revenue: [{ required: true, message: "请输入收入", trigger: "blur" }],
  cost: [{ required: true, message: "请输入成本", trigger: "blur" }],
});

const mainContentFullScreenVisible = ref<boolean>(false);

const toggleFullScreen = () => {
  // console.log("toggleFullScreen");
  mainContentFullScreenVisible.value = !mainContentFullScreenVisible.value;
};

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
    SettlementNumber: "",
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

const generateRandomData = () => {};

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
