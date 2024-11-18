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
      <!-- 临时用，选择报表类型 -->
      <el-select
        v-model="currentComponentType"
        placeholder="请选择报表类型"
        style="margin-left: 10px; width: 200px"
      >
        <el-option
          v-for="item in reportTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="relative">
      <!-- 状态 -->
      <div v-if="currentComponent" class="status-tag">
        <span>{{ currentFormStatus }}</span>
      </div>
      <component :is="currentComponent" ref="formRef" :editing="isEditing" />
    </div>
  </div>
</template>

<script setup lang="ts">
import yearlyReportDetailForm from "./yearlyReport/detail.vue";
import marketPriceReportDetailForm from "./marketPriceReport/detail.vue";
import firmMngReportDetailForm from "./firmMngReport/detail.vue";
import firmReportDetailForm from "./firmReport/detail.vue";
import customReportDetailForm from "./customReport/detail.vue";
import partnerReportDetailForm from "./partnerReport/detail.vue";
import partnerDetailForm from "@/views/partner/detail.vue";

import { ref, onMounted, shallowRef } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isEditing = ref(false);
const editable = ref(true);
const formRef = ref(null);

const currentComponent = shallowRef<any>(null);

const currentComponentType = ref("");

const currentFormStatus = ref<string | null>();

const reportTypes = [
  { value: "yearlyReport", label: "年度报表" },
  { value: "marketPriceReport", label: "市场价格报表" },
  { value: "firmMngReport", label: "企业管理报表" },
  { value: "firmReport", label: "企业报表" },
  { value: "customReport", label: "自定义报表" },
  { value: "partnerReport", label: "合作伙伴报表" },
  { value: "partnerDetail", label: "合作伙伴详情" },
];

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
    } else if (value === "partnerDetail") {
      currentComponent.value = partnerDetailForm;
    }
  },
  { immediate: true }
);

watch(
  () => currentComponentType.value,
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
    } else if (value === "partnerDetail") {
      currentComponent.value = partnerDetailForm;
    }
  }
);

watchEffect(() => {
  if (currentComponent.value) {
    currentFormStatus.value = isEditing.value
      ? route.query.id
        ? "草稿"
        : "编辑中"
      : route.query.id
        ? null
        : "草稿";
  }
});

onMounted(() => {
  console.log("mounted");
});
</script>

<style lang="scss" scoped>
.status-tag {
  @apply bg-amber-3;
  position: absolute;
  // color: #fefefe;
  top: -5px;
  right: 10px;
  box-shadow: 0 0 -10px rgba(0, 0, 0, 0.5);
  z-index: 1;
  padding: 5px 20px;
  border-radius: 0 0 10px 10px;
}
</style>
