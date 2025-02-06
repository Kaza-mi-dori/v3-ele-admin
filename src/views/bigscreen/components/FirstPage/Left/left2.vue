<template>
  <div class="model-box">
    <div class="model-header">
      <img class="model-header__bg" src="@/views/bigscreen/img/box2_top.png" />
      <div v-if="showHeader" class="model-title">
        <div class="model-title__text">{{ title }}</div>
      </div>
      <div class="model-select">
        <div class="demo-date-picker">
          <div class="block">
            <el-date-picker
              v-model="timeCondition"
              type="date"
              placeholder="请选择"
              size="small"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100px"
              :prefix-icon="customPrefix"
              class="custom-date-picker"
              popper-class="elDatePicker"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="model-body">
      <div class="model-body__content">
        <div v-for="(item, index) in contractData" :key="index">
          <img :src="backgroundImages[index]" alt="" />
          <div class="body-content">
            <div>{{ item.label }}</div>
            <div class="content-value">
              <div class="content-num">
                <el-statistic :value="outputValues[index]" />
              </div>
              <div class="content-unit">{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import yellowBg from "@/views/bigscreen/img/yellow_bg.png";
import blueBg from "@/views/bigscreen/img/blue_bg.png";
import greenBg from "@/views/bigscreen/img/green_bg.png";
import redBg from "@/views/bigscreen/img/red_bg.png";
import { h, ref, shallowRef } from "vue";
import { useTransition } from "@vueuse/core";
import BusinessFormAPI, { type BusinessReportQuery } from "@/api/businessForm";
import { startOfYear, endOfYear } from "@/utils/time"; // 导入工具类

// 定义背景图片数组
const backgroundImages = [yellowBg, blueBg, greenBg, redBg];

defineProps({
  title: {
    type: String,
    default: "Model",
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
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

const timeCondition = ref("");
const customPrefix = shallowRef({
  render() {
    return h("p", "");
  },
});
// 定义合同数据
let contractData = ref({});

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

  // 如果选择了日期，则过滤数据
  if (timeCondition.value) {
    resData = resData.filter(
      (item) => item["数据日期"] === timeCondition.value
    );
  }

  contractData.value = [
    { label: "合同总金额", value: 0, unit: "万元" },
    { label: "合同总数", value: 0, unit: "份" },
    { label: "采购合同", value: 0, unit: "份" },
    { label: "销售合同", value: 0, unit: "份" },
  ];

  const matchingItem = resData.find((item: any) => item["业态类型"] === "总体");

  contractData.value.forEach((contractItem, index) => {
    if (contractItem.label === "合同总金额") {
      contractItem.value = Number(matchingItem["累计合同履行金额"]) || 0;
    } else if (contractItem.label === "合同总数") {
      contractItem.value = Number(matchingItem["累计合同总份数"]) || 0;
    } else if (contractItem.label === "采购合同") {
      contractItem.value = Number(matchingItem["累计采购合同数"]) || 0;
    } else if (contractItem.label === "销售合同") {
      contractItem.value = Number(matchingItem["累计销售合同数"]) || 0;
    }
  });

  // 更新 outputValues
  updateOutputValues();
};

const outputValues = ref([]);

const updateOutputValues = () => {
  outputValues.value = contractData.value.map((item) => {
    const source = ref(0); // 初始值为 0
    const decimalPlaces = item.value.toString().includes(".")
      ? item.value.toString().split(".")[1].length
      : 0; // 获取小数位数

    const output = useTransition(source, {
      duration: 1000, // 动画持续时间
    });

    // 使用 Intl.NumberFormat 添加分隔符，并保持小数位数
    const formattedOutput = computed(() => {
      const numberFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
      return numberFormatter.format(output.value);
    });

    source.value = Number(item.value); // 设置目标值
    return formattedOutput;
  });
};

// 监听 timeCondition 的变化
watch(timeCondition, (newValue, oldValue) => {
  initData(); // 当时间条件变化时重新初始化数据
});

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.model-box {
  @apply relative w-full h-full flex flex-col;
  .model-header {
    // 让头部背景高度与头部一致
    @apply flex justify-between relative;
    .model-header__bg {
      @apply w-full h-full absolute top-0 bottom-0 left-0 right-0;
    }
    .model-title {
      @apply flex items-center relative;
      height: 33px;
      padding: 0 15px;
      .model-title__text {
        font-size: 18px;
        color: #fff;
        z-index: 1; /* 确保文字在背景图片上方 */
        font-family: 黑体;
        text-align: center; /* 防止内容过多时对齐异常 */
      }
    }
  }
  .model-select {
    margin: auto 0;
  }
  .model-body {
    @apply flex-1 relative;
    .model-body__bg {
      @apply absolute h-full m-2.5 top-0 bottom-0 left-0 right-0;
    }
    .model-body__content {
      @apply flex justify-center items-center w-full relative pl-[5px];
      padding-top: 5px;
      padding-bottom: 5px;
      overflow-x: hidden;
      // height: 100%;
      div {
        // height: 80%;
        @apply flex flex-1 justify-center items-center relative;
      }
      img {
        @apply absolute h-full top-0 bottom-0 left-0 right-0;
        // width: 100%;
        // 150%效果似乎更好
        width: 150%;
      }
      .body-content {
        @apply flex flex-col items-start justify-center text-left pl-[15px];
        font-size: 16px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #ffffff;
      }
      .content-value {
        @apply flex justify-center items-center;
        .content-num {
          font-size: 17px;
        }
        .content-unit {
          margin-left: 5px;
          font-size: 14px;
        }
      }
    }
  }
  .demo-date-picker {
    @apply flex flex-wrap w-full;
    padding: 0;
    margin-right: 15px;
  }
}
:deep(.el-input__prefix) {
  display: none;
}
:deep(.el-input__wrapper) {
  background-color: #0d2555;
  color: #7fa1f1;
  border-color: #0d2555;
  box-shadow: 0 0 0 1px #0d2555 inset;
}
/* 输入框内的文字颜色 */
:deep(.el-input__inner) {
  color: #7fa1f1;
  background-color: #0d2555;
}
/* 占位符的颜色 */
:deep(.el-input__inner::placeholder) {
  color: #7fa1f1;
}

::v-deep(.el-statistic__content) {
  all: unset;
}
</style>
