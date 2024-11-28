<template>
  <Model1 class="model1" title="成品油供应商挂牌价">
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="table-header" style="width: 60px">规格</th>
            <th class="table-header">生产企业</th>
            <th class="table-header" style="width: 115px">价格(元/吨)</th>
            <th class="table-header" style="width: 90px">涨跌幅</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in tradePartners"
            :key="index"
            class="table-row"
          >
            <td class="table-cell cell1">{{ item.specification }}</td>
            <td class="table-cell cell2">{{ item.company }}</td>
            <td class="table-cell">{{ item.amount }}</td>
            <td class="table-cell" :class="getTextClass(item['limit'])">
              {{ UDparamsFormatter(item.limit) }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Model1>
</template>

<script setup lang="ts">
import Model1 from "../Model1/index.vue";
import { ref } from "vue";

const tradePartners = ref([
  { specification: "95#", company: "企业A", amount: "7380.00", limit: "-0.26" },
  { specification: "92#", company: "企业A", amount: "7270.00", limit: "-0.27" },
  { specification: "98#", company: "企业A", amount: "7520.00", limit: "-0.42" },
  { specification: "95#", company: "企业H", amount: "7380.00", limit: "0.00" },
  { specification: "92#", company: "企业H", amount: "7270.00", limit: "0.00" },
  { specification: "98#", company: "企业H", amount: "7520.00", limit: "0.00" },
  { specification: "95#", company: "企业Y", amount: "7380.00", limit: "-0.26" },
  { specification: "92#", company: "企业Y", amount: "7270.00", limit: "-0.27" },
  { specification: "98#", company: "企业Y", amount: "7520.00", limit: "0.42" },
]);

const getTextClass = (data: string | number) => {
  if (data) {
    let number = Number(data);
    if (number > 0) {
      return "text-error";
    }
    if (number === 0) {
      return;
    }
    if (number < 0) {
      return "text-success";
    }
  }
  return "";
};

const UDparamsFormatter = (data: string | number) => {
  if (data) {
    let number = Number(data);
    return number > 0 ? "+" + number.toFixed(2) : number.toFixed(2);
  } else {
    return "-";
  }
};
</script>

<style lang="scss" scoped>
.model1 {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}

.table-wrapper {
  border: 2px solid #3486da;
  padding: 1px;
  margin: 20px 20px 0 20px;
}

.table {
  width: 100%;
  height: 360px;
  border-collapse: separate; /* 使用 separate 以支持 border-spacing */
  border-spacing: 2px 1px; /* 设置单元格之间的外间距：左右2px，上下1px */
  margin: 0;
  background-color: #050b47;
  overflow-y: auto;
}

.table tbody {
  width: 100%;
  height: 340px; /* 设置高度，留出thead的高度 */
  overflow-y: auto;
}

.table-header,
.table-cell {
  text-align: center;
  border: 2px solid #1a4790; /* 单元格边框 */
  font-size: 15px;
  letter-spacing: 1px;
}
.table-cell:first-child {
  letter-spacing: 0;
}

.table-header {
  background-color: #0f2465;
  font-size: 17px;
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
  text-align: left;
  padding-left: 10px;
}

.table td,
.table th {
  position: relative;
}

.text-success {
  color: #52c41a;
}

.text-error {
  color: #f5222d;
}
</style>
