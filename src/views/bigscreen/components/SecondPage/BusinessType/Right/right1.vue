<template>
  <Model1 class="model1" title="各加油站销售情况">
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="table-header" style="width: 70px">排行</th>
            <th class="table-header">油站</th>
            <th class="table-header" style="width: 140px">交易额(万元)</th>
            <th class="table-header" style="width: 140px">交易额占比(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in tradePartners"
            :key="index"
            class="table-row"
          >
            <td class="table-cell cell1">{{ index + 1 }}</td>
            <td class="table-cell cell2">{{ item.company }}</td>
            <td class="table-cell">{{ item.amount }}</td>
            <td class="table-cell">{{ item.ratio }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "@/views/bigscreen/components/SecondPage/Model1/index.vue";
import { ref } from "vue";

const tradePartners = ref([
  { company: "加油站A", amount: 96, ratio: 10.23 },
  { company: "加油站B", amount: 82, ratio: 8.23 },
  { company: "加油站C", amount: 76, ratio: 7.23 },
  { company: "加油站D", amount: 56, ratio: 5.23 },
  { company: "加油站E", amount: 30, ratio: 3.23 },
]);
</script>

<style lang="scss" scoped>
.model1 {
  @apply flex flex-1 flex-col h-full;
}

.table-wrapper {
  border: 2px solid #3486da;
  padding: 1px;
  margin: 20px 10px 0 10px;
}

.table {
  width: 100%;
  height: 190px;
  border-collapse: separate; /* 使用 separate 以支持 border-spacing */
  border-spacing: 2px 1px; /* 设置单元格之间的外间距：左右2px，上下1px */
  margin: 0;
  background-color: #050b47;
  overflow-y: auto;
}

.table tbody {
  width: 100%;
  height: 170px; /* 设置高度，留出thead的高度 */
  overflow-y: auto;
}

.table-header,
.table-cell {
  text-align: center;
  border: 2px solid #1a4790; /* 单元格边框 */
  font-size: 16px;
  letter-spacing: 1px;
}

.table-header {
  background-color: #0f2465;
  font-size: 17px;
  font-weight: bold;
  color: #3184d6;
}

.table-cell {
  background-color: #050b47;
  color: #fff;
}

.cell1 {
  color: #3184d6;
  font-size: 17px;
}

.cell2 {
  @apply text-left pl-[5px];
}

.table td,
.table th {
  @apply relative;
}

// .table-row {
//   transition: background-color 0.3s ease; /* 添加过渡效果 */
// }

// .table-row:hover {
//   background-color: rgba(15, 36, 101, 0.5);
// }
</style>
