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
                  <!-- 年、月、季、周、日 -->
                  <el-option
                    v-for="(value, key) in timeDimensionFtoBMap"
                    :key="key"
                    :label="key"
                    :value="value"
                  />
                </el-select>
                <span v-else>
                  {{
                    BMapFtoTimeDimension[
                      yearlyReportDetailForm.timeDimension as keyof typeof BMapFtoTimeDimension
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
            <!-- 业务维度 -->
            <el-col :span="8">
              <el-form-item label="业务板块" prop="businessDimension">
                <el-select
                  v-if="editing"
                  v-model="yearlyReportDetailForm.businessDimension"
                  placeholder="请选择报表反映的业务板块"
                >
                  <el-option
                    v-for="(value, key) in BusinessEnumMap"
                    :key="key"
                    :label="key"
                    :value="value"
                  />
                </el-select>
                <span v-else>
                  {{
                    BusinessEnumMap[yearlyReportDetailForm.businessDimension] ||
                    "未选择"
                  }}
                </span>
              </el-form-item>
            </el-col>
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
          <el-table
            :data="yearlyReportDetailForm.content"
            stripe
            border
            :scrollbar-always-on="true"
          >
            <el-table-column width="200" fixed="left">
              <template #header>
                <span>
                  具体产品
                  <span v-if="rules.profit" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'content.' + $index + '.profit'"
                  :rules="rules.product"
                >
                  <el-input v-if="editing" v-model="row.product" />
                  <span v-else>{{ row.product }}</span>
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
                  :prop="'content.' + $index + '.profit'"
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
                  :prop="'content.' + $index + '.income'"
                  :rules="rules.revenue"
                >
                  <el-input v-if="editing" v-model="row.income" type="number" />
                  <span v-else>{{ row.income }}</span>
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
                  :prop="'content.' + $index + '.outcome'"
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
                  当期采购金额(万元)
                  <span v-if="rules.purchaseAmount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'content.' + $index + '.purchaseAmount'"
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
                  当期销售金额(万元)
                  <span v-if="rules.salesAmount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'content.' + $index + '.salesAmount'"
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
            <el-table-column width="150">
              <template #header>
                <span>
                  累计签订合同数(份)
                  <span v-if="rules.contractCount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'content.' + $index + '.contractCount'"
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
                  :prop="'content.' + $index + '.contractFulfilledCount'"
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
                  :prop="'content.' + $index + '.riskContractCount'"
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
                  :prop="'content.' + $index + '.purchaseContractCount'"
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
                  :prop="'content.' + $index + '.salesContractCount'"
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
            <el-table-column width="150">
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
                  :prop="'content.' + $index + '.purchaseOrderCount'"
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
                  :prop="'content.' + $index + '.salesOrderCount'"
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
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  结算数量(吨)
                  <span v-if="rules.settlementCount" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'content.' + $index + '.settlementCount'"
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
                  :prop="'content.' + $index + '.settlementAmount'"
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
            <el-table-column width="150">
              <template #header>
                <span>
                  计划营收(万元)
                  <span v-if="rules.planIncome" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'content.' + $index + '.planIncome'"
                  :rules="rules.planIncome"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.planIncome"
                    type="number"
                  />
                  <span v-else>{{ row.planIncome }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  计划支出(万元)
                  <span v-if="rules.planOutcome" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'content.' + $index + '.planOutcome'"
                  :rules="rules.planOutcome"
                >
                  <el-input
                    v-if="editing"
                    v-model="row.planOutcome"
                    type="number"
                  />
                  <span v-else>{{ row.planOutcome }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #header>
                <span>
                  计划利润(万元)
                  <span v-if="rules.planProfit" class="text-red-5">*</span>
                </span>
              </template>
              <template v-slot="{ row, $index }">
                <el-form-item
                  :prop="'content.' + $index + '.planProfit'"
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
                  :prop="'content.' + $index + '.incomeFulfilledRate'"
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
                  :prop="'content.' + $index + '.profitFulfilledRate'"
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
    <!-- <div class="info-card-level1">
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
          <el-table :data="yearlyReportDetailForm.storage" stripe border>
            <el-table-column prop="warehouse" label="仓库">
              <template v-slot="{ row }">
                <el-input v-if="editing" v-model="row.warehouse" />
                <span v-else>{{ row.warehouse }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="产品名称">
              <template v-slot="{ row }">
                <el-input v-if="editing" v-model="row.name" />
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="产品数量">
              <template v-slot="{ row }">
                <el-input v-if="editing" v-model="row.amount" />
                <span v-else>{{ row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位">
              <template v-slot="{ row }">
                <el-input v-if="editing" v-model="row.unit" />
                <span v-else>{{ row.unit }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="editing"
              label="操作"
              fixed="right"
              width="100"
            >
              <template v-slot="{ row }">
                <el-link type="danger" @click="handleDelete(row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="w-full">
            <el-button
              v-if="editing"
              icon="plus"
              size="small"
              class="w-full g-button-1"
              @click="handleAddStorage"
            >
              新增
            </el-button>
          </div>
        </el-form>
      </div>
    </div> -->
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
import { useRoute } from "vue-router";
import { useManualRefHistory } from "@vueuse/core";
import { type FormInstance } from "element-plus";
import {
  timeDimensionFtoBMap,
  BMapFtoTimeDimension,
} from "@/enums/OptionLabelEnum";
import { BusinessEnumMap } from "@/enums/BusinessEnum";
import BusinessFormAPI from "@/api/businessForm";
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

const route = useRoute();
const formRef = ref<FormInstance | null>(null);
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
type YearlyReportDetailFormData =
  business.IAuditableEntity<business.IYearlyBusinessReport>;
const yearlyReportDetailForm: Ref<any> = ref({
  year: "2021",
  timeDimension: "年",
  businessDimension: "成品油",
  content: [
    {
      name: "成品油",
      profit: 1000,
      income: 1000,
      outcome: 2000,
      purchaseAmount: 1000,
      salesAmount: 2000,
      contractAmount: 1000,
      contractCount: 1000,
      contractFulfilledCount: 2000,
      riskContractCount: 1000,
      purchaseContractCount: 2000,
      salesContractCount: 1000,
      purchaseOrderCount: 2000,
      salesOrderCount: 1000,
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
    },
  ],
  createdAt: "",
  createdBy: "",
  updatedAt: "",
  updatedBy: "",
  dataFrom: "",
  audited: false,
});

const validateOn = ref(false);
const rules: Ref<GenericRecord> = ref({
  product: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
  year: [{ required: true, message: "请输入报表时间", trigger: "blur" }],
  profit: [{ required: true, message: "请输入利润", trigger: "blur" }],
  revenue: [{ required: true, message: "请输入收入", trigger: "blur" }],
  cost: [{ required: true, message: "请输入成本", trigger: "blur" }],
});

/** 新增库存信息 */
// const handleAddStorage = () => {
//   yearlyReportDetailForm.value.storage.push({
//     warehouse: "",
//     name: "",
//     amount: 0,
//     unit: "",
//   });
// };

/** 新增次级记录 */
const handleAddSubRecord = () => {
  yearlyReportDetailForm.value.content.push({
    name: "",
    product: "",
    profit: 0,
    income: 0,
    outcome: 0,
    purchaseAmount: 0,
    salesAmount: 0,
    contractCount: 0,
    contractFulfilledCount: 0,
    riskContractCount: 0,
    purchaseContractCount: 0,
    salesContractCount: 0,
    purchaseOrderCount: 0,
    salesOrderCount: 0,
    settlementCount: 0,
    settlementAmount: 0,
    planIncome: 0,
    planOutcome: 0,
    planProfit: 0,
    incomeFulfilledRate: 0,
    profitFulfilledRate: 0,
  });
};

/** 中文键值转为英文 */
const converter: (data: any) => YearlyReportDetailFormData = (data) => {
  const result = {} as YearlyReportDetailFormData;
  result.year = data["年度"];
  result.businessDimension = data["业务维度"];
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
  const index = yearlyReportDetailForm.value.storage.indexOf(row);
  if (index !== -1) {
    yearlyReportDetailForm.value.storage.splice(index, 1);
  }
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
    // name: "成品油",
    timeDimension: "年",
    businessDimension: "成品油",
    year: Math.floor(Math.random() * 10) + 2010 + "-01-01",
    content: [
      {
        name: "成品油",
        profit: Math.floor(Math.random() * 1000),
        income: Math.floor(Math.random() * 1000),
        outcome: Math.floor(Math.random() * 1000),
        purchaseAmount: Math.floor(Math.random() * 1000),
        salesAmount: Math.floor(Math.random() * 1000),
        contractCount: Math.floor(Math.random() * 1000),
        contractFulfilledCount: Math.floor(Math.random() * 1000),
        riskContractCount: Math.floor(Math.random() * 1000),
        purchaseContractCount: Math.floor(Math.random() * 1000),
        salesContractCount: Math.floor(Math.random() * 1000),
        purchaseOrderCount: Math.floor(Math.random() * 1000),
        salesOrderCount: Math.floor(Math.random() * 1000),
        settlementCount: Math.floor(Math.random() * 1000),
        settlementAmount: Math.floor(Math.random() * 1000),
        planIncome: Math.floor(Math.random() * 1000),
        planOutcome: Math.floor(Math.random() * 1000),
        planProfit: Math.floor(Math.random() * 1000),
        incomeFulfilledRate: Math.floor(Math.random() * 1000),
        profitFulfilledRate: Math.floor(Math.random() * 1000),
      },
    ],
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
    dataFrom: "",
    audited: false,
  };
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
    @apply m-0;
  }
  .el-form-item__content > .el-form-item__error {
    position: static !important;
  }
}
</style>
