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
          :model="paymentDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="6">
              <el-form-item label="数据源" prop="数据源">
                <el-select
                  v-if="editing"
                  v-model="paymentDetailForm.数据源"
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
                <span v-else>{{ paymentDetailForm.数据源 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数据日期" prop="日期">
                <date-picker
                  v-if="editing"
                  v-model="paymentDetailForm.日期"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择日期"
                />
                <span v-else>{{ paymentDetailForm.日期 }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
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
          :model="paymentDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="6">
              <el-form-item label="款项编号" prop="款项编号">
                <el-input
                  v-if="editing"
                  v-model="paymentDetailForm.款项编号"
                  placeholder="请输入款项编号"
                />
                <span v-else>{{ paymentDetailForm.款项编号 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单编号" prop="订单编号">
                <el-autocomplete
                  v-if="editing"
                  v-model="paymentDetailForm.订单编号"
                  placeholder="请输入订单编号"
                  :fetch-suggestions="queryOrderAsync"
                  :trigger-on-focus="false"
                  :debounce="500"
                />
                <span v-else>{{ paymentDetailForm.订单编号 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="款项金额" prop="款项金额">
                <el-input
                  v-if="editing"
                  v-model="paymentDetailForm.款项金额"
                  placeholder="请输入款项金额"
                  type="number"
                  min="0"
                />
                <span v-else>{{ paymentDetailForm.款项金额 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="款项类型" prop="款项类型">
                <el-select
                  v-if="editing"
                  v-model="paymentDetailForm.款项类型"
                  placeholder="请选择款项类型"
                >
                  <el-option label="合同付款" value="付款" />
                  <el-option label="合同回款" value="回款" />
                  <el-option label="其他" value="其他" />
                </el-select>
                <span v-else>{{ paymentDetailForm.款项类型 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="款项时间" prop="款项时间">
                <date-picker
                  v-if="editing"
                  v-model="paymentDetailForm.款项时间"
                  type="date"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  placeholder="请选择款项时间"
                />
                <span v-else>{{ paymentDetailForm.款项时间 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="款项说明" prop="款项说明">
                <el-input
                  v-if="editing"
                  v-model="paymentDetailForm.款项说明"
                  placeholder="请输入款项说明"
                />
                <span v-else>{{ paymentDetailForm.款项说明 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="款项状态" prop="款项状态">
                <el-select
                  v-if="editing"
                  v-model="paymentDetailForm.款项状态"
                  placeholder="请选择款项状态"
                >
                  <el-option label="已付款" value="已付款" />
                  <el-option label="未付款" value="未付款" />
                  <el-option label="部分付款" value="部分付款" />
                  <el-option label="已回款" value="已回款" />
                  <el-option label="未回款" value="未回款" />
                  <el-option label="部分回款" value="部分回款" />
                </el-select>
                <span v-else>{{ paymentDetailForm.款项状态 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="备注">
                <el-input
                  v-if="editing"
                  v-model="paymentDetailForm.备注"
                  placeholder="请输入备注"
                  type="textarea"
                />
                <span v-else>{{ paymentDetailForm.备注 }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
          :file-list="paymentDetailForm.附件"
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
import upload from "@/components/ElBasicPlus/upload.vue";
import pdfPNG from "@/assets/icons/pdf.png";
import ExcelPNG from "@/assets/icons/excel.png";
import WordPNG from "@/assets/icons/WORD.png";
import ZipSVG from "@/assets/icons/zip.svg";
import { DatasourceEnumMap } from "@/enums/DatasourceEnum";
import BusinessStandbookAPI from "@/api/businessStandBook";
import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { FormInstance } from "element-plus";

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

const paymentDetailForm = ref({
  数据源: undefined,
  日期: undefined,
  状态: undefined,
  款项编号: undefined,
  订单编号: undefined,
  备注: undefined,
  款项金额: undefined,
  款项类型: undefined,
  款项时间: undefined,
  款项说明: undefined,
  款项状态: undefined,
  附件: [],
});

const rules: Ref<GenericRecord> = ref({
  数据源: [{ required: true, message: "请选择数据源", trigger: "blur" }],
  日期: [{ required: true, message: "请选择数据日期", trigger: "blur" }],
  款项编号: [{ required: true, message: "请输入款项编号", trigger: "blur" }],
  订单编号: [{ required: true, message: "请输入订单编号", trigger: "blur" }],
  款项时间: [{ required: true, message: "请选择款项时间", trigger: "blur" }],
  款项金额: [{ required: true, message: "请输入款项金额", trigger: "blur" }],
  款项类型: [{ required: true, message: "请选择款项类型", trigger: "blur" }],
  款项说明: [{ required: true, message: "请输入款项说明", trigger: "blur" }],
  款项状态: [{ required: true, message: "请选择款项状态", trigger: "blur" }],
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

const { history, commit, undo, redo } = useManualRefHistory(paymentDetailForm, {
  clone: true,
});

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(paymentDetailForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    saveForm();
    paymentDetailForm.value = value;
  }
};
const validateForm = () => {
  return formRef.value?.validate();
};

const generateRandomData = () => {
  paymentDetailForm.value = {
    数据源: "其他",
    日期: "2021-09-01",
    状态: undefined,
    款项编号: "20210901001",
    订单编号: "20210901001",
    备注: "备注",
    款项金额: 10000,
    款项类型: "付款",
    款项时间: "2021-09-01",
    款项说明: "款项说明",
    款项状态: "已付款",
    attachment: [],
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
