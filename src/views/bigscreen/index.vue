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
                active: item.name === activeEntry && item.name === '石化总览',
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
          <div class="__title--text">广投石化驾驶舱</div>
        </div>
      </div>
      <div class="bg-view__body">
        <ScreenIndexContent style="position: relative" />
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import ScreenIndexContent from "./index-content.vue";
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
  const result = Object.keys(BusinessEnumMap)
    .filter((item) => item !== "其他" && item !== "仓储" && item !== "油站运营")
    .map((key) => {
      return {
        name: key,
        label: BusinessEnumMap[key as keyof typeof BusinessEnumMap],
      };
    });
  result.unshift({
    name: "石化总览",
    label: "石化总览",
  });
  return result;
});
const activeEntry = ref<string>("石化总览");

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
  if (item.name === "石化总览") {
    activeEntry.value = item.label;
    return;
  }
  const businessType = businessTypes2.find((type) => type.label === item.label);
  const routeName =
    businessTypeRouteNameMap[
      businessType?.name as keyof typeof businessTypeRouteNameMap
    ];
  if (businessType) {
    const route = router.resolve({
      // name: "Business",
      name: routeName,
      query: { businessName: businessType.name },
    });
    console.log("route", route);
    window.open(route.href, "_blank");
  }
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
  height: 100%;
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
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
}
.bg-view-img {
  width: 100%;
  height: 100%;
  background-image: url(./img/bg.jpg);
  background-size: cover;
}
.bg-view__header {
  width: 100%;
  height: 66px;
  display: flex;
  position: relative;
  .entry-container {
    position: absolute;
    z-index: 1;
    display: flex;
    bottom: 5px;
    left: 5px;
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
    position: absolute;
    z-index: 1;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    .weather-item__text {
      display: flex;
      align-items: center;
      justify-content: center;
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
    flex: 1;
    height: 66px;
    width: max-content;
    position: relative;
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
  overflow-y: hidden;
  // margin: 20px 0;
  padding: 20px 0 10px 0;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
</style>
