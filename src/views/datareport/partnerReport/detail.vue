<!-- 贸易伙伴报表 -->
<template>
  <div class="main-wrapper">
    <!-- <div class="g-title-block-2">
      <div class="__title">年度经营报表</div>
    </div> -->
    <div class="mb-4 p-10px bg-white">
      <el-button class="g-button-1" type="primary" @click="submitForm">
        提交
      </el-button>
      <el-button class="g-button-1" @click="favoForm">收藏</el-button>
      <el-button class="g-button-1" @click="exportForm">导出</el-button>
    </div>
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
                  :data="yearlyReportDetailForm.rankData"
                  style="width: 100%"
                  stripe
                  border
                  height="300"
                >
                  <el-table-column prop="rank" label="排名" width="180">
                    <template #default="{ row }">
                      <span>{{ row.rank }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="企业名称" width="180">
                    <template #default="{ row }">
                      <el-input v-if="editing" v-model="row.name" />
                      <el-link v-else type="primary">{{ row.name }}</el-link>
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
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>维护信息</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const yearlyReportDetailForm = ref({
  name: "贸易伙伴报表",
  year: "2021",
  profit: "1000",
  revenue: "2000",
  cost: "1000",
  rankData: [
    { rank: "1", name: "永盛石化", profit: "1000", revenue: "2000" },
    { rank: "2", name: "广投石化", profit: "1000", revenue: "2000" },
    { rank: "3", name: "中石化", profit: "1000", revenue: "2000" },
  ],
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
