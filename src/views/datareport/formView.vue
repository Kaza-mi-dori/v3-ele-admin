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
        :loading="submitting"
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
        生成测试数据
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
// import partnerReportDetailForm from "./partnerReport/detail_reserve.vue";
import partnerReportDetailForm from "./partnerReport/detail.vue";
import partnerDetailForm from "@/views/partner/detail.vue";
import contractDetailForm from "@/views/business/detail/contract.vue";
import orderDetailForm from "@/views/business/detail/order.vue";
import settlementDetailForm from "@/views/business/detail/settlement.vue";
import storageDetailForm from "@/views/business/detail/storage.vue";
import safetyDetailForm from "@/views/business/detail/safety.vue";
import goodsDetailForm from "@/views/business/detail/goods.vue";
import paymentDetailForm from "@/views/business/detail/payment.vue";
import singlePartnerDetailForm from "@/views/business/detail/partner.vue";
import bargainReportDetailForm from "@/views/datareport/bargainReport/detail.vue";
import fixedCostReportDetailForm from "@/views/datareport/fixedCostReport/detail.vue";
import BusinessFormAPI from "@/api/businessForm";
import BusinessStandbookAPI from "@/api/businessStandBook";
import { ElMessage } from "element-plus";
import { stringToArray, arrayToString } from "@/utils";
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

const submitting = ref(false);

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
  { value: "paymentDetail", label: "款项详情" },
  { value: "singlePartnerDetail", label: "合作伙伴展示报表" },
  { value: "bargainReport", label: "贸易板块跟踪表" },
  { value: "fixedCostReport", label: "固定成本月表" },
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
      // const content =
      //   Array.isArray(data["内容"]["详情"]) &&
      //   data["内容"]["详情"].length > 0 &&
      //   data["内容"]["详情"][0]; // TODO 改为遍历而不是只取第一个
      // return {
      //   timeDimension: data["类型"],
      //   year: data["日期"],
      //   businessDimension: data["业务维度"],
      //   profit: content["利润金额"],
      //   income: content["营收金额"],
      //   outcoming: content["支出金额"],
      //   purchaseAmount: content["采购金额"],
      //   salesAmount: content["销售金额"],
      //   purchaseContractCount: content["采购合同数"],
      //   salesContractCount: content["销售合同数"],
      //   contractCount: content["合同总份数"],
      //   contractAmount: content["合同总金额"],
      //   purchaseOrderCount: content["采购合同份数"],
      //   salesOrderCount: content["销售合同份数"],
      //   contractFulfilledCount: content["合同履行数"],
      //   riskContractCount: content["风险合同数"],
      //   storage: 0 || data["库存量"], // TODO 后端为数字但前端为数组
      //   settlementAmount: content["结算金额"],
      //   settlementCount: content["结算数量"],
      //   planIncome: content["计划营收"],
      //   planProfit: content["计划利润"],
      //   planOutcome: content["计划支出"],
      //   incomeFulfilledRate: content["营收目标完成率"],
      //   profitFulfilledRate: content["利润目标完成率"],
      //   createdBy: data["创建者"],
      //   createdAt: data["创建时间"],
      //   updatedBy: data["修改者"],
      //   updatedAt: data["修改时间"],
      // };
      return {
        year: data["日期"],
        businessDimension: data["业务维度"],
        content: data["内容"]["详情"].map((item: any) => {
          return {
            product: item["业态类型"],
            year: item["数据日期"],
            profit: item["利润金额"],
            income: item["营收金额"],
            contractCount: item["合同总份数"],
            contractAmount: item["合同总金额"],
            contractFulfilledCount: item["合同履行数"],
            riskContractCount: item["风险合同数"],
            settlementAmount: item["结算金额"],
            settlementCount: item["结算数量"],
            planIncome: item["计划营收"],
            planProfit: item["计划利润"],
            incomeFulfilledRate: item["营收目标完成率"],
            profitFulfilledRate: item["利润目标完成率"],
          };
        }),
      };
    case "marketPriceReport":
      // 市场价格报表
      return {
        year: data["日期"],
        goodsName: data["产品名称"],
        desc: data["内容"]["产品信息"],
        priceTime: data["内容"]["报价日期"],
        price: data["内容"]["报价金额"],
        currency: data["内容"]["报价币种"],
        change: data["内容"]["环比"],
        createdBy: data["创建者"],
        createdAt: data["创建时间"],
        updatedBy: data["修改者"],
        updatedAt: data["修改时间"],
      };
    case "firmMngReport":
      // 企业经营报表
      return {
        // 转换数据
        year: data["日期"],
        firmName: data["企业名称"],
        firmType: data["企业类型"],
        details: data["内容"]["详情"].map((item: any) => {
          return {
            businessType: item["业态类型"],
            dataDate: item["数据日期"],
            storage: item["库存量"],
            bargain: item["交易量"],
            profit: item["当期利润金额"],
            revenue: item["当期营收金额"],
            planProfit: item["当期计划利润"],
            planRevenue: item["当期计划营收"],
            purchaseAmount: item["当期采购金额"],
            salesAmount: item["当期销售金额"],
            purchaseCount: item["当期采购量"],
            salesCount: item["当期销售量"],
            settlementAmount: item["当期结算金额"],
            settlementCount: item["当期结算数量"],
            contractCount: item["累计合同总份数"],
            contractFulfilledCount: item["累计合同履行数"],
            contractFulfilledAmount: item["累计合同履行金额"],
            riskContractCount: item["累计风险合同数"],
            contractAmount: item["累计合同总金额"],
            purchaseContractFulfilledCount: item["累计采购合同履行数"],
            salesContractFulfilledCount: item["累计销售合同履行数"],
            purchaseContractCount: item["累计采购合同数"],
            salesContractCount: item["累计销售合同数"],
            storageContractCount: item["累计仓储合同数"],
            otherContractCount: item["累计其他合同数"],
            incomeFulfilledRate: item["累计营收目标完成率"],
            profitFulfilledRate: item["累计利润目标完成率"],
            accumulatedRevenue: item["累计营收金额"],
            accumulatedProfit: item["累计利润金额"],
            accumulatedPurchaseAmount: item["累计采购金额"],
            accumulatedSalesAmount: item["累计销售金额"],
          };
        }),
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
        name: "贸易伙伴报表",
        year: data["日期"],
        partnerName: data["伙伴名称"],
        partnerType: data["内容"]["伙伴类型"],
        totalTradeAmount: data["累计贸易额"],
        tradeAmountYoY: data["内容"]["同比"],
        tradeAmountMoM: data["内容"]["环比"],
        createdBy: data["创建者"],
        createdAt: data["创建时间"],
        updatedBy: data["修改者"],
        updatedAt: data["修改时间"],
        dataFrom: "手动录入",
        audited: data["状态"],
      };
    case "partnerDetail":
      // 合作伙伴详情
      return {
        // 转换数据
      };
    case "contractDetail":
      return {
        // 转换数据
        name: data["合同名称"],
        number: data["合同编号"],
        source: data["数据源"],
        signTime: data["签署日期"],
        type: data["合同类型"],
        amount: data["含税金额"],
        self: data["我方名称"],
        partner: data["相对人名称"],
        otherDesc: data["备注"],
        description: data["内容"]?.["合同说明"],
        expired: data["内容"]?.["履约期限"],
        isRisk: data["内容"]?.["是否风险合同"],
        fulfilledAmount: data["内容"]?.["已履行金额"],
        fulfilledCount: data["内容"]?.["已履约数量"],
        createdAt: data["创建时间"],
        createdBy: data["创建者"],
        updatedAt: data["修改时间"],
        updatedBy: data["修改者"],
        audited: data["状态"],
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
    case "paymentDetail":
      return {
        // 转换数据
        数据源: data["数据源"],
        日期: data["日期"],
        状态: data["状态"],
        款项编号: data["款项编号"],
        订单编号: data["订单编号"],
        备注: data["备注"],
        款项金额: data["内容"]["款项金额"],
        款项类型: data["内容"]["款项类型"],
        款项时间: data["内容"]["款项时间"],
        款项说明: data["内容"]["款项说明"],
        款项状态: data["内容"]["款项状态"],
      };
    case "goodsDetail":
      return {
        // 转换数据
      };
    case "singlePartnerDetail":
      return {
        客商名称: data["客商名称"],
        数据源: data["数据源"],
        客商类型: stringToArray(data["客商类型"]),
        准入状态: data["准入状态"],
        评价: +data["评价"],
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
      result["类型"] = data.timeDimension;
      // result["内容"] = {
      //   库存量: 0 || data.storage, // TODO 后端为数字但前端为数组
      //   详情: [
      //     {
      //       业态类型: data.businessDimension,
      //       数据日期: data.year,
      //       利润金额: data.profit,
      //       营收金额: data.income,
      //       // 采购金额: data.purchaseAmount, // TODO 后端接口无
      //       // 销售金额: data.salesAmount, // TODO 后端接口无
      //       // 支出金额: data.outcome, // TODO 后端接口无
      //       // 采购合同数: data.purchaseContractCount, // TODO 后端接口无
      //       // 销售合同数: data.salesContractCount, // TODO 后端接口无
      //       合同总份数: data.contractCount,
      //       合同总金额: data.contractAmount,
      //       // 采购合同份数: data.purchaseOrderCount, // TODO 后端接口无
      //       // 销售合同份数: data.salesOrderCount, // TODO 后端接口无
      //       合同履行数: data.contractFulfilledCount,
      //       合同履行金额: 0, // TODO 后端接口有但前端页面无
      //       风险合同数: data.riskContractCount,
      //       结算金额: data.settlementAmount,
      //       结算数量: data.settlementCount,
      //       计划营收: data.planIncome,
      //       计划利润: data.planProfit,
      //       // 计划支出: data.planOutcome, // TODO 后端接口无
      //       营收目标完成率: data.incomeFulfilledRate,
      //       利润目标完成率: data.profitFulfilledRate,
      //     },
      //   ],
      // };
      result["内容"] = {
        详情: data.content.map((item: any) => {
          return {
            业态类型: item.product,
            数据日期: item.year,
            利润金额: item.profit,
            营收金额: item.income,
            合同总份数: item.contractCount,
            合同总金额: item.contractAmount,
            合同履行数: item.contractFulfilledCount,
            风险合同数: item.riskContractCount,
            结算金额: item.settlementAmount,
            结算数量: item.settlementCount,
            计划营收: item.planIncome,
            计划利润: item.planProfit,
            营收目标完成率: item.incomeFulfilledRate,
            利润目标完成率: item.profitFulfilledRate,
          };
        }),
      };
      // console.log("converted", result);
      return result;
    case "marketPriceReport":
      result["日期"] = data.year;
      result["产品名称"] = data.goodsName;
      result["内容"] = {
        产品信息: data.desc,
        报价日期: data.priceTime,
        报价金额: data.price,
        报价币种: data.currency,
        环比: data.change,
      };
      return result;
    case "firmMngReport":
      result["日期"] = data.year;
      result["企业名称"] = data.firmName;
      result["企业类型"] = data.firmType;
      result["内容"] = {
        详情: data.details.map((item: any) => {
          return {
            业态类型: item.businessType,
            数据日期: item.dataDate,
            库存量: item.storage,
            交易量: item.bargain,
            当期利润金额: item.profit,
            当期营收金额: item.revenue,
            当期计划利润: item.planProfit,
            当期计划营收: item.planRevenue,
            当期采购金额: item.purchaseAmount,
            当期销售金额: item.salesAmount,
            当期采购量: item.purchaseCount,
            当期销售量: item.salesCount,
            当期结算金额: item.settlementAmount,
            当期结算数量: item.settlementCount,
            累计合同总份数: item.contractCount,
            累计合同履行数: item.contractFulfilledCount,
            累计合同履行金额: item.contractFulfilledAmount,
            累计风险合同数: item.riskContractCount,
            累计合同总金额: item.contractAmount,
            累计采购合同履行数: item.purchaseContractFulfilledCount,
            累计销售合同履行数: item.salesContractFulfilledCount,
            累计采购合同数: item.purchaseContractCount,
            累计销售合同数: item.salesContractCount,
            累计仓储合同数: item.storageContractCount,
            累计其他合同数: item.otherContractCount,
            累计营收目标完成率: item.incomeFulfilledRate,
            累计利润目标完成率: item.profitFulfilledRate,
            累计营收金额: item.accumulatedRevenue,
            累计利润金额: item.accumulatedProfit,
            累计采购金额: item.accumulatedPurchaseAmount,
            累计销售金额: item.accumulatedSalesAmount,
          };
        }),
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
      result["日期"] = data.year;
      result["伙伴名称"] = data.partnerName;
      result["累计贸易额"] = data.totalTradeAmount;
      result["内容"] = {
        贸易额伙伴类型: data.partnerType,
        贸易伙伴名称: data.partnerName,
        贸易额同比: data.tradeAmountYoY,
        贸易额环比: data.tradeAmountMoM,
      };
      return result;
    case "partnerDetail":
      return {
        ...data,
        // 转换数据
      };
    case "contractDetail":
      result["数据源"] = data.source;
      result["签署日期"] = data.signTime;
      result["合同名称"] = data.name;
      result["合同编号"] = data.number;
      result["合同类型"] = data.type;
      result["含税金额"] = data.amount;
      result["我方名称"] = data.self; // TODO 后端接口有但前端页面无
      result["相对人名称"] = data.partner;
      result["备注"] = data.otherDesc;
      result["内容"] = {
        合同说明: data.description,
        履约期限: data.expired,
        已履行金额: 0, // TODO 后端接口有但前端页面无
        已履约数量: 0, // TODO 后端接口有但前端页面无
        是否风险合同: data.isRisk,
      };
      return result;
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
    case "paymentDetail":
      result["数据源"] = data["数据源"];
      result["日期"] = data["日期"];
      result["状态"] = data["状态"];
      result["款项编号"] = data["款项编号"];
      result["订单编号"] = data["订单编号"];
      result["备注"] = data["备注"];
      result["内容"] = {
        款项金额: data["款项金额"],
        款项类型: data["款项类型"],
        款项时间: data["款项时间"],
        款项说明: data["款项说明"],
        款项状态: data["款项状态"],
      };
      return result;
    case "goodsDetail":
      return {
        ...data,
        // 转换数据
      };
    case "singlePartnerDetail":
      result["日期"] = data["日期"];
      result["数据源"] = data["数据源"];
      result["客商名称"] = data["客商名称"];
      // 客商类型在前端是数组，要转化为字符串
      result["客商类型"] = arrayToString(data["客商类型"]);
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
  submitting.value = true;
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
                name: "YearlyReportMng",
              });
            }, 500);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        })
        .finally(() => {
          submitting.value = false;
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
                name: "MarketPriceReportMng",
              });
            }, 500);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        })
        .finally(() => {
          submitting.value = false;
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
                name: "FirmMngReportMng",
              });
            }, 500);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        })
        .finally(() => {
          submitting.value = false;
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
                name: "FirmReportMng",
              });
            }, 500);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        })
        .finally(() => {
          submitting.value = false;
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
                name: "PartnerReportMng",
              });
            }, 500);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        })
        .finally(() => {
          submitting.value = false;
        });
      break;
    // case "partnerDetail":
    //   BusinessFormAPI.savePartnerDetail(submitData);
    //   break;
    case "contractDetail":
      const opContractDetail = route.query.id
        ? BusinessStandbookAPI.editContractLedgerRecord
        : BusinessStandbookAPI.addContractLedgerRecord;
      opContractDetail(realDataToSubmit).then(() => {
        isEditing.value = false;
        if (!route.query.id) {
          // 跳转到列表页
          ElMessage.success("提交成功, 正在跳转到列表页");
          setTimeout(() => {
            router.push({
              name: "ContractLedgerMng",
            });
          }, 500);
        } else {
          ElMessage.success("提交成功");
        }
      });
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
    case "paymentDetail":
      const opPaymentDetail = route.query.id
        ? BusinessStandbookAPI.editPaymentLedgerRecord
        : BusinessStandbookAPI.addPaymentLedgerRecord;
      opPaymentDetail(realDataToSubmit)
        .then(() => {
          isEditing.value = false;
          if (!route.query.id) {
            // 跳转到列表页
            ElMessage.success("提交成功, 正在跳转到列表页");
            setTimeout(() => {
              router.push({
                name: "PaymentLedgerMng",
              });
            }, 500);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .catch((err) => {
          isEditing.value = false;
          ElMessage.error("提交失败，" + err);
        })
        .finally(() => {
          submitting.value = false;
        });
      break;
    case "goodsDetail":
      // BusinessFormAPI.saveGoodsDetail(submitData);
      break;
    case "singlePartnerDetail":
      const opSinglePartnerDetail = route.query.id
        ? BusinessStandbookAPI.editCustomerAndSupplierLedgerRecord
        : BusinessStandbookAPI.addCustomerAndSupplierLedgerRecord;
      opSinglePartnerDetail(realDataToSubmit)
        .then(() => {
          isEditing.value = false;
          if (!route.query.id) {
            // 跳转到列表页
            ElMessage.success("提交成功, 正在跳转到列表页");
            setTimeout(() => {
              router.push({
                name: "PartnerLedgerMng",
              });
            }, 500);
          } else {
            ElMessage.success("提交成功");
          }
        })
        .finally(() => {
          submitting.value = false;
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
      if (route.query.id) {
        BusinessFormAPI.getCompanyReportForm(route.query.id as string).then(
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
      if (route.query.id) {
        BusinessStandbookAPI.getContractLedgerRecord(
          route.query.id as string
        ).then((data) => {
          if (formRef.value) {
            const form = formRef.value as any;
            console.log("contract", data, form);
            form.setFormValue(
              converToFrontendFormData(
                route.query.type as Nullable<string>,
                data
              )
            );
          }
        });
      }
      break;
    case orderDetailForm:
      break;
    case settlementDetailForm:
      break;
    case storageDetailForm:
      break;
    case safetyDetailForm:
      break;
    case paymentDetailForm:
      if (route.query.id) {
        BusinessStandbookAPI.getPaymentLedgerRecord(
          route.query.id as string
        ).then((data) => {
          if (formRef.value) {
            const form = formRef.value as any;
            form.setFormValue(
              converToFrontendFormData(
                route.query.type as Nullable<string>,
                data
              )
            );
          }
        });
      }

      break;
    case goodsDetailForm:
      break;
    case singlePartnerDetailForm:
      if (route.query.id) {
        BusinessStandbookAPI.getCustomerAndSupplierLedgerRecord(
          route.query.id as string
        ).then((data) => {
          if (formRef.value) {
            const form = formRef.value as any;
            form.setFormValue(
              converToFrontendFormData(
                route.query.type as Nullable<string>,
                data
              )
            );
          }
        });
      }
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
    } else if (value === "paymentDetail") {
      currentComponent.value = paymentDetailForm;
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
    } else if (value === "paymentDetail") {
      currentComponent.value = paymentDetailForm;
    } else if (value === "singlePartnerDetail") {
      currentComponent.value = singlePartnerDetailForm;
    } else if (value === "bargainReport") {
      currentComponent.value = bargainReportDetailForm;
    } else if (value === "fixedCostReport") {
      currentComponent.value = fixedCostReportDetailForm;
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
