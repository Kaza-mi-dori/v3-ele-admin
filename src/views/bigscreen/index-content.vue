<template>
  <div class="bg-view-body">
    <div class="c-space" />
    <div class="b-left" style="z-index: 1">
      <Left1 />
      <div class="b-space" />
      <!-- <Left2 class="left2" title="合同总数与金额" /> -->
      <Left2 />
      <div class="b-space" />
      <Left3 />
      <div class="b-space" />
      <!-- <Left4 /> -->
      <Left5 />
    </div>
    <div class="c-space" />
    <div class="b-middle">
      <!-- <div class="middle-item">
        <Model2 class="middle1" :totalData="totalData" />
      </div>
      <div class="b-space" /> -->
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
    <div class="b-right" style="z-index: 1">
      <Right1 />
      <div class="b-space" />
      <Right2 />
      <div class="b-space" />
      <right3New />
      <div class="b-space" />
      <Right4 />
    </div>
    <div class="c-space" />
  </div>
</template>

<script setup lang="ts">
import Left1 from "./components/FirstPage/Left/left1.vue";
import Left2 from "./components/FirstPage/Left/left2_new.vue";
import Left4 from "./components/FirstPage/Left/left4.vue";
import Left3 from "./components/FirstPage/Left/left3.vue";
import Left5 from "./components/FirstPage/Left/left5.vue";
import Model2 from "./components/FirstPage/Model2/index.vue";
import Middle2 from "./components/FirstPage/Middle/Middle2/index.vue";
import Middle3 from "./components/FirstPage/Middle/Middle3/index.vue";
import Right1 from "./components/FirstPage/Right/right1.vue";
import Right2 from "./components/FirstPage/Right/right2.vue";
import right3New from "./components/FirstPage/Right/right3-new.vue";
import Right4 from "./components/FirstPage/Right/right4.vue";
import Middle4 from "../bigscreen/components/FirstPage/Middle/Middle4/index.vue";
import Map from "./components/FirstPage/Map/index.vue";

import { ref } from "vue";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

let totalData = ref([
  { title: "累计采购", year: 0, month: 0, monthUnit: "万元", yearUnit: "亿元" },
  { title: "累计销售", year: 0, month: 0, monthUnit: "万元", yearUnit: "亿元" },
  { title: "累计营收", year: 0, month: 0, monthUnit: "万元", yearUnit: "亿元" },
  { title: "累计利润", year: 0, month: 0, monthUnit: "万元", yearUnit: "亿元" },
]);

const initData = async () => {
  queryForm.value = {
    页码: 1,
    页容量: 1,
    企业名称: "广投石化",
    状态集合: ["有效"],
  };
  const res: any = await BusinessFormAPI.getCompanyReportFormList(
    queryForm.value
  );
  let resData = (res["当前记录"]?.[0]?.["内容"]?.["详情"] || []).filter(
    (item: any) => item["业态类型"] === "总体"
  );
  const totals = {
    累计采购: { year: 0, month: 0, monthUnit: "万元", yearUnit: "亿元" },
    累计销售: { year: 0, month: 0, monthUnit: "万元", yearUnit: "亿元" },
    累计营收: { year: 0, month: 0, monthUnit: "万元", yearUnit: "亿元" },
    累计利润: { year: 0, month: 0, monthUnit: "万元", yearUnit: "亿元" },
  };

  resData.forEach((item: any) => {
    totals["累计采购"].year += Number(item.累计采购金额) || 0;
    totals["累计采购"].month += Number(item.当期采购金额) || 0;

    totals["累计销售"].year = Number(item.累计销售金额) || 0;
    totals["累计销售"].month = Number(item.当期销售金额) || 0;

    totals["累计营收"].year = Number(item.累计营收金额) || 0;
    totals["累计营收"].month = Number(item.当期营收金额) || 0;

    totals["累计利润"].year = Number(item.累计利润金额) || 0;
    totals["累计利润"].month = Number(item.当期利润金额) || 0;
  });
  totalData.value = [
    {
      title: "累计采购",
      year: (totals["累计采购"].year / 10000).toFixed(2),
      month: totals["累计采购"].month,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    {
      title: "累计销售",
      year: (totals["累计销售"].year / 10000).toFixed(2),
      month: totals["累计销售"].month,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    {
      title: "累计营收",
      year: (totals["累计营收"].year / 10000).toFixed(2),
      month: totals["累计营收"].month,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    {
      title: "累计利润",
      year: (totals["累计利润"].year / 10000).toFixed(2),
      month: totals["累计利润"].month,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
  ];
};

// 加载腾讯地图api
const initTMapApi = () => {
  const script = document.createElement("script");
  script.src =
    "https://map.qq.com/api/js?v=2.exp&key=4TYBZ-V2WCQ-IKX52-BEW3F-SDCA6-7DFMN";
  script.onload = () => {
    console.log("腾讯地图api加载完成");
  };
  script.async = true;
  document.body.appendChild(script);
};

// onBeforeMount(() => {
//   initTMapApi();
// });

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.bg-view-body {
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
  // height如果设为100%会导致左右定高，不设则会根据内容撑开
  // 定高可以自适应一屏，但是会使得中间地图无法保持比例，进而导致相对坐标不准确
  height: 100%;
  // padding-bottom: 20px;
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
      // flex: 1;
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
