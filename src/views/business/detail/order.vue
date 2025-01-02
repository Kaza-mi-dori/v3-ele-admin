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
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                />
                <span v-else>
                  {{ orderDetailForm.日期 }}
                </span>
              </el-form-item>
            </el-col>
            <!-- 数量 -->
            <el-col :span="8">
              <el-form-item label="数量" prop="数量">
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
              <el-form-item label="金额" prop="金额">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.金额"
                  type="number"
                  placeholder="请输入金额"
                />
                <span v-else>{{ orderDetailForm.金额 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" prop="状态">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.状态"
                  placeholder="请输入状态"
                />
                <span v-else>{{ orderDetailForm.状态 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同编号" prop="合同编号">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.合同编号"
                  placeholder="请输入合同编号"
                />
                <span v-else>{{ orderDetailForm.合同编号 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="备注">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.备注"
                  placeholder="请输入备注"
                />
                <span v-else>{{ orderDetailForm.备注 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="主体" prop="主体">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.主体"
                  placeholder="请输入主体"
                />
                <span v-else>{{ orderDetailForm.主体 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客商" prop="客商">
                <el-input
                  v-if="editing"
                  v-model="orderDetailForm.客商"
                  placeholder="请输入客商"
                />
                <span v-else>{{ orderDetailForm.客商 }}</span>
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
          :file-list="orderDetailForm.attachment"
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

/**
 * 货单详情表单
 * 包括:
 * 编号、类型、日期、金额、状态、附件、合同编号、备注、主体、客商、货品、数量、单价
 */
const orderDetailForm = ref({
  日期: "",
  金额: "",
  状态: "",
  附件: [],
  合同编号: "",
  备注: "",
  主体: "",
  客商: "",
  货品: "",
  数量: "",
  单价: "",
});

const rules: Ref<GenericRecord> = ref({
  日期: [{ required: true, message: "请输入日期", trigger: "blur" }],
  金额: [{ required: true, message: "请输入金额", trigger: "blur" }],
  状态: [{ required: true, message: "请输入状态", trigger: "blur" }],
  合同编号: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
  备注: [{ required: true, message: "请输入备注", trigger: "blur" }],
  主体: [{ required: true, message: "请输入主体", trigger: "blur" }],
  客商: [{ required: true, message: "请输入客商", trigger: "blur" }],
  货品: [{ required: true, message: "请输入货品", trigger: "blur" }],
  数量: [{ required: true, message: "请输入数量", trigger: "blur" }],
  单价: [{ required: true, message: "请输入单价", trigger: "blur" }],
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
    附件: [
      {
        name: "附件1",
        url: "http://www.baidu.com",
      },
      {
        name: "附件2",
        url: "http://www.baidu.com",
      },
    ],
    合同编号: "合同编号",
    备注: "备注",
    主体: "主体",
    客商: "客商",
    货品: "货品",
    数量: "数量",
    单价: "单价",
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
