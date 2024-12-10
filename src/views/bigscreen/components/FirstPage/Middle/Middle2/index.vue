<template>
  <div class="middle2-box">
    <div class="map-box" :class="{ center: !showTotalNum }">
      <!-- <img class="map-img" src="../../../../img/country_map_bg.png" alt="" /> -->
      <div
        style="
          margin: 0 auto;
          width: 80%;
          height: auto;
          overflow: hidden;
          position: relative;
        "
      >
        <img
          v-if="showTotalNum"
          class="map-img"
          src="../../../../img/country_map_bg.png"
          style="width: 100%; height: auto; object-fit: cover"
          alt="描述"
        />
        <img
          v-else
          class="map-img"
          src="../../../../img/guangxi_map.png"
          style="width: 100%; height: auto; object-fit: cover"
          alt="描述"
        />
        <div
          v-for="item in posItems"
          :key="item.id"
          :style="{ left: item.x + 'px', top: item.y + 'px' }"
          class="pos-item"
        >
          <el-popover
            popper-class="dark-popper"
            placement="top-start"
            width="200"
          >
            <template #reference>
              <img height="17" :src="getIcon(item.iconName)" />
            </template>
            <div class="pop-content">
              <div class="__title">
                <span>{{ item.name }}</span>
              </div>
              <div class="__desc">
                <span>{{ item.desc }}</span>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div v-if="showTotalNum" class="total-box">
      <div class="total-content">
        <div class="content1">
          <div class="title">油库</div>
          <div class="num">
            <el-statistic :value="gasNumOutputValue" />
          </div>
        </div>
        <div class="content2">
          <div class="title">加油站</div>
          <div class="num">
            <el-statistic :value="oilNumOutputValue" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import oil from "@/views/bigscreen/img/oil.png";
import gas from "@/views/bigscreen/img/oil2.png";
import { GsLocationAPI } from "@/api/config/gsLocation";
import { ref } from "vue";
import { useTransition } from "@vueuse/core";

defineProps({
  showTotalNum: {
    type: Boolean,
    default: true,
  },
});

interface posItem {
  id: number;
  iconName?: string;
  name: string;
  desc: string;
  x: number;
  y: number;
  xPercent?: string;
  yPercent?: string;
  type?: string;
}

const mockPosItems: Ref<posItem[]> = ref([
  {
    id: 1,
    name: "钦州油库",
    desc: "永盛石化自建油库，含仓储租赁等业务",
    iconName: "gas",
    x: 749,
    y: 683,
  },
  {
    id: 2,
    name: "东莞油库",
    desc: "东莞油库",
    iconName: "gas",
    x: 805,
    y: 671,
  },
  {
    id: 3,
    name: "五合加油站",
    desc: "五合加油站",
    iconName: "oil",
    x: 730,
    y: 655,
  },
]);

const posItems: Ref<posItem[]> = ref([]);

const getIcon = (iconName: string | undefined) => {
  if (iconName === "oil") {
    return oil;
  } else if (iconName === "gas") {
    return gas;
  }
};

// 动态计算实际posItem所在位置，以1261*853为基准
const getPos = (pos: number, base: number) => {
  return (pos / base) * 100 + "%";
};

/** 获取地图元素 */
const initTableData = async () => {
  const params = {
    页码: 1,
    页容量: 200,
  };
  const res: any = await GsLocationAPI.getMapElementList(params);
  const table = res["当前记录"];
  oilNum.value = table.filter((item: any) => item["类型"] === "加油站").length;
  gasNum.value = table.filter((item: any) => item["类型"] === "油库").length;
  const mapImg = document.querySelector(".map-img") as HTMLElement;
  const height = parseFloat(window.getComputedStyle(mapImg).height);
  const width = parseFloat(window.getComputedStyle(mapImg).width);
  posItems.value = table.map((item: any) => {
    const x = parseInt(item["坐标"]?.split(",")[0]);
    const y = parseInt(item["坐标"]?.split(",")[1]);
    return {
      id: item["id"],
      name: item["名称"],
      desc: item["描述"],
      iconName: item["类型"] === "加油站" ? "oil" : "gas",
      x: (x / 1261) * width,
      y: (y / 853) * height,
    };
  });
};

onMounted(() => {
  nextTick(() => {
    // 计算出mapImg的实际渲染高度与宽度
    // setTimeout(() => {
    //   const mapImg = document.querySelector(".map-img") as HTMLElement;
    //   const height = parseFloat(window.getComputedStyle(mapImg).height);
    //   const width = parseFloat(window.getComputedStyle(mapImg).width);
    //   posItems.value = mockPosItems.value.map((item) => {
    //     return {
    //       ...item,
    //       x: (item.x / 1261) * width,
    //       y: (item.y / 853) * height,
    //       // xPercent: getPos(item.x, 1261),
    //       // yPercent: getPos(item.y, 853),
    //     };
    //   });
    // }, 500);
    initTableData();
  });
  // console.log(posItems.value);
  // nextTick(() => {
  //   // 计算出mapbox的高度，这个高度是和父元素一样的，是外部的flex布局控制的
  //   // 然后根据这个高度与比例，计算出map-img的宽度
  //   const mapBox = document.querySelector(".map-box");
  //   const mapImg = document.querySelector(".map-img");
  //   if (mapBox && mapImg) {
  //     console.log(mapBox.clientHeight);
  //     const mapBoxHeight = window.getComputedStyle(mapBox).height;
  //     console.log(mapBoxHeight);
  //     const mapImgWidth = (1261 / 853) * parseInt(mapBoxHeight);
  //     mapImg.setAttribute("width", mapImgWidth + "px");
  //   }
  // });
});

const gasNum = ref(25);
const oilNum = ref(3);

const gasSource = ref(0);
const oilSource = ref(0);
const gasNumOutputValue = useTransition(gasSource, {
  duration: 2000,
});
const oilNumOutputValue = useTransition(oilSource, {
  duration: 2000,
});
gasSource.value = gasNum.value;
oilSource.value = oilNum.value;
</script>

<style lang="scss" scoped>
.middle2-box {
  @apply w-full h-full;
  text-align: center;
  padding: 10px;
}
.map-box {
  position: relative;
  height: 100%;
  // width: 100%;
  // .map-img {
  //   width: 80%;
  //   height: auto;
  //   // height: 100%;
  // }
  .pos-item {
    position: absolute;
  }
}
.total-box {
  display: flex;
  justify-content: flex-end;
  // height: 30px;
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
    color: #78ecf1;
  }
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
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
  }
}

::v-deep(.el-statistic__content) {
  all: unset;
}
</style>
