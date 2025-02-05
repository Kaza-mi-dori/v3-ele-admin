<template>
  <tlbs-map
    ref="mapContainer"
    api-key="4TYBZ-V2WCQ-IKX52-BEW3F-SDCA6-7DFMN"
    :center="center"
    :zoom="zoom"
    :control="control"
    :options="{
      mapStyleId: styleId,
    }"
    class="map-container"
    @click="onClickMap"
  >
    <!-- <tlbs-multi-marker
      ref="multiMarker"
      :geometries="geometries"
      :styles="styles"
      :options="options"
      @click="onClickGeo1"
    /> -->
    <tlbs-dom-overlay
      v-for="(item, index) in geometries"
      :key="index"
      :position="{
        lat: item.position.lat,
        lng: item.position.lng,
      }"
    >
      <div :style="{ cursor: 'pointer', textAlign: 'center' }">
        <img
          :src="
            item.styleId === 'gasStation'
              ? oil
              : item.styleId === 'oilDepot'
                ? gas
                : item.styleId === 'organization'
                  ? enterprise
                  : boat
          "
          :style="{
            width: '20px',
            height: '30px',
          }"
        />
        <el-popover
          popper-class="dark-popper"
          placement="top"
          width="200"
          trigger="hover"
        >
          <div class="pop-content">
            <div class="__title">
              <span>{{ item.properties && item.properties.label }}</span>
            </div>
            <div class="__desc">
              {{ item.properties && item.properties.description }}
            </div>
          </div>
          <template v-slot:reference>
            <div
              :class="{
                'gas-station': item.styleId === 'gasStation',
                'oil-depot': item.styleId === 'oilDepot',
                'oil-depot-zijian': getSubCategory(item) === 'oilDepotZijian',
                'oil-depot-zulin': getSubCategory(item) === 'oilDepotZulin',
                'oil-depot-jiameng': getSubCategory(item) === 'oilDepotJiameng',
                organization: item.styleId === 'organization',
                'charging-station': item.styleId === 'chargingStation',
              }"
              :data-name="item.properties.label"
              :style="{
                fontSize: '14px',
                transform:
                  item.styleId === 'oilDepot'
                    ? 'translateY(-4px)'
                    : item.styleId === 'organization'
                      ? 'translateY(-48px)'
                      : 'translateY(-14px)',
              }"
              @click="onClickGeo1"
            >
              {{ item.properties && item.properties.label }}
            </div>
          </template>
        </el-popover>
      </div>
    </tlbs-dom-overlay>
    <!-- <el-popover
      v-model:visible="windowVisible"
      popper-class="dark-popper"
      placement="top"
      width="200"
      trigger="click"
    >
      <div class="pop-content">
        <div class="__title">
          <span>{{ activeItem && activeItem.label }}</span>
        </div>
        <div class="__desc">
          <span>{{ activeItem && activeItem.description }}</span>
        </div>
      </div>
      <template v-slot:reference>
        <div
          :style="{
            position: 'absolute',
            top: windowY + 'px',
            left: windowX + 'px',
          }"
        />
      </template>
    </el-popover> -->
    <!-- 切换开关 -->
    <el-switch
      v-model="showOilDepot"
      class="custom-switch"
      active-color="#13ce66"
      inactive-color="#FFD700"
      active-text="油库"
      inactive-text="油站"
      style="
        position: absolute;
        font-size: 16px;
        z-index: 1001;
        bottom: 0;
        right: 10px;
      "
      @change="onToggleOilDepot"
    />
    <!-- 油站统计 -->
    <div
      v-if="!showOilDepot"
      class="oil-station-statistic"
      style="
        position: absolute;
        font-size: 16px;
        z-index: 1001;
        bottom: 40px;
        right: 10px;
      "
    >
      <div class="oil-station-statistic-item">
        <span>总数</span>
        <span>{{ oilStationStatistic.total }}</span>
      </div>
      <div class="oil-station-statistic-item">
        <span class="oil-depot-zijian">自建</span>
        <span>{{ oilStationStatistic.zijian }}</span>
      </div>
      <div class="oil-station-statistic-item">
        <span class="oil-depot-zulin">租赁</span>
        <span>{{ oilStationStatistic.zulin }}</span>
      </div>
      <div class="oil-station-statistic-item">
        <span class="oil-depot-jiameng">加盟</span>
        <span>{{ oilStationStatistic.jiameng }}</span>
      </div>
    </div>
    <!-- 库存统计 -->
    <div
      v-else
      class="oil-station-statistic"
      style="
        position: absolute;
        width: 22rex;
        font-size: 16px;
        z-index: 1001;
        bottom: 40px;
        right: 10px;
      "
    >
      <div class="oil-station-statistic-item">
        <span class="oil-depot-jiameng">库存总量</span>
        <span>{{ oilStockStatistic.total }}吨</span>
      </div>
      <div class="oil-station-statistic-item">
        <span class="oil-depot-zulin">东莞盛源库</span>
        <span>{{ oilStockStatistic.shengyuan }}吨</span>
      </div>
      <div class="oil-station-statistic-item">
        <span class="oil-depot-zulin">钦州永盛库</span>
        <span>{{ oilStockStatistic.yongsheng }}吨</span>
      </div>
      <div class="oil-station-statistic-item">
        <span class="oil-depot-zulin">钦州广明库</span>
        <span>{{ oilStockStatistic.guangming }}吨</span>
      </div>
      <div class="oil-station-statistic-item">
        <span class="oil-depot-zulin">来宾古瓦库</span>
        <span>{{ oilStockStatistic.guwa }}吨</span>
      </div>
      <div class="oil-station-statistic-item">
        <span class="oil-depot-zulin">恒润厂区库</span>
        <span>{{ oilStockStatistic.hengrun }}吨</span>
      </div>
    </div>
  </tlbs-map>
</template>

<script setup lang="ts">
import { ref } from "vue";
import boat from "@/views/bigscreen/img/boat2.png";
import oil from "@/views/bigscreen/img/oil_medium.png";
// import gas from "@/views/bigscreen/img/oil2_medium.png";
// import oil from "@/views/bigscreen/img/product_icon3.png";
import gas from "@/views/bigscreen/img/product_icon3.png";
import enterprise from "@/views/bigscreen/img/enterprise.png";
import { MapElementEnumMap, MapElementEnum } from "@/enums/BusinessEnum";
import { getDistrict } from "@/api/thirdSystem/tmap";
import { useDataIndex } from "@/hooks/useDataIndex";
import { inject } from "vue";

const props = defineProps({
  /** 标记点 */
  markers: {
    type: Array,
    default: () => [],
  },
});

const keywordMap = {
  成品油库存量: "1944e9e1626",
  盛源汽油库存量: "1944df2de3c",
  盛源柴油库存量: "1944df32f1c",
  永盛汽油库存量: "1944df20525",
  永盛柴油库存量: "1944df2800d",
  古瓦汽油库存量: "194d01a22cd",
  古瓦柴油库存量: "194d019da43",
  广明汽油库存量: "194d01a8a4a",
  广明柴油库存量: "194d01ab28b",
  恒润汽油库存量: "194d01b3637",
  恒润柴油库存量: "194d01af131",
};

const totalOilStockHook = useDataIndex(
  [
    keywordMap["成品油库存量"],
    keywordMap["盛源汽油库存量"],
    keywordMap["盛源柴油库存量"],
    keywordMap["永盛汽油库存量"],
    keywordMap["永盛柴油库存量"],
    keywordMap["古瓦汽油库存量"],
    keywordMap["古瓦柴油库存量"],
    keywordMap["广明汽油库存量"],
    keywordMap["广明柴油库存量"],
    keywordMap["恒润汽油库存量"],
    keywordMap["恒润柴油库存量"],
  ],
  11,
  undefined,
  undefined
);

const emit = defineEmits(["clickGeo"]);

const currentMonitor = inject("currentMonitor") as Ref<string>;

const showOilDepot = ref(true); // 默认显示油库
const mapContainer = ref<any>(null);
const multiMarker = ref<any>(null);
// lat是纬度，lng是经度
// 中国内陆中心点经纬度：lat: 35, lng: 105
// const center = ref({ lat: 35, lng: 105 });
// 广西经纬度：lat: 39.91799, lng: 116.397027
const center = ref({ lat: 30, lng: 108.3734508 });
// zoom小于3时，应该展示聚合
const zoom = ref(3);
const position1 = ref({ lat: 39.91799, lng: 116.397027 });
const offset1 = ref({ x: 0, y: -30 });
// const onClick = (e: Event) => {
//   console.log(e);
// };
const styleId = "style1";
const control = {
  scale: {},
  zoom: {
    position: "bottomRight",
  },
};
// const geometries = [
//   { styleId: "marker", position: { lat: 39.91799, lng: 116.397027 } },
// ];
const geometries = ref<any[]>([]);
const allGeometries = ref<any[]>([]); // 所有的点
const styles = {
  marker: {
    width: 20,
    height: 30,
    anchor: { x: 10, y: 30 },
  },
  // 加油站marker
  gasStation: {
    width: 20,
    height: 30,
    src: oil,
    // 浅红色
    color: "#FFD700",
    // size: 12,
    direction: "bottom",
    // direction: "top",
    offset: { x: 0, y: -10 },
    // anchor: { x: 10, y: 30 },
  },
  // 油库marker
  oilDepot: {
    width: 20,
    height: 30,
    src: gas,
    // 浅黄色
    color: "#FFD700",
    direction: "bottom",
    // size: 12,
    // direction: "top",
    offset: { x: 0, y: -10 },
    // anchor: { x: 10, y: 30 },
  },
  // 油船marker
  chargingStation: {
    width: 20,
    height: 30,
    direction: "bottom",
    color: "#DC8148",
    // size: 18,
    src: boat,
    anchor: { x: 10, y: 30 },
  },
  // 组织结构marker
  organization: {
    width: 20,
    height: 30,
    direction: "top",
    color: "#FFFFFF",
    size: 18,
    anchor: { x: 10, y: 30 },
  },
};
const options = {
  minZoom: 1,
  maxZoom: 15,
};

// 统计数据
const oilStationStatistic = ref({
  total: 0,
  zijian: 0,
  zulin: 0,
  jiameng: 0,
});
const oilStockStatistic = ref({
  total: 0,
  yongsheng: 0,
  shengyuan: 0,
  guwa: 0,
  guangming: 0,
  hengrun: 0,
});

/** 显示弹窗的位置 */
const windowVisible = ref(false);
const windowCenter = ref({ lat: 0, lng: 0 });
const windowX = ref(0);
const windowY = ref(0);
/** 当前互动的点 */
const activeItem = ref<any>();

const setCenter = (lat: number, lng: number) => {
  center.value = { lat, lng };
};

const setMarker = (lat: number, lng: number) => {
  geometries.value.push({ styleId: "marker", position: { lat, lng } });
};

const setZoom = (value: number) => {
  zoom.value = value;
};

// 找到离x,y 最近的geometry
// 由于每个元素可以计算出xOffset,yOffset，所以可以计算出每个元素的中心点
// 然后计算每个元素的中心点与x,y的距离，找到最小的那个
const getNearestGeometry = (x: number, y: number) => {
  let minDistance = Infinity;
  let nearestGeometry = null;
  geometries.value.forEach((geometry) => {
    // 找到data-name为geometry.content的元素
    const dom = document.querySelector(`[data-name="${geometry.content}"]`);
    if (dom) {
      // 计算元素对于地图的xOffset,yOffset
      const { x: domX, y: domY } = dom.getBoundingClientRect();
      const distance = Math.sqrt((domX - x) ** 2 + (domY - y) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
        nearestGeometry = geometry;
      }
    }
  });
  // 只有当nearestGeometry存在且distance(像素)小于40时，才返回nearestGeometry
  if (nearestGeometry && minDistance < 40) {
    return nearestGeometry;
  }
  return null;
};

function onClickMap(e: any) {
  // const { x, y } = e.point;
  const { x, y } = e.originalEvent;
  try {
    const nearestGeometry = getNearestGeometry(x, y) as any;
    // 将x,y坐标emit出去，适配父组件显示的逻辑
    // emit("clickGeo", { x, y });
    if (nearestGeometry) {
      currentMonitor.value = nearestGeometry.content;
    }
  } catch (error) {
    console.error("onClickMap", error);
  }
}

const onClickGeo1 = (e: any) => {
  // console.log("ClickGeo!", e);
  const { geometry } = e;
  if (!geometry) return;
  const { x, y } = e.point;
  if (geometry) {
    windowCenter.value = geometry.position;
    windowVisible.value = true;
    windowX.value = x;
    windowY.value = y;
    activeItem.value = geometry.properties;
    // 将x,y坐标emit出去，适配父组件显示的逻辑
    // emit("clickGeo", { x, y });
    emit("clickGeo", geometry);
  }
};

function onToggleOilDepot() {
  geometries.value = allGeometries.value.filter((item) => {
    if (showOilDepot.value) {
      return (
        item.styleId === "oilDepot" ||
        item.styleId === "chargingStation" ||
        item.styleId === "organization"
      );
    } else {
      return item.styleId === "gasStation";
    }
  });
  if (showOilDepot.value) {
    // 中心恢复到初始
    // setCenter(22.8226, 108.3734508);
    setCenter(30, 112);
    setZoom(5);
  } else {
    // 中心设为广西广东交界，缩放到7
    setCenter(23.91799, 118.397027);
    setZoom(7);
  }
}

// 获取次级属性(主要针对油站)
const getSubCategory = (item: any) => {
  if (item.styleId === "gasStation") {
    if (item.properties) {
      const subCategory = item.properties.description?.substring(0, 2);
      switch (subCategory) {
        case "自建":
          return "oilDepotZijian";
        case "租赁":
          return "oilDepotZulin";
        case "加盟":
          return "oilDepotJiameng";
      }
    }
  }
  return null;
};

watch(
  () => props.markers,
  (newVal) => {
    // geometries.value.length = 0;
    allGeometries.value = [];
    newVal.forEach((item: any) => {
      // 统计油站数量
      if (item.type === MapElementEnumMap[MapElementEnum.GAS_STATION]) {
        oilStationStatistic.value.total++;
        if (item.description?.substring(0, 2) === "自建") {
          oilStationStatistic.value.zijian++;
        } else if (item.description?.substring(0, 2) === "租赁") {
          oilStationStatistic.value.zulin++;
        } else if (item.description?.substring(0, 2) === "加盟") {
          oilStationStatistic.value.jiameng++;
        }
      }
      if (!item.lat || !item.lng) return;
      // // 1219 当前只标注油库\油船\组织结构
      // if (
      //   item.type !== MapElementEnumMap[MapElementEnum.OIL_DEPOT] &&
      //   item.type !== MapElementEnumMap[MapElementEnum.OIL_SHIP] &&
      //   item.type !== MapElementEnumMap[MapElementEnum.ORGANIZATION]
      // )
      //   return;
      const lat = +item.lat;
      const lng = +item.lng;
      if (isNaN(lat) || isNaN(lng)) return;
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
      let styleId = "chargingStation";
      switch (item.type) {
        case MapElementEnumMap[MapElementEnum.ORGANIZATION]:
          styleId = "organization";
          break;
        case MapElementEnumMap[MapElementEnum.OIL_DEPOT]:
          styleId = "oilDepot";
          break;
        case MapElementEnumMap[MapElementEnum.OIL_SHIP]:
          styleId = "chargingStation";
          break;
        case MapElementEnumMap[MapElementEnum.GAS_STATION]:
          styleId = "gasStation";
          break;
      }
      allGeometries.value.push({
        styleId: styleId,
        position: { lat, lng },
        properties: item,
        content: item.label,
      });
    });
    onToggleOilDepot();
  },
  {
    immediate: true,
    deep: true,
  }
);

/**
 * 获取广西、广东、浙江行政区划数据，用于地图展示
 */
const getDistrictData = async () => {
  const res = await getDistrict("广西,广东,浙江");
  console.log(res);
};

onMounted(() => {
  // getDistrictData();
  setTimeout(() => {
    // 寻找class为logo-text的元素
    const logoText = document.querySelector(".logo-text") as HTMLElement;
    // console.log(logoText);
    // 如果找到了，则找其父元素，并隐藏
    if (logoText && logoText.parentElement) {
      logoText.parentElement.style.display = "none";
    }
    // 寻找class为tmap-zoom-control的元素
    const zoomControl = document.querySelector(
      ".tmap-zoom-control"
    ) as HTMLElement;
    // console.log(zoomControl);
    // 如果找到了，则找其父元素，并隐藏
    if (zoomControl && zoomControl.parentElement) {
      zoomControl.parentElement.style.display = "none";
    }
  }, 2000);
  totalOilStockHook.fetchData().then(() => {
    oilStockStatistic.value.total = 0;
    oilStockStatistic.value.yongsheng = 0;
    oilStockStatistic.value.shengyuan = 0;
    for (const key in totalOilStockHook.result.value) {
      switch (key) {
        case keywordMap["成品油库存量"]:
          oilStockStatistic.value.total =
            totalOilStockHook.result.value[key]?.[0]?.["数据"];
          break;
        case keywordMap["盛源汽油库存量"]:
          oilStockStatistic.value.shengyuan += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["永盛汽油库存量"]:
          oilStockStatistic.value.yongsheng += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["盛源柴油库存量"]:
          oilStockStatistic.value.shengyuan += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["永盛柴油库存量"]:
          oilStockStatistic.value.yongsheng += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["恒润汽油库存量"]:
          oilStockStatistic.value.hengrun += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["恒润柴油库存量"]:
          oilStockStatistic.value.hengrun += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["广明汽油库存量"]:
          oilStockStatistic.value.guangming += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["广明柴油库存量"]:
          oilStockStatistic.value.guangming += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["古瓦汽油库存量"]:
          oilStockStatistic.value.guwa += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
        case keywordMap["古瓦柴油库存量"]:
          oilStockStatistic.value.guwa += Number(
            totalOilStockHook.result.value[key]?.[0]?.["数据"] ?? 0
          );
          break;
      }
    }
  });
});

watch(
  () => mapContainer.value?.$el,
  (newVal) => {
    if (newVal && newVal.$el) {
      const canvasDom = newVal.$el.querySelector("canvas");
      if (canvasDom) {
        canvasDom.classList.add("no-zoom");
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

defineExpose({
  setCenter,
  setZoom,
  setMarker,
});
</script>

<style lang="scss" scoped>
:deep(.el-switch) {
  .el-switch__label {
    span {
      font-size: 16px;
    }
    color: #ffffff;
    &.is-active {
      color: $bigscreen-primary-color-1;
    }
  }
}
.map-container {
  @apply w-full h-full absolute;
}
.pop-content {
  background-color: #303133;
  border-color: #303133;
  .__title {
    @apply lh-normal border-b-1 border-b-dark-1;
    color: #55a2f0;
    font-size: 18px;
  }
  .__desc {
    @apply text-sm;
    // 文字颜色改为比较护眼的暗色
    color: #c0c4cc;
    white-space: pre-line;
  }
}
.gas-station {
  color: #ffd700;
}
.oil-depot {
  color: #ffd700;
}
.oil-depot-zijian {
  color: #fbff00;
}
.oil-depot-zulin {
  color: #00f7ff;
}
.oil-depot-jiameng {
  color: #f0b47d;
}
.organization {
  color: #ffffff;
}
.charging-station {
  color: #dc8148;
}
.oil-station-statistic {
  @apply p-2 w-30;
  // 透明
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  .oil-station-statistic-item {
    @apply flex justify-between;
  }
}
</style>
