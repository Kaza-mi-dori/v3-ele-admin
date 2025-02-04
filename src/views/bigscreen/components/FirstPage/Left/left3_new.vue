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
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import DescribeItem4 from "../DescribeItems/Item4.vue";
import block1 from "@/views/bigscreen/img/left_block1.png";
import block2 from "@/views/bigscreen/img/left_block2.png";
import block3 from "@/views/bigscreen/img/left_block3.png";
import { startOfYear, endOfYear } from "@/utils/time"; // 导入工具类
import { useDataIndex } from "@/hooks/useDataIndex";

const queryForm: Ref<Partial<BusinessReportQuery> & PageQueryDev> = ref({
  业务维度: undefined,
  状态集合: undefined,
  日期早于: undefined,
  日期晚于: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 20,
});

const keywordMap = {
  累计采购: "1941591bce2",
  累计销售: "19415920653",
  毛利率: "19463e8525d",
};

const keywordMapMonth = {
  月度采购: "19471d10915",
  月度销售: "19471d14331",
  月度毛利率: "19471dd5398",
};

let totalData = ref([
  {
    title: "累计采购",
    keyword: keywordMap["累计采购"],
    keywordMonth: keywordMapMonth["月度采购"],
    bgImg: block1,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "万元",
    yearUnit: "万元",
  },
  {
    title: "累计销售",
    keyword: keywordMap["累计销售"],
    keywordMonth: keywordMapMonth["月度销售"],
    bgImg: block2,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "万元",
    yearUnit: "万元",
  },
  {
    title: "毛利率",
    keyword: keywordMap["毛利率"],
    keywordMonth: keywordMapMonth["月度毛利率"],
    bgImg: block3,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "%",
    yearUnit: "%",
  },
]);

// 获取年度数据
const { result, loading, error, fetchData } = useDataIndex(
  Object.values(keywordMap),
  100,
  undefined,
  undefined,
  true
);

// 获取月度数据
const {
  result: resultMonth,
  loading: loadingMonth,
  error: errorMonth,
  fetchData: fetchDataMonth,
} = useDataIndex(
  Object.values(keywordMapMonth),
  100,
  undefined,
  undefined,
  true
);

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
      monthUnit: "亿元",
      yearUnit: "亿元",
    },
    累计销售: {
      yearTotal: 0,
      monthTotal: 0,
      monthUnit: "亿元",
      yearUnit: "亿元",
    },
    累计毛利率: { yearTotal: 0, monthTotal: 0, monthUnit: "%", yearUnit: "%" },
  };

  resData.forEach((item: any) => {
    totals["累计采购"].yearTotal = Number(item.累计采购金额) || 0;
    totals["累计采购"].monthTotal = Number(item.当期采购金额) || 0;

    totals["累计销售"].yearTotal = Number(item.累计销售金额) || 0;
    totals["累计销售"].monthTotal = Number(item.当期销售金额) || 0;

    totals["累计毛利率"].yearTotal = Number(item.累计毛利率) || 0;
    totals["累计毛利率"].monthTotal = Number(item.本月毛利率) || 0;
  });
  totalData.value = [
    {
      title: "累计采购",
      keyword: keywordMap["累计采购"],
      keywordMonth: keywordMapMonth["月度采购"],
      bgImg: block1,
      yearTotal: Number(totals["累计采购"].yearTotal.toFixed(2)),
      monthTotal: Number(totals["累计采购"].monthTotal.toFixed(2)),
      monthUnit: "万元",
      yearUnit: "万元",
    },
    {
      title: "累计销售",
      keyword: keywordMap["累计销售"],
      keywordMonth: keywordMapMonth["月度销售"],
      bgImg: block2,
      yearTotal: Number(totals["累计销售"].yearTotal.toFixed(2)),
      monthTotal: Number(totals["累计销售"].monthTotal.toFixed(2)),
      monthUnit: "万元",
      yearUnit: "万元",
    },
    {
      title: "毛利率",
      keyword: keywordMap["毛利率"],
      keywordMonth: keywordMapMonth["月度毛利率"],
      bgImg: block3,
      yearTotal: Number(totals["累计毛利率"].yearTotal.toFixed(2)),
      monthTotal: Number(totals["累计毛利率"].monthTotal.toFixed(2)),
      monthUnit: "%",
      yearUnit: "%",
    },
  ];
  fetchData().then(() => {
    // 将result.value中的数据赋值给totalData
    for (const key in result.value) {
      // 如果有数据，则取第一条
      const item = totalData.value.find((item) => item.keyword === key);
      if (item) {
        item.yearTotal = parseFloat(result.value[key][0].数据);
      }
    }
  });
  fetchDataMonth().then(() => {
    for (const key in resultMonth.value) {
      const itemMonth = totalData.value.find(
        (item) => item.keywordMonth === key
      );
      if (itemMonth) {
        itemMonth.monthTotal = parseFloat(resultMonth.value[key][0].数据);
      }
    }
  });
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.left3-box {
  @apply w-full h-full;
}
</style>
