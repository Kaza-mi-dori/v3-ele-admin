<template>
  <div class="table-wrapper p-4">
    <table class="table">
      <thead>
        <tr>
          <th class="table-header" style="width: 70px">序号</th>
          <th class="table-header">企业</th>
          <th class="table-header" style="width: 140px">年累计(万元)</th>
          <th class="table-header" style="width: 140px">年计划(%)</th>
          <th class="table-header" style="width: 140px">年完成率(%)</th>
          <th class="table-header" style="width: 140px">去年同期(万元)</th>
          <th class="table-header" style="width: 140px">同比增幅(%)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="index" class="table-row">
          <td class="table-cell cell1">{{ index + 1 }}</td>
          <td class="table-cell cell2">{{ item.company }}</td>
          <td class="table-cell">{{ item.amount }}</td>
          <td class="table-cell">{{ item.ratio }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any[];
}>();
const tableData = ref<any[]>(props.data);
</script>

<style lang="scss" scoped>
@use "@/styles/gmixin.scss" as gmixin;

@include gmixin.b-table-1;
</style>
