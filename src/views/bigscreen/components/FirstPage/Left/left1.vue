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
            <br />
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

// const companyInfo = ref(
//   "广西广投石化有限公司是广西能源集团有限公司（占股比例为49%）以及广西广投产业链服务集团有限公司（占股比例为51%）的下属公司，隶属于广西投资集团（世界500强，广西百强企业首位，连续8年获AAA主体信用评级）。公司成立于2018年3月8日，注册资本金10亿元人民币，总资产67.44亿元。公司主要从事原油、燃料油、LPG、沥青、成品油、化工产品销售、煤炭销售、石化仓储物流、加油站开发运营及石化供应链金融服务等业务，在山东东营、广东东莞及广西钦州等地建立油品保障基地，以保证公司的石化产品供应服务。公司不断提高在国内石油贸易行业中的优势地位，与国内主营以及其他大型炼厂开展长期合作。公司年营业收入超300亿，年度供应体量超500万吨，近年来创造了良好的经营效益和社会效益自成立以来，广投石化保持了良好的发展态势，通过聚焦主业，拓展原油、燃料油、LPG等进口业务，充分利用国内国外两个市场，对外开展国际贸易，对内做好市场开拓，稳健经营，原料供应链及油品化工业务不断增长。2024年度荣登中国石油和化工行业500强榜单第73位，较2023排名大幅提升67位，连续三年上榜行业百强之列。公司积极整合广西投资集团旗下石化板块资源，实现了石化板块归口化专业管理、市场化经济引领和规模化快速发展，使石化板块形成集石油化工产品贸易、码头、仓储物流、交易中心、终端服务于一身的专业大型石化公司。在公司做大做强贸易业务的基础上，以供给侧结构性改革为主线，全面以上下游资源整合优势，与跨国石油公司和贸易公司的紧密合作以及与多家知名国际船东的客户建立了长期友好的合作关系。深度拓展进口原油、进口燃料油以及国际船舶的保税加油业务，服务国内外客户，在国内外市场和石油行业逐渐显著的竞争优势，销售总量和营收水平持续刷新历史记录，公司持续展示强劲的发展动力，引领地方经济高质量发展。展望未来，面对复杂的全球经济环境，以及国内产业转型升级的机遇，广投石化将继续坚持健立全产业发展格局，推动产业走向高端化，逐步占领产业链制高点，增强企业综合竞争力，打造石油化工产品全产业链的产业格局，推动石化板块走向高质量发展之道。"
// );

const companyInfo = ref(
  `广西广投能源集团有限公司（以下简称“广投能源集团”或“公司”）成立于2020年3月，其前身广西广投能源有限公司由广西投资集团方元电力股份有限公司和广西广投清洁能源有限公司于2018年5月通过机构改革重组合并而成，公司注册资本55.62亿元，是广西投资集团有限公司（以下简称“广投集团”）所属，专业化从事能源产业投资、建设、运营、管理的二级平台公司。广投能源集团以电力起家，经过多年的发展，现已打造成集水电、火电、核电、电网、天然气、油品化工等支柱能源为核心，风能、太阳能、氢能等新能源为补充的多元化大能源产业格局，业务遍及华南、西南、华中等国内区域，能源技术与服务输出到南亚、西亚、拉美等国外地区。
    2020年，广投能源集团资产总额达到466亿元，实现营收超400亿元，与“十二五”末相比，资产总额增长0.95倍，营业收入增长3.49倍，利润总额增长18.27倍，实现跨越式发展。在2020年中国能源企业500强中排名第25位，并连续多年获评双AA+主体信用评级，是广西最大的地方发电企业、广西首家进入中国氢能联盟企业、广西天然气中游管网建设运营主体，广西区内最大的石油和化工地方企业以及广西第二大城燃企业。`
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
  @apply flex flex-col h-full flex-1;
}
:deep(.el-carousel__container) {
  height: 180px;
}
.box1 {
  @apply w-full h-full flex px-2 overflow-hidden;
  .item-img {
    @apply flex-1 text-center m-auto;
  }
  .scroll-area {
    @apply overflow-hidden;
    flex: 1.1;
    max-height: 230px;
    margin: auto;
  }
  .item-text {
    flex: 1;
    color: #ffffff;
    font-size: 14px;
    letter-spacing: 1px;
    line-height: 20px;
    /* 包裹文字内容的容器 */
    .text-content {
      @apply flex flex-col;
    }
    // 需要有间隔时间，否则会出现闪烁
    animation: scroll 25s linear forwards infinite;
    animation-delay: 1s;
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
