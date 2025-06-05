<template>
  <div class="flex flex-wrap" style="align-content: flex-start">
    <!-- <div class="box" v-for="item in data" :key="item.title">
      <div class="title-box">
        <img :src="require('@/views/bigscreen/img/left_icon1.png')" class="title-icon" />
        <span>{{ item.title }}</span>
      </div>
      <div class="annual-total">
        <span>年度累计</span>
        <span class="year-num">{{ item.value }}</span>
        <span>{{ item.unit }}</span>
      </div>
    </div> -->
    <Item3
      v-for="item in data"
      :key="item.title"
      style="width: 30%; margin: 8px 1%"
      :title="item.title"
      :amount="item.value + ''"
      :unit="item.unit"
      :planAmount="item.planAmount"
      :iconUrl="item.iconUrl"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import icon1 from "@/views/bigscreen/img/product_icon1.png";
import icon2 from "@/views/bigscreen/img/product_icon2.png";
import icon3 from "@/views/bigscreen/img/product_icon3.png";
import icon4 from "@/views/bigscreen/img/product_icon4.png";
import icon5 from "@/views/bigscreen/img/product_icon5.png";
import icon6 from "@/views/bigscreen/img/product_icon6.png";
import Item3 from "@/views/bigscreen/components/FirstPage/DescribeItems/Item3.vue";
import { businessStoreHook } from "@/store/modules/business";
import { useDataIndex } from "@/hooks/useDataIndex";

const businessStore = businessStoreHook();

async function initChart() {}

const keywordMap = {
  成品油贸易累计合同数量: "1944e0aa665",
  化工及其他产品贸易累计合同数量: "1944e0de1ae",
  原油贸易累计合同数量: "1944e0c8e39",
  // "LNG贸易累计合同数量": "1944e0aa668",
  煤炭贸易累计合同数量: "1949ddb47ed",
  燃料油贸易累计合同数量: "194a07f15e8",
};

const { result, loading, error, fetchData } = useDataIndex(
  Object.values(keywordMap),
  6,
  undefined,
  undefined,
  true
);

const data = ref<any[]>([
  {
    title: "成品油",
    value: 100,
    unit: "万吨",
    keyword: keywordMap["成品油贸易累计合同数量"],
    iconUrl: icon1,
    planAmount: 150,
  },
  {
    title: "化工产品",
    value: 50,
    unit: "万吨",
    keyword: keywordMap["化工及其他产品贸易累计合同数量"],
    iconUrl: icon2,
  },
  {
    title: "原油",
    value: 100,
    unit: "万吨",
    keyword: keywordMap["原油贸易累计合同数量"],
    iconUrl: icon3,
    planAmount: 680,
  },
  { title: "LNG", value: 50, unit: "万吨", iconUrl: icon4 },
  {
    title: "煤炭",
    value: 100,
    unit: "万吨",
    keyword: keywordMap["煤炭贸易累计合同数量"],
    iconUrl: icon5,
  },
  {
    title: "燃料油",
    value: 50,
    keyword: keywordMap["燃料油贸易累计合同数量"],
    unit: "万吨",
    iconUrl: icon6,
    planAmount: 80,
  },
]);

const props = defineProps<{
  year: number;
}>();

// Add interface for the response type
interface BusinessReportResponse {
  内容?: {
    详情?: {
      结算数量?: number;
    }[];
  };
}

async function initData() {
  const res = await Promise.allSettled(
    data.value.map((item) =>
      businessStore.getBusinessReportMap(props.year.toString(), item.title)
    )
  );
  data.value.forEach((item, index) => {
    // 如果成功更新数据
    if (res[index].status === "fulfilled") {
      const { 结算数量: amount } =
        (res[index].value as BusinessReportResponse)?.["内容"]?.["详情"]?.[0] ||
        {};
      item.value = amount;
    } else {
      item.value = 0;
    }
  });
  await fetchData(
    `${props.year}-01-01 00:00:00`,
    `${props.year}-12-31 23:59:59`
  );
  // 将result.value中的数据赋值给totalData
  for (const key in result.value) {
    // 如果有数据，则取第一条
    const item = data.value.find((item) => item.keyword === key);
    if (item) {
      item.value = parseFloat(result.value[key][0].数据);
    }
  }
}

watch(
  () => props.year,
  async () => {
    await initData();
    initChart();
  }
);

onMounted(async () => {
  await initData();
  initChart();
});
</script>
