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
              <el-form-item label="年份" prop="year">
                <el-date-picker
                  v-if="editing"
                  v-model="firmReportDetailForm.year"
                  type="year"
                  value-format="YYYY-MM-DD"
                  placeholder="选择年份"
                />
                <span v-else>
                  {{ firmReportDetailForm.year.substring(0, 4) }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业名称" prop="year">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.name"
                  placeholder="请输入企业名称"
                />
                <span v-else>{{ firmReportDetailForm.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业介绍">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.description"
                  placeholder="请输入企业介绍"
                />
                <span v-else>{{ firmReportDetailForm.description }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业资产">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.asset"
                  placeholder="请输入企业资产"
                />
                <span v-else>{{ firmReportDetailForm.asset }}</span>
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
          :file-list="firmReportDetailForm.attachment"
        />
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon>
            <Plus />
          </el-icon>
          <template v-slot:file="{ file }">
            <img
              v-if="['image/jpeg', 'image/png'].includes(file.raw?.type || '')"
              :src="file.url"
              class="el-upload-list__item-thumbnail"
            />
            <img
              v-else-if="['application/pdf'].includes(file.raw?.type || '')"
              :src="pdfPNG"
              alt=""
            />
            <img
              v-else-if="
                [
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ].includes(file.raw?.type || '')
              "
              :src="WordPNG"
              alt=""
            />
            <img
              v-else-if="
                [
                  'application/vnd.ms-excel',
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ].includes(file.raw?.type || '')
              "
              :src="ExcelPNG"
              alt=""
            />
            <i
              v-else-if="
                [
                  'application/zip',
                  'application/x-zip-compressed',
                  'application/x-rar-compressed',
                ].includes(file.raw?.type || '')
              "
              :src="ZipSVG"
              alt=""
            />
            <i v-else class="el-icon-document el-upload-list__item-icon" />
            <span class="el-upload-list__item-actions flex flex-wrap">
              <div class="w-full text-sm text-center">{{ file.name }}</div>
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <el-icon>
                  <View />
                </el-icon>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <el-icon>
                  <Download />
                </el-icon>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <el-icon>
                  <Delete />
                </el-icon>
              </span>
            </span>
          </template>
        </el-upload> -->
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

const firmReportDetailForm = ref({
  name: "广投石化",
  year: "2024-01-01",
  description: "广投石化有限公司",
  asset: "1000",
  attachment: [],
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

const generateRandomData = () => {
  firmReportDetailForm.value = {
    name: "广投石化",
    year: "2024",
    description: "广投石化有限公司",
    asset: "1000",
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
