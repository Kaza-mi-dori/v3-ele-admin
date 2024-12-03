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
          :model="yearlyReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="年度" prop="year">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.year"
                />
                <span v-else>{{ yearlyReportDetailForm.year }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="利润">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.profit"
                />
                <span v-else>{{ yearlyReportDetailForm.profit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收入">
                <el-input
                  v-if="editing"
                  v-model="yearlyReportDetailForm.revenue"
                />
                <span v-else>{{ yearlyReportDetailForm.revenue }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="期间排名">
                <el-table
                  :header-cell-style="{
                    'background-color':
                      sassvariables['custom-table-header-background'],
                    color: sassvariables['custom-table-header-color'],
                    'text-align': 'center',
                  }"
                  :data="yearlyReportDetailForm.rankData"
                  style="width: 100%"
                  stripe
                  border
                >
                  <el-table-column
                    prop="rank"
                    label="排名"
                    width="80"
                    align="center"
                  >
                    <template #default="{ row }">
                      <span>{{ row.rank }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="企业名称">
                    <template #default="{ row }">
                      <!-- <el-input v-if="editing" v-model="row.name" /> -->
                      <el-autocomplete
                        v-if="editing"
                        v-model="row.name"
                        :fetch-suggestions="queryPartnerSearchAsync"
                        placeholder="请输入企业名称"
                        @select="handleSelectPartner"
                      />
                      <el-link v-else type="primary">{{ row.name }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="product"
                    label="主要贸易产品"
                    width="180"
                  >
                    <template #default="{ row }">
                      <el-input v-if="editing" v-model="row.product" />
                      <span v-else>{{ row.product }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="bargainAmount"
                    label="贸易量(吨)"
                    width="180"
                  >
                    <template #default="{ row }">
                      <el-input v-if="editing" v-model="row.bargainAmount" />
                      <span v-else>{{ row.bargainAmount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="bargainCount"
                    label="贸易额(元)"
                    width="180"
                  >
                    <template #default="{ row }">
                      <el-input v-if="editing" v-model="row.bargainCount" />
                      <span v-else>{{ row.bargainCount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="profit" label="利润(元)" width="180">
                    <template #default="{ row }">
                      <el-input v-if="editing" v-model="row.profit" />
                      <span v-else type="primary">{{ row.profit }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="revenue" label="收入(元)" width="180">
                    <template #default="{ row }">
                      <el-input v-if="editing" v-model="row.revenue" />
                      <span v-else type="primary">{{ row.revenue }}</span>
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
                        <el-link type="danger" @click="handleDelete(row)">
                          删除
                        </el-link>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div v-if="editing" class="w-full">
                  <el-button
                    icon="plus"
                    class="w-full g-button-1"
                    size="small"
                    @click="addRankRecord"
                  >
                    新增
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
          :file-list="yearlyReportDetailForm.attachment"
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
import { ref, onMounted } from "vue";
import { useManualRefHistory } from "@vueuse/core";
import { type FormInstance } from "element-plus";
import upload from "@/components/ElBasicPlus/upload.vue";
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

const allSelected = ref(false);

const yearlyReportDetailForm = ref({
  name: "贸易伙伴报表",
  year: "2021",
  profit: "1000",
  revenue: "2000",
  cost: "1000",
  // 包含贸易量、贸易额、主要贸易产品
  rankData: [
    { rank: "1", name: "永盛石化", profit: "1000", revenue: "2000" },
    { rank: "2", name: "广投石化", profit: "1000", revenue: "2000" },
    { rank: "3", name: "中石化", profit: "1000", revenue: "2000" },
    {
      rank: "4",
      name: "中石油",
      profit: "1000",
      revenue: "2000",
      product: "石油",
      bargainAmount: "1000",
      bargainCount: "1000",
    },
  ],
  createdAt: "2021-01-01",
  createdBy: "admin",
  updatedAt: "2021-01-01",
  updatedBy: "admin",
  dataFrom: "系统录入",
  audited: "是",
});

const rules: Ref<GenericRecord> = ref({
  year: [{ required: true, message: "请输入年度", trigger: "blur" }],
  profit: [{ required: true, message: "请输入利润", trigger: "blur" }],
  revenue: [{ required: true, message: "请输入收入", trigger: "blur" }],
  cost: [{ required: true, message: "请输入成本", trigger: "blur" }],
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

/** 新增排名记录 */
const addRankRecord = () => {
  const rank = yearlyReportDetailForm.value.rankData.length + 1;
  yearlyReportDetailForm.value.rankData.push({
    rank: rank.toString(),
    name: "",
    profit: "",
    revenue: "",
  });
};

/** 删除排名记录 */
const handleDelete = (row: any) => {
  const index = yearlyReportDetailForm.value.rankData.indexOf(row);
  yearlyReportDetailForm.value.rankData.splice(index, 1);
};

/** 图片预览 */
const handlePictureCardPreview = async (file: any) => {
  console.log("handlePictureCardPreview", file);
};

/** 删除图片 */
const handleRemove = async (file: any) => {
  console.log("handleRemove", file);
};

// 历史记录功能
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

const validateForm = () => {
  return formRef.value?.validate();
};

const generateRandomData = () => {
  yearlyReportDetailForm.value = {
    name: "贸易伙伴报表",
    year: "2021",
    profit: "1000",
    revenue: "2000",
    cost: "1000",
    rankData: [
      { rank: "1", name: "永盛石化", profit: "1000", revenue: "2000" },
      { rank: "2", name: "广投石化", profit: "1000", revenue: "2000" },
      { rank: "3", name: "中石化", profit: "1000", revenue: "2000" },
      {
        rank: "4",
        name: "中石油",
        profit: "1000",
        revenue: "2000",
        product: "石油",
        bargainAmount: "1000",
        bargainCount: "1000",
      },
    ],
    createdAt: "2021-01-01",
    createdBy: "admin",
    updatedAt: "2021-01-01",
    updatedBy: "admin",
    dataFrom: "系统录入",
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
