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
              <el-form-item label="年份" prop="year">
                <el-date-picker
                  v-if="editing"
                  v-model="firmReportDetailForm.year"
                  type="year"
                  value-format="YYYY-MM-DD"
                  placeholder="选择年份"
                />
                <span v-else>
                  {{ firmReportDetailForm.year.substring(0, 4) }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业名称" prop="year">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.name"
                  placeholder="请输入企业名称"
                />
                <span v-else>{{ firmReportDetailForm.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业介绍">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.description"
                  placeholder="请输入企业介绍"
                />
                <span v-else>{{ firmReportDetailForm.description }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业资产">
                <el-input
                  v-if="editing"
                  v-model="firmReportDetailForm.asset"
                  placeholder="请输入企业资产"
                />
                <span v-else>{{ firmReportDetailForm.asset }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>报表内容</span>
      </div>
      <div class="__content">
        <ExcelLikeTable
          type="limited"
          :inputItemDefsByRow="inputItemDefsByRow"
          needSummary
          :cols-def="columnDefs"
          :editing="editing"
          :headers="extraHeaders"
        />
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
  </div>
</template>

<script setup lang="ts">
import upload from "@/components/ElBasicPlus/upload.vue";
import pdfPNG from "@/assets/icons/pdf.png";
import ExcelPNG from "@/assets/icons/excel.png";
import WordPNG from "@/assets/icons/WORD.png";
import ZipSVG from "@/assets/icons/zip.svg";
import ExcelLikeTable, {
  type ColumnDef,
  type rowDef,
} from "@/components/CustomComponent/ExcelLikeTable/index.vue";

import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { FormInstance } from "element-plus";
import { title } from "process";

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

const firmReportDetailForm = ref({
  name: "广投石化",
  year: "2024-01-01",
  description: "广投石化有限公司",
  asset: "1000",
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

/**
 * 中文键值转为英文键值
 * @param value
 */
const converter = (value: any) => {
  const obj: any = {};
  for (const key in value) {
    if (key === "年份") {
      obj.year = value[key];
    } else if (key === "企业名称") {
      obj.name = value[key];
    } else if (key === "企业介绍") {
      obj.description = value[key];
    } else if (key === "企业资产") {
      obj.asset = value[key];
    }
  }
  return obj;
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
    description: "广投石化有限公司",
    asset: "1000",
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
});
</script>

<style lang="scss" scoped></style>
