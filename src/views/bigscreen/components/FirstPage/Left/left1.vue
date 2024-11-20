<template>
  <Model1 class="model1" title="企业宣传">
    <div class="box1">
      <div class="item-img">
        <img src="../../../img/company.png" alt="" />
      </div>
      <div class="item-text">
        <div>{{ companyInfo }}</div>
      </div>
    </div>
  </Model1>
</template>

<script setup lang="ts">
import { ref } from "vue";
const companyInfo = ref(
  "广投集团作为广西最大的地方发电企业，近年来通过一系列的改革发展、实践创新，走出了一条独具特色的广西本土能源企业发展新路径，逐步将专业化从事能源产业投资、建设、运营、管理的二级平台公司广投能源集团打造成集水电、火电、核电、电网、天然气、油品化工等支柱能源为核心，风能、太阳能、氢能等新能源为补充的多元化大能源产业新格局，全力助推广西能源产业向清洁低碳化转型。"
);
</script>

<style lang="scss" scoped>
.model1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.box1 {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 10px;
  .item-img {
    flex: 1;
    text-align: center;
    margin: auto;
  }
  .item-text {
    flex: 1;
    color: #ffffff;
    font-size: 12px;
    letter-spacing: 1px;
  }
}
</style>
