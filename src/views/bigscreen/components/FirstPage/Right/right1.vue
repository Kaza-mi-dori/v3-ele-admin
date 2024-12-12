<template>
  <div class="box1">
    <div class="__left">
      <Item1
        style="margin: 0 auto"
        :amount="oilData.oilBargain"
        title="成品油库存"
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
  let resData = res["当前记录"]?.[0]?.["内容"]?.["详情"] || [];

  const matchingItem = resData.find(
    (item: any) => item["业态类型"] === "成品油"
  );
  console.log("matchingItem", matchingItem);

  if (matchingItem) {
    const { 库存量, 当期销售量 } = matchingItem; // 解构赋值
    oilData.value = {
      oilStorage: 库存量,
      oilBargain: 当期销售量,
    };
  }
  console.log("oilData", oilData.value);
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
