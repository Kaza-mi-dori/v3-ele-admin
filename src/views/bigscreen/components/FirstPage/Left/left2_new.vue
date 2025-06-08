<template>
  <div class="flex flex-gap-2 w-full justify-between h-full">
    <DescribeItem2
      v-bind="revenueData"
      style="flex: 1"
      @click="handleClickDescribeItem('revenue')"
    />
    <DescribeItem2
      v-bind="profitData"
      style="flex: 1"
      @click="handleClickDescribeItem('profit')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import DescribeItem2 from "../DescribeItems/Item2.vue";
import Coin from "@/views/bigscreen/img/left_icon1.png";
import WrappedGift from "@/views/bigscreen/img/left_icon2.png";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import { currentYear, currentMonth } from "@/utils/time";

interface FinancialData {
  title: string;
  yoy: number;
  fulfilled: number;
  target: number;
  monthTotal: number;
  icon: string;
  unit?: string;
}

let revenueData = ref<FinancialData>({
  title: "累计营收",
  yoy: 0,
  fulfilled: 0,
  target: 0,
  monthTotal: 0,
  icon: Coin,
  unit: "亿元",
});

let profitData = ref<FinancialData>({
  title: "累计利润",
  yoy: 0,
  fulfilled: 0,
  target: 0,
  monthTotal: 0,
  icon: WrappedGift,
  unit: "万元",
});

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

const currentRevenue = ref(0); // 年度营收
const currentProfit = ref(0); // 年度利润
const lastYearRevenue = ref(0); // 去年营收
const lastYearProfit = ref(0); // 去年利润
const monthRevenue = ref(0); // 月度营收
const monthProfit = ref(0); // 月度利润

const router = useRouter();

const handleClickDescribeItem = (type: string) => {
  const route = router.resolve({
    // name: type === "revenue" ? "RevenueAnalysis" : "ProfitAnalysis",
    name: type === "revenue" ? "Revenue" : "Profit",
    query: {
      module: type,
      companyName: "石化板块",
    },
  });
  window.open(route.href, "_blank");
};

const commonQueryParams = {
  页码: 1,
  页容量: 1,
  // 企业名称: "广投石化",
  企业名称: "石化板块",
  状态集合: ["有效"],
  // 类型集合: ["年"],
  类型集合: ["月"],
};

// 计算同比
const calculateYoY = (current: number, lastYear: number): number => {
  return lastYear
    ? Number((((current - lastYear) / Math.abs(lastYear)) * 100).toFixed(2))
    : 0;
};

// 通用的接口数据获取函数
const fetchData = async (queryParams: Partial<BusinessReportQuery>) => {
  const res: any = await BusinessFormAPI.getCompanyReportFormList(queryParams);
  return res["当前记录"]?.[0]?.["内容"];
};

// 获取去年数据
const fetchLastYearData = async () => {
  const queryParams = {
    ...commonQueryParams,
    // 日期晚于: `${currentYear() - 1}-01-01`,
    // 日期早于: `${currentYear() - 1}-12-31`,
    日期晚于: `${currentYear() - 1}-${currentMonth()}-01`,
    日期早于: `${currentYear() - 1}-${currentMonth()}-31`,
  };

  const resData = await fetchData(queryParams);

  (resData?.["详情"] || []).forEach((item: any) => {
    if (item["业态类型"] === "总体") {
      lastYearRevenue.value = Number(item.累计营收金额) || 0;
      lastYearProfit.value = Number(item.累计利润金额) || 0;
    }
  });

  return { lastYearRevenue, lastYearProfit };
};

const initData = async () => {
  const lastYearData = await fetchLastYearData();

  const queryParams = {
    ...commonQueryParams,
    // 日期晚于: `${currentYear()}-01-01`,
    // 日期早于: `${currentYear()}-12-31`,
    日期晚于: `${currentYear()}-${currentMonth()}-01`,
    日期早于: `${currentYear()}-${currentMonth()}-31`,
  };

  const resData = await fetchData(queryParams);

  (resData?.["详情"] || []).forEach((item: any) => {
    if (item["业态类型"] === "总体") {
      currentRevenue.value = Number(item.累计营收金额) || 0;
      currentProfit.value = Number(item.累计利润金额) || 0;
      monthRevenue.value = Number(item.当期营收金额) || 0;
      monthProfit.value = Number(item.当期利润金额) || 0;
    }
  });

  // 更新数据
  revenueData.value = {
    title: "累计营收",
    yoy: calculateYoY(currentRevenue.value, lastYearData.lastYearRevenue.value),
    fulfilled: +(currentRevenue.value / 10000).toFixed(2),
    target: +(Number(resData.营收基准值) / 10000).toFixed(2),
    monthTotal: +(monthRevenue.value / 10000).toFixed(2),
    icon: Coin,
    unit: "亿元",
  };
  profitData.value = {
    title: "累计利润",
    yoy: calculateYoY(currentProfit.value, lastYearData.lastYearProfit.value),
    fulfilled: currentProfit.value,
    target: Number(resData.利润基准值) || 0,
    monthTotal: monthProfit.value,
    icon: WrappedGift,
    unit: "万元",
  };
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped></style>
