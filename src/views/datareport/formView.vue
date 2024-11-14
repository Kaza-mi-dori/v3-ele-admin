<!-- 显示HOC -->
<template>
  <div class="main-wrapper">
    <div class="mb-4 p-10px bg-white">
      <el-button
        v-if="!isEditing && editable"
        class="g-button-1"
        type="primary"
        @click="handleEdit"
      >
        编辑
      </el-button>
      <el-button
        v-if="isEditing && editable"
        class="g-button-1"
        type="primary"
        @click="submitForm"
      >
        提交
      </el-button>
      <el-button
        v-if="isEditing && editable"
        class="g-button-1"
        type="primary"
        @click="handleCancel"
      >
        取消
      </el-button>
      <el-button class="g-button-1" @click="favoForm">收藏</el-button>
      <el-button class="g-button-1" @click="exportForm">导出</el-button>
    </div>
    <component :is="currentComponent" ref="formRef" :editing="isEditing" />
  </div>
</template>

<script setup lang="ts">
import yearlyReportDetailForm from "./yearlyReport/detail.vue";
import marketPriceReportDetailForm from "./marketPriceReport/detail.vue";
import firmMngReportDetailForm from "./firmMngReport/detail.vue";
import firmReportDetailForm from "./firmReport/detail.vue";
import customReportDetailForm from "./customReport/detail.vue";
import partnerReportDetailForm from "./partnerReport/detail.vue";

import { ref, onMounted, shallowRef } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isEditing = ref(false);
const editable = ref(true);
const formRef = ref(null);

const currentComponent = shallowRef<any>(null);

const handleEdit = () => {
  isEditing.value = true;
  if (formRef.value) {
    const form = formRef.value as any;
    form.saveForm();
  }
};

const submitForm = () => {
  console.log("submit form");
};

const favoForm = () => {
  console.log("favo form");
};

const exportForm = () => {
  console.log("export form");
};

const handleCancel = () => {
  isEditing.value = false;
  if (formRef.value) {
    const form = formRef.value as any;
    form.restoreForm();
  }
};

watch(
  () => route.query.type,
  (value) => {
    if (value === "yearlyReport") {
      currentComponent.value = yearlyReportDetailForm;
    } else if (value === "marketPriceReport") {
      currentComponent.value = marketPriceReportDetailForm;
    } else if (value === "firmMngReport") {
      currentComponent.value = firmMngReportDetailForm;
    } else if (value === "firmReport") {
      currentComponent.value = firmReportDetailForm;
    } else if (value === "customReport") {
      currentComponent.value = customReportDetailForm;
    } else if (value === "partnerReport") {
      currentComponent.value = partnerReportDetailForm;
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log("mounted");
});
</script>

<style lang="sass" scoped></style>
