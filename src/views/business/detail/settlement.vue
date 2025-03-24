<!-- 企业概况报表-->
<template>
  <div class="main-wrapper">
    <!-- <div class="g-title-block-2">
      <div class="__title">年度经营报表</div>
    </div> -->
    <!-- <div class="mb-4 p-10px bg-white">
      <el-button class="g-button-1" type="primary">编辑</el-button>
      <el-button
        v-if="isEditing && editable"
        class="g-button-1"
        type="primary"
        @click="submitForm"
      >
        提交
      </el-button>
      <el-button class="g-button-1" @click="favoForm">收藏</el-button>
      <el-button class="g-button-1" @click="exportForm">导出</el-button>
    </div> -->
    <div class="info-card-level1">
      <div class="__title">
        <span>报表信息</span>
      </div>
      <div class="__content">
        <el-form
          ref="formRef"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="firmReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="日期" prop="date">
                <datePicker
                  v-if="editing"
                  v-model="firmReportDetailForm.date"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="选择结算日期"
                />
                <span v-else>{{ firmReportDetailForm.date }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算单号" prop="number">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.number"
                  placeholder="请输入结算单号"
                />
                <span v-else>{{ firmReportDetailForm.number }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="款项编号" prop="number">
                <el-autocomplete
                  v-if="editing"
                  v-model="firmReportDetailForm.paymentNum"
                  :fetch-suggestions="debouncePaymentSearchAsync as any"
                  placeholder="请输入款项编号"
                  value-key="label"
                  @select="handleSelectPayment"
                />
                <span v-else>{{ firmReportDetailForm.paymentNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算合同" prop="contractNum">
                <!-- <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.contractNum"
                  filterable
                  remote
                  :remote-method="queryContractSearch"
                  placeholder="请选择结算合同"
                >
                  <el-option
                    v-for="item in contractList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select> -->
                <contractSelector
                  v-if="editing"
                  v-model="firmReportDetailForm.contractNum"
                  prop="合同编号"
                  propQueryInList
                />
                <span v-else>{{ firmReportDetailForm.contractNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算类型" prop="type">
                <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.type"
                  placeholder="请选择结算类型"
                >
                  <el-option label="预付款" value="预付款" />
                  <el-option label="货款" value="货款" />
                </el-select>
                <span v-else>{{ firmReportDetailForm.type }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.status"
                  placeholder="请选择状态"
                >
                  <el-option label="有效" value="有效" />
                  <el-option label="无效" value="无效" />
                </el-select>
                <span v-else>{{ firmReportDetailForm.status }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="含税金额(元)" prop="amount">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.amount"
                  type="number"
                />
                <span v-else>
                  {{
                    toThousands(
                      firmReportDetailForm.amount as unknown as string
                    )
                  }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="税率(%)" prop="taxRate">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.taxRate"
                  type="number"
                />
                <span v-else>{{ firmReportDetailForm.taxRate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算对方" prop="counterparty">
                <el-autocomplete
                  v-if="editing"
                  v-model="firmReportDetailForm.counterparty"
                  placeholder="请输入结算对方"
                  :fetch-suggestions="queryCounterpartySearch"
                  :trigger-on-focus="false"
                  :debounce="500"
                  value-key="label"
                />
                <span v-else>{{ firmReportDetailForm.counterparty }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算描述" prop="description">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.description"
                  placeholder="请输入结算描述"
                />
                <span v-else>{{ firmReportDetailForm.description }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算备注" prop="remark">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.remark"
                  placeholder="请输入结算备注"
                />
                <span v-else>{{ firmReportDetailForm.remark }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>关联款项</span>
      </div>
      <div class="__content">
        <el-table :data="firmReportDetailForm.payments" border>
          <el-table-column prop="款项日期" label="日期">
            <template #default="scope">
              <datePicker
                v-if="editing"
                v-model="scope.row.款项日期"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
              />
              <span v-else>{{ scope.row.款项日期 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="款项类型" label="类型">
            <template #default="scope">
              <el-select
                v-if="editing"
                v-model="scope.row.款项类型"
                placeholder="请选择款项类型"
              >
                <el-option label="预付款" value="预付款" />
                <el-option label="货款" value="货款" />
              </el-select>
              <span v-else>{{ scope.row.款项类型 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="款项单号" label="单号">
            <template #default="scope">
              <el-select
                v-if="editing"
                v-model="scope.row.款项单号"
                placeholder="请选择款项单号"
                filterable
                remote
                :remote-method="queryPaymentSearch"
              >
                <el-option
                  v-for="item in paymentList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span v-else>{{ scope.row.款项单号 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="款项描述" label="描述">
            <template #default="scope">
              <el-input v-if="editing" v-model="scope.row.款项描述" />
              <span v-else>{{ scope.row.款项描述 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="金额" label="金额(元)">
            <template #default="scope">
              <el-input v-if="editing" v-model="scope.row.金额" type="number" />
              <span v-else>{{ toThousands(scope.row.金额) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="备注" label="备注">
            <template #default="scope">
              <el-input v-if="editing" v-model="scope.row.备注" />
              <span v-else>{{ scope.row.备注 }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="w-full">
          <el-button
            v-if="editing"
            icon="plus"
            size="small"
            class="w-full g-button-1"
            @click="handleAddPayment"
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
          :file-list="firmReportDetailForm.attachment"
        />
      </div>
    </div>
    <div v-if="!editing" class="info-card-level1">
      <div class="__title">
        <span>维护信息</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import datePicker from "@/components/ElBasicPlus/datePicker.vue";
import contractSelector from "@/components/Business/Selector/contract.vue";
import upload from "@/components/ElBasicPlus/upload.vue";
import pdfPNG from "@/assets/icons/pdf.png";
import ExcelPNG from "@/assets/icons/excel.png";
import WordPNG from "@/assets/icons/WORD.png";
import ZipSVG from "@/assets/icons/zip.svg";
import BusinessStandbookAPI from "@/api/businessStandBook";
import { toThousands } from "@/utils";
import { ref, onMounted } from "vue";
import { useManualRefHistory, useDebounceFn } from "@vueuse/core";
import { FormInstance } from "element-plus";
import type {
  AutocompleteFetchSuggestions,
  AutocompleteFetchSuggestionsCallback,
  AutocompleteData,
} from "element-plus";
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

const { id, editing } = toRefs(props);
const formRef = ref<Nullable<FormInstance>>(null);

const firmReportDetailForm = ref({
  /** 数据日期 */
  date: undefined,
  /** 结算单号 */
  number: undefined,
  /** 款项编号 */
  paymentNum: undefined,
  /** 合同编号 */
  contractNum: undefined,
  /** 结算描述 */
  description: undefined,
  /** 结算备注 */
  remark: undefined,
  /** 结算类型 */
  type: undefined,
  /** 状态 */
  status: undefined,
  /** 含税金额 */
  amount: undefined,
  /** 税率 */
  taxRate: undefined,
  /** 结算对方 */
  counterparty: undefined,
  /** 附件 */
  attachment: [],
  /** 付款信息 */
  payments: [] as any[],
});

const rules: Ref<GenericRecord> = ref({
  date: [{ required: true, message: "请选择结算日期", trigger: "blur" }],
  number: [{ required: true, message: "请输入结算单号", trigger: "blur" }],
  type: [{ required: true, message: "请选择结算类型", trigger: "blur" }],
  amount: [{ required: true, message: "请输入含税金额", trigger: "blur" }],
  taxRate: [{ required: true, message: "请输入税率", trigger: "blur" }],
  counterparty: [
    { required: true, message: "请输入结算对方", trigger: "blur  " },
  ],
});

const allSelected = ref(false);

const editButtonVisible = ref(false); // 是否显示编辑开关, 应与用户权限结合

const editable = ref(false);

const isEditing = ref(false); // 是否正在编辑

const paymentList = ref<any>([]);
const queryPaymentSearch = async (query: string) => {
  // TODO 补全查询信息（包括根据相对方查找)
  const res: any = await BusinessStandbookAPI.getPaymentLedgerRecordList({
    状态集合: ["有效"],
    页码: 1,
    页容量: 20,
  });
  const result = res?.当前记录.map((item: any) => {
    return {
      value: item.款项编号,
      label:
        item.款项编号 +
        " " +
        (item.备注 || "") +
        " " +
        (item?.内容?.款项金额 || ""),
      款项日期: item.内容?.款项时间,
      款项类型: item.内容?.款项类型,
      款项单号: item.款项编号,
      款项描述: item.内容?.款项描述,
      金额: item?.内容?.款项金额,
      备注: item.备注,
    };
  });
  paymentList.value = result;
};

/**
 * 查询合同表
 */
const contractList = ref<any>([]);
const queryContractSearch = async (query: string) => {
  // TODO 获取合同编号(查询合同表)
  const res: any = await BusinessStandbookAPI.getContractLedgerRecordList({
    合同编号: query,
    页码: 1,
    页容量: 20,
  });
  const result = res["当前记录"].map((item: any) => {
    return {
      value: item["合同编号"],
      label:
        item["合同编号"] +
        (item["合同名称"] ? " " + item["合同名称"] : "") +
        (item["相对人名称"] ? "/" + item["相对人名称"] : ""),
    };
  });
  contractList.value = result;
};

/**
 * 查询客商表
 * @param query
 * @param callback
 */
const queryCounterpartySearch: AutocompleteFetchSuggestions = async (
  query: string,
  callback: AutocompleteFetchSuggestionsCallback
) => {
  // TODO 获取结算对方(查询客商表)
  callback([]);
};

function handlePaymentSelect(item: any, index: number) {
  firmReportDetailForm.value.payments[index] = {
    ...firmReportDetailForm.value.payments[index],
    ...item,
  };
}

function handleAddPayment() {
  firmReportDetailForm.value.payments.push({
    款项日期: undefined,
    款项类型: undefined,
    款项单号: undefined,
    款项描述: undefined,
    金额: undefined,
    备注: undefined,
  });
}

/**
 * 中文键值转为英文键值
 * @param value
 */
const converter = (value: any) => {
  const obj: any = {};
  for (const key in value) {
    if (key === "年份") {
      obj.year = value[key];
    } else if (key === "企业名称") {
      obj.name = value[key];
    } else if (key === "企业介绍") {
      obj.description = value[key];
    } else if (key === "企业资产") {
      obj.asset = value[key];
    }
  }
  return obj;
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

const handlePictureCardPreview = async (file: any) => {
  console.log("handlePictureCardPreview", file);
};

const handleDownload = async (file: any) => {
  console.log("handleDownload", file);
};

const handleRemove = async (file: any) => {
  console.log("handleRemove", file);
};

const { history, commit, undo, redo } = useManualRefHistory(
  firmReportDetailForm,
  { clone: true }
);

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(firmReportDetailForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    saveForm();
    firmReportDetailForm.value = value;
  }
};
const validateForm = () => {
  return formRef.value?.validate();
};

const debouncePaymentSearchAsync = useDebounceFn(paymentSearchAsync, 500);

function paymentSearchAsync(query: string, callback: (data: any) => void) {
  // 构造请求参数
  const requestParams: any = {
    页码: 1,
    页容量: 10000,
  };

  // TODO 是否增加模糊搜索？
  // 如果 query 有值，则添加款项编号集合参数
  if (query) {
    requestParams.款项编号集合 = [query];
  }
  BusinessStandbookAPI.getPaymentLedgerRecordList(requestParams)
    .then((res: any) => {
      // 将res.当前记录.款项编号转化为value
      const data = res.当前记录?.map((item: any) => {
        return {
          value: item.款项编号,
          label: item.款项编号,
        };
      });
      callback(data);
    })
    .catch((err: any) => {
      console.log(err);
      callback([]);
    });
}

function handleSelectPayment(item: any) {
  firmReportDetailForm.value.paymentNum = item.value;
}

const generateRandomData = () => {
  /** 随机生成数据 */
  firmReportDetailForm.value = {
    date: "2024-01-01",
    number: "1234567890",
    description: "广投石化有限公司",
    amount: "1000",
    taxRate: "13%",
    counterparty: "广投石化",
    attachment: [],
    payments: [],
  };
};

defineExpose({
  saveForm,
  restoreForm,
  getFormValue,
  setFormValue,
  generateRandomData,
  validateForm,
});
</script>

<style lang="scss" scoped></style>
