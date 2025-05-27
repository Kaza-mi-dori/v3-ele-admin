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
        <span>来源信息</span>
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
              <el-form-item prop="source">
                <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.source"
                  placeholder="请选择数据来源"
                >
                  <el-option
                    v-for="(value, key, index) in DatasourceEnumMap"
                    :key="key"
                    disabled
                    :label="key"
                    :value="value"
                  />
                </el-select>
                <span v-else>{{ firmReportDetailForm.source }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>报表信息</span>
        <el-button
          class="g-button-1 ml-4"
          type="primary"
          @click="handleExtract"
        >
          提取信息
        </el-button>
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
              <el-form-item label="合同名称" prop="name">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.name"
                  placeholder="请输入合同名称"
                />
                <span v-else>{{ firmReportDetailForm.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同编号" prop="number">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.number"
                  placeholder="请输入合同编号"
                />
                <span v-else>{{ firmReportDetailForm.number }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="我方名称" prop="self">
                <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.self"
                  placeholder="请选择我方名称"
                >
                  <el-option
                    v-for="(value, key, index) in OurCompanyEnumMap"
                    :key="key"
                    :label="value"
                    :value="value"
                  />
                </el-select>
                <span v-else>
                  {{ OurCompanyEnumMap[firmReportDetailForm.self] }}
                </span>
              </el-form-item>
            </el-col>
            <!-- 我方全称 -->
            <el-col :span="8">
              <el-form-item label="我方全称" prop="self">
                <el-input
                  v-if="editing"
                  :value="OurCompanyFullNameMap[firmReportDetailForm.self]"
                  placeholder="请输入我方全称"
                  disabled
                />
                <span v-else>
                  {{ OurCompanyFullNameMap[firmReportDetailForm.self] }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="对方名称" prop="partner">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.partner"
                  data-id="partner"
                  placeholder="请输入对方名称"
                />
                <span v-else>{{ firmReportDetailForm.partner }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同类型" prop="type">
                <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.type"
                  placeholder="请选择合同类型"
                >
                  <el-option
                    v-for="(value, key, index) in ContractTypeEnumMap"
                    :key="key"
                    :label="value"
                    :value="value"
                  />
                </el-select>
                <span v-else>{{ firmReportDetailForm.type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同总金额(含税)(万元)" prop="amount">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.amount"
                  placeholder="请输入合同总金额(含税)"
                />
                <span v-else>{{ firmReportDetailForm.amount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同签订时间" prop="signTime">
                <date-picker
                  v-if="editing"
                  v-model="firmReportDetailForm.signTime"
                  style="width: 100%"
                  valueFormat="YYYY-MM-DD"
                  placeholder="请选择合同签订时间"
                />
                <span v-else>{{ firmReportDetailForm.signTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同履约期限" prop="expired">
                <date-picker
                  v-if="editing"
                  v-model="firmReportDetailForm.expired"
                  style="width: 100%"
                  valueFormat="YYYY-MM-DD"
                  placeholder="请选择履约期限"
                />
                <span v-else>{{ firmReportDetailForm.expired }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="合同说明" prop="description">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.description"
                  type="textarea"
                  placeholder="请输入合同说明"
                />
                <span v-else>{{ firmReportDetailForm.description }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="合同其他描述" prop="other">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.other"
                  placeholder="请输入合同其他描述"
                />
                <span v-else>{{ firmReportDetailForm.other }}</span>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 关联信息 -->
    <div v-if="!editing" class="info-card-level1">
      <div class="__title">
        <span>结算追踪</span>
      </div>
      <div class="__content">
        <div class="flex mb-4 items-center">
          <!-- 表格，显示关联的合同、订单、回款、结算 -->
          <el-table
            :data="ordersTableData"
            row-key="id"
            style="width: 100%"
            :tree-props="{ children: '关联款项' }"
            show-summary
            :summary-method="getOrdersSummary"
          >
            <el-table-column label="类型" prop="类型" />
            <el-table-column label="编号">
              <template v-slot="scope">
                <el-link type="primary" @click="handleExpand(scope.row)">
                  {{ scope.row.编号 }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="日期" label="日期" />
            <el-table-column prop="金额" label="金额" />
            <el-table-column prop="状态" label="状态" />
            <el-table-column prop="百分比" label="合同占比" />
          </el-table>
        </div>
      </div>
    </div>
    <!-- 关联结算 -->
    <!-- <div v-if="!editing" class="info-card-level1">
      <div class="__title">
        <span>关联结算</span>
      </div>
      <div class="__content">
        <el-table
          :data="settlementTableData"
          row-key="id"
          show-summary
          :summary-method="getSettlementSummary"
        >
          <el-table-column label="编号" prop="结算编号">
            <template v-slot="scope">
              <el-link type="primary">
                {{ scope.row.结算编号 }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="日期" prop="结算日期" />
          <el-table-column label="金额" prop="结算金额" />
          <el-table-column label="状态" prop="结算状态" />
          <el-table-column label="结算数量" prop="结算数量" />
        </el-table>
      </div>
    </div> -->
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
      <el-form
        label-position="top"
        label-width="100px"
        inline
        :rules="rules"
        class="w-full g-form-1"
        :model="firmReportDetailForm"
      >
        <el-row class="w-full">
          <el-col :span="8">
            <el-form-item label="创建时间" prop="createdAt">
              <span>{{ firmReportDetailForm.createdAt }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人" prop="createdBy">
              <span>{{ firmReportDetailForm.createdBy }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新时间" prop="updatedAt">
              <span>{{ firmReportDetailForm.updatedAt }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新人" prop="updatedBy">
              <span>{{ firmReportDetailForm.updatedBy }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据来源" prop="dataFrom">
              <span>{{ firmReportDetailForm.dataFrom }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否审核" prop="audited">
              <span>{{ firmReportDetailForm.audited ? "是" : "否" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import datePicker from "@/components/ElBasicPlus/datePicker.vue";
import upload from "@/components/ElBasicPlus/upload.vue";
import pdfPNG from "@/assets/icons/pdf.png";
import ExcelPNG from "@/assets/icons/excel.png";
import WordPNG from "@/assets/icons/WORD.png";
import ZipSVG from "@/assets/icons/zip.svg";
import { DatasourceEnum, DatasourceEnumMap } from "@/enums/DatasourceEnum";
import {
  OurCompanyEnum,
  OurCompanyEnumMap,
  OurCompanyFullNameMap,
  ContractTypeEnumMap,
} from "@/enums/BusinessEnum";
import BusinessStandbookAPI from "@/api/businessStandBook";
import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { FormInstance } from "element-plus";
import { extractInfoFromContractRecord } from "@/utils/textExtract";

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

const handleExtract = () => {
  console.log("handleExtract", firmReportDetailForm.value.description);
  const info = extractInfoFromContractRecord(
    firmReportDetailForm.value.description
  );
  console.log("info", info);
};

const ordersTableData = ref([]);

const settlementTableData = ref([
  {
    id: 1,
    结算编号: "HT2022001",
    结算日期: "2022-01-01",
    结算金额: "1000000",
    结算状态: "已结算",
    结算数量: "1000",
  },
]);

const firmReportDetailForm = ref({
  /** 数据来源 */
  source: DatasourceEnumMap[DatasourceEnum.OTHER],
  /** 合同名称 */
  name: undefined,
  /** 我方名称 */
  self: undefined,
  /** 相对方名称 */
  partner: undefined,
  /** 合同编号 */
  number: undefined,
  /** 合同类型 */
  type: undefined,
  /** 合同说明 */
  description: undefined,
  /** 合同总金额(含税) */
  amount: undefined,
  /** 合同签订时间 */
  signTime: undefined,
  // /** 合同其他描述 */
  otherDesc: undefined,
  /** 履约期限 */
  expired: undefined,
  /** 附件 */
  attachment: [] as Array<{ name: string; url: string; type: string }>,
});

const rules: Ref<GenericRecord> = ref({
  source: [{ required: true, message: "请选择数据来源", trigger: "change" }],
  name: [{ required: true, message: "请输入合同名称", trigger: "change" }],
  self: [{ required: true, message: "请选择我方名称", trigger: "change" }],
  partner: [{ required: true, message: "请输入对方名称", trigger: "change" }],
  number: [{ required: true, message: "请输入合同编号", trigger: "change" }],
  type: [{ required: true, message: "请选择合同类型", trigger: "change" }],
  amount: [
    { required: true, message: "请输入合同总金额(含税)", trigger: "change" },
  ],
  expired: [
    {
      // 如果填写了合同履约期限，则必须填写合同签订时间，且合同签订时间不能晚于合同履约期限
      validator: (rule: any, value: any, callback: any) => {
        if (value && !firmReportDetailForm.value.signTime) {
          callback(new Error("请填写合同签订时间"));
        } else if (
          value &&
          firmReportDetailForm.value.signTime &&
          new Date(value) < new Date(firmReportDetailForm.value.signTime)
        ) {
          callback(new Error("合同履约期限不能早于合同签订时间"));
        } else {
          callback();
        }
      },
    },
  ],
});

const allSelected = ref(false);

const editButtonVisible = ref(false); // 是否显示编辑开关, 应与用户权限结合

const editable = ref(false);

const isEditing = ref(false); // 是否正在编辑

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
    // console.log("setFormValue", value);
    saveForm();
    firmReportDetailForm.value = value;
  }
};
const validateForm = () => {
  return formRef.value?.validate();
};

const handleExpand = (row: any) => {
  console.log("handleExpand", row);
};

/**
 * 获取关联结算的汇总
 * @param param
 * @returns
 */
function getSettlementSummary(param: any) {
  const { columns, data } = param;
  const sums: any[] = [];
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = "";
      return;
    } else if (column.property === "结算金额") {
      sums[index] = data.reduce((sum: number, row: any) => {
        return sum + Number(row.结算金额);
      }, 0);
    } else if (column.property === "结算数量") {
      sums[index] = data.reduce((sum: number, row: any) => {
        return sum + Number(row.结算数量);
      }, 0);
    } else {
      sums[index] = "-";
      return;
    }
  });
  return sums;
}

/**
 * 获取关联订单的汇总
 * @param param
 * @returns
 */
function getOrdersSummary(param: any) {
  const { columns, data } = param;
  const sums: any[] = [];
  // 根据列名，计算汇总金额与百分比
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = "";
      return;
    }
    // TODO 处理sum最后是NaN的情况
    if (column.property === "金额") {
      sums[index] = data.reduce((sum: number, row: any) => {
        return sum + (isNaN(Number(row.金额)) ? 0 : Number(row.金额));
      }, 0);
    } else if (column.property === "百分比") {
      sums[index] = data.reduce((sum: number, row: any) => {
        return (
          sum + (isNaN(parseFloat(row.百分比)) ? 0 : parseFloat(row.百分比))
        );
      }, 0);
    } else {
      sums[index] = "-";
      return;
    }
  });
  return sums;
}

// 取消类型验证
const generateRandomData = () => {
  firmReportDetailForm.value = {
    source: DatasourceEnumMap[DatasourceEnum.OTHER],
    name: "广投石化",
    self: OurCompanyEnumMap[OurCompanyEnum.GTSHC],
    partner: "广州石化",
    number: "HT2022001",
    type: "销售合同",
    description: "这是一个合同说明",
    amount: "1000000",
    signTime: "2022-01-01",
    other: "这是一个合同其他描述",
    attachment: [
      {
        name: "合同附件1.pdf",
        url: "http://www.baidu.com",
        type: "pdf",
      },
    ],
  };
};

// 合同编号
const contractNumber = computed(() => firmReportDetailForm.value.number);

watch(
  contractNumber,
  async (newContractNumber) => {
    // 如果合同编号存在，则获取关联的订单
    if (newContractNumber) {
      const orders = await fetchOrderLedgerRecords(newContractNumber);
      ordersTableData.value = orders;
    } else {
      ordersTableData.value = [];
      console.error("合同编号不存在，无法获取订单数据");
    }
  },
  { immediate: true }
);

/**
 * 获取关联的订单，并构造 ordersTableData 所需格式
 * @param contractNumber 合同编号
 * @returns 构造后的 ordersTableData 数据
 */
const fetchOrderLedgerRecords = async (contractNumber: string) => {
  try {
    // 调用接口获取数据
    const response = await BusinessStandbookAPI.getOrderLedgerRecordList({
      页码: 1,
      页容量: 1000,
      合同编号集合: [contractNumber], // 将单个合同编号放入数据中
    });

    const records = response?.["当前记录"] || [];

    // 构造 ordersTableData 所需格式
    return records.map((record: any) => ({
      id: record.id,
      类型: record["内容"]?.["订单类型"],
      编号: record["订单编号"],
      日期: record["日期"],
      金额: record["内容"]?.["订单金额"],
      状态: record["状态"],
      百分比: "",
    }));
  } catch (err) {
    ElMessage.error("获取数据失败");
    return []; // 返回空数组，避免页面渲染出错
  }
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
