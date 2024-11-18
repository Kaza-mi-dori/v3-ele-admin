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
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="priceDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="企业名称" prop="year">
                <el-autocomplete
                  v-if="editing"
                  v-model="priceDetailForm.name"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入企业名称"
                />
                <span v-else>{{ priceDetailForm.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报价时间">
                <date-picker-plus
                  v-if="editing"
                  v-model="priceDetailForm.priceTime"
                  type="datetime"
                  placeholder="选择报价时间"
                  value-format="yyyy-MM-DD HH:mm:ss"
                />
                <span v-else>{{ priceDetailForm.priceTime }}</span>
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
        <el-table
          :data="priceDetailForm.prices"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column prop="name" label="商品名称" width="180">
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
          <el-table-column prop="firm" label="报价企业" width="180">
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
        </el-table>
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

const priceDetailForm = ref({
  id: null,
  name: "广投石化",
  year: "2024",
  description: "广投石化有限公司",
  priceTime: "2024-01-01 12:00:00",
  asset: "1000",
  prices: [
    {
      name: "甲醇",
      spec: "99%",
      firm: "广投石化",
      price: 1000,
      unit: "元/吨",
      change: 0.1,
    },
    {
      name: "乙醇",
      spec: "99%",
      firm: "广投石化",
      price: 2000,
      unit: "元/吨",
      change: 0.2,
    },
  ] as PriceRecord[],
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
  name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
});

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

defineExpose({
  saveForm,
  restoreForm,
  getFormValue,
  setFormValue,
});
</script>

<style lang="scss" scoped></style>
