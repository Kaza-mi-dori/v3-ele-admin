<template>
  <div class="box1">
    <div class="__left">
      <Item1
        style="margin: 0 auto"
        :amount="oilData.oilStorage"
        title="成品油库存量"
        :iconUrl="inventory"
      />
    </div>
    <div class="__right">
      <Item1
        style="margin: 0 auto"
        :amount="oilData.oilBargain"
        title="成品油交易量"
        :iconUrl="business"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Item1 from "../DescribeItems/Item1.vue";
import inventory from "@/views/bigscreen/img/inventory.png";
import business from "@/views/bigscreen/img/business.png";
import { ref } from "vue";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
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

let oilData = ref({
  oilStorage: "0",
  oilBargain: "0",
});

const keywordMap = {
  成品油库存量: "1944e9e1626",
  // 成品油交易量: "19415920653",
};

const oilStorageHook = useDataIndex(
  [keywordMap["成品油库存量"]],
  1,
  startOfYear(),
  endOfYear()
);

// const oilBargainHook = useDataIndex(
//   [keywordMap["成品油交易量"]],
//   1,
//   startOfYear(),
//   endOfYear()
// );

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
  let resData = res["当前记录"]?.[0]?.["内容"]?.["详情"] || [];

  const matchingItem = resData.find(
    (item: any) => item["业态类型"] === "成品油"
  );
  // console.log("matchingItem", matchingItem);

  if (matchingItem) {
    const { 库存量, 当期销售量, 当期采购量 } = matchingItem; // 解构赋值
    oilData.value = {
      oilStorage: 库存量,
      oilBargain: (
        parseFloat(当期销售量 || 0) + parseFloat(当期采购量 || 0)
      ).toFixed(0),
    };
    // 深拷贝
    oilData.value = JSON.parse(JSON.stringify(oilData.value));
  }
  // console.log("oilData", oilData.value);
  await oilStorageHook.fetchData();
  if (oilStorageHook.result.value[keywordMap["成品油库存量"]]) {
    oilData.value.oilStorage =
      oilStorageHook.result.value[keywordMap["成品油库存量"]][0].数据;
  }
  // await oilBargainHook.fetchData();
  // if (oilBargainHook.result.value[keywordMap["成品油交易量"]]) {
  //   oilData.value.oilBargain =
  //     oilBargainHook.result.value[keywordMap["成品油交易量"]][0].数据;
  // }
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.box1 {
  @apply flex items-center;
  background-image: url("@/views/bigscreen/img/tag_bg.png");
  background-size: 100% 100%;
  width: 100%;
  // height: 176px;
  .__left {
    @apply flex;
    width: 50%;
    height: 100%;
  }
  .__right {
    @apply flex;
    width: 50%;
    height: 100%;
  }
}
</style>
