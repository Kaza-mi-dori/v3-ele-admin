<template>
  <Model1 class="model1" title="企业宣传">
    <div class="box1">
      <!-- <div class="item-img">
        <img src="../../../img/company.png" alt="" />
      </div> -->
      <el-carousel
        class="item-img"
        style="height: 180px"
        :interval="5000"
        direction="vertical"
        :autoplay="true"
        indicator-position="none"
      >
        <el-carousel-item v-for="item in imgList" :key="item">
          <img :src="item" height="180" alt="" />
        </el-carousel-item>
      </el-carousel>
      <div class="scroll-area">
        <div
          class="item-text"
          @mouseover="handleMouseoverText"
          @mouseout="handleMouseoutText"
        >
          <!-- 初始内容及复制内容 -->
          <div class="text-content">
            <div>{{ companyInfo }}</div>
            <div>{{ companyInfo }}</div>
          </div>
        </div>
      </div>
    </div>
  </Model1>
</template>

<script setup lang="ts">
import { ref } from "vue";
import companyImg from "../../../img/company.png";
import companyImage2 from "../../../img/company2.jpg";
import companyImage3 from "../../../img/company3.png";

const companyInfo = ref(
  "广西广投石化有限公司（简称“广投石化公司”）成立于2018年3月8日，注册资本10亿元，系广西投资集团有限公司下属子公司，是国有企业。广西投资集团有限公司（以下简称“广投集团”）成立于1988年，注册资本230亿元，广投集团属广西壮族自治区人民政府国有资产监督管理委员会直接监管，广西区直属正厅级企业，连续5年进入《财富》世界500强，2024年位居第472位，连续7年位居广西百强企业首位；连续9年获AAA主体信用评级，获穆迪、惠誉授予“Baa2”“BBB”国际信用评级，为广西企业最高评级；2022年广西唯一入选首批国务院国资委“公司治理示范企业”；广投集团资产总额超8000亿元，年度贡献利税超百亿元。"
);

const imgList = [companyImg, companyImage2, companyImage3];

const handleMouseoverText = () => {
  // 停止动画
  const text = document.querySelector(".item-text") as HTMLElement;
  if (text) {
    text.style.animationPlayState = "paused";
  }
};

const handleMouseoutText = () => {
  // 开始动画
  const text = document.querySelector(".item-text") as HTMLElement;
  if (text) {
    text.style.animationPlayState = "running";
  }
};
</script>

<style lang="scss" scoped>
.model1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
:deep(.el-carousel__container) {
  height: 180px;
}
.box1 {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 10px;
  overflow: hidden;
  .item-img {
    flex: 1;
    text-align: center;
    margin: auto;
  }
  .scroll-area {
    flex: 1.1;
    max-height: 230px;
    margin: auto;
    overflow: hidden;
  }
  .item-text {
    flex: 1;
    color: #ffffff;
    font-size: 14px;
    letter-spacing: 1px;
    line-height: 20px;
    /* 包裹文字内容的容器 */
    .text-content {
      display: flex;
      flex-direction: column;
    }
    // 需要有间隔时间，否则会出现闪烁
    animation: scroll 25s ease-in forwards infinite;
    // animation-delay: 0.5s;
    @keyframes scroll {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-50%);
      }
    }
  }
}
</style>
