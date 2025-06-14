<template>
  <div class="bg-view-img2">
    <img style="position: absolute; top: 0" height="100vh" />
    <div class="bg-view1__header">
      <div class="title">
        <div class="__title--text">{{ title }}分析</div>
      </div>
    </div>
    <div class="bg-view1__body">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { OurCompanyEnum, OurCompanyEnumMap } from "@/enums/BusinessEnum";
import BusinessTypeScreen1 from "./BusinessTypeScreen1.vue";
import {
  BusinessFormatEnum,
  BusinessFormatEnumMap,
  ProductTypeToDisplayNameEnumMap,
} from "@/enums/BusinessEnum";
import { businessFormats } from "../../constants";

const route = useRoute();
const title = ref("");

const getCompanyName = (name: string) => {
  const companyName = route.query.companyName || "";
  // 检测是否在枚举值中
  const companyNameEnum = Object.values(OurCompanyEnumMap).find(
    (item) => item === companyName
  );
  return companyNameEnum || "";
};

const getProductTypeName = (name: string) => {
  const productType = route.query.productType || "";
  return productType;
};

onMounted(() => {
  // 取第一个路由参数("module=")
  const name = route.fullPath.split("/").pop()?.split("?")[0];
  const companyName = getCompanyName(name!);
  const productType = getProductTypeName(name!);
  const productTypeDisplayName =
    ProductTypeToDisplayNameEnumMap[productType] || productType;
  const companyDisplayName =
    productType.indexOf("公司") > -1 ? "" : companyName;
  switch (name) {
    case "revenue":
      title.value = `${companyDisplayName}${productTypeDisplayName ? `${productTypeDisplayName}` : ""}营收`;
      break;
    case "profit":
      title.value = `${companyDisplayName}${productTypeDisplayName ? `${productTypeDisplayName}` : ""}利润`;
      break;
    case "purchase":
      title.value = `${companyDisplayName}${productTypeDisplayName ? `${productTypeDisplayName}` : ""}采购量`;
      break;
    case "sale":
      title.value = `${companyDisplayName}${productTypeDisplayName ? `${productTypeDisplayName}` : ""}销售量`;
      break;
    case "purchaseAmount":
      title.value = `${companyDisplayName}${productTypeDisplayName ? `${productTypeDisplayName}` : ""}采购金额`;
      break;
    case "sellAmount":
      title.value = `${companyDisplayName}${productTypeDisplayName ? `${productTypeDisplayName}` : ""}销售金额`;
      break;
    case "contract":
      title.value = `${companyDisplayName}${productTypeDisplayName ? `${productTypeDisplayName}` : ""}合同`;
      break;
    case "portfolio":
      title.value = `${companyDisplayName}企业资金`;
      break;
    case "fixedCost":
      title.value = `${companyName}${productType ? `${productType}` : ""}固定成本`;
      break;
  }
});
</script>

<style lang="scss" scoped>
.bg-view-img2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  background-color: #030542;
}
.bg-view1__header {
  @apply w-full flex relative;
  height: 66px;
  .title {
    @apply flex flex-1 justify-center items-center;
    background-image: url(@/views/bigscreen/img/tit_bg.png);
    background-repeat: no-repeat;
    background-size: 80% 100%;
    background-position: center;
    .__title--text {
      @apply text-center font-bold relative;
      font-size: 2rem;
      letter-spacing: 6px;
      background: linear-gradient(
        to bottom,
        rgb(251, 254, 254),
        rgb(188, 247, 255)
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.bg-view1__body {
  // flex-grow: 1;
  // overflow-y: hidden;
  // margin: 20px 50px 50px 50px;
  padding: 10px 0 20px 0;
  // height: calc(100% - 66px);
  ::-webkit-scrollbar {
    @apply hidden;
  }
  scrollbar-width: none;
}
</style>
