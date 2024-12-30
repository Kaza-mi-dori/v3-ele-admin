<template>
  <div class="left3-box">
    <div class="flex flex-gap-2 w-full justify-between">
      <div
        v-for="(item, index) in totalData.slice(0, 3)"
        :key="index"
        style="flex: 1"
      >
        <DescribeItem4 v-bind="item" />
      </div>
    </div>
    <div class="flex flex-gap-2 w-full justify-between mt-[10px]">
      <div
        v-for="(item, index) in totalData.slice(3)"
        :key="index"
        style="flex: 1"
      >
        <DescribeItem4 v-bind="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import DescribeItem4 from "../DescribeItems/Item4.vue";
import block1 from "@/views/bigscreen/img/left_block1.png";
import block2 from "@/views/bigscreen/img/left_block2.png";
import block3 from "@/views/bigscreen/img/left_block3.png";
import block4 from "@/views/bigscreen/img/left_block4.png";
import block5 from "@/views/bigscreen/img/left_block5.png";
import { startOfYear, endOfYear } from "@/utils/time"; // 导入工具类

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
  {
    title: "累计采购",
    bgImg: block1,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "万元",
    yearUnit: "亿元",
  },
  {
    title: "累计销售",
    bgImg: block2,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "万元",
    yearUnit: "亿元",
  },
  {
    title: "毛利率",
    bgImg: block3,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "%",
    yearUnit: "%",
  },
  {
    title: "累计营收",
    bgImg: block4,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "万元",
    yearUnit: "亿元",
  },
  {
    title: "累计利润",
    bgImg: block5,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "万元",
    yearUnit: "亿元",
  },
]);

const initData = async () => {
  queryForm.value = {
    页码: 1,
    页容量: 1,
    企业名称: "广投石化",
    状态集合: ["有效"],
    类型集合: ["年"],
    日期晚于: startOfYear(), // 取当年数据,设置为当前年份的第一天
    日期早于: endOfYear(), // 取当年数据,设置为当前年份的最后一天
  };
  const res: any = await BusinessFormAPI.getCompanyReportFormList(
    queryForm.value
  );
  let resData = (res["当前记录"]?.[0]?.["内容"]?.["详情"] || []).filter(
    (item: any) => item["业态类型"] === "总体"
  );
  const totals = {
    累计采购: {
      yearTotal: 0,
      monthTotal: 0,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    累计销售: {
      yearTotal: 0,
      monthTotal: 0,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    累计毛利率: { yearTotal: 0, monthTotal: 0, monthUnit: "%", yearUnit: "%" },
    累计营收: {
      yearTotal: 0,
      monthTotal: 0,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    累计利润: {
      yearTotal: 0,
      monthTotal: 0,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
  };

  resData.forEach((item: any) => {
    totals["累计采购"].yearTotal += Number(item.累计采购金额) || 0;
    totals["累计采购"].monthTotal += Number(item.当期采购金额) || 0;

    totals["累计销售"].yearTotal = Number(item.累计销售金额) || 0;
    totals["累计销售"].monthTotal = Number(item.当期销售金额) || 0;

    totals["累计毛利率"].yearTotal = Number(item.累计毛利率) || 0;
    totals["累计毛利率"].monthTotal = Number(item.本月毛利率) || 0;

    totals["累计营收"].yearTotal = Number(item.累计营收金额) || 0;
    totals["累计营收"].monthTotal = Number(item.当期营收金额) || 0;

    totals["累计利润"].yearTotal = Number(item.累计利润金额) || 0;
    totals["累计利润"].monthTotal = Number(item.当期利润金额) || 0;
  });
  totalData.value = [
    {
      title: "累计采购",
      bgImg: block1,
      yearTotal: Number((totals["累计采购"].yearTotal / 10000).toFixed(2)),
      monthTotal: totals["累计采购"].monthTotal,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    {
      title: "累计销售",
      bgImg: block2,
      yearTotal: Number((totals["累计销售"].yearTotal / 10000).toFixed(2)),
      monthTotal: totals["累计销售"].monthTotal,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    {
      title: "毛利率",
      bgImg: block3,
      yearTotal: Number((totals["累计毛利率"].yearTotal / 10000).toFixed(2)),
      monthTotal: totals["累计毛利率"].monthTotal,
      monthUnit: "%",
      yearUnit: "%",
    },
    {
      title: "累计营收",
      bgImg: block4,
      yearTotal: Number((totals["累计营收"].yearTotal / 10000).toFixed(2)),
      monthTotal: totals["累计营收"].monthTotal,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
    {
      title: "累计利润",
      bgImg: block5,
      yearTotal: Number((totals["累计利润"].yearTotal / 10000).toFixed(2)),
      monthTotal: totals["累计利润"].monthTotal,
      monthUnit: "万元",
      yearUnit: "亿元",
    },
  ];
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.left3-box {
  width: 100%;
  height: 100%;
}
</style>
