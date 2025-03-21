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
          :model="orderDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="日期" prop="日期">
                <date-picker
                  v-if="editing"
                  v-model="orderDetailForm.日期"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                />
                <span v-else>
                  {{ orderDetailForm.日期 }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单编号" prop="订单编号">
                <el-autocomplete
                  v-if="editing"
                  v-model="orderDetailForm.订单编号"
                  placeholder="请输入订单编号"
                  :fetch-suggestions="queryOrderAsync"
                  :trigger-on-focus="false"
                  :debounce="500"
                />
                <span v-else>{{ orderDetailForm.订单编号 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同编号" prop="合同编号">
                <el-autocomplete
                  v-if="editing"
                  v-model="orderDetailForm.合同编号"
                  :fetch-suggestions="debounceContractSearchAsync as any"
                  placeholder="请输入合同编号"
                  value-key="label"
                  @select="handleSelectContract"
                />
                <span v-else>{{ orderDetailForm.合同编号 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货品" prop="货品">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.货品"
                  placeholder="请输入货品"
                />
                <span v-else>{{ orderDetailForm.货品 }}</span>
              </el-form-item>
            </el-col>
            <!-- 数量 -->
            <el-col :span="8">
              <el-form-item label="订单数量" prop="数量">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.数量"
                  type="number"
                  placeholder="请输入数量"
                />
                <span v-else>{{ orderDetailForm.数量 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单金额" prop="金额">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.金额"
                  type="number"
                  placeholder="请输入金额"
                />
                <span v-else>{{ toThousands(orderDetailForm.金额) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" prop="状态">
                <el-select
                  v-if="editing"
                  v-model="orderDetailForm.状态"
                  placeholder="请选择状态"
                >
                  <el-option
                    v-for="(value, key) in OrderStatusEnumMap"
                    :key="key"
                    :label="value"
                    :value="key"
                  />
                </el-select>
                <span v-else>{{ orderDetailForm.状态 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单类型" prop="订单类型">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.订单类型"
                  placeholder="请输入订单类型"
                />
                <span v-else>{{ orderDetailForm.订单类型 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合作方" prop="合作方">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.合作方"
                  placeholder="请输入合作方"
                />
                <span v-else>{{ orderDetailForm.合作方 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="备注">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.备注"
                  type="textarea"
                  placeholder="请输入备注"
                />
                <span v-else>{{ orderDetailForm.备注 }}</span>
              </el-form-item>
            </el-col>
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
          <!-- 表格，显示关联的款项 -->
          <el-table
            :data="paymentTableData"
            row-key="id"
            style="width: 100%"
            :tree-props="{ children: '关联款项' }"
            show-summary
            :summary-method="getpaymentsSummary"
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
          :file-list="orderDetailForm.附件 as any"
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
import upload from "@/components/ElBasicPlus/upload.vue";
import datePicker from "@/components/ElBasicPlus/datePicker.vue";
import pdfPNG from "@/assets/icons/pdf.png";
import ExcelPNG from "@/assets/icons/excel.png";
import WordPNG from "@/assets/icons/WORD.png";
import ZipSVG from "@/assets/icons/zip.svg";
import BusinessStandbookAPI from "@/api/businessStandBook";
import {
  ContractStatusEnumMap,
  OrderStatusEnumMap,
} from "@/enums/BusinessEnum";
import { ref, onMounted } from "vue";
import { useManualRefHistory, useDebounceFn } from "@vueuse/core";
import { FormInstance } from "element-plus";
import { toThousands } from "@/utils";
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

/**
 * 订单详情表单
 * 包括:
 * 编号、类型、日期、金额、状态、附件、合同编号、备注、主体、客商、货品、数量、单价
 */
const orderDetailForm = ref({
  日期: undefined,
  金额: undefined,
  状态: undefined,
  附件: [],
  订单编号: undefined,
  合同编号: undefined,
  备注: undefined,
  合作方: undefined,
  货品: undefined,
  数量: undefined,
  单价: undefined,
  订单类型: undefined,
});

// TODO 与后端保持一致
const rules: Ref<GenericRecord> = ref({
  日期: [{ required: true, message: "请选择日期", trigger: "blur" }],
  金额: [{ required: true, message: "请输入金额", trigger: "blur" }],
  状态: [{ required: true, message: "请输入状态", trigger: "blur" }],
  订单编号: [{ required: true, message: "请输入订单编号", trigger: "blur" }],
  合同编号: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
  合作方: [{ required: true, message: "请输入合作方", trigger: "blur" }],
  货品: [{ required: true, message: "请输入货品", trigger: "blur" }],
  数量: [{ required: true, message: "请输入数量", trigger: "blur" }],
  单价: [{ required: true, message: "请输入单价", trigger: "blur" }],
  订单类型: [{ required: true, message: "请输入订单类型", trigger: "blur" }],
});

const paymentTableData = ref([]);

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

function contractSearchAsync(query: string, callback: (data: any) => void) {
  // 构造请求参数
  const requestParams: any = {
    页码: 1,
    页容量: 10000,
  };

  // TODO 是否增加模糊搜索？
  // 如果 query 有值，则添加合同编号集合参数
  if (query) {
    requestParams.合同编号集合 = [query];
  }
  BusinessStandbookAPI.getContractLedgerRecordList(requestParams)
    .then((res: any) => {
      // 将res.当前记录.合同编号转化为value
      const data = res.当前记录?.map((item: any) => {
        return {
          value: item.合同编号,
          label: item.合同编号 + "(" + item.合同名称 + ")",
        };
      });
      callback(data);
    })
    .catch((err) => {
      console.log(err);
      callback([]);
    });
}

const debounceContractSearchAsync = useDebounceFn(contractSearchAsync, 500);

function handleSelectContract(item: any) {
  orderDetailForm.value.合同编号 = item.value;
}

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

const { history, commit, undo, redo } = useManualRefHistory(orderDetailForm, {
  clone: true,
});

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(orderDetailForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    saveForm();
    orderDetailForm.value = value;
  }
};
const validateForm = () => {
  return formRef.value?.validate();
};

const generateRandomData = () => {
  orderDetailForm.value = {
    日期: "2021-01-01",
    金额: "1000",
    状态: "有效",
    附件: [],
    订单编号: "订单编号",
    合同编号: "合同编号",
    备注: "备注",
    合作方: "合作方",
    货品: "货品",
    数量: "数量",
    单价: "单价",
    订单类型: "订单类型",
  };
};

function queryOrderAsync(query: string, callback: (data: any) => void) {
  BusinessStandbookAPI.getOrderLedgerRecordList({
    编号: query,
  })
    .then((data: any) => {
      const list = data?.["当前记录"] || [];
      callback(
        list.map((item: any) => ({
          value: item.订单编号,
          label: item.订单编号,
        }))
      );
    })
    .catch((error: any) => {
      console.error(error);
      callback([]);
    });
}

// 订单编号
const orderNumber = computed(() => orderDetailForm.value["订单编号"]);

watch(
  orderNumber,
  async (newOrderNumber) => {
    // 如果订单编号存在，则获取关联的款项
    if (newOrderNumber) {
      const payments = await fetchPaymentLedgerRecords(newOrderNumber);
      paymentTableData.value = payments;
    } else {
      paymentTableData.value = [];
      console.error("订单编号不存在，无法获取款项数据");
    }
  },
  { immediate: true }
);

const handleExpand = (row: any) => {
  console.log("handleExpand", row);
};

/**
 * 获取关联款项的汇总
 * @param param
 * @returns
 */
function getpaymentsSummary(param: any) {
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

/**
 * 获取关联的款项，并构造 paymentTableData 所需格式
 * @param orderNumber 订单编号
 * @returns 构造后的 paymentTableData 数据
 */
const fetchPaymentLedgerRecords = async (orderNumber: string) => {
  try {
    // 调用接口获取数据
    const response = await BusinessStandbookAPI.getPaymentLedgerRecordList({
      页码: 1,
      页容量: 1000,
      订单编号集合: [orderNumber], // 将单个订单编号放入数据中
    });
    const records = response?.["当前记录"] || [];

    // 构造 paymentTableData 所需格式
    return records.map((record: any) => ({
      id: record.id,
      类型: record["内容"]?.["款项类型"],
      编号: record["款项编号"],
      日期: record["日期"],
      金额: record["内容"]?.["款项金额"],
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
