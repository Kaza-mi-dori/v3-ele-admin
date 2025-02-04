<template>
  <div
    id="bg-container"
    ref="container"
    v-loading="loading"
    element-loading-text="页面加载中"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    class="bg-view"
  >
    <div v-if="showOtherContent" class="bg-view-img">
      <img style="position: absolute; top: 0" height="100vh" />
      <div class="bg-view__header">
        <!-- 绝对定位悬挂入口 -->
        <div class="entry-container">
          <div
            v-for="(item, index) in entryList"
            :key="index"
            class="entry-item"
          >
            <div
              class="entry-container-item"
              :class="{
                active: item.name === activeEntry && item.name === '石化板块',
              }"
              @click="handleEntryClick(item)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
        <!-- 绝对定位悬挂天气 -->
        <div class="weather-container">
          <!-- 日期 -->
          <div class="weather-item__text">
            <div class="weather-item__text--2">{{ date }}</div>
            <div class="weather-item__text--2">{{ today }}</div>
            <div class="weather-item__text--2">晴</div>
            <div class="weather-item__text--2">25℃</div>
          </div>
        </div>
        <div class="title">
          <div class="__title--text">石化板块驾驶舱</div>
        </div>
      </div>
      <div class="bg-view__body">
        <canvas
          id="first-page-bg-canvas-1"
          style="position: absolute; z-index: 0; top: 0; left: 0"
        />
        <div
          class="scroll-text"
          style="
            position: absolute;
            z-index: 1000;
            top: -3px;
            font-size: 20px;
            text-align: center;
            color: red;
          "
        >
          1. 不准开展背离主业的贸易业务。 2.
          不准参与特定利益关系企业间开展的无商业目的的贸易业务。 3.
          不准在贸易业务中人为增加不必要的交易环节。 4.
          不准开展任何形式的融资性贸易。 5.
          不准开展对交易标的没有控制权的空转、走单等贸易业务。 6.
          不准开展无商业实质的循环贸易。 7.
          不准开展有悖于交易常识的异常贸易业务。 8.
          不准开展风险较高的非标仓单交易。 9.
          不准违反会计准则规定确认代理贸易收入。 10.
          不准在内控机制缺乏的情况下开展贸易业务。
        </div>
        <ScreenIndexContent style="position: relative" />
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import ScreenIndexContent from "./index-content.vue";
import { RollingStarrySky } from "./components/Common/DynamicBG/rollingStarrySky";
import { ref, computed } from "vue";
import router from "@/router";
import { businessStore, companyStore } from "@/store";
import Map from "./components/FirstPage/Map/index.vue";
import { GsLocationAPI } from "@/api/config/gsLocation";
import { BusinessEnum, BusinessEnumMap } from "@/enums/BusinessEnum";
import {
  businessTypes2,
  navItem,
  businessTypeRouteNameMap,
} from "./components/constants";
import {
  PerformanceMonitor,
  PerformanceInfo,
} from "@/utils/perfomance-monitor";
const performanceData = ref<PerformanceInfo>({
  fps: 0,
  frameTime: 0,
  longFrames: 0,
  memoryUsage: undefined,
});

const starrySky = new RollingStarrySky();
const performanceMonitor = new PerformanceMonitor((info) => {
  performanceData.value = info;

  // 性能警告
  if (info.fps < 20) {
    console.warn("低帧率警告:", info.fps);
  }
  if (info.longFrames > 5) {
    console.warn("卡顿帧数过多:", info.longFrames);
  }
  if (info.memoryUsage && info.memoryUsage.usedJSHeapSize > 100 * 1024 * 1024) {
    console.warn("内存占用过高");
  }
});
performanceMonitor.start();
const businessstore = businessStore();
const companystore = companyStore();
const loading = ref(true);
// 日期，第一个/替换为年-第二个/替换为月
const date = new Date()
  .toLocaleDateString()
  .replace(/(\d{4})\/(\d{1,2})\/(\d{1,2})/, "$1年$2月$3日");
/** 计算星期几 */
const today = computed(() => {
  const week = new Date().getDay();
  const weekMap = ["日", "一", "二", "三", "四", "五", "六"];
  return "星期" + weekMap[week];
});

/** 地图ref */
const mapRef = ref<any>();
/** 地图显示标注点 */
const gsMarkerList = ref<any[]>([]);
/** 二级入口(主营产品)列表 */
const entryList = computed(() => {
  // const result = Object.keys(BusinessEnumMap)
  //   .filter((item) => item !== "其他" && item !== "仓储" && item !== "油站运营")
  //   .map((key) => {
  //     return {
  //       name: key,
  //       label: BusinessEnumMap[key as keyof typeof BusinessEnumMap],
  //     };
  //   });
  const result = [
    {
      name: "Gtsh",
      label: "广投石化",
    },
    {
      name: "Kry",
      label: "开燃公司",
    },
    {
      name: "Gsshc",
      label: "桂盛桂轩",
    },
    {
      name: "Hry",
      label: "恒润公司",
    },
  ];
  result.unshift({
    name: "石化板块",
    label: "石化板块",
  });
  return result;
});
const activeEntry = ref<string>("石化板块");

const getGsMarkerList = async () => {
  const res: any = await GsLocationAPI.getAllMapElement();
  const list = res["当前记录"];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const newItem = {
      id: item.id,
      label: item.名称,
      description: item.描述,
      type: item.类型,
      iconName: item.类型 === "加油站" ? "gas" : "oil",
      xOffSet: item.坐标 ? item.坐标.split(",")[0] : null,
      yOffSet: item.坐标 ? item.坐标.split(",")[1] : null,
    };
    gsMarkerList.value.push({
      ...newItem,
      lng: item.坐标 ? item.坐标.split(",")[0] : null,
      lat: item.坐标 ? item.坐标.split(",")[1] : null,
    });
  }
};

// 如果是点击事件、滚轮事件，判断实际触发事件的元素，如果是地图，则阻止事件冒泡
const onClickContent = (e: MouseEvent) => {
  console.log(e.currentTarget, e.target);
  // 如果包含了middle2这个类，则由地图响应，否则由内容响应
  if (
    e.target instanceof HTMLElement &&
    e.target.classList.contains("middle2")
  ) {
    // 阻止事件冒泡
    e.stopPropagation();
  } else {
    console.log("点击了内容");
  }
};

const onWheelContent = (e: Event) => {
  // 父元素不响应这个事件，由子元素响应
  console.log(e.target, e.currentTarget);
  e.stopPropagation();
  // 当前会被z-index为1的元素响应, 要实现其不响应滚轮事件
};

// 点击入口
const handleEntryClick = (item: any) => {
  // 往下跳
  if (item.name === "石化板块") {
    activeEntry.value = item.label;
    return;
  }
  // const businessType = businessTypes2.find((type) => type.label === item.label);
  // const routeName =
  //   businessTypeRouteNameMap[
  //     businessType?.name as keyof typeof businessTypeRouteNameMap
  //   ];
  // if (businessType) {
  //   const route = router.resolve({
  //     // name: "Business",
  //     name: routeName,
  //     query: { businessName: businessType.name },
  //   });
  //   window.open(route.href, "_blank");
  // }
  // 0204 改动为按企业名称
  const route = router.resolve({
    name: item.name,
  });
  window.open(route.href, "_blank");
};

// 根据路由决定显示内容
const showOtherContent = computed(() => {
  return router.currentRoute.value.name == "BigScreenBoard";
});

/**
 * @description 初始化缩放,令要显示的内容可以在整个window内显示
 * 渲染的高度是一定的，这导致了窗口高度越小，zoom = originalHeight / windowHeight越大
 */
const initScale = () => {
  const originalWidth = 1920;
  // const originalHeight = 1080;
  // 渲染后读取容器的高度
  const bgContainer = ref<HTMLElement | null>(null);
  // +20是因为有padding，否则会有滚动条
  // const originalHeight = (bgContainer.value?.offsetHeight || 1080) + 0;
  // 首屏改为bg-view__header的高度 + bg-view__body的高度
  const headerDOM =
    (document.querySelector(".bg-view__header") as HTMLElement) ||
    (document.querySelector(".bg-view1__header") as HTMLElement);
  const bodyDOM =
    (document.querySelector(".bg-view__body") as HTMLElement) ||
    (document.querySelector(".bg-view1__body") as HTMLElement);
  const containerDOM = document.querySelector(".bg-view-img");
  // originalHeight: 完整渲染后的高度，需要用来计算缩放比例
  const originalHeight =
    headerDOM && bodyDOM ? headerDOM.offsetHeight + bodyDOM.offsetHeight : 1080;
  // console.log("originalHeight===", originalHeight);
  // const originalHeight = containerDOM
  //   ? containerDOM.clientHeight
  //   : headerDOM && bodyDOM
  //     ? headerDOM.clientHeight + bodyDOM.clientHeight
  //     : 1080;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const containerElement = document.getElementById("bg-container");
  // const containerElement = containerDOM as HTMLElement;
  if (!containerElement) return;
  const aspectRatio = 1920 / 1080;
  const ratio = windowWidth / windowHeight;
  // console.log(containerElement.computedStyleMap, '&', window.innerWidth)
  const newWidth = window.innerWidth * (originalHeight / windowHeight);

  // console.log('newWidth', newWidth)

  containerElement.style.width = newWidth + "px";

  const scale = windowHeight / originalHeight;
  document.body.style.zoom = scale + "";
  document.styleSheets[document.styleSheets.length - 1].insertRule(
    ":not(.map-container) > canvas { zoom: " + 1 / scale + " !important; }"
  );
  document.styleSheets[document.styleSheets.length - 1].insertRule(
    ":not(.map-container) > canvas { transform: scale(" +
      scale +
      ") !important; }"
  );
  document.styleSheets[document.styleSheets.length - 1].insertRule(
    "canvas { transform-origin: 0 0 !important; }"
  );

  if (!headerDOM || !bodyDOM) return;
  // zoom设置完毕之后，header和body的高度会变化，需要计算header的高度使得body占据父元素剩余的高度
  const headerHeight = headerDOM.offsetHeight;
  const containerHeight = containerElement.offsetHeight;
  const bodyHeight = containerHeight - headerHeight;
  bodyDOM.style.height = bodyHeight + "px";
};

onMounted(async () => {
  businessstore.getBusinessReportFormList(businessstore.queryForm);
  companystore.getCompanyReportFormList(companystore.queryForm2);
  await getGsMarkerList();
  // window.addEventListener("resize", () => {
  //   initScale();
  // });
  // window.addEventListener("wheel", onWheelContent);
  nextTick(() => {
    initScale();
    // 让所有echarts图表自适应
    setTimeout(() => {
      loading.value = false;
      window.dispatchEvent(new Event("resize"));
      const canvas = document.getElementById(
        "first-page-bg-canvas-1"
      ) as HTMLCanvasElement;
      if (canvas) {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        starrySky.setCanvas(canvas);
        starrySky.init();
      }
    }, 100);
  });
});

// 每次更新时，重新计算缩放
onUpdated(() => {
  nextTick(() => {
    initScale();
    // 让所有echarts图表自适应
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  });
});
</script>

<style lang="scss" scoped>
// ::-webkit-scrollbar {
//   width: 6px;
//   height: 6px;
// }
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   -webkit-box-shadow: inset 0 0 5px #7dbaef;
//   background: #7dbaef;
// }
// ::-webkit-scrollbar-track {
//   -webkit-box-shadow: inset 0 0 5px #7dbaef;
//   border-radius: 10px;
//   background: transparent;
// }
.bg-view {
  // min-width: 1750px;
  // min-height: 900px;
  // height: 1080px;
  // height: 100%;
  // width: 1920px;
  font-size: 12px;
  color: #bfbfbf;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: "tnum";
  // width: 100vw;
  overflow: hidden;
  font-family:
    PingFangSC,
    Microsoft YaHei,
    Helvetica Neue,
    Arial,
    sans-serif !important;
  font-weight: 400;
  overscroll-behavior: none;
  scroll-behavior: smooth;
  user-select: none;
  @apply flex flex-col h-full;
  &::-webkit-scrollbar {
    display: none;
  }
}
.bg-view-img {
  @apply w-full h-full;
  background-image: url(./img/bg.jpg);
  background-size: cover;
}
.bg-view__header {
  height: 66px;
  @apply w-full flex relative;
  .entry-container {
    @apply absolute z-1 flex bottom-[5px] left-[5px];
    .entry-container-item {
      text-align: center;
      color: $bigscreen-primary-color-1;
      background-image: url("./img/new-nav2.png");
      background-size: 100% 100%;
      font-size: 1rem;
      padding: 5px 5px;
      min-width: 90px;
      cursor: pointer;
      &:hover {
        color: #fff;
        background-image: url("./img/nav2_over.png");
      }
      &.active {
        font-size: 1.1rem;
        // 勾边
        text-shadow: 0 0 5px #fff;
        color: #fff;
        background-image: url("./img/new-nav1.png");
      }
    }
  }
  /** 天气 */
  .weather-container {
    @apply absolute z-1;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    .weather-item__text {
      @apply flex items-center justify-center;
      color: #fff;
      font-size: 1rem;
      .weather-item__text--1 {
        margin-right: 5px;
      }
      .weather-item__text--2 {
        font-size: 1.4rem;
        margin-right: 10px;
      }
    }
  }
  .title {
    @apply flex-1 relative;
    height: 66px;
    width: max-content;
    // top: clamp(10px, 25px, 30%);
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
    .__title--text {
      margin: auto 0;
      // margin-top: 8px;
      font-size: 2.5rem;
      letter-spacing: 6px;
      // line-height: px;
      font-weight: bold;
      text-align: center;
      // color: #70b9fd;
      // 字体颜色从rgb(163,243,250)到rgb(78,149,253)的均匀渐变
      background: linear-gradient(
        to bottom,
        rgb(163, 241, 251),
        rgb(78, 149, 253)
      );
      -webkit-background-clip: text; /* 兼容性设置 */
      -webkit-text-fill-color: transparent; /* 兼容性设置 */
      position: relative;
    }
  }
}
.bg-view__body {
  // height: 100%;
  // height: calc(100% - 66px);
  // overflow-y: auto; /* 纵向滚动条 */
  @apply relative;
  overflow-y: hidden;
  // margin: 20px 0;
  padding: 20px 0 10px 0;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

.scroll-text {
  width: auto;
  overflow-x: auto;
  white-space: nowrap;
  animation-name: leftToRight;
  animation-duration: 60s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  font-weight: 900;
  @keyframes leftToRight {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
}
</style>
