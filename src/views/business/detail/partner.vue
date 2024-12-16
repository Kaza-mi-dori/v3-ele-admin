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
              <el-form-item label="数据源" prop="数据源">
                <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.数据源"
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
                <span v-else>{{ firmReportDetailForm.数据源 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据日期" prop="日期">
                <date-picker
                  v-if="editing"
                  v-model="firmReportDetailForm.日期"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择日期"
                />
                <span v-else>{{ firmReportDetailForm.日期 }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
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
              <el-form-item label="客商名称" prop="客商名称">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.客商名称"
                  placeholder="请输入客商名称"
                />
                <span v-else>{{ firmReportDetailForm.客商名称 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客商类型" prop="客商类型">
                <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.客商类型"
                  placeholder="请选择客商类型"
                  multiple
                >
                  <el-option
                    v-for="value in ['供应商', '客户']"
                    :key="value"
                    :label="value"
                    :value="value"
                  />
                </el-select>
                <span v-else>
                  {{ arrayToString(firmReportDetailForm.客商类型) }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="准入状态" prop="准入状态">
                <el-select
                  v-if="editing"
                  v-model="firmReportDetailForm.准入状态"
                  placeholder="请选择准入状态"
                >
                  <el-option
                    v-for="value in ['已准入', '未准入']"
                    :key="value"
                    :label="value"
                    :value="value"
                  />
                </el-select>
                <span v-else>{{ firmReportDetailForm.准入状态 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评价" prop="评价">
                <!-- <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.评价"
                  placeholder="请输入评价"
                />
                <span v-else>{{ firmReportDetailForm.评价 }}</span> -->
                <!-- 打星 -->
                <el-rate
                  v-model="firmReportDetailForm.评价"
                  :disabled="!editing"
                  show-score
                  allow-half
                  text-color="#ff9900"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="备注">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.备注"
                  placeholder="请输入备注"
                />
                <span v-else>{{ firmReportDetailForm.备注 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="履约风险合同数" prop="履约风险合同数">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.履约风险合同数"
                  placeholder="请输入履约风险合同数"
                />
                <span v-else>{{ firmReportDetailForm.履约风险合同数 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="累计贸易额" prop="累计贸易额">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.累计贸易额"
                  placeholder="请输入累计贸易额"
                />
                <span v-else>{{ firmReportDetailForm.累计贸易额 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="累计签订合同数" prop="累计签订合同数">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.累计签订合同数"
                  placeholder="请输入累计签订合同数"
                />
                <span v-else>{{ firmReportDetailForm.累计签订合同数 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="未履约合同数" prop="未履约合同数">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.未履约合同数"
                  placeholder="请输入未履约合同数"
                />
                <span v-else>{{ firmReportDetailForm.未履约合同数 }}</span>
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
        :model="firmReportDetailForm"
        class="w-full g-form-1"
      >
        <el-row class="w-full">
          <el-col :span="8">
            <el-form-item label="创建人">
              <span>{{ firmReportDetailForm.创建者 }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <span>{{ firmReportDetailForm.创建时间 }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改人">
              <span>{{ firmReportDetailForm.修改者 }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改时间">
              <span>{{ firmReportDetailForm.修改时间 }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
import business from "@/types/business";
import { type CustomerAndSupplierLedgerRecordForm } from "@/api/businessStandBook";
import { DatasourceEnumMap } from "@/enums/DatasourceEnum";
import { arrayToString, stringToArray } from "@/utils";

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

const firmReportDetailForm: any = ref({
  id: undefined,
  数据源: "其他",
  日期: "",
  状态: "",
  客商名称: "",
  客商类型: "",
  准入状态: "",
  评价: "",
  备注: "",
  履约风险合同数: 0,
  累计贸易额: 0,
  累计签订合同数: 0,
  未履约合同数: 0,
  创建者: "",
  创建时间: "",
  修改者: "",
  修改时间: "",
});

const rules: Ref<GenericRecord> = ref({
  数据源: [{ required: true, message: "请选择数据来源", trigger: "blur" }],
  客商名称: [
    { required: true, message: "请输入客商企业名称", trigger: "blur" },
  ],
  客商类型: [{ required: true, message: "请选择客商类型", trigger: "blur" }],
  日期: [{ required: true, message: "请选择日期", trigger: "blur" }],
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
    数据源: "其他",
    客商名称: "广投石化",
    客商类型: "供应商",
    准入状态: "已准入",
    评价: "优秀",
    备注: "备注",
    履约风险合同数: 10,
    累计贸易额: 1000000,
    累计签订合同数: 100,
    未履约合同数: 5,
    创建者: "管理员",
    创建时间: "2021-01-01",
    修改者: "管理员",
    修改时间: "2021-01-01",
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
