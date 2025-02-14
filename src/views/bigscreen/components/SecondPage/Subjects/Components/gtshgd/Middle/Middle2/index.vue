<template>
  <div class="middle2-box">
    <center-map :markers="gsMarkerList" />
    <!-- <div class="map-box" :class="{ center: !showTotalNum }">
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
        <el-popover
          popper-class="dark-popper"
          placement="top-start"
          width="200"
        >
          <template #reference>
            <div class="content1">
              <div class="title">油库</div>
              <div class="num">
                <el-statistic :value="gasNumOutputValue" />
              </div>
            </div>
          </template>
          <div class="total-pop-content">
            <div class="__desc">
              <div
                v-for="item in posItems.filter(
                  (item) => item['type'] === '油库'
                )"
                :key="item.id"
              >
                <div class="__title">
                  <span>{{ item.name }}</span>
                </div>
                <div class="__desc">
                  <span>{{ item.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-popover>
        <el-popover
          popper-class="dark-popper"
          placement="top-start"
          width="500"
        >
          <template #reference>
            <div class="content2">
              <div class="title">加油站</div>
              <div class="num">
                <el-statistic :value="oilNumOutputValue" />
              </div>
            </div>
          </template>
          <div class="total-pop-content">
            <div class="__desc">
              <div
                v-for="item in posItems.filter(
                  (item) => item['type'] === '加油站'
                )"
                :key="item.id"
              >
                <div class="__desc flex justify-between">
                  <span class="text-blue">{{ item.name }}</span>
                  <div>
                    <span
                      :class="{
                        'text-amber': item.status1 === '自建',
                        'text-green': item.status1 === '租赁',
                        'text-purple': item.status1 === '加盟',
                      }"
                    >
                      {{ item.status1 }}|
                    </span>
                    <span v-if="item.status2">{{ item.status2 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-popover>
        <el-popover
          popper-class="dark-popper"
          placement="top-start"
          width="500"
        >
          <template #reference>
            <div class="content3">
              <div class="title">运油船</div>
              <div class="num">
                <el-statistic :value="boatNumOutputValue" />
              </div>
            </div>
          </template>
          <div class="total-pop-content">
            <div class="__desc">
              <div
                v-for="item in posItems.filter(
                  (item) => item['type'] === '运油船'
                )"
                :key="item.id"
              >
                <div class="__desc flex justify-between">
                  <span class="text-blue">{{ item.name }}</span>
                  <span class="text-green">{{ item.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-popover>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import oil from "@/views/bigscreen/img/oil.png";
import gas from "@/views/bigscreen/img/oil2.png";
import { useRoute } from "vue-router";
import { GsLocationAPI } from "@/api/config/gsLocation";
import { ref } from "vue";
import { useTransition } from "@vueuse/core";
import CenterMap from "@/views/bigscreen/components/Common/map.vue";
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
  status1?: string;
  status2?: string;
}

/** 地图元素 */
const gsMarkerList = ref<any[]>([]);

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

const route = useRoute();
const routeName = route.name;

/** 获取地图元素 */
const initTableData = async () => {
  // const params = {
  //   页码: 1,
  //   页容量: 200,
  // };
  // const res: any = await GsLocationAPI.getMapElementList(params);
  // const table = res["当前记录"];
  // oilSource.value = table.filter(
  //   (item: any) => item["类型"] === "加油站"
  // ).length;
  // gasSource.value = table.filter((item: any) => item["类型"] === "油库").length;
  // boatSource.value = table.filter(
  //   (item: any) => item["类型"] === "运油船"
  // ).length;
  // const mapImg = document.querySelector(".map-img") as HTMLElement;
  // const height = parseFloat(window.getComputedStyle(mapImg).height);
  // const width = parseFloat(window.getComputedStyle(mapImg).width);
  // posItems.value = table.map((item: any) => {
  //   const x = parseInt(item["坐标"]?.split(",")[0]);
  //   const y = parseInt(item["坐标"]?.split(",")[1]);
  //   return {
  //     id: item["id"],
  //     name: item["名称"],
  //     desc: item["描述"],
  //     type: item["类型"],
  //     iconName: item["类型"] === "加油站" ? "oil" : "gas",
  //     x: (x / 1261) * width,
  //     y: (y / 853) * height,
  //     status1: item["描述"].split("，")[0],
  //     status2: item["描述"].split("，")[1] || "",
  //   };
  // });
  const res: any = await GsLocationAPI.getAllMapElement();
  const allList = res["当前记录"];
  let list = ref<any[]>([]);

  const filterAndProcessList = (list: any, enterprise: any) => {
    const filteredList = allList.filter(
      (item: { 所属企业: any }) => item.所属企业 === enterprise
    );
    getGsMarkerList(filteredList);
  };

  const processEnterpriseList = (enterprise: any) => {
    list.value = allList.filter(
      (item: { 所属企业: any }) => item.所属企业 === enterprise
    );
    filterAndProcessList(list.value, enterprise);
  };

  switch (routeName) {
    case "Gtsh":
      processEnterpriseList("广投石化");
      break;
    case "Kry":
      processEnterpriseList("开燃公司");
      break;
    case "Gsshc":
      processEnterpriseList("桂盛桂轩");
      break;
    case "Hry":
      processEnterpriseList("恒润公司");
      break;
    default:
      break;
  }
};

const getGsMarkerList = (list: any[]) => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const newItem = {
      id: item.id,
      label: item.名称,
      description: item.描述,
      type: item.类型,
      iconName: item.类型 === "加油站" ? "gas" : "oil",
      xOffSet: item.坐标 ? item.坐标.split(",")[0] : null,
      yOffSet: item.坐标 ? item.坐标.split(",")[1] : null,
      enterprise: item.所属企业,
    };
    gsMarkerList.value.push({
      ...newItem,
      lng: item.坐标 ? item.坐标.split(",")[0] : null,
      lat: item.坐标 ? item.坐标.split(",")[1] : null,
    });
  }
};

onMounted(() => {
  initTableData();
});

// const gasNum = ref(25);
// const oilNum = ref(3);
// const boatNum = ref(0);

const gasSource = ref(0);
const oilSource = ref(0);
const boatSource = ref(0);
const gasNumOutputValue = useTransition(gasSource, {
  duration: 1000,
});
const oilNumOutputValue = useTransition(oilSource, {
  duration: 1000,
});
const boatNumOutputValue = useTransition(boatSource, {
  duration: 1000,
});
// gasSource.value = gasNum.value;
// oilSource.value = oilNum.value;
// boatSource.value = boatNum.value;
</script>

<style lang="scss" scoped>
.middle2-box {
  @apply w-full h-full text-center relative;
  // padding: 10px;
}
.map-box {
  @apply relative h-full;
  // width: 100%;
  // .map-img {
  //   width: 80%;
  //   height: auto;
  //   // height: 100%;
  // }
  .pos-item {
    @apply absolute;
  }
}
.total-box {
  @apply flex relative;
  justify-content: flex-end;
  z-index: 100;
  // height: 30px;
  margin-top: -35px;
  margin-right: -10px;
  .total-content {
    @apply flex justify-between items-center;
    padding: 0 10px;
    background-color: #062750;
    border: 1px #1d599a solid;
    color: #55a2f0;
    font-size: 14px;
  }
  .content1,
  .content2,
  .content3 {
    @apply flex cursor-pointer;
  }
  .content2,
  .content3 {
    margin-left: 15px;
  }
  .num {
    margin-left: 5px;
    font-size: 15px;
    color: #78ecf1;
  }
}
.center {
  @apply flex justify-center items-center;
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

.total-pop-content {
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
