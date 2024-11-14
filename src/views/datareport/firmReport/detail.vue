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
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="firmReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="企业名称" prop="year">
                <span>{{ firmReportDetailForm.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业介绍">
                <span>{{ firmReportDetailForm.description }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业资产">
                <span>{{ firmReportDetailForm.asset }}</span>
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
          <el-button type="danger">删除</el-button>
        </div>
        <upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
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
    <div class="info-card-level1">
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

const firmReportDetailForm = ref({
  name: "广投石化",
  year: "2024",
  description: "广投石化有限公司",
  asset: "1000",
});

const rules: Ref<GenericRecord> = ref({
  name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
});

const allSelected = ref(false);

const editButtonVisible = ref(false); // 是否显示编辑开关, 应与用户权限结合

const editable = ref(false);

const isEditing = ref(false); // 是否正在编辑

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
    firmReportDetailForm.value = value;
  }
};

defineExpose({
  saveForm,
  restoreForm,
  getFormValue,
  setFormValue,
});
</script>

<style lang="scss" scoped></style>
