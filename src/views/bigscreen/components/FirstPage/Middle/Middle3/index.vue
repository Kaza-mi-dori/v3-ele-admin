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
            <div>营收(万元)</div>
            <div class="revenue-num">{{ formatNumber(item.revenue) }}</div>
          </div>
          <div class="profit-total">
            <div>利润(万元)</div>
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
    类型集合: ["年"],
    日期晚于: startOfYear(), // 取当年数据,设置为当前年份的第一天
    日期早于: endOfYear(), // 取当年数据,设置为当前年份的最后一天
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
  @apply w-full h-full relative;
  padding: 10px;
  .middle1-bg {
    top: 0;
    left: 0;
    @apply w-full h-full absolute;
    object-fit: cover; /* 使图像覆盖整个父容器，并保持比例 */
  }
  .content-wrapper {
    @apply flex justify-around items-center;
  }
  .content-box {
    @apply flex flex-1 justify-center z-1;
    color: #ffffff;
    font-size: 16px;
    // 为奇数孩子节点时给下面的孩子节点加动画
    &:nth-child(odd) {
      .title-icon {
        animation: updown 8s cubic-bezier(0.075, 0.82, 0.165, 1) infinite;
        @keyframes updown {
          0% {
            transform: translateY(-3px);
          }
          25% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
          75% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-3px);
          }
        }
      }
    }
    &:nth-child(even) {
      .title-icon {
        animation: updown2 8s cubic-bezier(0.075, 0.82, 0.165, 1) infinite;
        @keyframes updown2 {
          0% {
            transform: translateY(0px);
          }
          25% {
            transform: translateY(-3px);
          }
          50% {
            transform: translateY(0px);
          }
          75% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      }
    }
  }
  .content-item {
    margin: auto 10px;
  }
  .title-box,
  .revenue-total,
  .profit-total {
    @apply flex;
  }
  .revenue-total {
    margin-top: 5px;
  }
  .profit-total {
    margin-top: 3px;
  }
  .title-box {
    @apply flex items-center;
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
