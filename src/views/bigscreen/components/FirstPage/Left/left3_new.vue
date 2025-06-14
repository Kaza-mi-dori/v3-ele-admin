<template>
  <div class="left3-box">
    <div class="flex flex-gap-2 w-full justify-between">
      <div
        v-for="(item, index) in totalData.slice(0, 4)"
        :key="index"
        style="flex: 1"
      >
        <DescribeItem4
          v-bind="item"
          @clickYear="handleClickYear"
          @clickMonth="handleClickMonth"
        />
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

const router = useRouter();

const keywordMap = {
  累计采购: "1941591bce2",
  累计销售: "19415920653",
  毛利率: "19463e8525d",
  固定成本: "1976a3b04d2",
  年度企业资金: "1976cf67036",
};

const keywordMapMonth = {
  月度采购: "19471d10915",
  月度销售: "19471d14331",
  月度毛利率: "19471dd5398",
  月度固定成本: "1976a3dd9f5",
  月度企业资金: "1976cf6b25f",
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
  // {
  //   title: "毛利率",
  //   keyword: keywordMap["毛利率"],
  //   keywordMonth: keywordMapMonth["月度毛利率"],
  //   bgImg: block3,
  //   yearTotal: 0,
  //   monthTotal: 0,
  //   monthUnit: "%",
  //   yearUnit: "%",
  // },
  {
    title: "可用资金",
    keyword: keywordMap["年度企业资金"],
    keywordMonth: keywordMapMonth["月度企业资金"],
    bgImg: block3,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "亿元",
    yearUnit: "亿元",
  },
  {
    title: "固定成本",
    keyword: keywordMap["固定成本"],
    keywordMonth: keywordMapMonth["月度固定成本"],
    bgImg: block3,
    yearTotal: 0,
    monthTotal: 0,
    monthUnit: "万元",
    yearUnit: "万元",
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
      monthUnit: "万元",
      yearUnit: "万元",
    },
    累计销售: {
      yearTotal: 0,
      monthTotal: 0,
      monthUnit: "万元",
      yearUnit: "万元",
    },
    累计毛利率: { yearTotal: 0, monthTotal: 0, monthUnit: "%", yearUnit: "%" },
    累计固定成本: {
      yearTotal: 0,
      monthTotal: 0,
      monthUnit: "亿元",
      yearUnit: "亿元",
    },
    累计企业资金: {
      yearTotal: 0,
      monthTotal: 0,
      monthUnit: "亿元",
      yearUnit: "亿元",
    },
  };

  resData.forEach((item: any) => {
    totals["累计采购"].yearTotal = Number((item.累计采购金额 || 0) / 10000);
    totals["累计采购"].monthTotal = Number((item.当期采购金额 || 0) / 10000);

    totals["累计销售"].yearTotal = Number((item.累计销售金额 || 0) / 10000);
    totals["累计销售"].monthTotal = Number((item.当期销售金额 || 0) / 10000);

    totals["累计毛利率"].yearTotal = Number(item.累计毛利率) || 0;
    totals["累计毛利率"].monthTotal = Number(item.本月毛利率) || 0;

    totals["累计固定成本"].yearTotal = Number(item.累计固定成本) || 0;
    totals["累计固定成本"].monthTotal = Number(item.当期固定成本) || 0;

    totals["累计企业资金"].yearTotal = Number(item.累计企业资金) || 0;
    totals["累计企业资金"].monthTotal = Number(item.当期企业资金) || 0;
  });
  totalData.value = [
    {
      title: "累计采购",
      keyword: keywordMap["累计采购"],
      keywordMonth: keywordMapMonth["月度采购"],
      bgImg: block1,
      yearTotal: Number(totals["累计采购"].yearTotal.toFixed(0)),
      monthTotal: Number(totals["累计采购"].monthTotal.toFixed(0)),
      monthUnit: "万元",
      yearUnit: "万元",
    },
    {
      title: "累计销售",
      keyword: keywordMap["累计销售"],
      keywordMonth: keywordMapMonth["月度销售"],
      bgImg: block2,
      yearTotal: Number(totals["累计销售"].yearTotal.toFixed(0)),
      monthTotal: Number(totals["累计销售"].monthTotal.toFixed(0)),
      monthUnit: "万元",
      yearUnit: "万元",
    },
    // {
    //   title: "毛利率",
    //   keyword: keywordMap["毛利率"],
    //   keywordMonth: keywordMapMonth["月度毛利率"],
    //   bgImg: block3,
    //   yearTotal: Number(totals["累计毛利率"].yearTotal.toFixed(2)),
    //   monthTotal: Number(totals["累计毛利率"].monthTotal.toFixed(2)),
    //   monthUnit: "%",
    //   yearUnit: "%",
    // },
    {
      title: "可用资金",
      keyword: keywordMap["年度企业资金"],
      keywordMonth: keywordMapMonth["月度企业资金"],
      bgImg: block3,
      yearTotal: Number(totals["累计企业资金"].yearTotal.toFixed(2)),
      monthTotal: Number(totals["累计企业资金"].monthTotal.toFixed(2)),
      monthUnit: "亿元",
      yearUnit: "亿元",
    },
    {
      title: "固定成本",
      keyword: keywordMap["固定成本"],
      keywordMonth: keywordMapMonth["月度固定成本"],
      bgImg: block3,
      yearTotal: Number(totals["累计固定成本"].yearTotal.toFixed(2)),
      monthTotal: Number(totals["累计固定成本"].monthTotal.toFixed(2)),
      monthUnit: "万元",
      yearUnit: "万元",
    },
  ];
  fetchData().then(() => {
    // 将result.value中的数据赋值给totalData
    for (const key in result.value) {
      // 如果有数据，则取第一条
      const item = totalData.value.find((item) => item.keyword === key);
      if (item) {
        item.yearTotal = Number(
          parseFloat(result.value[key][0].数据).toFixed(0)
        );
      }
    }
  });
  fetchDataMonth().then(() => {
    for (const key in resultMonth.value) {
      const itemMonth = totalData.value.find(
        (item) => item.keywordMonth === key
      );
      if (itemMonth) {
        itemMonth.monthTotal = Number(
          parseFloat(resultMonth.value[key][0].数据).toFixed(0)
        );
      }
    }
  });
};

const handleClickYear = (title: string) => {
  switch (title) {
    case "累计采购":
      router.push({
        name: "PurchaseAmount",
        query: {
          module: "purchaseAmount",
          companyName: "石化板块",
        },
      });
      break;
    case "累计销售":
      router.push({
        name: "SellAmount",
        query: {
          module: "sellAmount",
          companyName: "石化板块",
        },
      });
      break;
    case "可用资金":
      router.push({
        name: "Portfolio",
        query: {
          companyName: "石化板块",
          productType: "企业资金",
        },
      });
      break;
  }
};

const handleClickMonth = (title: string) => {
  console.log("handleClickMonth", title);
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
