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
      <!-- DEV_ONLY -->
      <el-button
        v-if="isEditing && editable"
        type="danger"
        class="g-button-1"
        @click="handleGenerateRandomData"
      >
        生成随机数据
      </el-button>
      <!-- DEV_ONLY -->
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
      <div v-if="currentComponent && currentFormStatus" class="status-tag">
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
import contractDetailForm from "@/views/business/detail/contract.vue";
import orderDetailForm from "@/views/business/detail/order.vue";
import settlementDetailForm from "@/views/business/detail/settlement.vue";
import storageDetailForm from "@/views/business/detail/storage.vue";
import safetyDetailForm from "@/views/business/detail/safety.vue";
import goodsDetailForm from "@/views/business/detail/goods.vue";
import singlePartnerDetailForm from "@/views/business/detail/partner.vue";

import BusinessFormAPI from "@/api/businessForm";
import BusinessStandbookAPI from "@/api/businessStandBook";
import { ElMessage } from "element-plus";

import { ref, onMounted, shallowRef } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();

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
  { value: "contractDetail", label: "合同详情" },
  { value: "orderDetail", label: "订单详情" },
  { value: "settlementDetail", label: "结算详情" },
  { value: "storageDetail", label: "库存详情" },
  { value: "safetyDetail", label: "安全详情" },
  { value: "goodsDetail", label: "商品详情" },
  { value: "singlePartnerDetail", label: "合作伙伴展示报表" },
];

const handleEdit = () => {
  isEditing.value = true;
  if (formRef.value) {
    const form = formRef.value as any;
    form.saveForm();
  }
};

const handleGenerateRandomData = () => {
  if (formRef.value) {
    const form = formRef.value as any;
    if (form.generateRandomData) {
      form.generateRandomData();
    } else {
      ElMessage.error("该表单不支持生成随机数据");
    }
  }
};

const converToFrontendFormData = (type: string | null, data: any) => {
  switch (type) {
    case "yearlyReport":
      return {
        year: data["日期"],
        businessDimension: data["业务维度"],
        profit: data["内容"]["利润金额"],
        income: data["内容"]["营收金额"],
        outcoming: data["内容"]["支出金额"],
        purchaseAmount: data["内容"]["采购金额"],
        salesAmount: data["内容"]["销售金额"],
        purchaseContractCount: data["内容"]["采购合同数"],
        salesContractCount: data["内容"]["销售合同数"],
        contractCount: data["内容"]["合同总份数"],
        contractAmount: data["内容"]["合同总金额"],
        purchaseOrderCount: data["内容"]["采购合同份数"],
        salesOrderCount: data["内容"]["销售合同份数"],
        contractFulfilledCount: data["内容"]["合同履行数"],
        riskContractCount: data["内容"]["风险合同数"],
        storage: data["内容"]["库存量"],
        settlementAmount: data["内容"]["结算金额"],
        settlementCount: data["内容"]["结算数量"],
        planIncome: data["内容"]["计划营收"],
        planProfit: data["内容"]["计划利润"],
        planOutcome: data["内容"]["计划支出"],
        incomeFulfilledRate: data["内容"]["营收目标完成率"],
        profitFulfilledRate: data["内容"]["利润目标完成率"],
        createdBy: data["创建者"],
        createdAt: data["创建时间"],
        updatedBy: data["修改者"],
        updatedAt: data["修改时间"],
      };
    case "marketPriceReport":
      // 市场价格报表
      return {
        // 转换数据
      };
    case "firmMngReport":
      // 企业经营报表
      return {
        // 转换数据
      };
    case "firmReport":
      return {
        // 转换数据
        name: data["内容"]["企业名称"],
        description: data["内容"]["企业介绍"],
        asset: data["内容"]["企业资产"],
        staff: data["内容"]["企业人数"],
        attachment: data["内容"]["附件"],
        year: data["日期"],
      };
    case "customReport":
      return {
        // 转换数据
      };
    case "partnerReport":
      // 合作伙伴报表
      return {
        // 转换数据
      };
    case "partnerDetail":
      // 合作伙伴详情
      return {
        // 转换数据
      };
    case "contractDetail":
      return {
        // 转换数据
      };
    case "orderDetail":
      return {
        // 转换数据
      };
    case "settlementDetail":
      return {
        // 转换数据
      };
    case "storageDetail":
      return {
        // 转换数据
      };
    case "safetyDetail":
      return {
        // 转换数据
      };
    case "goodsDetail":
      return {
        // 转换数据
      };
    case "singlePartnerDetail":
      return {
        客商名称: data["客商名称"],
        数据源: data["数据源"],
        客商类型: data["客商类型"],
        准入状态: data["准入状态"],
        评价: data["评价"],
        备注: data["备注"],
        履约风险合同数: data["内容"]["履约风险合同数"],
        累计贸易额: data["内容"]["累计贸易额"],
        累计签订合同数: data["内容"]["累计签订合同数"],
        未履约合同数: data["内容"]["未履约合同数"],
        创建者: data["创建者"],
        创建时间: data["创建时间"],
        修改者: data["修改者"],
        修改时间: data["修改时间"],
        日期: data["日期"],
      };
    default:
      return data;
  }
};

const convertToBackendData = (type: string | null, data: any) => {
  const result: GenericRecord = {
    id: route.query.id,
  };
  switch (type) {
    case "yearlyReport":
      result["日期"] = data.year;
      result["业务维度"] = data.businessDimension;
      result["内容"] = {
        利润金额: data.profit,
        营收金额: data.income,
        采购金额: data.purchaseAmount,
        销售金额: data.salesAmount,
        支出金额: data.outcome,
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
        计划支出: data.planOutcome,
        营收目标完成率: data.incomeFulfilledRate,
        利润目标完成率: data.profitFulfilledRate,
      };
      // console.log("converted", result);
      return result;
    case "marketPriceReport":
      return {
        ...data,
        // 转换数据
      };
    case "firmMngReport":
      result["日期"] = data.year;
      result["企业类型"] = data.name;
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
      return result;
    case "firmReport":
      result["日期"] = data.year;
      result["企业名称"] = data.name;
      result["内容"] = {
        企业名称: data.name,
        企业介绍: data.description,
        企业资产: data.asset,
        企业人数: data.staff,
        // '附件': data.attachment,
      };
      return result;
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
    case "contractDetail":
      return {
        ...data,
        // 转换数据
      };
    case "orderDetail":
      return {
        ...data,
        // 转换数据
      };
    case "settlementDetail":
      return {
        ...data,
        // 转换数据
      };
    case "storageDetail":
      return {
        ...data,
        // 转换数据
      };
    case "safetyDetail":
      return {
        ...data,
        // 转换数据
      };
    case "goodsDetail":
      return {
        ...data,
        // 转换数据
      };
    case "singlePartnerDetail":
      result["日期"] = data["日期"];
      result["数据源"] = data["数据源"];
      result["客商名称"] = data["客商名称"];
      result["客商类型"] = data["客商类型"];
      result["准入状态"] = data["准入状态"];
      result["评价"] = data["评价"];
      result["备注"] = data["备注"];
      result["内容"] = {
        履约风险合同数: data["履约风险合同数"],
        累计贸易额: data["累计贸易额"],
        累计签订合同数: data["累计签订合同数"],
        未履约合同数: data["未履约合同数"],
      };
      return result;
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
  // console.log("real", realDataToSubmit);
  // 根据当前表单类型提交数据
  switch (route.query.type as Nullable<string>) {
    case "yearlyReport":
      const op = route.query.id
        ? BusinessFormAPI.editBusinessReportForm
        : BusinessFormAPI.addBusinessReportForm;
      op(realDataToSubmit)
        .then(() => {
          isEditing.value = false;
          if (!route.query.id) {
            // 跳转到列表页
            ElMessage.success("提交成功, 正在跳转到列表页");
            setTimeout(() => {
              router.push({
                name: "yearlyReportMng",
                query: {
                  type: "yearlyReport",
                },
              });
            }, 1000);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        });
      break;
    case "marketPriceReport":
      const opMarketPriceReport = route.query.id
        ? BusinessFormAPI.editMarketQuotationReportForm
        : BusinessFormAPI.addMarketQuotationReportForm;
      opMarketPriceReport(realDataToSubmit)
        .then(() => {
          isEditing.value = false;
          if (!route.query.id) {
            // 跳转到列表页
            ElMessage.success("提交成功, 正在跳转到列表页");
            setTimeout(() => {
              router.push({
                name: "ReportList",
                query: {
                  type: "marketPriceReport",
                },
              });
            }, 1000);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        });
      break;
    case "firmMngReport":
      const opFirmMngReport = route.query.id
        ? BusinessFormAPI.editCompanyReportForm
        : BusinessFormAPI.addCompanyReportForm;
      opFirmMngReport(realDataToSubmit)
        .then(() => {
          isEditing.value = false;
          if (!route.query.id) {
            // 跳转到列表页
            ElMessage.success("提交成功, 正在跳转到列表页");
            setTimeout(() => {
              router.push({
                name: "ReportList",
                query: {
                  type: "firmMngReport",
                },
              });
            }, 1000);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        });
      break;
    case "firmReport":
      const opFirmReport = route.query.id
        ? BusinessFormAPI.editCompanyDescForm
        : BusinessFormAPI.addCompanyDescForm;
      opFirmReport(realDataToSubmit)
        .then(() => {
          isEditing.value = false;
          if (!route.query.id) {
            // 跳转到列表页
            ElMessage.success("提交成功, 正在跳转到列表页");
            setTimeout(() => {
              router.push({
                name: "ReportList",
                query: {
                  type: "firmReport",
                },
              });
            }, 1000);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        });
      break;
    // case "customReport":
    //   BusinessFormAPI.saveCustomReport(submitData);
    //   break;
    case "partnerReport":
      const opPartnerReport = route.query.id
        ? BusinessFormAPI.editTradePartnersReportForm
        : BusinessFormAPI.addTradePartnersReportForm;
      opPartnerReport(realDataToSubmit)
        .then(() => {
          isEditing.value = false;
          if (!route.query.id) {
            // 跳转到列表页
            ElMessage.success("提交成功, 正在跳转到列表页");
            setTimeout(() => {
              router.push({
                name: "ReportList",
                query: {
                  type: "partnerReport",
                },
              });
            }, 1000);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        });
      break;
    // case "partnerDetail":
    //   BusinessFormAPI.savePartnerDetail(submitData);
    //   break;
    case "contractDetail":
      // BusinessFormAPI.saveContractDetail(submitData);
      break;
    case "orderDetail":
      // BusinessFormAPI.saveOrderDetail(submitData);
      break;
    case "settlementDetail":
      // BusinessFormAPI.saveSettlementDetail(submitData);
      break;
    case "storageDetail":
      // BusinessFormAPI.saveStorageDetail(submitData);
      break;
    case "safetyDetail":
      // BusinessFormAPI.saveSafetyDetail(submitData);
      break;
    case "goodsDetail":
      // BusinessFormAPI.saveGoodsDetail(submitData);
      break;
    case "singlePartnerDetail":
      const opSinglePartnerDetail = route.query.id
        ? BusinessStandbookAPI.editCustomerAndSupplierLedgerRecord
        : BusinessStandbookAPI.addCustomerAndSupplierLedgerRecord;
      opSinglePartnerDetail(realDataToSubmit).then(() => {
        isEditing.value = false;
        if (!route.query.id) {
          // 跳转到列表页
          ElMessage.success("提交成功, 正在跳转到列表页");
          setTimeout(() => {
            router.push({
              name: "PartnerLedgerMng",
            });
          }, 1000);
        } else {
          ElMessage.success("提交成功");
        }
      });
    default:
      break;
  }
};

const handleSubmitSuccess = () => {
  isEditing.value = false;
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

/**
 * 初始化表单
 * 根据当前指定的表单类型，初始化表单，从路由参数获取id
 */
const initForm = () => {
  switch (currentComponent.value) {
    case yearlyReportDetailForm:
      if (route.query.id) {
        BusinessFormAPI.getBusinessReportForm(route.query.id as string).then(
          (data) => {
            if (formRef.value) {
              const form = formRef.value as any;
              form.setFormValue(
                converToFrontendFormData(
                  route.query.type as Nullable<string>,
                  data
                )
              );
            }
          }
        );
      }
      break;
    case marketPriceReportDetailForm:
      break;
    case firmMngReportDetailForm:
      break;
    case firmReportDetailForm:
      if (route.query.id) {
        BusinessFormAPI.getCompanyDescForm(route.query.id as string).then(
          (data) => {
            if (formRef.value) {
              const form = formRef.value as any;
              form.setFormValue(
                converToFrontendFormData(
                  route.query.type as Nullable<string>,
                  data
                )
              );
            }
          }
        );
      }
      break;
    case customReportDetailForm:
      break;
    case partnerReportDetailForm:
      break;
    case partnerDetailForm:
      break;
    case contractDetailForm:
      break;
    case orderDetailForm:
      break;
    case settlementDetailForm:
      break;
    case storageDetailForm:
      break;
    case safetyDetailForm:
      break;
    case goodsDetailForm:
      break;
    case singlePartnerDetailForm:
      break;
    default:
      break;
  }
};

watch(() => currentComponent.value, initForm, { immediate: true });

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
    } else if (value === "contractDetail") {
      currentComponent.value = contractDetailForm;
    } else if (value === "orderDetail") {
      currentComponent.value = orderDetailForm;
    } else if (value === "settlementDetail") {
      currentComponent.value = settlementDetailForm;
    } else if (value === "storageDetail") {
      currentComponent.value = storageDetailForm;
    } else if (value === "safetyDetail") {
      currentComponent.value = safetyDetailForm;
    } else if (value === "goodsDetail") {
      currentComponent.value = goodsDetailForm;
    } else if (value === "singlePartnerDetail") {
      currentComponent.value = singlePartnerDetailForm;
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
    } else if (value === "contractDetail") {
      currentComponent.value = contractDetailForm;
    } else if (value === "orderDetail") {
      currentComponent.value = orderDetailForm;
    } else if (value === "settlementDetail") {
      currentComponent.value = settlementDetailForm;
    } else if (value === "storageDetail") {
      currentComponent.value = storageDetailForm;
    } else if (value === "safetyDetail") {
      currentComponent.value = safetyDetailForm;
    } else if (value === "goodsDetail") {
      currentComponent.value = goodsDetailForm;
    } else if (value === "singlePartnerDetail") {
      currentComponent.value = singlePartnerDetailForm;
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
  // initForm();
});
</script>

<style lang="scss" scoped>
.status-tag {
  @apply bg-amber-3;
  position: absolute;
  // color: #fefefe;
  top: -5px;
  right: 10px;
  box-shadow: 0 -2px rgba(0, 0, 0, 0.5);
  z-index: 1;
  padding: 5px 20px;
  border-radius: 0 10px 10px;
}
</style>
