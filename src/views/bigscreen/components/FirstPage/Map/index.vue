<template>
  <tlbs-map
    ref="map"
    api-key="OVGBZ-AB4KU-RE5VF-GWC3I-7M3G5-X4BUJ"
    :center="center"
    :zoom="zoom"
    :control="control"
    :options="{
      mapStyleId: 'style1',
    }"
  >
    <tlbs-multi-marker
      :geometries="geometries"
      :styles="styles"
      :options="options"
      @click="onClickGeo"
    />
    <!-- <tlbs-info-window
      :visible="windowVisible"
      :position="windowCenter"
      :content="windowContent"
      :options="windowOptions"
      enableCustom
      @close="onCloseWindow"
    /> -->
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
          data-index="1"
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
// import { Map } from "@tencent/tlbs";
import { ref } from "vue";
import { MapElementEnum, MapElementEnumMap } from "@/enums/BusinessEnum";
import boat from "@/views/bigscreen/img/boat2.png";
import oil from "@/views/bigscreen/img/oil_medium.png";
import gas from "@/views/bigscreen/img/oil2_medium.png";

const props = defineProps({
  markers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["clickGeo"]);

const map = ref<any>(null);
// lat是纬度，lng是经度
// 广西经纬度：lat: 39.91799, lng: 116.397027
const center = ref({ lat: 22.8226, lng: 108.3734508 });
// 地图宽度、高度
const size = ref({ width: 800, height: 600 });
const zoom = ref(5);
// const onClick = (e: Event) => {
//   console.log(e);
// };
const control = {
  scale: {},
  zoom: {
    position: "topRight",
  },
};
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
    size: 12,
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
    size: 18,
    // direction: "top",
    offset: { x: 0, y: -10 },
    // anchor: { x: 10, y: 30 },
  },
  // 油船marker
  chargingStation: {
    width: 20,
    height: 30,
    direction: "bottom",
    size: 18,
    // src: boat,
    anchor: { x: 10, y: 30 },
  },
  // 组织结构marker
  organization: {
    width: 20,
    height: 30,
    direction: "bottom",
    color: "#FFFFFF",
    size: 18,
    anchor: { x: 10, y: 30 },
  },
};
const options = {
  minZoom: 5,
  maxZoom: 15,
};

const styleId = "style1";

const windowVisible = ref(false);
const windowCenter = ref({ lat: 0, lng: 0 });
const activeItem = ref<any>();
// el-popover字符串
const infoDOM = `
  <el-popover>
    <p>这是一个气泡</p>
    <p>这是一个气泡</p>
    <p>这是一个气泡</p>
  </el-popover>
`;
const windowContent = ref(infoDOM);
const windowX = ref(0);
const windowY = ref(0);
const windowOptions = {
  offset: { x: 0, y: 0 },
};

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
  // console.log("onClickGeo", e);
  const { geometry } = e;
  if (!geometry) return;
  const { x, y } = e.point;
  if (geometry) {
    switch (geometry.styleId) {
      case "gasStation":
        console.log("gasStation");
        break;
      case "oilDepot":
        console.log("oilDepot");
        break;
      case "chargingStation":
        console.log("chargingStation");
        break;
      default:
        console.log("default");
    }
    windowCenter.value = geometry.position;
    windowVisible.value = true;
    windowX.value = x;
    windowY.value = y;
    activeItem.value = geometry.properties;
    // 将x,y坐标emit出去，适配父组件显示的逻辑
    // emit("clickGeo", { x, y });
  }
};

const onCloseWindow = () => {
  console.log("onCloseWindow");
  windowVisible.value = false;
};

defineExpose({
  setCenter,
  setZoom,
  setMarker,
});

watch(
  () => props.markers,
  (newVal) => {
    // console.log("markers,", newVal);
    geometries.value.length = 0;
    newVal.forEach((item: any) => {
      if (!item.lat || !item.lng) return;
      // 只标注油库\油船\组织结构
      if (
        item.type !== MapElementEnumMap[MapElementEnum.OIL_DEPOT] &&
        item.type !== MapElementEnumMap[MapElementEnum.OIL_SHIP] &&
        item.type !== MapElementEnumMap[MapElementEnum.ORGANIZATION]
      )
        return;
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
      geometries.value.push({
        styleId: styleId,
        position: { lat, lng },
        properties: item,
        content: item.label,
      });
    });
    // console.log("geometries,", geometries.value);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
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
  }
}
</style>
