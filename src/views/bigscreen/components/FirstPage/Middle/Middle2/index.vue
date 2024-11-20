<template>
  <div class="middle2-box">
    <div class="map-box">
      <img class="map-img" src="../../../../img/country_map_bg.png" alt="" />
    </div>
    <div class="total-box">
      <div class="total-content">
        <div class="content1">
          <div class="title">油库</div>
          <div class="num">98</div>
        </div>
        <div class="content2">
          <div class="title">加油站</div>
          <div class="num">98</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>

<style lang="scss" scoped>
.middle2-box {
  text-align: center;
  padding: 10px;
}
.map-box {
  .map-img {
    width: 80%;
    padding: 10px 10px 0 10px;
  }
}
.total-box {
  display: flex;
  justify-content: flex-end;
  height: 30px;
  margin-top: -35px;
  margin-right: -10px;
  .total-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #062750;
    border: 1px #1d599a solid;
    color: #55a2f0;
    font-size: 14px;
  }
  .content1,
  .content2 {
    display: flex;
  }
  .content2 {
    margin-left: 15px;
  }
  .num {
    margin-left: 5px;
    font-size: 15px;
    font-weight: bold;
    color: #78ecf1;
  }
}
</style>
