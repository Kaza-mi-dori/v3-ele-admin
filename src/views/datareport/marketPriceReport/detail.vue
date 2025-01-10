<!-- 市场报价报表 -->
<!-- 企业概况报表-->
<template>
  <div class="main-wrapper">
    <!-- <div class="g-title-block-2">
      <div class="__title">年度经营报表</div>
    </div> -->
    <!-- <div class="mb-4 p-10px bg-white">
      <el-button class="g-button-1" type="primary" @click="submitForm">
        提交
      </el-button>
      <el-button class="g-button-1" @click="favoForm">收藏</el-button>
      <el-button class="g-button-1" @click="exportForm">导出</el-button>
    </div> -->
    <div class="info-card-level1">
      <div class="__title">
        <span>报表信息</span>
      </div>
      <div class="__content">
        <el-form
          ref="formRef"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="priceDetailForm"
        >
          <el-row class="w-full">
            <!-- <el-col :span="8">
              <el-form-item label="报价企业" prop="firmName">
                <el-autocomplete
                  v-if="editing"
                  v-model="priceDetailForm.firmName"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入企业名称"
                />
                <span v-else>{{ priceDetailForm.firmName }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="数据日期" prop="year">
                <date-picker-plus
                  v-if="editing"
                  v-model="priceDetailForm.year"
                  type="date"
                  placeholder="选择数据日期"
                  value-format="YYYY-MM-DD"
                />
                <span v-else>{{ priceDetailForm.year }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>报价内容</span>
      </div>
      <div class="__content">
        <!-- <el-table
          :header-cell-style="{
            'background-color': sassvariables['custom-table-header-background'],
            color: sassvariables['custom-table-header-color'],
            'text-align': 'center',
          }"
          :data="priceDetailForm.prices"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column prop="name" label="商品名称">
            <template #default="{ row }">
              <el-input v-if="editing" v-model="row.name" />
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" width="180">
            <template #default="{ row }">
              <el-input v-if="editing" v-model="row.spec" />
              <span v-else>{{ row.spec }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="firm" label="报价企业">
            <template #default="{ row }">
              <el-input v-if="editing" v-model="row.firm" />
              <span v-else>{{ row.firm }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="180">
            <template #default="{ row }">
              <el-input v-if="editing" v-model="row.price" />
              <span v-else>{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="180">
            <template #default="{ row }">
              <el-input v-if="editing" v-model="row.unit" />
              <span v-else>{{ row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="change" label="涨跌幅(%)" width="180">
            <template #default="{ row }">
              <el-input v-if="editing" v-model="row.change" />
              <span v-else>{{ row.change }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="editing"
            key="操作"
            label="操作"
            fixed="right"
            width="100"
          >
            <template #default="{ row }">
              <div class="w-full flex justify-evenly">
                <el-link type="danger" @click="handleDelete(row)">删除</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="editing" class="w-full">
          <el-button
            class="w-full g-button-1"
            size="small"
            icon="plus"
            @click="addPriceRecord"
          >
            新增
          </el-button>
        </div> -->
        <!-- 将数组内容变成单行表单 -->
        <el-form
          ref="formRef"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="priceDetailForm"
        >
          <el-row class="w-full">
            <el-col :xs="24" :span="8">
              <el-form-item label="报价企业" prop="firmName">
                <el-input v-if="editing" v-model="priceDetailForm.firmName" />
                <span v-else>{{ priceDetailForm.firmName }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="8">
              <el-form-item label="报价日期" prop="firmName">
                <date-picker-plus
                  v-if="editing"
                  v-model="priceDetailForm.priceTime"
                  type="date"
                  placeholder="选择报价日期"
                  value-format="YYYY-MM-DD"
                />
                <span v-else>
                  {{ priceDetailForm.priceTime.split(" ")[0] }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="8">
              <el-form-item label="报价商品" prop="goodsName">
                <el-input v-if="editing" v-model="priceDetailForm.goodsName" />
                <span v-else>{{ priceDetailForm.goodsName }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="8">
              <el-form-item label="商品规格" prop="spec">
                <el-input v-if="editing" v-model="priceDetailForm.spec" />
                <span v-else>{{ priceDetailForm.spec }}</span>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :span="8">
              <el-form-item label="报价金额" prop="price">
                <el-input
                  v-if="editing"
                  v-model="priceDetailForm.price"
                  type="number"
                />
                <span v-else>{{ priceDetailForm.price }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="8">
              <el-form-item label="报价币种" prop="currency">
                <el-select v-if="editing" v-model="priceDetailForm.currency">
                  <el-option
                    v-for="(value, key) in CurrencyEnumMap"
                    :key="key"
                    :label="key"
                    :value="value"
                  />
                </el-select>
                <span v-else>{{ priceDetailForm.currency }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="8">
              <el-form-item label="较上次涨跌幅(%)" prop="change">
                <el-input
                  v-if="editing"
                  v-model="priceDetailForm.change"
                  type="number"
                />
                <span v-else>{{ priceDetailForm.change }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="8">
              <el-form-item label="单位" prop="unit">
                <el-input v-if="editing" v-model="priceDetailForm.unit" />
                <span v-else>{{ priceDetailForm.unit }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="24">
              <el-form-item label="报价描述" prop="desc">
                <el-input v-if="editing" v-model="priceDetailForm.desc" />
                <span v-else>{{ priceDetailForm.desc }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="priceDetailForm.id" class="info-card-level1">
      <div class="__title">
        <span>维护信息</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import datePickerPlus from "@/components/ElBasicPlus/datePicker.vue";
import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { FormInstance } from "element-plus";
import { CurrencyEnum, CurrencyEnumMap } from "@/enums/BusinessEnum";
import sassvariables from "@/styles/variables.module.scss";

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

const formRef = ref<Nullable<FormInstance>>(null);
const { id, editing } = toRefs(props);

const priceDetailForm = ref({
  id: null,
  firmName: "广投石化",
  year: "2024-01-01", // 数据日期
  description: "广投石化有限公司",
  priceTime: "2024-01-30",
  asset: "1000",
  goodsName: "甲醇",
  spec: "99%",
  // firm: "广投石化",
  desc: "一次报价", // 产品信息·报价描述
  price: 1000,
  currency: "人民币/CNY", // 币种
  unit: "元/吨",
  change: 0.1, // 环比
  // prices: [
  //   {
  //     name: "甲醇",
  //     spec: "99%",
  //     firm: "广投石化",
  //     price: 1000,
  //     unit: "元/吨",
  //     change: 0.1,
  //   },
  //   {
  //     name: "乙醇",
  //     spec: "99%",
  //     firm: "广投石化",
  //     price: 2000,
  //     unit: "元/吨",
  //     change: 0.2,
  //   },
  // ] as PriceRecord[],
});

// 报价记录类型
// 报价商品名称、规格、报价企业、价格、单位、涨跌幅
interface PriceRecord {
  name: string;
  spec: string;
  firm: string;
  price: number;
  unit: string;
  change: number;
}

const rules: Ref<GenericRecord> = ref({
  goodsName: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
  year: [{ required: true, message: "请选择数据日期", trigger: "blur" }],
  currency: [{ required: true, message: "请选择币种", trigger: "blur" }],
  price: [{ required: true, message: "请输入报价金额", trigger: "blur" }],
  priceTime: [{ required: true, message: "请选择报价日期", trigger: "blur" }],
  // unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
});

/** 新增报价记录 */
const addPriceRecord = () => {
  priceDetailForm.value.prices.push({
    name: "",
    spec: "",
    firm: "",
    price: 0,
    unit: "",
    change: 0,
  });
};

/** 删除报价记录 */
const handleDelete = (row: PriceRecord) => {
  const index = priceDetailForm.value.prices.indexOf(row);
  priceDetailForm.value.prices.splice(index, 1);
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

const querySearch = (queryString: string, cb: (results: any[]) => void) => {
  const results = [
    {
      value: "广投石化",
      label: "广投石化",
    },
    {
      value: "永盛石化",
      label: "永盛石化",
    },
    {
      value: "中石化",
      label: "中石化",
    },
  ];
  cb(results.filter((item) => item.label.includes(queryString)));
};

const { history, commit, undo, redo } = useManualRefHistory(priceDetailForm, {
  clone: true,
});

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(priceDetailForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    priceDetailForm.value = value;
  }
};

const validateForm = () => {
  return formRef.value?.validate();
};

const generateRandomData = () => {
  priceDetailForm.value = {
    id: null,
    firmName: "广投石化",
    year: "2024-01-01", // 数据日期
    description: "广投石化有限公司",
    priceTime: "2024-01-30",

    // prices: [
    //   {
    //     name: "甲醇",
    //     spec: "99%",
    //     firm: "广投石化",
    //     price: 1000,
    //     unit: "元/吨",
    //     change: 0.1,
    //   },
    //   {
    //     name: "乙醇",
    //     spec: "99%",
    //     firm: "广投石化",
    //     price: 2000,
    //     unit: "元/吨",
    //     change: 0.2,
    //   },
    // ] as PriceRecord[],
  };
};

defineExpose({
  saveForm,
  restoreForm,
  getFormValue,
  setFormValue,
  validateForm,
  generateRandomData,
});
</script>

<style lang="scss" scoped></style>
