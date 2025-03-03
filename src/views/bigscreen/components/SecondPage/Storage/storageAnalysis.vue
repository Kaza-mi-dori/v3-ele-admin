<template>
  <div class="dashboard">
    <div class="select-oil-warehouse-container">
      <el-select
        v-model="oilWarehouse"
        class="select-oil-warehouse"
        style="width: 200px"
        placeholder="请选择油库"
        @change="handleOilWarehouseChange"
      >
        <el-option
          v-for="item in oilWarehouseList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <DashboardHeader :stats="stats" />

    <div class="grid-container">
      <StorageCard
        v-for="card in storageCards"
        :key="card.title"
        :title="card.title"
        :status="card.status"
        :usagePercentage="card.usagePercentage"
        :fullLoad="card.fullLoad"
        :remaining="card.remaining"
        :volume="card.volume"
        :actual="card.actual"
        :heightPercentage="card.heightPercentage"
      />
    </div>
  </div>
</template>

<script setup>
import DashboardHeader from "../Common/IndexHeader/index.vue";
import StorageCard from "./StorageCard/index.vue";
import icon2 from "@/views/bigscreen/img/product_icon2.png";
import icon3 from "@/views/bigscreen/img/product_icon3.png";
import icon4 from "@/views/bigscreen/img/product_icon4.png";
import icon5 from "@/views/bigscreen/img/product_icon5.png";
import icon6 from "@/views/bigscreen/img/product_icon6.png";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const oilWarehouse = ref("1");
const oilWarehouseList = ref([
  {
    value: "1",
    label: "永盛油库",
  },
  {
    value: "2",
    label: "盛源油库",
  },
]);

// TODO 根据路由参数获取初始油库
const initOilWarehouse = () => {
  console.log(route.query.oilWarehouse);
};
initOilWarehouse();

const storageCards = ref([
  {
    title: "TD-001",
    status: "*#号专用汽油",
    usagePercentage: 88,
    fullLoad: 16.4,
    remaining: 6.812,
    volume: 4192.93,
    actual: 3378.63,
    heightPercentage: 23,
  },
  {
    title: "TD-002",
    status: "*#号专用汽油",
    usagePercentage: 88,
    fullLoad: 16.4,
    remaining: 6.812,
    volume: 4192.93,
    actual: 3378.63,
    heightPercentage: 88,
  },
  {
    title: "TD-003",
    status: "*#号专用汽油",
    usagePercentage: 88,
    fullLoad: 16.4,
    remaining: 6.812,
    volume: 4192.93,
    actual: 3378.63,
    heightPercentage: 88,
  },
  {
    title: "TD-004",
    status: "*#号专用汽油",
    usagePercentage: 88,
    fullLoad: 16.4,
    remaining: 6.812,
    volume: 4192.93,
    actual: 3378.63,
    heightPercentage: 88,
  },
  {
    title: "TD-0501",
    status: "*#号专用汽油",
    usagePercentage: 88,
    fullLoad: 16.4,
    remaining: 6.812,
    volume: 4192.93,
    actual: 3378.63,
    heightPercentage: 88,
  },
  {
    title: "TD-0601",
    status: "*#号专用汽油",
    usagePercentage: 88,
    fullLoad: 16.4,
    remaining: 6.812,
    volume: 4192.93,
    actual: 3378.63,
    heightPercentage: 88,
  },
  {
    title: "TD-0701",
    status: "*#号专用汽油",
    usagePercentage: 88,
    fullLoad: 16.4,
    remaining: 6.812,
    volume: 4192.93,
    actual: 3378.63,
    heightPercentage: (6.812 / 16.4) * 100,
  },
  {
    title: "TD-0801",
    status: "*#号专用汽油",
    usagePercentage: 88,
    fullLoad: 16.4,
    remaining: 6.812,
    volume: 4192.93,
    actual: 3378.63,
    heightPercentage: 88,
  },
]);

const stats = ref([
  {
    value: 12,
    label: "总储罐数",
    icon: icon2,
  },
  {
    value: 62210,
    label: "总库存(吨)",
    icon: icon3,
  },
  {
    value: 100,
    label: "年累计出库量（万吨）",
    icon: icon4,
  },
  {
    value: 100,
    label: "年累计入库量(万吨)",
    icon: icon5,
  },
]);

const handleOilWarehouseChange = () => {
  // 重新生成storageCards
  storageCards.value = [
    {
      title: "TD-001",
      status: "*#号专用汽油",
      usagePercentage: 88,
      fullLoad: 16.4,
      remaining: 6.812,
    },
    {
      title: "TD-002",
      status: "*#号专用汽油",
      usagePercentage: 88,
      fullLoad: 16.4,
      remaining: 6.812,
    },
  ];
  // 根据油库重新生成storageCards
  // 根据油库重新生成stats
  stats.value = [
    {
      value: 21,
      label: "总储罐数",
      icon: icon2,
    },
    {
      value: 51210,
      label: "总库存(吨)",
      icon: icon3,
    },
    {
      value: 50,
      label: "年累计出库量（万吨）",
      icon: icon4,
    },
    {
      value: 30,
      label: "年累计入库量(万吨)",
      icon: icon5,
    },
  ];
};
</script>

<style scoped lang="scss">
.dashboard {
  font-family: Arial, sans-serif;
  color: #fff;
  height: 100vh;
  padding: 20px;
  overflow: auto;
}

.grid-container {
  display: grid;
  /* 4列, 每列宽度为1fr ,fr是根据内容自动计算宽度*/
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.select-oil-warehouse-container {
  @apply flex justify-end;
}

:deep(.el-select) {
  .el-select__wrapper {
    border: 1px solid #1e3a8a;
    .el-select__placeholder {
      color: #fff;
    }
  }
  &.select-oil-warehouse {
    float: right;
    border: 1px solid #1e3a8a !important;
    border-radius: 5px;
    .el-select__wrapper {
      background: #222590;
      border-radius: 5px;
      --el-border-color: #222590;
    }
  }
}
</style>
