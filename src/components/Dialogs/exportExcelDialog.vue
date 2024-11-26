<!-- 导出excel弹窗，主要确定导出哪些数据、哪些字段、导出文件名、导出格式等 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="导出excel"
    width="50%"
    :before-close="handleClose"
  >
    <!--左侧为导出数据的设置，右侧为导出记录 -->
    <div class="export-data">
      <el-form :model="exportForm" label-width="80px">
        <el-form-item label="导出字段">
          <el-checkbox-group v-model="exportForm.fields">
            <el-checkbox label="日期" />
            <el-checkbox label="业务维度" />
            <el-checkbox label="状态" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="导出文件名">
          <el-input v-model="exportForm.fileName" />
        </el-form-item>
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportForm.format">
            <el-radio label="xlsx">xlsx</el-radio>
            <el-radio label="csv">csv</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="export-records">
        <el-table :data="records" style="width: 100%">
          <el-table-column
            v-for="(item, index) in props.fields"
            :key="index"
            :label="item as string"
          />
        </el-table>
      </div>
    </div>

    <el-button type="primary" @click="handleExport">导出</el-button>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ElForm,
  ElFormItem,
  ElCheckboxGroup,
  ElCheckbox,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElButton,
} from "element-plus";

const props = defineProps({
  records: {
    type: Array,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
});

const dialogVisible = ref(false);
const exportForm = ref({
  fields: ["日期", "业务维度", "状态"],
  fileName: "导出文件名",
  format: "xlsx",
});

function handleClose() {
  dialogVisible.value = false;
}

function handleExport() {
  console.log(exportForm.value);
}
</script>

<style lang="scss" scoped></style>
