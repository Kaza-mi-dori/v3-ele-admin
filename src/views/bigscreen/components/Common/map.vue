<template>
  <div class="map-wrapper">
    <div id="mapContainer" class="map-container" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const initMap = () => {
  //定义地图中心点坐标
  const center = new TMap.LatLng(35, 105);
  //定义map变量，调用 TMap.Map() 构造函数创建地图
  const map = new TMap.Map(document.getElementById("mapContainer"), {
    center: center, // 设置地图中心点坐标
    zoom: 2, //设置地图缩放级别
    viewMode: "2D",
    scaleControl: true, // 比例尺
    mapStyleId: "style1", // 自定义样式
  });
};

onMounted(() => {
  initMap();
});
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
