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
    <!-- 校验模式开关 -->
    <!-- <el-switch
      v-if="editing"
      v-model="validateOn"
      active-text="校验"
      inactive-text="不校验"
      :active-value="true"
      :inactive-value="false"
      class="m-2"
    /> -->
    <div class="info-card-level1">
      <div class="__title">
        <span>报表维度</span>
      </div>
      <div class="__content">
        <el-form
          ref="formRef"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="yearlyReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="维度" prop="timeDimension">
                <el-select
                  v-if="editing"
                  v-model="yearlyReportDetailForm.timeDimension"
                  placeholder="请选择报表反映的时间维度"
                  @change="onChangeTimeDimension"
                >
                  <el-option
                    v-for="(value, key) in timeDimensionFtoBMap"
                    :key="key"
                    :label="key"
                    :value="value"
                  />
                </el-select>
                <span v-else>
                  {{
                    timeDimensionFtoBMap[
                      yearlyReportDetailForm.timeDimension
                    ] || "未选择"
                  }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间" prop="year">
                <template v-if="editing">
                  <el-date-picker
                    v-if="
                      editing && yearlyReportDetailForm.timeDimension === '年'
                    "
                    v-model="yearlyReportDetailForm.year"
                    style="width: 100%"
                    type="year"
                    value-format="YYYY-01-01"
                  />
                  <el-date-picker
                    v-else-if="
                      editing && yearlyReportDetailForm.timeDimension === '月'
                    "
                    v-model="yearlyReportDetailForm.year"
                    type="month"
                    style="width: 100%"
                    value-format="YYYY-MM-01"
                  />
                  <el-date-picker
                    v-else
                    v-model="yearlyReportDetailForm.year"
                    type="date"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </template>
                <span v-else>{{ yearlyReportDetailForm.year }}</span>
              </el-form-item>
            </el-col>
            <!-- 企业名称 -->
            <el-col :span="8">
              <el-form-item label="企业名称" prop="firmName">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.firmName"
                />
                <span v-else>{{ yearlyReportDetailForm.firmName || "-" }}</span>
              </el-form-item>
            </el-col>
            <!-- 数据日期 -->
            <!-- <el-col :span="8">
              <el-form-item label="数据日期" prop="year">
                <el-date-picker
                  v-if="editing"
                  v-model="yearlyReportDetailForm.year"
                  type="date"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                />
                <span v-else>{{ yearlyReportDetailForm.year || "-" }}</span>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>基本信息</span>
      </div>
      <div class="__content">
        <el-form
          ref="formRef"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="yearlyReportDetailForm"
        >
          <!-- <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="利润(万元)" prop="profit">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.profit"
                />
                <span v-else>{{ yearlyReportDetailForm.profit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收入(万元)" prop="income">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.income"
                />
                <span v-else>{{ yearlyReportDetailForm.income }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="支出(万元)" prop="outcome">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.outcome"
                />
                <span v-else>{{ yearlyReportDetailForm.outcome }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购金额(万元)" prop="purchaseAmount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.purchaseAmount"
                />
                <span v-else>{{ yearlyReportDetailForm.purchaseAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售金额(万元)" prop="salesAmount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.salesAmount"
                />
                <span v-else>{{ yearlyReportDetailForm.salesAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同数量(万元)" prop="contractCount">
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
              <el-form-item label="结算数量(吨)" prop="settlementCount">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.settlementCount"
                />
                <span v-else>{{ yearlyReportDetailForm.settlementCount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算金额(万元)" prop="settlementAmount">
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
              <el-form-item label="计划营收(万元)" prop="planIncome">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.planIncome"
                />
                <span v-else>{{ yearlyReportDetailForm.planIncome }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划支出(万元)" prop="planOutcome">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.planOutcome"
                />
                <span v-else>{{ yearlyReportDetailForm.planOutcome }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划利润(万元)" prop="planProfit">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.planProfit"
                />
                <span v-else>{{ yearlyReportDetailForm.planProfit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="营收目标完成率(%)"
                prop="incomeFulfilledRate"
              >
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
              <el-form-item
                label="利润目标完成率(%)"
                prop="profitFulfilledRate"
              >
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.profitFulfilledRate"
                />
                <span v-else>
                  {{ yearlyReportDetailForm.profitFulfilledRate }}
                </span>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- 以上数据改为表格形式，一行对应一个表单 -->
          <div class="mt-4 mb-4">
            <el-button @click="generateRandomTableData">生成测试数据</el-button>
          </div>
          <el-table
            :data="yearlyReportDetailForm.details"
            stripe
            border
            :scrollbar-always-on="true"
          >
            <el-table-column width="200" fixed="left">
              <template #header>
                <span>
                  业务板块
                  <span v-if="rules.businessType" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.profit'"
                  :rules="rules.businessType"
                >
                  <el-input v-if="editing" v-model="row.businessType" />
                  <span v-else>{{ row.businessType }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  当期利润(万元)
                  <span v-if="rules.profit" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.profit'"
                  :rules="rules.profit"
                >
                  <el-input v-if="editing" v-model="row.profit" type="number" />
                  <span v-else>{{ row.profit }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  当期营收(万元)
                  <span v-if="rules.revenue" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.revenue'"
                  :rules="rules.revenue"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.revenue"
                    type="number"
                  />
                  <span v-else>{{ row.revenue }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 累计营收金额 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  累计营收金额(万元)
                  <span v-if="rules.accumulatedRevenue" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.accumulatedRevenue'"
                  :rules="rules.accumulatedRevenue"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.accumulatedRevenue"
                    type="number"
                  />
                  <span v-else>{{ row.accumulatedRevenue }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 累计利润金额 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  累计利润金额(万元)
                  <span v-if="rules.accumulatedProfit" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.accumulatedProfit'"
                  :rules="rules.accumulatedProfit"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.accumulatedProfit"
                    type="number"
                  />
                  <span v-else>{{ row.accumulatedProfit }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 累计采购金额 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  累计采购金额(万元)
                  <span
                    v-if="rules.accumulatedPurchaseAmount"
                    class="text-red-5"
                  >
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.accumulatedPurchaseAmount'"
                  :rules="rules.accumulatedPurchaseAmount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.accumulatedPurchaseAmount"
                    type="number"
                  />
                  <span v-else>{{ row.accumulatedPurchaseAmount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 累计销售金额 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  累计销售金额(万元)
                  <span v-if="rules.accumulatedSalesAmount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.accumulatedSalesAmount'"
                  :rules="rules.accumulatedSalesAmount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.accumulatedSalesAmount"
                    type="number"
                  />
                  <span v-else>{{ row.accumulatedSalesAmount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 计划利润 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  计划利润(万元)
                  <span v-if="rules.planProfit" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.planProfit'"
                  :rules="rules.planProfit"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.planProfit"
                    type="number"
                  />
                  <span v-else>{{ row.planProfit }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 计划营收 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  计划营收(万元)
                  <span v-if="rules.planRevenue" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.planRevenue'"
                  :rules="rules.planRevenue"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.planRevenue"
                    type="number"
                  />
                  <span v-else>{{ row.planRevenue }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 营收完成率 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  营收完成率(%)
                  <span v-if="rules.incomeFulfilledRate" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.incomeFulfilledRate'"
                  :rules="rules.incomeFulfilledRate"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.incomeFulfilledRate"
                    type="number"
                  />
                  <span v-else>{{ row.incomeFulfilledRate }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 利润完成率 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  利润完成率(%)
                  <span v-if="rules.profitFulfilledRate" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.profitFulfilledRate'"
                  :rules="rules.profitFulfilledRate"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.profitFulfilledRate"
                    type="number"
                  />
                  <span v-else>{{ row.profitFulfilledRate }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column width="150">
              <template #header>
                <span>
                  支出(万元)
                  <span v-if="rules.cost" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.outcome'"
                  :rules="rules.cost"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.outcome"
                    type="number"
                  />
                  <span v-else>{{ row.outcome }}</span>
                </el-form-item>
              </template>
            </el-table-column> -->
            <el-table-column width="150">
              <template #header>
                <span>
                  当期采购量(吨)
                  <span v-if="rules.purchaseAmount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.purchaseCount'"
                  :rules="rules.purchaseCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.purchaseCount"
                    type="number"
                  />
                  <span v-else>{{ row.purchaseCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  当期采购金额(万元)
                  <span v-if="rules.purchaseAmount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.purchaseAmount'"
                  :rules="rules.purchaseAmount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.purchaseAmount"
                    type="number"
                  />
                  <span v-else>{{ row.purchaseAmount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  当期销售量(吨)
                  <span v-if="rules.salesCount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.salesCount'"
                  :rules="rules.salesCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.salesCount"
                    type="number"
                  />
                  <span v-else>{{ row.salesCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  当期销售金额(万元)
                  <span v-if="rules.salesAmount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.salesAmount'"
                  :rules="rules.salesAmount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.salesAmount"
                    type="number"
                  />
                  <span v-else>{{ row.salesAmount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 交易量 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  交易量(吨)
                  <span v-if="rules.bargain" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.bargain'"
                  :rules="rules.bargain"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.bargain"
                    type="number"
                  />
                  <span v-else>{{ row.bargain }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 库存量 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  库存量(吨)
                  <span v-if="rules.storage" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.storage'"
                  :rules="rules.storage"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.storage"
                    type="number"
                  />
                  <span v-else>{{ row.storage }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!--  -->
            <!-- 累计采购合同 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  累计采购合同数(份)
                  <span v-if="rules.purchaseContractCount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.purchaseContractCount'"
                  :rules="rules.purchaseContractCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.purchaseContractCount"
                    type="number"
                  />
                  <span v-else>{{ row.purchaseContractCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 已执行采购合同数 -->
            <el-table-column width="220">
              <template #header>
                <span>
                  已执行采购合同数(份)
                  <span
                    v-if="rules.purchaseContractFulfilledCount"
                    class="text-red-5"
                  >
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="
                    'details.' + $index + '.purchaseContractFulfilledCount'
                  "
                  :rules="rules.purchaseContractFulfilledCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.purchaseContractFulfilledCount"
                    type="number"
                  />
                  <span v-else>{{ row.purchaseContractFulfilledCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 累计销售合同 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  累计销售合同数(份)
                  <span v-if="rules.salesContractCount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.salesContractCount'"
                  :rules="rules.salesContractCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.salesContractCount"
                    type="number"
                  />
                  <span v-else>{{ row.salesContractCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 已执行销售合同数 -->
            <el-table-column width="200">
              <template #header>
                <span>
                  已执行销售合同数(份)
                  <span
                    v-if="rules.salesContractFulfilledCount"
                    class="text-red-5"
                  >
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.salesContractFulfilledCount'"
                  :rules="rules.salesContractFulfilledCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.salesContractFulfilledCount"
                    type="number"
                  />
                  <span v-else>{{ row.salesContractFulfilledCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 累计仓储合同 -->
            <el-table-column width="150">
              <template #header>
                <span>
                  累计仓储合同数(份)
                  <span v-if="rules.storageContractCount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.storageContractCount'"
                  :rules="rules.storageContractCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.storageContractCount"
                    type="number"
                  />
                  <span v-else>{{ row.storageContractCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  累计签订合同数(份)
                  <span v-if="rules.contractCount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.contractCount'"
                  :rules="rules.contractCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.contractCount"
                    type="number"
                  />
                  <span v-else>{{ row.contractCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  已履行合同数量(份)
                  <span v-if="rules.contractFulfilledCount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.contractFulfilledCount'"
                  :rules="rules.contractFulfilledCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.contractFulfilledCount"
                    type="number"
                  />
                  <span v-else>{{ row.contractFulfilledCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  风险合同数量(份)
                  <span v-if="rules.riskContractCount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.riskContractCount'"
                  :rules="rules.riskContractCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.riskContractCount"
                    type="number"
                  />
                  <span v-else>{{ row.riskContractCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  采购合同数量(份)
                  <span v-if="rules.purchaseContractCount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.purchaseContractCount'"
                  :rules="rules.purchaseContractCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.purchaseContractCount"
                    type="number"
                  />
                  <span v-else>{{ row.purchaseContractCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  销售合同数量(份)
                  <span v-if="rules.salesContractCount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.salesContractCount'"
                  :rules="rules.salesContractCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.salesContractCount"
                    type="number"
                  />
                  <span v-else>{{ row.salesContractCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column width="150">
              <template #header>
                <span>
                  采购订单数量(份)
                  <span v-if="rules.purchaseOrderCount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.purchaseOrderCount'"
                  :rules="rules.purchaseOrderCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.purchaseOrderCount"
                    type="number"
                  />
                  <span v-else>{{ row.purchaseOrderCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  销售订单数量(份)
                  <span v-if="rules.salesOrderCount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.salesOrderCount'"
                  :rules="rules.salesOrderCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.salesOrderCount"
                    type="number"
                  />
                  <span v-else>{{ row.salesOrderCount }}</span>
                </el-form-item>
              </template>
            </el-table-column> -->
            <el-table-column width="150">
              <template #header>
                <span>
                  结算数量(吨)
                  <span v-if="rules.settlementCount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.settlementCount'"
                  :rules="rules.settlementCount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.settlementCount"
                    type="number"
                  />
                  <span v-else>{{ row.settlementCount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  结算金额(万元)
                  <span v-if="rules.settlementAmount" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.settlementAmount'"
                  :rules="rules.settlementAmount"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.settlementAmount"
                    type="number"
                  />
                  <span v-else>{{ row.settlementAmount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column width="150">
              <template #header>
                <span>
                  计划利润(万元)
                  <span v-if="rules.planProfit" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.planProfit'"
                  :rules="rules.planProfit"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.planProfit"
                    type="number"
                  />
                  <span v-else>{{ row.planProfit }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  营收目标完成率(%)
                  <span v-if="rules.incomeFulfilledRate" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.incomeFulfilledRate'"
                  :rules="rules.incomeFulfilledRate"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.incomeFulfilledRate"
                    type="number"
                  />
                  <span v-else>{{ row.incomeFulfilledRate }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  利润目标完成率(%)
                  <span v-if="rules.profitFulfilledRate" class="text-red-5">
                    *
                  </span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'details.' + $index + '.profitFulfilledRate'"
                  :rules="rules.profitFulfilledRate"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.profitFulfilledRate"
                    type="number"
                  />
                  <span v-else>{{ row.profitFulfilledRate }}</span>
                </el-form-item>
              </template>
            </el-table-column> -->
          </el-table>
        </el-form>
        <div class="w-full">
          <el-button
            v-if="editing"
            icon="plus"
            size="small"
            class="w-full g-button-1"
            @click="handleAddSubRecord"
          >
            新增
          </el-button>
        </div>
      </div>
    </div>
    <div v-if="!editing" class="info-card-level1">
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
                <span>{{ yearlyReportDetailForm.audited ? "是" : "否" }}</span>
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
import { useRoute } from "vue-router";
import { useManualRefHistory } from "@vueuse/core";
import { type FormInstance } from "element-plus";
import { timeDimensionFtoBMap } from "@/enums/OptionLabelEnum";
import { BusinessEnumMap } from "@/enums/BusinessEnum";
import datePickerPlus from "@/components/ElBasicPlus/datePicker.vue";
import sassvariables from "@/styles/variables.module.scss";
import BusinessFormAPI from "@/api/businessForm";
import business from "@/types/business";
import Data from "@/views/system/dict/data.vue";

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

const route = useRoute();
const formRef = ref<FormInstance | null>(null);
const { id, editing } = toRefs(props);

/**
 * @description 年度经营报表详情数据
 * {
 *   businessType: ""
 * }
 */

type YearlyReportDetailFormData = business.IAuditableEntity<any>;
const yearlyReportDetailForm = ref({
  /** */
  name: "永盛石化", // 企业名称
  year: undefined, // 数据日期
  timeDimension: "年",
  firmName: "", // 企业名称
  firmType: "", // 企业类型,
  details: Object.keys(BusinessEnumMap).map((key) => ({
    businessType: key, // 业态类型
    dataDate: undefined, // 数据日期,
    storage: 0, // 库存量
    bargain: 0, // 交易量
    profit: 0, // 当期利润
    revenue: 0, // 当期营业收入
    planProfit: 0, // 当期计划利润
    planRevenue: 0, // 当期计划营业收入
    purchaseCount: 0, // 当期采购量
    purchaseAmount: 0, // 当期采购金额
    salesCount: 0, // 当期销售量
    salesAmount: 0, // 当期销售金额
    /** 累计营收金额 */
    accumulatedRevenue: 0,
    /** 累计利润 */
    accumulatedProfit: 0,
    /** 累计采购金额 */
    accumulatedPurchaseAmount: 0,
    /** 累计销售金额 */
    accumulatedSalesAmount: 0,
    /**当期结算金额 */
    settlementAmount: 0,
    /**当期结算数量 */
    settlementCount: 0,
    yearlyPlanProfit: 0, // 年度计划利润
    yearlyPlanRevenue: 0, // 年度计划营业收入
    /**当年累计合同数 */
    contractCount: 0,
    /** 当年累计合同履行金额 */
    contractFulfilledAmount: 0,
    /**当年累计已履行合同数 */
    contractFulfilledCount: 0,
    /** 当年已履行采购合同数 */
    purchaseContractFulfilledCount: 0,
    /** 当年已履行销售合同数 */
    salesContractFulfilledCount: 0,
    /**当年累计风险合同数 */
    riskContractCount: 0,
    /**当年累计采购合同数 */
    purchaseContractCount: 0,
    /**当年累计销售合同数 */
    salesContractCount: 0,
    /**当年累计仓储合同数 */
    storageContractCount: 0,
    /**当年累计其他合同数 */
    otherContractCount: 0,
    /** 当年累计营收完成率 */
    incomeFulfilledRate: 0,
    /** 当年累计利润完成率 */
    profitFulfilledRate: 0,
  })),
  createdAt: "",
  createdBy: "",
  updatedAt: "",
  updatedBy: "",
  dataFrom: "",
  audited: false,
});

const realForm: Ref<any> = ref({
  // 报表类型(年、月)
  reportType: "year",
  // 数据日期
  dataDate: "",
  /** 总体指标 */
  // 当期利润
  profit: 0,
  // 当年累计利润(月度表)
  cumulativeProfit: 0,
  // 当期利润较上期增减
  profitIncrease: 0,
  // 当期利润环比涨幅
  profitIncreaseRate: 0,
  // 累计利润较上年增减
  cumulativeProfitIncrease: 0,
  // 累计利润同比增长率
  cumulativeProfitIncreaseRate: 0,
  // 当期(累计)利润目标完成率
  profitFulfilledRate: 0,
  // 当期(累计)营收目标完成率
  incomeFulfilledRate: 0,
  // 当期营业收入
  revenue: 0,
  // 当年累计营业收入(月度表)
  cumulativeRevenue: 0,
  // 当期营业收入较上期增减
  revenueIncrease: 0,
  // 当期营业收入环比涨幅
  revenueIncreaseRate: 0,
  // 累计营业收入较上年增减
  cumulativeRevenueIncrease: 0,
  // 累计营业收入同比增长率
  cumulativeRevenueIncreaseRate: 0,
  // 期间费用和税金及附加
  expenses: 0,
  // 期间费用和税金及附加较上期增减
  expensesIncrease: 0,
  /** 经营成果 */
  // 当期销售量
  salesVolume: 0,
  // 当年累计销售量(月度表)
  cumulativeSalesVolume: 0,
  // 当期销售量较上期增减
  salesVolumeIncrease: 0,
  // 当期销售量环比涨幅
  salesVolumeIncreaseRate: 0,
  // 累计销售量较上年增减
  cumulativeSalesVolumeIncrease: 0,
  // 累计销售量同比增长率
  cumulativeSalesVolumeIncreaseRate: 0,
  // 当期固定成本总额
  fixedCost: 0,
  // 当期固定成本同比
  fixedCostIncrease: 0,
  // 当期固定成本环比
  fixedCostIncreaseRate: 0,
  // 累计固定成本总额
  cumulativeFixedCost: 0,
  // 累计固定成本同比
  cumulativeFixedCostIncrease: 0,
  // 累计固定成本环比
  cumulativeFixedCostIncreaseRate: 0,
  /** 分业务 */
  subBusiness: [
    {
      // 业务名称
      name: "",
      // 当期利润
      profit: 0,
      // 当年累计利润(月度表)
      cumulativeProfit: 0,
      // 当期利润较上期增减
      profitIncrease: 0,
      // 当期利润环比涨幅
      profitIncreaseRate: 0,
      // 累计利润较上年增减
      cumulativeProfitIncrease: 0,
      // 累计利润同比增长率
      cumulativeProfitIncreaseRate: 0,
      // 当期营业收入
      revenue: 0,
      // 当年累计营业收入(月度表)
      cumulativeRevenue: 0,
      // 当期营业收入较上期增减
      revenueIncrease: 0,
      // 当期营业收入环比涨幅
      revenueIncreaseRate: 0,
      // 累计营业收入较上年增减
      cumulativeRevenueIncrease: 0,
      // 累计营业收入同比增长率
      cumulativeRevenueIncreaseRate: 0,
      // 当期销售均价
      averagePrice: 0,
      // 销售均价较上期增减
      averagePriceIncrease: 0,
      // 销售均价环比涨幅
      averagePriceIncreaseRate: 0,
      // 当期销售量
      salesVolume: 0,
      // 当年累计销售量(月度表)
      cumulativeSalesVolume: 0,
    },
  ],
  // 成本总额
  cost: 0,
  // 年度累计成本(月度表)
  cumulativeCost: 0,
  /** 产品生产指标情况 */
  purchases: [
    {
      /** 具体商品 */
      name: "",
      /** 当期采购量 */
      purchaseVolume: 0,
      /** 当期采购均价 */
      purchaseAveragePrice: 0,
      /** 当期采购量较上期增减 */
      purchaseVolumeIncrease: 0,
      /** 当期采购均价较上期增减 */
      purchaseAveragePriceIncrease: 0,
      /** 当期采购量环比涨幅 */
      purchaseVolumeIncreaseRate: 0,
      /** 当期采购均价环比涨幅 */
      purchaseAveragePriceIncreaseRate: 0,
      /** 累计采购量 */
      cumulativePurchaseVolume: 0,
      /** 累计采购均价 */
      cumulativePurchaseAveragePrice: 0,
      /** 累计采购量较上年增减 */
      cumulativePurchaseVolumeIncrease: 0,
      /** 累计采购均价较上年增减 */
      cumulativePurchaseAveragePriceIncrease: 0,
      /** 累计采购量同比增长率 */
      cumulativePurchaseVolumeIncreaseRate: 0,
      /** 累计采购均价同比增长率 */
      cumulativePurchaseAveragePriceIncreaseRate: 0,
    },
  ],
  /** 销售指标情况 */
  sales: [
    {
      /** 具体商品 */
      name: "",
      /** 当期销售量 */
      salesVolume: 0,
      /** 当期销售均价 */
      salesAveragePrice: 0,
      /** 当期销售量较上期增减 */
      salesVolumeIncrease: 0,
      /** 当期销售均价较上期增减 */
      salesAveragePriceIncrease: 0,
      /** 当期销售量环比涨幅 */
      salesVolumeIncreaseRate: 0,
      /** 当期销售均价环比涨幅 */
      salesAveragePriceIncreaseRate: 0,
      /** 累计销售量 */
      cumulativeSalesVolume: 0,
      /** 累计销售均价 */
      cumulativeSalesAveragePrice: 0,
      /** 累计销售量较上年增减 */
      cumulativeSalesVolumeIncrease: 0,
      /** 累计销售均价较上年增减 */
      cumulativeSalesAveragePriceIncrease: 0,
      /** 累计销售量同比增长率 */
      cumulativeSalesVolumeIncreaseRate: 0,
      /** 累计销售均价同比增长率 */
      cumulativeSalesAveragePriceIncreaseRate: 0,
    },
  ],
});

const handleAddSubRecord = () => {
  yearlyReportDetailForm.value.details.push({
    businessType: "",
    timeDimension: "",
    dataDate: "",
    storage: 0,
    bargain: 0,
    profit: 0,
    revenue: 0,
    planProfit: 0,
    planRevenue: 0,
    purchaseCount: 0,
    purchaseAmount: 0,
    salesCount: 0,
    salesAmount: 0,
    settlementAmount: 0,
    settlementCount: 0,
    yearlyPlanProfit: 0,
    yearlyPlanRevenue: 0,
    contractCount: 0,
    contractFulfilledAmount: 0,
    contractFulfilledCount: 0,
    riskContractCount: 0,
    purchaseContractCount: 0,
    salesContractCount: 0,
    storageContractCount: 0,
    otherContractCount: 0,
    incomeFulfilledRate: 0,
    profitFulfilledRate: 0,
  });
};

const validateOn = ref(false);
const rules: Ref<GenericRecord> = ref({
  year: [{ required: true, message: "请输入年度", trigger: "blur" }],
  profit: [{ required: true, message: "请输入利润", trigger: "blur" }],
  businessType: [
    { required: true, message: "请输入业务板块", trigger: "blur" },
  ],
  revenue: [{ required: true, message: "请输入收入", trigger: "blur" }],
  cost: [{ required: true, message: "请输入成本", trigger: "blur" }],
});

/** 中文键值转为英文 */
const converter: (data: any) => YearlyReportDetailFormData = (data) => {
  const result = {} as YearlyReportDetailFormData;
  result.name = data["企业名称"];
  result.year = data["年度"];
  result.timeDimension = data["类型"];
  // result.businessDimension = data["业务维度"];
  result.profit = data["利润金额"];
  result.income = data["营收金额"];
  result.purchaseAmount = data["采购金额"];
  result.salesAmount = data["销售金额"];
  result.purchaseContractCount = data["采购合同数"];
  result.salesContractCount = data["销售合同数"];
  result.contractCount = data["合同总份数"];
  result.contractAmount = data["合同总金额"];
  result.purchaseOrderCount = data["采购合同份数"];
  result.salesOrderCount = data["销售合同份数"];
  result.contractFulfilledCount = data["合同履行数"];
  result.riskContractCount = data["风险合同数"];
  result.storage = data["库存量"];
  result.settlementAmount = data["结算金额"];
  result.settlementCount = data["结算数量"];
  result.planIncome = data["计划营收"];
  result.planProfit = data["计划利润"];
  result.incomeFulfilledRate = data["营收目标完成率"];
  result.profitFulfilledRate = data["利润目标完成率"];
  result.createdAt = data["创建时间"];
  result.createdBy = data["创建人"];
  result.updatedAt = data["更新时间"];
  result.updatedBy = data["更新人"];
  result.dataFrom = data["数据来源"];
  result.audited = data["是否审核"];
  return result;
};

const addStorage = () => {
  yearlyReportDetailForm.value.storage.push({
    warehouse: "",
    name: "",
    amount: 0,
    unit: "",
  });
};

const initForm = (formData: any) => {
  // console.log("initForm", formData);
  yearlyReportDetailForm.value = converter(formData);
};

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

const handleDelete = (row: any) => {
  yearlyReportDetailForm.value.storage =
    yearlyReportDetailForm.value.storage.filter((item) => item !== row);
};

/** 如果改变了时间维度则重置时间 */
const onChangeTimeDimension = (value: string) => {
  yearlyReportDetailForm.value.year = undefined;
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
const validateForm = () => {
  return formRef.value?.validate();
};
const getFormValue = () => {
  // 先校验
  return unref(yearlyReportDetailForm);
};
const setFormValue = (value: any) => {
  if (value) {
    saveForm();
    yearlyReportDetailForm.value = value;
  }
};

const generateRandomData = () => {
  yearlyReportDetailForm.value = {
    // 随机生成数据
    name: "永盛石化",
    year: Math.floor(Math.random() * 10) + 2010 + "-01-01",
    income: Math.floor(Math.random() * 1000) + 1000,
    outcome: Math.floor(Math.random() * 1000) + 1000,
    profit: Math.floor(Math.random() * 1000) + 1000,
    purchaseAmount: Math.floor(Math.random() * 1000) + 1000,
    salesAmount: 2000,
    contractCount: 1000,
    contractFulfilledCount: 2000,
    riskContractCount: 1000,
    purchaseContractCount: 2000,
    salesContractCount: 1000,
    purchaseOrderCount: 2000,
    salesOrderCount: 1000,
    storage: [],
    // storage: [
    //   {
    //     warehouse: "仓库1",
    //     name: "产品1",
    //     amount: 1000,
    //     unit: "吨",
    //   },
    //   {
    //     warehouse: "仓库2",
    //     name: "产品2",
    //     amount: 2000,
    //     unit: "吨",
    //   },
    //   {
    //     warehouse: "在途",
    //     name: "产品3",
    //     amount: 3000,
    //     unit: "吨",
    //   },
    // ],
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
  };
};

/**
 * 生成随机表格数据
 */
const generateRandomTableData = () => {
  yearlyReportDetailForm.value.details.forEach((item) => {
    item.dataDate = Math.floor(Math.random() * 10) + 2010 + "-01-01";
    item.storage = Math.floor(Math.random() * 1000) + 1000;
    item.bargain = Math.floor(Math.random() * 1000) + 1000;
    item.profit = Math.floor(Math.random() * 1000) + 1000;
    item.revenue = Math.floor(Math.random() * 1000) + 1000;
    item.planProfit = Math.floor(Math.random() * 1000) + 1000;
    item.planRevenue = Math.floor(Math.random() * 1000) + 1000;
    item.purchaseCount = Math.floor(Math.random() * 1000) + 1000;
    item.purchaseAmount = Math.floor(Math.random() * 1000) + 1000;
    item.salesCount = Math.floor(Math.random() * 1000) + 1000;
    item.salesAmount = Math.floor(Math.random() * 1000) + 1000;
    item.settlementAmount = Math.floor(Math.random() * 1000) + 1000;
    item.settlementCount = Math.floor(Math.random() * 1000) + 1000;
    item.yearlyPlanProfit = Math.floor(Math.random() * 1000) + 1000;
    item.yearlyPlanRevenue = Math.floor(Math.random() * 1000) + 1000;
    item.contractCount = Math.floor(Math.random() * 1000) + 1000;
    item.contractFulfilledAmount = Math.floor(Math.random() * 1000) + 1000;
    item.contractFulfilledCount = Math.floor(Math.random() * 1000) + 1000;
    item.purchaseContractFulfilledCount =
      Math.floor(Math.random() * 1000) + 1000;
    item.salesContractFulfilledCount = Math.floor(Math.random() * 1000) + 1000;
    item.riskContractCount = Math.floor(Math.random() * 1000) + 1000;
    item.purchaseContractCount = Math.floor(Math.random() * 1000) + 1000;
    item.salesContractCount = Math.floor(Math.random() * 1000) + 1000;
    item.storageContractCount = Math.floor(Math.random() * 1000) + 1000;
    item.otherContractCount = Math.floor(Math.random() * 1000) + 1000;
    item.incomeFulfilledRate = Math.floor(Math.random() * 100);
    item.profitFulfilledRate = Math.floor(Math.random() * 100);
  });
};

defineExpose({
  saveForm,
  restoreForm,
  validateForm,
  getFormValue,
  setFormValue,
  generateRandomData,
});

onMounted(() => {
  // if (route.query.id) {
  //   // 根据id获取数据
  //   BusinessFormAPI.getBusinessReportForm(route.query.id as string).then(
  //     (data) => {
  //       initForm(data);
  //     }
  //   );
  // }
});
</script>

<style lang="scss" scoped>
:deep(.el-table__cell) {
  .el-form-item {
    margin: 0;
  }
  .el-form-item__content > .el-form-item__error {
    position: static !important;
  }
}
</style>
