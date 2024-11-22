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
        @click="handleCancel"
      >
        取消更改
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

import BusinessFormAPI from "@/api/businessForm";

import { ref, onMounted, shallowRef } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isEditing = ref(false);
const editable = ref(true);
const formRef = ref(null);

const currentComponent = shallowRef<any>(null);

const currentComponentType = ref();

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

const convertToBackendData = (type: string | null, data: any) => {
  const result: GenericRecord = {
    id: route.query.id,
  };
  switch (type) {
    case "yearlyReport":
      result["日期"] = new Date().setFullYear(data.year);
      result["业务维度"] = data.businessDimension;
      result["内容"] = {
        利润金额: data.profit,
        营收金额: data.income,
        采购金额: data.purchaseAmount,
        销售金额: data.salesAmount,
        采购合同数: data.purchaseContractCount,
        销售合同数: data.salesContractCount,
        合同总份数: data.contractCount,
        合同总金额: data.contractAmount,
        采购合同份数: data.purchaseOrderCount,
        销售合同份数: data.salesOrderCount,
        合同履行数: data.contractFulfilledCount,
        风险合同数: data.riskContractCount,
        库存量: data.storage,
        结算金额: data.settlementAmount,
        结算数量: data.settlementCount,
        计划营收: data.planIncome,
        计划利润: data.planProfit,
        营收目标完成率: data.incomeFulfilledRate,
        利润目标完成率: data.profitFulfilledRate,
      };
      console.log("converted", result);
      return result;
    case "marketPriceReport":
      return {
        ...data,
        // 转换数据
      };
    case "firmMngReport":
      return {
        ...data,
        // 转换数据
      };
    case "firmReport":
      return {
        ...data,
        // 转换数据
      };
    case "customReport":
      return {
        ...data,
        // 转换数据
      };
    case "partnerReport":
      return {
        ...data,
        // 转换数据
      };
    case "partnerDetail":
      return {
        ...data,
        // 转换数据
      };
    default:
      return data;
  }
};

const submitForm = async () => {
  // 获取数据
  if (!formRef.value) return;
  const form = formRef.value as any;
  const valid = await form.validateForm();
  if (!valid) return;
  const submitData = form.getFormValue();
  if (!submitData) return;
  // console.log(submitData);
  const realDataToSubmit = convertToBackendData(
    route.query.type as Nullable<string>,
    submitData
  );
  console.log("real", realDataToSubmit);
  // 根据当前表单类型提交数据
  // switch (currentComponentType.value) {
  //   case "yearlyReport":
  //     const op = route.query.id
  //       ? BusinessFormAPI.editBusinessReportForm
  //       : BusinessFormAPI.addBusinessReportForm;
  //     op(submitData);
  //     break;
  //   case "marketPriceReport":
  //     BusinessFormAPI.saveMarketPriceReport(submitData);
  //     break;
  //   case "firmMngReport":
  //     BusinessFormAPI.saveFirmMngReport(submitData);
  //     break;
  //   case "firmReport":
  //     BusinessFormAPI.saveFirmReport(submitData);
  //     break;
  //   case "customReport":
  //     BusinessFormAPI.saveCustomReport(submitData);
  //     break;
  //   case "partnerReport":
  //     BusinessFormAPI.savePartnerReport(submitData);
  //     break;
  //   case "partnerDetail":
  //     BusinessFormAPI.savePartnerDetail(submitData);
  //     break;
  //   default:
  //     break;
  // }
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
  box-shadow: 0 -10px rgba(0, 0, 0, 0.5);
  z-index: 1;
  padding: 5px 20px;
  border-radius: 0 10px 10px;
}
</style>
