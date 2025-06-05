<template>
  <div class="box" @click="handleClick">
    <div class="box__icon">
      <img :src="props.iconUrl" alt="" />
    </div>
    <div class="box__content">
      <div class="box__title">
        {{ props.title }}
      </div>
      <div class="box__amount">
        <span class="__desc">年贸易量</span>
        <el-statistic
          class="animated-amount"
          :precision="2"
          :value="animatedAmount"
        />
        <span class="__unit">{{ props.unit }}</span>
      </div>
      <div class="box__amount">
        <span class="__desc">计划量</span>
        <el-statistic
          class="animated-amount"
          :precision="2"
          :value="animatedTarget"
        />
        <span class="__unit">{{ props.unit }}</span>
      </div>
      <div class="box__amount">
        <span class="__desc">完成率</span>
        <!-- <el-statistic
          class="animated-amount"
          :precision="2"
          :value="animatedFinished"
        />
        <span class="__unit">%</span> -->
        <!-- 换成进度条 -->
        <!-- <el-progress
          style="width: calc(100% - 3em)"
          :text-inside="true"
          :stroke-width="16"
          color="#0054BD"
          text-color="#fff"
          :percentage="animatedFinished"
        /> -->
        <div
          class="__bar-container"
          :style="{
            width: `calc(100% - 3em)`,
            backgroundColor: '#c1c1c1',
          }"
        >
          <div
            class="__bar"
            :style="{
              width: `calc(${Math.min(animatedFinished, 100)}%)`,
              backgroundColor: '#0180EB',
            }"
          >
            <span class="__text">{{ animatedFinished }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults, defineProps } from "vue";
import { useTransition } from "@vueuse/core";
import { businessTypes2, businessTypeRouteNameMap } from "../../constants";
import { useRouter } from "vue-router";

const router = useRouter();
const props = withDefaults(
  defineProps<{
    title?: string;
    amount?: string;
    planAmount?: string;
    iconUrl?: string;
    amountColor?: string;
    titleColor?: string;
    iconWidth?: number;
    iconHeight?: number;
    height?: number;
    unit?: string;
  }>(),
  {
    amountColor: "rgb(16,253,254)",
    titleColor: "white",
    title: "标题",
    amount: "0",
    planAmount: "10",
    iconWidth: 50,
    iconHeight: 50,
    height: 100,
    unit: "万吨",
  }
);

const source = ref(0);
const target = ref(0);
const finished = ref(0);
const animatedAmount = useTransition(source, {
  duration: 1000,
});
const animatedTarget = useTransition(target, {
  duration: 1000,
});
const animatedFinished = useTransition(finished, {
  duration: 1000,
});

function handleClick() {
  const businessName = businessTypes2.find(
    (item) => item.label === props.title
  )?.name;
  if (!businessName) {
    return;
  }
  const routeName =
    businessTypeRouteNameMap[
      businessName as keyof typeof businessTypeRouteNameMap
    ];
  // console.log(businessName, routeName);
  const route = router.resolve({
    // name: "Business",
    name: routeName,
    query: { businessName },
  });
  window.open(route.href, "_blank");
}

watch(
  () => props.amount,
  (val) => {
    // 将字符串转换为数字
    source.value = +parseFloat(val).toFixed(2);
    // source.value = val;
    // 确保转换后的值不会是 NaN
    if (isNaN(source.value)) {
      source.value = 0;
    }
    if (props.planAmount) {
      target.value = +parseFloat(props.planAmount).toFixed(2);
      if (target.value) {
        finished.value = Number(
          ((source.value / target.value) * 100).toFixed(2)
        );
      }
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
$title-text-color-bright: #b6d7db;
$title-text-color: #9dc1d0;
$number-color: #2abfff;
.box {
  @apply flex items-center cursor-pointer;
  margin: 0 auto;
  padding: 20px 5px;
  background-image: url("@/views/bigscreen/img/product_box.png");
  background-size: 100% 100%;
  .box__icon {
    width: 30px;
    height: 30px;
    @apply text-right;
    img {
      @apply w-full h-full;
    }
  }
  .box__content {
    @apply text-left;
    margin-left: 10px;
    font-family:
      PingFangSC,
      Microsoft YaHei,
      Helvetica Neue,
      Arial,
      sans-serif !important;
    .box__title {
      font-size: 1.2rem;
      color: $title-text-color-bright;
    }
    .box__amount {
      @apply flex;
      align-items: center;
      font-size: 1.2rem;
      color: $number-color;
      .__desc {
        margin-right: 10px;
        color: $title-text-color;
        font-size: 0.9rem;
      }
      .animated-amount {
        font-size: 0.9rem;
      }
      .__unit {
        margin-left: 5px;
        color: $title-text-color;
        font-size: 0.8rem;
      }
    }
  }
}

::v-deep(.el-statistic__content) {
  all: unset;
}

.__bar-container {
  @apply h-3.5 mb-3px ml-3px relative;
  // border-radius: 5px;
  .__bar {
    @apply h-full;
    // border-radius: 5px;
  }
  .__text {
    @apply text-sm text-center max-w-[5em] text-ellipsis overflow-hidden whitespace-nowrap text-white absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%];
    &:first-child {
      @apply font-bold;
    }
  }
}
</style>
