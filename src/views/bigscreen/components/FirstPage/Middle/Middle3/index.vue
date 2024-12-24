<template>
  <div class="middle1-box">
    <img class="middle1-bg" src="../../../../img/tag3.png" alt="" />
    <div class="content-wrapper">
      <div v-for="(item, index) in totalData" :key="index" class="content-box">
        <img class="title-icon" :src="titleArr[index].icon" />
        <div class="content-item">
          <div class="title-box">
            <div>{{ titleArr[index].title }}</div>
          </div>
          <div class="revenue-total">
            <div>营收</div>
            <div class="revenue-num">{{ formatNumber(item.revenue) }}</div>
          </div>
          <div class="profit-total">
            <div>利润</div>
            <div class="profit-num">{{ formatNumber(item.profit) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import refinedOilProductIcon from "../../../../img/refined_oil_product.png";
import crudeOilIcon from "../../../../img/crude_oil.png";
import chemicalProductIcon from "../../../../img/chemical_product.png";
import fuelOilIcon from "../../../../img/fuel_oil.png";

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

const titleArr = ref([
  {
    title: "成品油",
    icon: refinedOilProductIcon,
  },
  {
    title: "原油",
    icon: crudeOilIcon,
  },
  {
    title: "化工产品",
    icon: chemicalProductIcon,
  },
  {
    title: "燃料油",
    icon: fuelOilIcon,
  },
]);

let totalData = ref([]);

const formatNumber = (num: number | string): string => {
  if (Number(num) > 10000) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return num.toString(); // 直接返回原始数字，不格式化
  }
};

const initData = async () => {
  queryForm.value = {
    页码: 1,
    页容量: 1,
    企业名称: "广投石化",
    状态集合: ["有效"],
  };
  const res = await BusinessFormAPI.getCompanyReportFormList(queryForm.value);
  let resData = res["当前记录"]?.[0]?.["内容"]?.["详情"] || [];

  // 遍历 titleArr，找到对应的业态类型并赋值
  const mappedData = titleArr.value.map((titleItem) => {
    // 根据业态类型查找匹配的项
    const matchingItem = resData.find(
      (item) => item["业态类型"] === titleItem.title
    );

    // 如果找到了匹配项，则返回利润和营收的对象
    if (matchingItem) {
      return {
        title: titleItem.title,
        revenue: matchingItem["当期营收金额"],
        profit: matchingItem["当期利润金额"],
      };
    }

    // 如果没有找到匹配项，返回默认的空数据
    return {
      title: titleItem.title,
      revenue: "0",
      profit: "0",
    };
  });

  // 将映射后的数据赋值给 totalData
  totalData.value = mappedData;
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.middle1-box {
  position: relative; /* 确保父元素的布局设置好 */
  width: 100%; /* 父元素宽度占满父容器 */
  height: 100%; /* 父元素高度占满父容器 */
  padding: 10px;
  .middle1-bg {
    position: absolute; /* 使图像脱离文档流 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 使图像覆盖整个父容器，并保持比例 */
  }
  .content-wrapper {
    display: flex;
    justify-content: space-around; /* 平均分配每个div之间的空间 */
    align-items: center;
  }
  .content-box {
    flex: 1;
    display: flex;
    justify-content: center;
    z-index: 1; /* 确保文字在背景图片上方 */
    color: #ffffff;
    font-size: 16px;
  }
  .content-item {
    margin: auto 10px;
  }
  .title-box,
  .revenue-total,
  .profit-total {
    display: flex;
  }
  .revenue-total {
    margin-top: 5px;
  }
  .profit-total {
    margin-top: 3px;
  }
  .title-box {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
  .title-icon {
    width: 50px;
    margin-left: 5px;
    margin-right: 5px;
    display: block;
  }
  .revenue-num,
  .profit-num {
    margin: 0 5px;
  }
  .revenue-num {
    color: #d6e337;
  }
  .profit-num {
    color: #12f5fb;
  }
}
</style>
