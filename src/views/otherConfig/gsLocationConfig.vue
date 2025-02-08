<!-- 地图图表放置 -->
<template>
  <!-- 左侧可放置图标列表、图标详情、右侧地图，可点击根据相对位置确定坐标 -->
  <div class="main-wrapper">
    <div class="item-menu-block">
      <div v-loading="menuLoading" class="item-menu">
        <!-- <el-input
          v-model="searchValue"
          search-icon="el-icon-search"
          class="mb-10px"
          size="small"
          placeholder="请输入搜索内容"
          clearable
        /> -->
        <el-button icon="plus" size="small" class="mb-10px" @click="addItem">
          添加
        </el-button>
        <el-tree
          class="w-full"
          :data="gsListdata"
          :props="defaultProps"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </div>
      <div
        v-if="currentItem"
        v-loading="currentItemLoading"
        class="item-detail"
      >
        <!-- <div class="mb-4">
          <el-button size="small" icon="edit" />
        </div> -->
        <el-form class="g-form-1" :model="currentItem" label-position="top">
          <el-col :span="24">
            <el-form-item label="名称">
              <span>{{ currentItem.label }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图标">
              <template #label>
                <span>图标</span>
              </template>
              <img v-if="currentItem.iconName" :src="currentIcon" />
              <span v-else>未指定</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地图坐标">
              <template #label>
                <span>地图坐标</span>
                <el-link
                  v-if="!isPositionEdit"
                  size="small"
                  type="primary"
                  style="margin-left: 10px"
                  @click="handleStartChangePos"
                >
                  修改
                </el-link>
                <el-link
                  v-if="isPositionEdit"
                  style="margin-left: 10px"
                  size="small"
                  type="primary"
                  @click="handleCancelChangePos"
                >
                  恢复
                </el-link>
              </template>
              <span v-if="currentItem.xOffSet && currentItem.yOffSet">
                (x: {{ currentItem.xOffSet }}, y: {{ currentItem.yOffSet }})
              </span>
              <span v-else>未指定</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="说明">
              <span>{{ currentItem.description }}</span>
            </el-form-item>
          </el-col>
        </el-form>
        <div v-if="!isPositionEdit" class="bottom-op mt-8 text-align-end">
          <el-button
            type="primary"
            size="small"
            @click="onSubmitChangeCurrentItemForm"
          >
            保存
          </el-button>
          <el-button
            type="danger"
            class="mr-10px"
            size="small"
            @click="handleDeleteItem(currentItem.id)"
          >
            删除
          </el-button>
        </div>
      </div>
      <!-- <div v-else class="item-detail text-center w-full">
        <span class="text-xl color-coolgray">详情区</span>
      </div> -->
    </div>
    <Map
      ref="mapRef"
      :markers="gsMarkerList"
      style="width: calc(100% - 300px); height: 600px; z-index: 0"
      @click-geo="onClickGeo"
    />
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增配置点" width="30%" center>
      <el-form ref="itemFormRef" :model="itemForm" :rules="rules">
        <el-form-item label="类别" prop="type">
          <el-select v-model="itemForm.type" placeholder="请选择">
            <el-option
              v-for="(value, key) of MapElementEnumMap"
              :key="key"
              :label="value"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="itemForm.name"
            placeholder="请输入名称, 大屏上将显示这里的内容"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="itemForm.description"
            type="textarea"
            placeholder="请输入描述, 大屏上将显示这里的内容"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="submitItemLoading"
            @click="onSubmitItemForm"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改地址抽屉，根据地址查询经纬度 -->
    <el-drawer v-model="drawerVisible" title="修改地址" size="30%">
      <el-form
        ref="addressFormRef"
        v-loading="searchLoading"
        :model="addressForm"
        :rules="addressRules"
      >
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="addressForm.address"
            placeholder="请输入地图上的完整地址，否则无法正确转换"
            @blur="onAddressBlur"
            @keyup.enter="onAddressBlur"
          />
        </el-form-item>
        <!-- 经纬度，自动查询 -->
        <el-form-item label="经度(-180~180)">
          <el-input v-model="addressForm.lng" />
        </el-form-item>
        <el-form-item label="纬度(-90~90)">
          <el-input v-model="addressForm.lat" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="onCancelAddressDialog">取 消</el-button>
          <el-button
            type="primary"
            :loading="submitAddressLoading"
            @click="onSubmitAddressForm"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import chinaGeoJson from "@/assets/json/provinceGeoJson.json";
import countryMapBg from "@/views/bigscreen/img/country_map_bg.png";
import oil from "@/views/bigscreen/img/oil.png";
import gas from "@/views/bigscreen/img/oil2.png";
import * as echarts from "echarts";
import "echarts/extension/bmap/bmap";
import { MapElementEnumMap, MapElementEnum } from "@/enums/BusinessEnum";
import { ElMessage } from "element-plus";
import { GsLocationAPI } from "@/api/config/gsLocation";
import { getGeoCode } from "@/api/thirdSystem/tmap";
import { FormInstance } from "element-plus";
import { ref, onMounted, nextTick } from "vue";
import Map from "@/views/bigscreen/components/FirstPage/Map/index.vue";
import { on } from "events";

interface ItemFormType {
  id: number | string | undefined;
  name: string | undefined;
  description: string | undefined;
  type: number | undefined | string;
  xOffSet: number | undefined;
  yOffSet: number | undefined;
}

interface BackEndFormType {
  id: number | string;
  名称: string;
  类型: string;
  描述: string;
  坐标: string;
  图标: string;
}

const dialogVisible = ref(false);
const searchValue = ref("");
const itemForm = ref<ItemFormType>({
  id: undefined,
  name: undefined,
  description: undefined,
  type: undefined,
  xOffSet: 0,
  yOffSet: 0,
});
const itemFormRef = ref<Nullable<FormInstance>>(null);
const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
  type: [{ required: true, message: "请选择类别", trigger: "change" }],
};
const submitItemLoading = ref(false);
// 修改地址抽屉
const drawerVisible = ref(false);
const addressForm = ref({
  address: undefined,
  lng: 0,
  lat: 0,
});
const submitAddressLoading = ref(false);
const addressRules = {
  address: [{ required: true, message: "请输入地址", trigger: "blur" }],
};
const addressFormRef = ref<Nullable<FormInstance>>(null);
const searchLoading = ref(false); // 查询经纬度loading
const mapRef = ref<Nullable<any>>(null);

const gsListdata = ref([
  {
    id: 1,
    label: MapElementEnumMap[MapElementEnum.ORGANIZATION],
    children: [],
  },
  {
    id: 2,
    label: MapElementEnumMap[MapElementEnum.OIL_DEPOT],
    children: [],
  },
  {
    id: 3,
    label: MapElementEnumMap[MapElementEnum.GAS_STATION],
    children: [],
  },
  {
    id: 4,
    label: MapElementEnumMap[MapElementEnum.OIL_SHIP],
    children: [],
  },
  {
    id: 5,
    label: "其他",
    children: [],
  },
]);

/** 给腾讯地图显示 */
const gsMarkerList = ref<any[]>([]);

const positions = computed(() => {
  return gsListdata.value.map((item) => {
    return item.children.filter((child) => child.xOffSet && child.yOffSet);
  });
});

const defaultProps = {
  children: "children",
  label: "label",
};

const chartDOM = ref<HTMLElement | null>(null);

interface CurrentItem {
  id: number;
  label: string;
  type: string;
  description: string;
  iconName?: string;
  xOffSet?: number | null;
  yOffSet?: number | null;
}

interface PointPos {
  x: number;
  y: number;
}

const currentItem = ref<CurrentItem | null>(null);
const menuLoading = ref(false);
const currentItemLoading = ref(false);

const currentIcon = computed(() => {
  switch (currentItem.value?.iconName) {
    case "oil":
      return gas;
    case "gas":
      return oil;
    default:
      return "";
  }
});

const currentPos = ref<PointPos>({ x: 0, y: 0 });
const iconEl = ref<HTMLElement | null>(null);
const isPositionEdit = ref(false);
const isMouseWithInMap = ref(false);
// 判断是否鼠标位置对应当前图标位置的范围
const isMouseInIcon = ref(false);
// 范围大小
const iconRange = 16;

const GAS_ENUM_VALUE = MapElementEnumMap[MapElementEnum.GAS_STATION];
const STORAGE_ENUM_VALUE = MapElementEnumMap[MapElementEnum.OIL_DEPOT];
const BOAT_ENUM_VALUE = MapElementEnumMap[MapElementEnum.OIL_SHIP];

/**
 * @description: 鼠标进入地图，判断是否为修改位置状态，如果是则将图标位置设置为当前鼠标位置，否则不做任何操作
 * @param {*}
 */
const handleMouseEnter = (e: MouseEvent) => {
  // if (isPositionEdit.value) {
  //   currentItem.value = {
  //     ...currentItem.value,
  //     xOffSet: currentPos.value.x,
  //     yOffSet: currentPos.value.y,
  //   };
  // }
  // console.log("enter!");
  e.preventDefault();
  if (!isMouseWithInMap.value) {
    isMouseWithInMap.value = true;
  }
  // isMouseWithInMap.value = true;
};

const handleMouseLeave = (e: MouseEvent) => {
  // console.log("leave!");
  // isMouseWithInMap.value = false;
  e.preventDefault();
  if (isMouseWithInMap.value) {
    isMouseWithInMap.value = false;
  }
};

const handleMouseOver = (e: MouseEvent) => {
  // isMouseWithInMap.value = true;
  // 获取相对map-box的坐标
  // 需要判断target是否为map-box
  if (e.target !== e.currentTarget) {
    return;
  }
  if (!isMouseWithInMap.value) {
    isMouseWithInMap.value = true;
  }
  // 还需要减去尺寸
  // console.log(e.offsetX, e.offsetY);
  currentPos.value = {
    x: e.offsetX,
    y: e.offsetY,
  };
  // 强制更新视图
  // await nextTick();
  // 判断是否鼠标位置对应当前图标位置的范围
};

/**
 * @description: 点击地图，如果此时为修改位置状态，则将位置设置为点击位置，且切换为非修改位置状态
 * @param {*}
 */
const handleMapClick = () => {
  if (isPositionEdit.value) {
    isPositionEdit.value = false;
    // 保证currentItem不为空
    if (currentItem.value) {
      currentItem.value = {
        ...currentItem.value,
        xOffSet: currentPos.value.x,
        yOffSet: currentPos.value.y,
      };
      // 修改gsListdata中的数据
      const item = gsListdata.value
        .map((item) => item.children)
        .flat()
        .find((item) => item.id === currentItem.value?.id);
      if (item) {
        item.xOffSet = currentPos.value.x;
        item.yOffSet = currentPos.value.y;
      }
    }
  }
};

/**
 * @description: 开始修改位置
 * @param {*}
 */
const handleStartChangePos = () => {
  // // isPositionEdit.value = true;
  // if (!isPositionEdit.value) {
  //   isPositionEdit.value = true;
  // }
  drawerVisible.value = true;
};

/**
 * @description: 取消修改位置
 * @param {*}
 */
const handleCancelChangePos = () => {
  // isPositionEdit.value = false;
  if (isPositionEdit.value) {
    isPositionEdit.value = false;
  }
};

// 鼠标移动到图标上时显示其内容
const handleMouseEnterIcon = () => {
  // isMouseInIcon.value = true;
  if (!isMouseInIcon.value) {
    return;
  }
  isMouseInIcon.value = true;
};

const handleMouseLeaveIcon = () => {
  if (isMouseInIcon.value) {
    isMouseInIcon.value = false;
  }
};

const handleNodeClick = (data: any) => {
  // console.log(data);
  if (!data.children) {
    currentItem.value = data;
    currentItemLoading.value = true;
    setTimeout(() => {
      currentItemLoading.value = false;
    }, 1000);
  }
  // currentItem.value = data;
};

/**
 * 添加加油站
 */
const addItem = () => {
  // gsListdata.value[0].children.push({
  //   id: gsListdata.value[0].children.length + 1,
  //   label: "新加油站",
  //   description: "新加油站",
  //   iconName: "gas",
  //   xOffSet: 0,
  //   yOffSet: 0,
  // });
  dialogVisible.value = true;
};

/**
 * 添加油库
 */

const addStorage = () => {
  gsListdata.value[1].children.push({
    id: gsListdata.value[1].children.length + 1,
    label: "新油库",
    description: "新油库",
    iconName: "oil",
    xOffSet: 0,
    yOffSet: 0,
  });
};

const getGeoCodeThrottled = useThrottleFn(getGeoCode, 2000);

/** 在地址确定时查询经纬度，要做限流 */
const onAddressBlur = async () => {
  // 查询经纬度
  if (!addressForm.value.address) {
    return;
  }
  searchLoading.value = true;
  const res = await getGeoCodeThrottled(addressForm.value.address);
  if (res) {
    if (res.result && res.result.location) {
      ElMessage.success("查询经纬度成功，已自动填入");
      addressForm.value.lng = res.result.location.lng;
      addressForm.value.lat = res.result.location.lat;
      mapRef.value?.setCenter(res.result.location.lat, res.result.location.lng);
      mapRef.value?.setZoom(10);
      mapRef.value?.setMarker(res.result.location.lat, res.result.location.lng);
    } else {
      ElMessage.error("未查询到经纬度, 请检查地址是否正确");
    }
  }
  searchLoading.value = false;
};

/** 修改坐标提交 */
const onSubmitChangeCurrentItemForm = async () => {
  // 提交表单
  // console.log(itemForm.value);
  // 添加到gsListdata中
  currentItemLoading.value = true;
  const submitData: BackEndFormType = {
    id: currentItem.value?.id as number,
    名称: currentItem.value?.label as string,
    类型: currentItem.value?.type as string,
    描述: currentItem.value?.description as string,
    坐标: `${currentItem.value?.xOffSet},${currentItem.value?.yOffSet}`,
    图标: currentItem.value?.iconName as string,
  };
  GsLocationAPI.updateMapElement(submitData)
    .then((res) => {
      currentItemLoading.value = false;
      ElMessage.success("修改成功");
      initListData();
    })
    .catch((err) => {
      currentItemLoading.value = false;
      ElMessage.error("修改失败");
    });
};

/**
 * 取消修改
 */
const onCancelAddressDialog = () => {
  drawerVisible.value = false;
};

/**修改地址 */
const onSubmitAddressForm = () => {
  // 提交表单
  // console.log(itemForm.value);
  // 添加到gsListdata中
  submitAddressLoading.value = true;
  const submitData = {
    id: currentItem.value?.id,
    名称: currentItem.value?.label,
    类型: currentItem.value?.type,
    描述: currentItem.value?.description,
    坐标: `${addressForm.value.lng},${addressForm.value.lat}`,
    图标: currentItem.value?.iconName,
  };
  GsLocationAPI.updateMapElement(submitData)
    .then((res) => {
      submitAddressLoading.value = false;
      ElMessage.success("修改成功");
      // 清除表单
      addressForm.value = {
        address: undefined,
        lng: 0,
        lat: 0,
      };
      drawerVisible.value = false;
      initListData();
    })
    .catch((err) => {
      submitAddressLoading.value = false;
      ElMessage.error("修改失败");
    });
};

/**
 * 新建提交表单
 */
const onSubmitItemForm = () => {
  itemFormRef.value?.validate().then(async (valid) => {
    if (valid) {
      // 提交表单
      // console.log(itemForm.value);
      // 添加到gsListdata中
      submitItemLoading.value = true;
      const submitData = {
        id: itemForm.value.id,
        名称: itemForm.value.name,
        类型: itemForm.value.type,
        描述: itemForm.value.description,
        坐标: `${itemForm.value.xOffSet},${itemForm.value.yOffSet}`,
        图标: itemForm.value.type === GAS_ENUM_VALUE ? "gas" : "oil",
      };
      const op = itemForm.value.id
        ? GsLocationAPI.updateMapElement
        : GsLocationAPI.addMapElement;
      op(submitData)
        .then((res) => {
          submitItemLoading.value = false;
          let index = 4;
          switch (itemForm.value.type) {
            case MapElementEnumMap[MapElementEnum.ORGANIZATION]:
              index = 0;
              break;
            case MapElementEnumMap[MapElementEnum.OIL_DEPOT]:
              index = 1;
              break;
            case MapElementEnumMap[MapElementEnum.GAS_STATION]:
              index = 2;
              break;
            case MapElementEnumMap[MapElementEnum.OIL_SHIP]:
              index = 3;
              break;
            default:
              break;
          }
          const item = {
            id:
              itemForm.value.id || gsListdata.value[index].children.length + 1,
            label: itemForm.value.name as unknown as string,
            type: itemForm.value.type,
            description: itemForm.value.description as unknown as string,
            iconName:
              itemForm.value.type ===
              MapElementEnumMap[MapElementEnum.GAS_STATION]
                ? "gas"
                : "oil",
            xOffSet: itemForm.value.xOffSet,
            yOffSet: itemForm.value.yOffSet,
          };
          gsListdata.value[index].children.push(item);
          // 重置表单
          itemForm.value = {
            id: undefined,
            name: "",
            description: "",
            type: undefined,
            xOffSet: 0,
            yOffSet: 0,
          };
          itemFormRef.value?.resetFields();
          dialogVisible.value = false;
          initListData();
          ElMessage.success("添加成功");
        })
        .catch((err) => {
          submitItemLoading.value = false;
          ElMessage.error("添加失败");
        });
    }
  });
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "oil":
      return gas;
    case "gas":
      return oil;
    default:
      return "";
  }
};

const handleDeleteItem = (id: number | string) => {
  // 删除gsListdata中的数据
  menuLoading.value = true;
  currentItemLoading.value = true;
  GsLocationAPI.deleteMapElement(id)
    .then((res) => {
      currentItemLoading.value = false;
      currentItem.value = null;
      ElMessage.success("删除成功");
      initListData();
    })
    .catch((err) => {
      menuLoading.value = false;
      currentItemLoading.value = false;
      ElMessage.error("删除失败");
      console.log(err);
    });
};

// 点击标记后回调
const onClickGeo = (pos: any) => {
  const { x, y } = pos;
};

const initListData = async () => {
  // chartDOM.value = document.getElementById("chart1");
  menuLoading.value = true;
  const res: any = await GsLocationAPI.getAllMapElement();
  menuLoading.value = false;
  // console.log("res", res);
  const list = res["当前记录"];
  for (let i = 0; i < gsListdata.value.length; i++) {
    gsListdata.value[i].children = [];
  }
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    let index = 4;
    switch (item.类型) {
      case MapElementEnumMap[MapElementEnum.ORGANIZATION]:
        index = 0;
        break;
      case MapElementEnumMap[MapElementEnum.OIL_DEPOT]:
        index = 1;
        break;
      case MapElementEnumMap[MapElementEnum.GAS_STATION]:
        index = 2;
        break;
      case MapElementEnumMap[MapElementEnum.OIL_SHIP]:
        index = 3;
        break;
      default:
        break;
    }
    const newItem = {
      id: item.id,
      label: item.名称,
      description: item.描述,
      type: item.类型,
      iconName: item.类型 === "加油站" ? "gas" : "oil",
      xOffSet: item.坐标 ? item.坐标.split(",")[0] : null,
      yOffSet: item.坐标 ? item.坐标.split(",")[1] : null,
    };
    gsListdata.value[index].children.push(newItem);
    gsMarkerList.value.push({
      ...newItem,
      lng: item.坐标 ? item.坐标.split(",")[0] : null,
      lat: item.坐标 ? item.坐标.split(",")[1] : null,
    });
  }
  // 同时要消除详情区
  if (currentItem.value?.id) {
    currentItem.value = null;
  }
  // initChart();
};

onMounted(() => {
  // chartDOM.value = document.getElementById("chart1");
  // echarts.registerMap("china", chinaGeoJson as any);
  // initChart();
  initListData();
});
</script>

<style lang="scss" scoped>
.main-wrapper {
  @apply flex;
  padding: 10px;
}

.item-menu-block {
  @apply flex flex-1 bg-white mr-4;
  .item-menu {
    @apply mr-10px p-2 pr-15px flex flex-col;
    border-right: 1px solid #fefefe;
    .item {
      @apply m-2.5;
      padding: 10px;
      border: 1px solid #ccc;
    }
  }
  .item-detail {
    @apply bg-white w-200px pl-20px pr-20px pt-10px shadow-coolGray-100 relative;
  }
}

.map-block {
  flex: 0 0 auto;
  @apply relative;
  .map {
    background-image: url("@/views/bigscreen/img/country_map_bg.png");
    background-size: 100% 100%;
    width: 1261px;
    height: 853px;
    border: 1px solid #ccc;
  }
}

.pop-content {
  .__title {
    @apply lh-normal border-b-1 border-coolGray-200;
    font-size: 18px;
  }
  .__desc {
    @apply text-sm;
  }
}
</style>
