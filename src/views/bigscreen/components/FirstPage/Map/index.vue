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
    position: "topRight",
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
  minZoom: 5,
  maxZoom: 15,
};

const styleId = "style1";
</script>
