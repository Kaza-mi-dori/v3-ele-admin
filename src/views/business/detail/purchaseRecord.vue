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
          :model="purchaseRecordForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="日期" prop="日期">
                <datePicker
                  v-if="editing"
                  v-model="purchaseRecordForm.日期"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同编号" prop="合同编号">
                <contractSelector
                  v-if="editing"
                  v-model="purchaseRecordForm.合同编号"
                  prop="合同编号"
                  prop-query-in-list
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称" prop="商品名称">
                <el-input
                  v-if="editing"
                  v-model="purchaseRecordForm.商品名称"
                  placeholder="请输入商品名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品类型" prop="商品类型">
                <el-input
                  v-if="editing"
                  v-model="purchaseRecordForm.商品类型"
                  placeholder="请输入商品类型"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数量" prop="数量">
                <el-input
                  v-if="editing"
                  v-model="purchaseRecordForm.数量"
                  placeholder="请输入数量"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="含税单价" prop="含税单价">
                <el-input
                  v-if="editing"
                  v-model="purchaseRecordForm.含税单价"
                  placeholder="请输入含税单价"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="含税金额" prop="金额">
                <el-input
                  v-if="editing"
                  v-model="purchaseRecordForm.金额"
                  placeholder="请输入金额"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不含税单价" prop="不含税单价">
                <el-input
                  v-if="editing"
                  v-model="purchaseRecordForm.不含税单价"
                  placeholder="请输入不含税单价"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="税率(%)" prop="税率">
                <el-input
                  v-if="editing"
                  v-model="purchaseRecordForm.税率"
                  placeholder="请输入税率"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="税额(元)" prop="税额">
                <el-input
                  v-if="editing"
                  v-model="purchaseRecordForm.税额"
                  placeholder="请输入税额"
                  type="number"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
import business from "@/types/business";
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

const purchaseRecordForm: Ref<business.IPurchaseRecord> = ref({
  id: "",
  公司名称: "",
  日期: "",
  合同编号: "",
  商品名称: "",
  商品类型: "",
  数量: "",
  含税单价: "",
  金额: "",
  不含税单价: "",
  税率: "",
  税额: "",
});

const rules: Ref<GenericRecord> = ref({
  name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
  year: [{ required: true, message: "请选择年份", trigger: "blur" }],
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
  purchaseRecordForm,
  { clone: true }
);

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(purchaseRecordForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    saveForm();
    purchaseRecordForm.value = value;
  }
};
const validateForm = () => {
  return formRef.value?.validate();
};

const generateRandomData = () => {
  purchaseRecordForm.value = {
    id: "1",
    公司名称: "广投石化",
    日期: "2024-01-01",
    合同编号: "1234567890",
    商品名称: "石油",
    商品类型: "化工原料",
    数量: "100",
    含税单价: "100",
    金额: "10000",
    不含税单价: "90",
    税率: "10",
    税额: "1000",
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
