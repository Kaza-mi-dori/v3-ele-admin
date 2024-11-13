<!-- 企业概况报表-->
<template>
  <div class="main-wrapper">
    <!-- <div class="g-title-block-2">
      <div class="__title">年度经营报表</div>
    </div> -->
    <div class="mb-4 p-10px bg-white">
      <el-button class="g-button-1" type="primary" @click="submitForm">
        提交
      </el-button>
      <el-button class="g-button-1" @click="favoForm">收藏</el-button>
      <el-button class="g-button-1" @click="exportForm">导出</el-button>
    </div>
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
        <span>维护信息</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const firmReportDetailForm = ref({
  name: "广投石化",
  year: "2024",
  description: "广投石化有限公司",
  asset: "1000",
});

const rules: Ref<GenericRecord> = ref({
  name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
});

const submitForm = () => {
  console.log("submitForm");
};

const favoForm = () => {
  console.log("favoForm");
};

const exportForm = () => {
  console.log("exportForm");
};
</script>

<style lang="scss" scoped></style>
