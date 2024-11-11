<template>
  <div>
    <!-- 搜索筛选区 -->
    <!-- 结算类型、合同编号、结算时间、结算状态、结算相对方 -->
    <div class="filter-block">
      <el-select
        v-model="settlementType"
        placeholder="结算类型"
        style="width: 200px"
      >
        <el-option
          v-for="item in settlementTypeOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-input
        v-model="contractNumber"
        placeholder="合同编号"
        style="width: 200px"
      />
      <el-date-picker
        v-model="settlementTime"
        type="date"
        placeholder="选择日期"
        style="width: 200px"
      />
      <el-select
        v-model="settlementStatus"
        placeholder="结算状态"
        style="width: 200px"
      >
        <el-option
          v-for="item in settlementStatusOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-input
        v-model="settlementCounterparty"
        placeholder="结算相对方"
        style="width: 200px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const settlementType = ref("");
const settlementTypeOptions = ["结算类型一", "结算类型二", "结算类型三"];
const contractNumber = ref("");
const settlementTime = ref("");
const settlementStatus = ref("");
const settlementStatusOptions = ["结算状态一", "结算状态二", "结算状态三"];
const settlementCounterparty = ref("");
</script>

<style lang="scss" scoped>
.filter-block {
  @apply m-1;
  el-select {
    @apply mr-2;
  }
  el-input {
    @apply mr-2;
  }
}
</style>
