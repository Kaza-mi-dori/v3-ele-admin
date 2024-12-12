<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left">
      <Left1 />
      <div class="b-space" />
      <Left2 class="left2" title="合同总数与金额" />
      <div class="b-space" />
      <Left3 />
      <div class="b-space" />
      <Left4 />
    </div>
    <div class="c-space" />
    <div class="b-middle">
      <div class="middle-item">
        <Model2 class="middle1" :totalData="totalData" />
      </div>
      <div class="b-space" />
      <div class="middle-item flex-grow">
        <Middle2 class="middle2" />
      </div>
      <div class="b-space" />
      <div class="middle-item" style="margin-bottom: 10px">
        <Middle3 />
      </div>
      <div class="b-space" />
      <div class="middle-item">
        <Middle4 />
      </div>
    </div>
    <div class="c-space" />
    <div class="b-right">
      <Right1 />
      <div class="b-space" />
      <Right2 />
      <div class="b-space" />
      <Right3 />
      <div class="b-space" />
      <Right4 />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Left1 from "./components/FirstPage/Left/left1.vue";
import Left2 from "./components/FirstPage/Left/left2.vue";
import Left4 from "./components/FirstPage/Left/left4.vue";
import Left3 from "./components/FirstPage/Left/left3.vue";
import Model2 from "./components/FirstPage/Model2/index.vue";
import Middle2 from "./components/FirstPage/Middle/Middle2/index.vue";
import Middle3 from "./components/FirstPage/Middle/Middle3/index.vue";
import Right1 from "./components/FirstPage/Right/right1.vue";
import Right2 from "./components/FirstPage/Right/right2.vue";
import Right3 from "./components/FirstPage/Right/right3.vue";
import Right4 from "./components/FirstPage/Right/right4.vue";
import Middle4 from "../bigscreen/components/FirstPage/Middle/Middle4/index.vue";
import { onMounted, ref } from "vue";
import BusinessFormAPI, { BusinessReportQuery } from "@/api/businessForm";

const totalData = ref([
  {
    year: "25438",
    month: "25438",
    monthUnit: "万元",
    yearUnit: "亿元",
  },
  {
    year: "25438",
    month: "25438",
    monthUnit: "万元",
    yearUnit: "亿元",
  },
  {
    year: "25438",
    month: "25438",
    monthUnit: "万元",
    yearUnit: "亿元",
  },
  {
    year: "25438",
    month: "25438",
    monthUnit: "万元",
    yearUnit: "亿元",
  },
]);

const initData = async () => {
  const params = {
    页码: 1,
    页容量: 1,
    企业名称: "广投石化",
    状态集合: ["有效"],
  };
  const res: any = await BusinessFormAPI.getCompanyReportFormList(params);
  let resData = res["当前记录"]?.[0]?.["内容"]?.["详情"] || [];

  const matchingItem = resData.find((item: any) => item["业态类型"] === "总体");
  // console.log("matchingItem", matchingItem);

  if (matchingItem) {
    const {
      当期采购金额,
      当期销售金额,
      当期营收金额,
      当期利润金额,
      累计采购金额,
      累计销售金额,
      累计营收金额,
      累计利润金额,
    } = matchingItem; // 解构赋值
    totalData.value = [
      /** 采购、销售、 营收、利润*/
      {
        year: (parseFloat(累计采购金额 || 0) / 10000).toFixed(2),
        month: 当期采购金额,
        monthUnit: "万元",
        yearUnit: "亿元",
      },
      {
        year: (parseFloat(累计销售金额 || 0) / 10000).toFixed(2),
        month: 当期销售金额,
        monthUnit: "万元",
        yearUnit: "亿元",
      },
      {
        year: (parseFloat(累计营收金额 || 0) / 10000).toFixed(2),
        month: 当期营收金额,
        monthUnit: "万元",
        yearUnit: "亿元",
      },
      {
        year: (parseFloat(累计利润金额 || 0) / 10000).toFixed(2),
        month: 当期利润金额,
        monthUnit: "万元",
        yearUnit: "亿元",
      },
    ];
  }
  // console.log("oilData", oilData.value);
};

onMounted(() => {
  // 初始化数据
  initData();
});
</script>

<style lang="scss" scoped>
.bg-view-body {
  flex: 1;
  display: flex;
  width: 100%;
  // height如果设为100%会导致左右定高，不设则会根据内容撑开
  // 定高可以自适应一屏，但是会使得中间地图无法保持比例，进而导致相对坐标不准确
  height: 100%;
  .b-left,
  .b-middle,
  .b-right {
    display: flex;
    flex-direction: column;
  }
  .b-left {
    flex: 1;
  }
  .b-middle {
    flex: 1.4;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    .middle-item {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
    .flex-grow {
      flex: 3;
    }
  }
  .b-right {
    flex: 1;
  }
}
.b-space {
  width: 0;
  height: 10px;
}
.c-space {
  width: 25px;
  height: 0;
}
.bg-view-body > .c-space:first-child {
  width: 15px;
}
.bg-view-body > .c-space:last-child {
  width: 15px;
}
.model1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.left2 {
  flex: 0.5;
}
</style>
