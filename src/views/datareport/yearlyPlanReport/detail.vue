<template>
  <div class="main-wrapper">
    <!-- <div class="g-title-block-2">
      <div class="__title">年度经营报表</div>
    </div> -->
    <!-- <div class="mb-4 p-10px bg-white">
      <el-button class="g-button-1" type="primary" @click="handleEdit">
        编辑
      </el-button>
      <el-button class="g-button-1" type="primary" @click="submitForm">
        提交
      </el-button>
      <el-button class="g-button-1" @click="favoForm">收藏</el-button>
      <el-button class="g-button-1" @click="exportForm">导出</el-button>
    </div> -->
    <div class="info-card-level1">
      <div class="__title">
        <span>基本信息</span>
      </div>
      <div class="__content">
        <el-form
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="yearlyReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="年度" prop="year">
                <el-date-picker
                  v-if="editing"
                  v-model="yearlyReportDetailForm.year"
                  type="year"
                />
                <span v-else>{{ yearlyReportDetailForm.year }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="利润" prop="profit">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.profit"
                />
                <span v-else>{{ yearlyReportDetailForm.profit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收入" prop="income">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.income"
                />
                <span v-else>{{ yearlyReportDetailForm.income }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="支出" prop="outcome">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.outcome"
                />
                <span v-else>{{ yearlyReportDetailForm.outcome }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购金额" prop="purchaseAmount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.purchaseAmount"
                />
                <span v-else>{{ yearlyReportDetailForm.purchaseAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售金额" prop="salesAmount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.salesAmount"
                />
                <span v-else>{{ yearlyReportDetailForm.salesAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同数量" prop="contractCount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.contractCount"
                />
                <span v-else>{{ yearlyReportDetailForm.contractCount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="已履行合同数量"
                prop="contractFulfilledCount"
              >
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.contractFulfilledCount"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.contractFulfilledCount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="风险合同数量" prop="riskContractCount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.riskContractCount"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.riskContractCount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购合同数量" prop="purchaseContractCount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.purchaseContractCount"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.purchaseContractCount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售合同数量" prop="salesContractCount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.salesContractCount"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.salesContractCount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购订单数量" prop="purchaseOrderCount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.purchaseOrderCount"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.purchaseOrderCount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售订单数量" prop="salesOrderCount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.salesOrderCount"
                />
                <span v-else>{{ yearlyReportDetailForm.salesOrderCount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算数量" prop="settlementCount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.settlementCount"
                />
                <span v-else>{{ yearlyReportDetailForm.settlementCount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算金额" prop="settlementAmount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.settlementAmount"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.settlementAmount }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划收入" prop="planIncome">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.planIncome"
                />
                <span v-else>{{ yearlyReportDetailForm.planIncome }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划支出" prop="planOutcome">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.planOutcome"
                />
                <span v-else>{{ yearlyReportDetailForm.planOutcome }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划利润" prop="planProfit">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.planProfit"
                />
                <span v-else>{{ yearlyReportDetailForm.planProfit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="营收目标完成率" prop="incomeFulfilledRate">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.incomeFulfilledRate"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.incomeFulfilledRate }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="利润目标完成率" prop="profitFulfilledRate">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.profitFulfilledRate"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.profitFulfilledRate }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>库存信息</span>
      </div>
      <div class="__content">
        <el-form
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="yearlyReportDetailForm"
        >
          <el-row>
            <el-col :span="24">
              <el-table :data="yearlyReportDetailForm.storage" stripe border>
                <el-table-column prop="warehouse" label="仓库" />
                <el-table-column prop="name" label="产品" />
                <el-table-column prop="amount" label="数量" />
              </el-table>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>维护信息</span>
      </div>
      <div class="__content">
        <el-form
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="yearlyReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="创建时间" prop="createdAt">
                <span>{{ yearlyReportDetailForm.createdAt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人" prop="createdBy">
                <span>{{ yearlyReportDetailForm.createdBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新时间" prop="updatedAt">
                <span>{{ yearlyReportDetailForm.updatedAt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新人" prop="updatedBy">
                <span>{{ yearlyReportDetailForm.updatedBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据来源" prop="dataFrom">
                <span>{{ yearlyReportDetailForm.dataFrom }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否审核" prop="audited">
                <span>{{ yearlyReportDetailForm.audited }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import business from "@/types/business";

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

// 按照类型定义产出数据
/**
 *  year: string;
    income: number;
    outcome: number;
    profit: number;
    purchaseAmount: number; // 采购金额
    salesAmount: number; // 销售金额
    contractCount: number; // 合同数量
    contractFulfilledCount: number; // 已履行合同数量
    riskContractCount: number; // 风险合同数量
    purchaseContractCount: number; // 采购合同数量
    salesContractCount: number; // 销售合同数量
    purchaseOrderCount: number; // 采购订单数量
    salesOrderCount: number; // 销售订单数量,
    storage: Record<string, number>; // 仓储信息
    settlementCount: number; // 结算数量
    settlementAmount: number; // 结算金额
    planIncome: number; // 计划收入
    planOutcome: number; // 计划支出
    planProfit: number; // 计划利润
    incomeFulfilledRate: number; // 营收目标完成率
    profitFulfilledRate: number; // 利润目标完成率
 */
const yearlyReportDetailForm = ref<
  business.IAuditableEntity<business.IYearlyBusinessReport>
>({
  year: "2021",
  income: 1000,
  outcome: 2000,
  profit: 1000,
  purchaseAmount: 1000,
  salesAmount: 2000,
  contractCount: 1000,
  contractFulfilledCount: 2000,
  riskContractCount: 1000,
  purchaseContractCount: 2000,
  salesContractCount: 1000,
  purchaseOrderCount: 2000,
  salesOrderCount: 1000,
  storage: [
    {
      warehouse: "仓库1",
      name: "产品1",
      amount: 1000,
    },
    {
      warehouse: "仓库2",
      name: "产品2",
      amount: 2000,
    },
    {
      warehouse: "在途",
      name: "产品3",
      amount: 3000,
    },
  ],
  settlementCount: 1000,
  settlementAmount: 2000,
  planIncome: 1000,
  planOutcome: 2000,
  planProfit: 1000,
  incomeFulfilledRate: 1000,
  profitFulfilledRate: 2000,
  createdAt: "",
  createdBy: "",
  updatedAt: "",
  updatedBy: "",
  dataFrom: "",
  audited: false,
});

const rules: Ref<GenericRecord> = ref({
  year: [{ required: true, message: "请输入年度", trigger: "blur" }],
  profit: [{ required: true, message: "请输入利润", trigger: "blur" }],
  revenue: [{ required: true, message: "请输入收入", trigger: "blur" }],
  cost: [{ required: true, message: "请输入成本", trigger: "blur" }],
});

const handleEdit = () => {
  console.log("handleEdit");
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

// snippet: ts-useManualRefHistory
const { history, commit, undo, redo } = useManualRefHistory(
  yearlyReportDetailForm,
  { clone: true }
);

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(yearlyReportDetailForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    yearlyReportDetailForm.value = value;
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
