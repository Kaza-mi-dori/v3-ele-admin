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
    @click="onClick"
  >
    <tlbs-multi-marker
      :geometries="geometries"
      :styles="styles"
      :options="options"
    />
  </tlbs-map>
</template>

<script setup lang="ts">
import { ref } from "vue";

const map = ref(null);
// lat是纬度，lng是经度
// 中国内陆中心点经纬度：lat: 35, lng: 105
const center = ref({ lat: 35, lng: 105 });
// 地图宽度、高度
const size = ref({ width: 800, height: 600 });
const zoom = ref(2);
const onClick = (e: Event) => {
  console.log(e);
};
const control = {
  scale: {},
  zoom: {
    position: "bottomRight",
  },
};
const geometries = [
  { styleId: "marker", position: { lat: 39.91799, lng: 116.397027 } },
];
const styles = {
  marker: {
    width: 20,
    height: 30,
    anchor: { x: 10, y: 30 },
  },
};
const options = {
  minZoom: 1,
  maxZoom: 15,
};

const styleId = "style1";
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  position: relative;
}
</style>
