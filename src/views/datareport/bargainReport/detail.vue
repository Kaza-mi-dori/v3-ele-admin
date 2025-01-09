<!-- 企业概况报表-->
<template>
  <div class="main-wrapper">
    <div class="info-card-level1">
      <div class="__title">
        <span>基础信息</span>
      </div>
      <div class="__content">
        <el-form
          ref="formRef"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="firmReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="数据日期" prop="year">
                <el-date-picker
                  v-if="editing"
                  v-model="firmReportDetailForm.year"
                  value-format="YYYY-MM-DD"
                  placeholder="选择数据日期"
                />
                <span v-else>
                  {{ firmReportDetailForm.year.substring(0, 10) }}
                </span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="企业名称" prop="year">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.name"
                  placeholder="请输入企业名称"
                />
                <span v-else>{{ firmReportDetailForm.name }}</span>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>报表内容</span>
      </div>
      <div class="__content">
        <div class="mb-4">
          <el-button
            icon="ArrowDown"
            :disabled="!editing"
            @click="onImportExcel"
          >
            从Excel导入
          </el-button>
        </div>
        <!-- <ExcelLikeTable
          type="limited"
          :inputItemDefsByRow="inputItemDefsByRow"
          needSummary
          :cols-def="columnDefs"
          :editing="editing"
          :headers="extraHeaders"
        /> -->
        <el-table
          v-if="tableData.length > 0"
          :header-cell-style="() => ({ textAlign: 'center' })"
          :data="tableData"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          border
          style="width: 100%"
          row-key="名称"
          default-expand-all
          stripe
        >
          <!-- 名称 -->
          <el-table-column
            label="名称"
            prop="名称"
            width="100"
            align="center"
          />
          <!-- 固定成本 -->
          <el-table-column
            label="全年预测固定成本"
            prop="全年预测固定成本"
            width="150"
            align="center"
          >
            <template v-slot="{ row }">
              <el-input
                v-if="editing"
                v-model="row['全年预测固定成本']"
                type="number"
                placeholder="请输入全年预测固定成本"
              />
              <span v-else>
                {{
                  row["全年预测固定成本"]
                    ? parseFloat(row["全年预测固定成本"]).toFixed(2)
                    : "-"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(unit, key) of tableData[0].数据"
            :key="key"
            :label="unit['类型']"
          >
            <el-table-column label="报告日" prop="报告日" width="120">
              <template v-slot="{ row }">
                <el-input
                  v-if="editing"
                  v-model="row['数据'][key]['报告日']"
                  type="number"
                  placeholder="请输入报告日"
                />
                <span v-else>
                  {{
                    row["数据"][key] && row["数据"][key]["报告日"]
                      ? parseFloat(row["数据"][key]["报告日"]).toFixed(2)
                      : "-"
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="月累计" prop="月累计" width="120">
              <template v-slot="{ row }">
                <el-input
                  v-if="editing"
                  v-model="row['数据'][key]['月累计']"
                  type="number"
                  placeholder="请输入月累计"
                />
                <span v-else>
                  {{
                    row["数据"][key] && row["数据"][key]["月累计"]
                      ? parseFloat(row["数据"][key]["月累计"]).toFixed(2)
                      : "-"
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="年累计" prop="年累计" width="120">
              <template v-slot="{ row }">
                <el-input
                  v-if="editing"
                  v-model="row['数据'][key]['年累计']"
                  type="number"
                  placeholder="请输入年累计"
                />
                <span v-else>
                  {{
                    row["数据"][key] && row["数据"][key]["年累计"]
                      ? parseFloat(row["数据"][key]["年累计"]).toFixed(2)
                      : "-"
                  }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>附件信息</span>
      </div>
      <div class="__content">
        <div class="flex mb-4 items-center">
          <el-checkbox v-model="allSelected" style="margin-right: 20px">
            全选
          </el-checkbox>
          <el-button>下载</el-button>
          <el-button v-if="editing" type="danger">删除</el-button>
        </div>
        <upload
          :disabled="!editing"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="firmReportDetailForm.attachment"
        />
      </div>
    </div>
    <div v-if="!editing" class="info-card-level1">
      <div class="__title">
        <span>维护信息</span>
      </div>
    </div>
    <ImportExcelDialog
      ref="importExcelDialogRef"
      :upload-url="uploadExcelUrl"
      :upload-name="'Excel文件'"
      @import-success="importSuccess"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import upload from "@/components/ElBasicPlus/upload.vue";
import pdfPNG from "@/assets/icons/pdf.png";
import ExcelPNG from "@/assets/icons/excel.png";
import WordPNG from "@/assets/icons/WORD.png";
import ZipSVG from "@/assets/icons/zip.svg";
import ImportExcelDialog from "./importExcelDialog.vue";
import ExcelLikeTable, {
  type ColumnDef,
  type rowDef,
} from "@/components/CustomComponent/ExcelLikeTable/index.vue";

import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { FormInstance } from "element-plus";
import { add, update } from "@/api/datasource/bargainForm";

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
const formRef = ref<Nullable<FormInstance>>(null);
const importExcelDialogRef =
  ref<Nullable<InstanceType<typeof ImportExcelDialog>>>(null);
const uploadExcelUrl =
  import.meta.env.VITE_APP_API_URL_DEV +
  "/Api/Business/TradeTracking/ReadFromSpecialExcel";

const firmReportDetailForm = ref({
  name: "广投石化",
  year: "2024-01-01",
  content: undefined,
  attachment: [],
});

const rules: Ref<GenericRecord> = ref({
  name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
  year: [{ required: true, message: "请选择年份", trigger: "blur" }],
});

const allSelected = ref(false);

const editButtonVisible = ref(false); // 是否显示编辑开关, 应与用户权限结合

const editable = ref(false);

const isEditing = ref(false); // 是否正在编辑

const tableData = ref<any[]>([
  {
    名称: "广投石化",
    全年预测固定成本: 0,
    数据: [
      {
        类型: "采购量",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "采购价",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "库存量",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "库存平均价",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "销售量",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "销售价",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "单位变动成本",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "单位边际效益",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "总边际效益",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
    ],
    children: [
      {
        名称: "成品油",
        全年预测固定成本: 0,
        数据: [
          {
            类型: "采购量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "采购价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存平均价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位变动成本",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "总边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
        ],
      },
      {
        名称: "化工",
        全年预测固定成本: 0,
        数据: [
          {
            类型: "采购量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "采购价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存平均价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位变动成本",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "总边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
        ],
      },
      {
        名称: "原油",
        全年预测固定成本: 0,
        数据: [
          {
            类型: "采购量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "采购价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存平均价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位变动成本",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "总边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
        ],
      },
      {
        名称: "化学原料",
        全年预测固定成本: 0,
        数据: [
          {
            类型: "采购量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "采购价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存平均价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位变动成本",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "总边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
        ],
      },
    ],
  },
  {
    名称: "永盛公司",
    全年预测固定成本: 0,
    数据: [
      {
        类型: "采购量",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "采购价",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "库存量",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "库存平均价",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "销售量",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "销售价",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "单位变动成本",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "单位边际效益",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
      {
        类型: "总边际效益",
        报告日: 0,
        月累计: 0,
        年累计: 0,
      },
    ],
    children: [
      {
        名称: "成品油",
        全年预测固定成本: 0,
        数据: [
          {
            类型: "采购量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "采购价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存平均价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位变动成本",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "总边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
        ],
      },
      {
        名称: "化工",
        全年预测固定成本: 0,
        数据: [
          {
            类型: "采购量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "采购价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "库存平均价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售量",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "销售价",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位变动成本",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "单位边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
          {
            类型: "总边际效益",
            报告日: 0,
            月累计: 0,
            年累计: 0,
          },
        ],
      },
    ],
  },
]);

/** 列定义 */
// 列定义实例
const columnDefs = ref<ColumnDef[]>([
  {
    name: "全年预测固定成本(万元)",
    prop: "fixedCost",
    order: 2,
    editable: true,
    computed: false,
    default: 0,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "贸易品类",
    prop: "tradeCategory",
    order: 3,
    editable: true,
    computed: false,
    default: "成品油化工",
    computeType: "",
    computeFormula: "",
    summaryType: "same",
    isNumber: false,
    inputType: "select",
    options: ["成品油化工"],
    selectType: "single",
  },
  {
    name: "报告日",
    prop: "purchaseDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "purchaseMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "purchaseYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "报告日",
    prop: "purchasePriceDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "purchasePriceMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "purchasePriceYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "报告日",
    prop: "stockDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "stockMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "stockYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "报告日",
    prop: "stockPriceDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "stockPriceMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "stockPriceYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "报告日",
    prop: "saleDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "saleMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "saleYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "报告日",
    prop: "salePriceDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "salePriceMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "salePriceYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "报告日",
    prop: "unitCostDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "unitCostMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "unitCostYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "报告日",
    prop: "unitMarginDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "unitMarginMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "unitMarginYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "报告日",
    prop: "totalMarginDaily",
    order: 4,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "totalMarginMonthly",
    order: 5,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "totalMarginYearly",
    order: 6,
    default: 0,
    editable: true,
    computed: false,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本月当月累计",
    prop: "totalFixedCostMonthly",
    order: 2,
    editable: true,
    computed: false,
    default: 0,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "totalFixedCostYearly",
    order: 3,
    editable: true,
    computed: false,
    default: 0,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "当月累计",
    prop: "totalProfitMonthly",
    order: 4,
    editable: true,
    computed: false,
    default: 0,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
  {
    name: "本年累计",
    prop: "totalProfitYearly",
    order: 5,
    editable: true,
    computed: false,
    default: 0,
    computeType: "",
    computeFormula: "",
    summaryType: "sum",
    isNumber: true,
  },
]);

// 额外的表头
const extraHeaders = [
  [
    {
      title: "统计口径",
      colspan: 4,
    },
    {
      title: "采购量(万吨)",
      colspan: 3,
    },
    {
      title: "采购价(含税)(元/吨)",
      colspan: 3,
    },
    {
      title: "库存量(万吨)",
      colspan: 3,
    },
    {
      title: "库存平均价(含税)(元/吨)",
      colspan: 3,
    },
    {
      title: "销售量(万吨)",
      colspan: 3,
    },
    {
      title: "销售价(含税)(元/吨)",
      colspan: 3,
    },
    {
      title: "单位变动成本(元/吨)",
      colspan: 3,
    },
    {
      title: "单位边际效益(元/吨)",
      colspan: 3,
    },
    {
      title: "总边际效益(万元)",
      colspan: 3,
    },
    {
      title: "累计固定成本(万元)",
      colspan: 2,
    },
    {
      title: "企业总利润(万元)",
      colspan: 2,
    },
  ],
];

/** 行头的配置 */
const inputItemDefs = ref([
  {
    name: "广投石化",
    unit: "万元",
    children: [
      {
        name: "成品油",
        unit: "万元",
      },
      {
        name: "原油",
        unit: "万元",
      },
      {
        name: "化工",
        unit: "万元",
      },
      {
        name: "化学原料",
        unit: "万元",
      },
      {
        name: "煤",
        unit: "万元",
      },
    ],
  },
  {
    name: "永盛公司",
    unit: "万元",
    children: [
      {
        name: "成品油",
        unit: "万元",
      },
      {
        name: "化工",
        unit: "万元",
      },
    ],
  },
]);

/** 配置转换为以行为单位的方便遍历的格式 */
const inputItemDefsByRow = computed(() => {
  const rows: any[] = [];
  inputItemDefs.value.forEach((item) => {
    if (item.children) {
      item.children.forEach((child, index) => {
        rows.push({
          isFirstChild: index === 0,
          parent: item.name,
          childrenCount: item.children.length,
          names: [item.name, child.name],
          unit: child.unit,
        });
      });
    } else {
      rows.push({
        names: [item.name],
        unit: item.unit,
      });
    }
  });
  return rows;
});

function onImportExcel() {
  importExcelDialogRef.value?.open();
}

function converImportedDataToSubmitData(data: any): any {
  console.log("data", data);
}

/**
 * 将表格数据转换为后端格式
 * 由于表格已经转换为了树形结构，要将内层的数据放出来
 * @param data 表格数据
 * @returns
 */
function getTransferredData(): any {
  const result: any[] = [];
  for (const item of tableData.value) {
    result.push(item);
    if (item.children) {
      item.children.forEach((child: any) => {
        result.push(child);
      });
    }
  }
  return result;
}

/**
 * 将后端数据转换为表格格式
 * @param data
 * @returns
 */
function transferDataToTree(list: any): any {
  console.log("开始转换", list);
  if (Array.isArray(list)) {
    const parentNodeNames = ["广投石化", "永盛公司"];
    // 找出父节点的位置，假定顺序严格按照父1-子11-子12-父2-子21-子22
    const parentIndexs = list
      .map((item, index) => (parentNodeNames.includes(item.名称) ? index : -1))
      .filter((index) => index !== -1);
    // 生成树形结构
    const treeData: any[] = [];
    parentIndexs.forEach((parentIndex, index) => {
      const result = {
        名称: list[parentIndex].名称,
        全年预测固定成本: list[parentIndex].全年预测固定成本,
        数据: list[parentIndex].数据,
        children: [] as any[],
      };
      const children = list.slice(parentIndex + 1, parentIndexs[index + 1]);
      result.children = children.map((child) => {
        // 将父节点中数据字段有的key，复制到子节点中
        const keys = ["报告日", "月累计", "年累计"];
        if (child.数据) {
          keys.forEach((key) => {
            child.数据.forEach((item: any) => {
              item[key] = item[key] || undefined;
            });
            // 如果发现child.数据长度小于父节点，则需要补充到父节点长度
            if (child.数据.length < list[parentIndex].数据.length) {
              const len = list[parentIndex].数据.length - child.数据.length;
              const originalLength = child.数据.length;
              for (let i = 0; i < len; i++) {
                child.数据.push({
                  类型: list[parentIndex].数据[i + originalLength].类型,
                  报告日: undefined,
                  月累计: undefined,
                  年累计: undefined,
                });
              }
            }
          });
        }
        return {
          名称: child.名称,
          全年预测固定成本: child.全年预测固定成本,
          数据: child.数据,
        };
      }) as any[];
      // if (result.children.length === 0) {
      //   result.hasChildren = false;
      // }
      treeData.push(result);
    });
    tableData.value = unref(treeData);
  }
}

function importSuccess(data: any) {}

function handleSubmit(data: any) {
  // 逐行对应填入tableData
  try {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      tableData.value[i] = row;
    }
    // firmReportDetailForm.value.content = data;
    importExcelDialogRef.value?.handleClose();
  } catch (error) {
    console.log("error", error);
    ElMessage.error("导入数据格式错误");
  }
  // 存储数据
  // firmReportDetailForm.value.content = converImportedDataToSubmitData(data);
  // 关闭
}

// 特殊逻辑：观察content的变化，如果变化了，则将content转化为表格格式
watch(
  () => firmReportDetailForm.value.content,
  (newVal) => {
    if (newVal) {
      transferDataToTree(unref(newVal));
    }
  }
);

const submitForm = () => {
  console.log("submitForm");
};

const favoForm = () => {
  console.log("favoForm");
};

const exportForm = () => {
  console.log("exportForm");
};

const handlePictureCardPreview = async (file: any) => {
  console.log("handlePictureCardPreview", file);
};

const handleDownload = async (file: any) => {
  console.log("handleDownload", file);
};

const handleRemove = async (file: any) => {
  console.log("handleRemove", file);
};

const { history, commit, undo, redo } = useManualRefHistory(
  firmReportDetailForm,
  { clone: true }
);

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(firmReportDetailForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    saveForm();
    firmReportDetailForm.value = value;
  }
};
const validateForm = () => {
  return formRef.value?.validate();
};

const generateRandomData = () => {
  firmReportDetailForm.value = {
    name: "广投石化",
    year: "2024",
    content: [],
    attachment: [],
  };
};

defineExpose({
  saveForm,
  restoreForm,
  getFormValue,
  setFormValue,
  generateRandomData,
  validateForm,
  getTransferredData,
});
</script>

<style lang="scss" scoped></style>
