<!-- 贸易伙伴报表 -->
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
          :model="partnerDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="客商名称" prop="name">
                <el-autocomplete
                  v-if="editing"
                  v-model="partnerDetailForm.name"
                  :fetch-suggestions="queryPartnerSearchAsync"
                  placeholder="请输入客商名称"
                  @select="handleSelectPartner"
                />
                <span v-else>{{ partnerDetailForm.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客商类型" prop="type">
                <el-input v-if="editing" v-model="partnerDetailForm.type" />
                <span v-else>{{ partnerDetailForm.type }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="当年度评分" prop="currentYearScore">
                <el-input
                  v-if="editing"
                  v-model="partnerDetailForm.currentYearScore"
                />
                <span v-else>{{ partnerDetailForm.currentYearScore }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="准入状态" prop="admissionStatus">
                <el-select
                  v-if="editing"
                  v-model="partnerDetailForm.admissionStatus"
                >
                  <el-option label="已准入" value="已准入" />
                  <el-option label="未准入" value="未准入" />
                </el-select>
                <span v-else>{{ partnerDetailForm.admissionStatus }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="准入时间" prop="admissionTime">
                <date-picker-plus
                  v-if="editing"
                  v-model="partnerDetailForm.admissionTime"
                  type="date"
                />
                <span v-else>{{ partnerDetailForm.admissionTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否封禁" prop="banned">
                <el-switch
                  v-if="editing"
                  v-model="partnerDetailForm.banned"
                  active-text="是"
                  inactive-text="否"
                />
                <span v-else>{{ partnerDetailForm.banned }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交易金额" prop="tradeAmount">
                <el-input
                  v-if="editing"
                  v-model="partnerDetailForm.tradeAmount"
                />
                <span v-else>{{ partnerDetailForm.tradeAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="风险金额" prop="riskAmount">
                <el-input
                  v-if="editing"
                  v-model="partnerDetailForm.riskAmount"
                />
                <span v-else>{{ partnerDetailForm.riskAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同金额" prop="contractAmount">
                <el-input
                  v-if="editing"
                  v-model="partnerDetailForm.contractAmount"
                />
                <span v-else>{{ partnerDetailForm.contractAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-if="editing" v-model="partnerDetailForm.phone" />
                <span v-else>{{ partnerDetailForm.phone }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地址" prop="address">
                <el-input v-if="editing" v-model="partnerDetailForm.address" />
                <span v-else>{{ partnerDetailForm.address }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>年度评分历史</span>
      </div>
      <div class="__content">
        <el-table
          :header-cell-style="{
            'text-align': 'center',
          }"
          :data="partnerDetailForm.yearScores"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column prop="year" label="年度" width="250">
            <template #default="{ row }">
              <el-date-picker
                v-if="editing"
                v-model="row.year"
                type="year"
                value-format="YYYY"
                placeholder="选择年度"
              />
              <span v-else>{{ row.year }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="评分" width="180">
            <template #default="{ row }">
              <el-input v-if="editing" v-model="row.score" type="number" />
              <span v-else>{{ row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="备注" show-overflow-tooltip>
            <template #default="{ row }">
              <el-input v-if="editing" v-model="row.desc" />
              <span v-else>{{ row.desc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="flex justify-evenly">
                <el-link
                  v-if="editing"
                  type="danger"
                  @click="handleDelete(row)"
                >
                  删除
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="w-full">
          <el-button
            v-if="editing"
            icon="plus"
            class="w-full g-button-1"
            @click="handleAddYearScore"
          >
            添加年度评分
          </el-button>
        </div>
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
        <uploadPlus
          :disabled="!editing"
          :editing="editing"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        />
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
          :model="partnerDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="创建时间" prop="createdAt">
                <span>{{ partnerDetailForm.createdAt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人" prop="createdBy">
                <span>{{ partnerDetailForm.createdBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新时间" prop="updatedAt">
                <span>{{ partnerDetailForm.updatedAt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新人" prop="updatedBy">
                <span>{{ partnerDetailForm.updatedBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据来源" prop="dataFrom">
                <span>{{ partnerDetailForm.dataFrom }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否审核" prop="audited">
                <span>{{ partnerDetailForm.audited }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import datePickerPlus from "@/components/ElBasicPlus/datePicker.vue";
import uploadPlus from "@/components/ElBasicPlus/upload.vue";
import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { FormInstance } from "element-plus";

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

// 客商名称、客商类型、年度评分列表、准入状态、准入时间、是否封禁、交易金额、风险金额、合同金额、联系电话、地址、创建时间、创建人、更新时间、更新人、数据来源、是否审核
interface Partner {
  name: string;
  type: string;
  currentYearScore: string;
  yearScores: any[];
  admissionStatus: string;
  admissionTime: string;
  banned: string;
  tradeAmount: string;
  riskAmount: string;
  contractAmount: string;
  phone: string;
  address: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  dataFrom: string;
  audited: string;
}

const partnerDetailForm = ref<Partner>({
  name: "测试企业1",
  type: "石化",
  currentYearScore: "90",
  yearScores: [
    {
      year: "2020",
      score: "90",
      desc: "年度评分2020",
    },
    {
      year: "2021",
      score: "90",
      desc: "年度评分2021",
    },
  ],
  admissionStatus: "已准入",
  admissionTime: "2024-08-01",
  banned: "否",
  tradeAmount: "1000",
  riskAmount: "100",
  contractAmount: "100",
  phone: "13888888888",
  address: "广州市天河区",
  createdAt: "2021-08-01",
  createdBy: "admin",
  updatedAt: "2021-08-01",
  updatedBy: "admin",
  dataFrom: "手动录入",
  audited: "是",
});

const rules: Ref<GenericRecord> = ref({
  year: [{ required: true, message: "请输入年度", trigger: "blur" }],
  profit: [{ required: true, message: "请输入利润", trigger: "blur" }],
  revenue: [{ required: true, message: "请输入收入", trigger: "blur" }],
  cost: [{ required: true, message: "请输入成本", trigger: "blur" }],
});

const handleAddYearScore = () => {
  partnerDetailForm.value.yearScores.push({
    year: "",
    score: "",
  });
};

const handleDelete = (row: any) => {
  const index = partnerDetailForm.value.yearScores.indexOf(row);
  partnerDetailForm.value.yearScores.splice(index, 1);
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

// 附件
const allSelected = ref(false);
const handlePictureCardPreview = (file: any) => {
  console.log("handlePictureCardPreview", file);
};

const handleRemove = (file: any) => {
  console.log("handleRemove", file);
};

// 后端搜索企业接口
let timeout: ReturnType<typeof setTimeout>;
const queryPartnerSearchAsync = (query: string, cb: (args: any) => void) => {
  console.log("queryPartnerSearchAsync", query);
  const result = [
    { value: "永盛石化", label: "永盛石化" },
    { value: "广投石化", label: "广投石化" },
    { value: "中石化", label: "中石化" },
  ];
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(result.filter((item) => item.label.includes(query)));
  }, 1000);
};

const handleSelectPartner = (value: any) => {
  console.log("handleSelectPartner", value);
};

// 历史记录功能
const { history, commit, undo, redo } = useManualRefHistory(partnerDetailForm, {
  clone: true,
});

const saveForm = () => {
  commit();
};
const restoreForm = () => {
  undo();
};
const getFormValue = () => {
  return unref(partnerDetailForm.value);
};
const setFormValue = (value: any) => {
  if (value) {
    saveForm();
    partnerDetailForm.value = value;
  }
};

const validateForm = () => {
  return formRef.value?.validate();
};

const generateRandomData = () => {
  partnerDetailForm.value = {
    name: "广投石化",
    type: "石化",
    currentYearScore: "90",
    yearScores: [
      {
        year: "2020",
        score: "90",
      },
      {
        year: "2021",
        score: "90",
      },
    ],
    admissionStatus: "已准入",
    admissionTime: "2024-08-01",
    banned: "否",
    tradeAmount: "1000",
    riskAmount: "100",
    contractAmount: "100",
    phone: "13888888888",
    address: "广州市天河区",
    createdAt: "2021-08-01",
    createdBy: "admin",
    updatedAt: "2021-08-01",
    updatedBy: "admin",
    dataFrom: "手动录入",
    audited: "是",
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
