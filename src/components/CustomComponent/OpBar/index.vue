<template>
  <div class="mb-4 p-10px bg-white">
    <el-button v-if="showBackBtn" class="g-button-1" @click="handleBack">
      返回
    </el-button>
    <el-button
      v-if="showEditBtn"
      class="g-button-1"
      :loading="loading"
      @click="handleEdit"
    >
      编辑
    </el-button>
    <el-button
      v-if="showSubmitBtn"
      class="g-button-1"
      type="primary"
      :loading="loading"
      @click="handleSubmit"
    >
      提交
    </el-button>
    <!-- DEV_ONLY -->
    <el-button
      v-if="showGenerateRandomDataBtn"
      type="danger"
      class="g-button-1"
      :loading="loading"
      @click="handleGenerateRandomData"
    >
      生成测试数据
    </el-button>
    <!-- DEV_ONLY -->
    <el-button
      v-if="showCancelBtn"
      class="g-button-1"
      :loading="loading"
      @click="handleCancel"
    >
      取消更改
    </el-button>
    <!-- <el-button v-if="showFavoBtn" class="g-button-1" @click="handleFavo">
      收藏
    </el-button> -->
    <el-button v-if="showExportBtn" class="g-button-1" @click="exportForm">
      导出
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  showEditBtn?: boolean;
  showSubmitBtn?: boolean;
  showGenerateRandomDataBtn?: boolean;
  showCancelBtn?: boolean;
  showFavoBtn?: boolean;
  showExportBtn?: boolean;
  showDeleteBtn?: boolean;
  showBackBtn?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "submit"): void;
  (e: "generateRandomData"): void;
  (e: "cancel"): void;
  (e: "favo"): void;
  (e: "export"): void;
  (e: "delete"): void;
  (e: "back"): void;
}>();

const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit");
};

const handleSubmit = () => {
  emit("submit");
};

const handleGenerateRandomData = () => {
  emit("generateRandomData");
};

const handleCancel = () => {
  emit("cancel");
};

const handleFavo = () => {
  emit("favo");
};

const handleExport = () => {
  emit("export");
};

const handleDelete = () => {
  emit("delete");
};

const exportForm = () => {
  emit("export");
};
</script>
