<template>
  <div class="main-wrapper bg-white">
    <div class="g-title-block-2">
      <div class="__title">年度经营报表</div>
    </div>
    <div class="info-card-level1">
      <div class="__title">
        <span>报表信息</span>
      </div>
      <div class="__content">
        <el-form
          label-position="top"
          label-width="100px"
          inline
          class="w-full g-form-1"
          :model="yearlyReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="年度">
                <span>{{ yearlyReportDetailForm.year }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="利润">
                <span>{{ yearlyReportDetailForm.profit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收入">
                <span>{{ yearlyReportDetailForm.revenue }}</span>
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

const yearlyReportDetailForm = ref({
  name: "年度经营报表",
  year: "2021",
  profit: "1000",
  revenue: "2000",
  cost: "1000",
});
</script>

<style lang="scss" scoped></style>
