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
  >
    <tlbs-multi-marker
      :geometries="geometries"
      :styles="styles"
      :options="options"
      @click="onClickGeo"
    />
    <el-popover
      v-model:visible="windowVisible"
      popper-class="dark-popper"
      placement="top"
      width="200"
      trigger="click"
    >
      <!-- 内容 -->
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
    </el-popover>
  </tlbs-map>
</template>

<script setup lang="ts">
import { ref } from "vue";
import boat from "@/views/bigscreen/img/boat2.png";
import oil from "@/views/bigscreen/img/oil_medium.png";
import gas from "@/views/bigscreen/img/oil2_medium.png";
import { MapElementEnumMap, MapElementEnum } from "@/enums/BusinessEnum";

const props = defineProps({
  /** 标记点 */
  markers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["clickGeo"]);

const map = ref(null);
// lat是纬度，lng是经度
// 中国内陆中心点经纬度：lat: 35, lng: 105
// const center = ref({ lat: 35, lng: 105 });
// 广西经纬度：lat: 39.91799, lng: 116.397027
const center = ref({ lat: 22.8226, lng: 108.3734508 });
// 地图宽度、高度
const size = ref({ width: 800, height: 600 });
const zoom = ref(5);
const onClick = (e: Event) => {
  console.log(e);
};
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
    color: "#FF4500",
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
};
const options = {
  minZoom: 1,
  maxZoom: 15,
};

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

const onClickGeo = (e: any) => {
  const { geometry } = e;
  if (!geometry) return;
  const { x, y } = e.point;
  if (geometry) {
    // 如果要分类做处理
    // switch (geometry.styleId) {
    //   case "gasStation":
    //     console.log("gasStation");
    //     break;
    //   case "oilDepot":
    //     console.log("oilDepot");
    //     break;
    //   case "chargingStation":
    //     console.log("chargingStation");
    //     break;
    //   default:
    //     console.log("default");
    // }
    windowCenter.value = geometry.position;
    windowVisible.value = true;
    windowX.value = x;
    windowY.value = y;
    activeItem.value = geometry.properties;
    // 将x,y坐标emit出去，适配父组件显示的逻辑
    // emit("clickGeo", { x, y });
  }
};

watch(
  () => props.markers,
  (newVal) => {
    console.log("new", newVal);
    geometries.value.length = 0;
    newVal.forEach((item: any) => {
      if (!item.lat || !item.lng) return;
      // 1219 当前只标注油库与油船
      if (item.type !== "油库" && item.type !== "运油船") return;
      const lat = +item.lat;
      const lng = +item.lng;
      if (isNaN(lat) || isNaN(lng)) return;
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
      geometries.value.push({
        styleId:
          item.type === MapElementEnumMap[MapElementEnum.GAS_STATION]
            ? "gasStation"
            : item.type === MapElementEnumMap[MapElementEnum.OIL_DEPOT]
              ? "oilDepot"
              : "chargingStation",
        position: { lat, lng },
        properties: item,
        content: item.label,
      });
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

const styleId = "style1";

defineExpose({
  setCenter,
  setZoom,
  setMarker,
});
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  position: relative;
}
</style>
