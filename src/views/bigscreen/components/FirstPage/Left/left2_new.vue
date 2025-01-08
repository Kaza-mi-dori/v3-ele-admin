<template>
  <div class="flex flex-gap-2 w-full justify-between h-full">
    <DescribeItem2 v-bind="revenueData" style="flex: 1" />
    <DescribeItem2 v-bind="profitData" style="flex: 1" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import DescribeItem2 from "../DescribeItems/Item2.vue";
import Coin from "@/views/bigscreen/img/left_icon1.png";
import WrappedGift from "@/views/bigscreen/img/left_icon2.png";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import {
  startOfYear,
  endOfYear,
  startOfLastYear,
  endOfLastYear,
} from "@/utils/time"; // 导入工具类

interface FinancialData {
  title: string;
  yoy: number;
  fulfilled: number;
  target: number;
  monthTotal: number;
  icon: string;
}

let revenueData = ref<FinancialData>({
  title: "累计营收",
  yoy: 0,
  fulfilled: 0,
  target: 0,
  monthTotal: 0,
  icon: Coin,
});

let profitData = ref<FinancialData>({
  title: "累计利润",
  yoy: 0,
  fulfilled: 0,
  target: 0,
  monthTotal: 0,
  icon: WrappedGift,
});

// revenueData.value = {
//   title: "累计营收",
//   yoy: -36.53,
//   fulfilled: 2043700,
//   target: 3999100,
//   monthTotal: 1000,
//   icon: Coin,
// };
// profitData.value = {
//   title: "累计利润",
//   yoy: -31.26,
//   fulfilled: -5500,
//   target: 15000,
//   monthTotal: 100,
//   icon: WrappedGift,
// };

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

// 计算同比
const calculateYoY = (current: number, lastYear: number): number => {
  return lastYear
    ? Number((((current - lastYear) / lastYear) * 100).toFixed(2))
    : 0;
};

// 获取去年数据
const fetchLastYearData = async () => {
  const lastYearQueryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> =
    ref({
      页码: 1,
      页容量: 1,
      企业名称: "广投石化",
      状态集合: ["有效"],
      类型集合: ["年"],
      日期晚于: startOfLastYear(), // 取去年的数据
      日期早于: endOfLastYear(), // 取去年的最后一天
    });

  const res: any = await BusinessFormAPI.getCompanyReportFormList(
    lastYearQueryForm.value
  );
  let resData = (res["当前记录"]?.[0]?.["内容"]?.["详情"] || []).filter(
    (item: any) => item["业态类型"] === "总体"
  );

  let lastYearRevenue = ref(0);
  let lastYearProfit = ref(0);

  resData.forEach((item: any) => {
    lastYearRevenue.value = Number(item.累计营收金额) || 0;
    lastYearProfit.value = Number(item.累计利润金额) || 0;
  });

  return {
    lastYearRevenue,
    lastYearProfit,
  };
};

const initData = async () => {
  const lastYearData = await fetchLastYearData();

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
  let resData = res["当前记录"]?.[0]?.["内容"];
  let resData2 = (res["当前记录"]?.[0]?.["内容"]?.["详情"] || []).filter(
    (item: any) => item["业态类型"] === "总体"
  );

  let currentRevenue = ref(0);
  let currentProfit = ref(0);

  resData2.forEach((item: any) => {
    currentRevenue.value = Number(item.累计营收金额) || 0;
    currentProfit.value = Number(item.累计利润金额) || 0;
  });

  revenueData.value = {
    title: "累计营收",
    yoy: 0,
    fulfilled: 0,
    target: 0,
    monthTotal: 0,
    icon: Coin,
  };
  profitData.value = {
    title: "累计利润",
    yoy: 0,
    fulfilled: 0,
    target: 0,
    monthTotal: 0,
    icon: WrappedGift,
  };

  resData2.forEach((item: any) => {
    revenueData.value = {
      title: "累计营收",
      yoy: calculateYoY(
        currentRevenue.value,
        lastYearData.lastYearRevenue.value
      ),
      fulfilled: currentRevenue.value,
      target: Number(resData.营收基准值) || 0,
      monthTotal: Number(item.当期营收金额) || 0,
      icon: Coin,
    };
    profitData.value = {
      title: "累计利润",
      yoy: calculateYoY(currentProfit.value, lastYearData.lastYearProfit.value),
      fulfilled: currentProfit.value,
      target: Number(resData.利润基准值) || 0,
      monthTotal: Number(item.当期利润金额) || 0,
      icon: WrappedGift,
    };
  });
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped></style>
