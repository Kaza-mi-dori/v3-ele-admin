<!-- 地图图表放置 -->
<template>
  <!-- 左侧可放置图标列表、图标详情、右侧地图，可点击根据相对位置确定坐标 -->
  <div class="main-wrapper">
    <div class="item-menu-block">
      <div class="item-menu">
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
      <div v-if="currentItem" class="item-detail">
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
        <!-- <div class="flex justify-end mt-4">
          <el-button size="small" type="primary">修改</el-button>
        </div> -->
        <!-- <el-button
          v-if="!isPositionEdit"
          size="small"
          type="primary"
          @click="handleStartChangePos"
        >
          修改位置
        </el-button>
        <el-button
          v-if="isPositionEdit"
          size="small"
          @click="handleCancelChangePos"
        >
          取消
        </el-button> -->
      </div>
      <div v-else class="item-detail text-center w-full">
        <span class="text-xl color-coolgray">详情区</span>
      </div>
    </div>
    <div class="map-block">
      <div
        id="mapbox"
        class="map"
        @click="handleMapClick"
        @mousemove.stop="handleMouseOver"
        @mouseleave.stop="handleMouseLeave"
      >
        <!-- <span>地图</span> -->
        <span v-if="isMouseWithInMap">
          当前坐标: ({{ currentPos.x }}, {{ currentPos.y }})
        </span>
        <span v-if="isPositionEdit && isMouseWithInMap" class="color-red">
          请点击想要放置的位置以完成位置修改
        </span>
        <!-- 图标，如果有相对坐标与图标则显示 -->
        <div v-for="item in positions" :key="item.id">
          <div
            v-for="child in item"
            :key="child.id"
            class="absolute"
            :style="{
              left: child.xOffSet + 'px',
              top: child.yOffSet + 'px',
              zIndex: 100,
            }"
            @mouseenter="handleMouseEnterIcon"
            @mouseleave="handleMouseLeaveIcon"
          >
            <el-popover placement="top-start" width="200">
              <template #reference>
                <img height="25" :src="getIcon(child.iconName)" />
              </template>
              <div class="pop-content">
                <div class="__title">
                  <span>{{ child.label }}</span>
                </div>
                <div class="__desc">
                  <span>{{ child.description }}</span>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <!-- <div class="h-20px" /> -->
      <!-- <div id="chart1" ref="chartDOM" style="height: 600px" /> -->
      <img
        v-if="isPositionEdit && isMouseWithInMap"
        ref="iconEl"
        :src="currentIcon"
        class="absolute"
        height="25"
        :style="{
          left: currentPos.x + 'px',
          top: currentPos.y + 'px',
          pointerEvents: 'none',
        }"
        @mousemove.stop
        @mouseover.stop
        @mouseleave.stop
        @mouseenter.stop
      />
      <!-- <img
        v-if="isPositionEdit && isMouseWithInMap"
        ref="iconEl"
        :src="currentIcon"
        class="absolute"
        :style="{ left: currentPos.x + 'px', top: currentPos.y + 'px' }"
      /> -->
    </div>
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增配置点" width="30%" center>
      <el-form ref="itemFormRef" :model="itemForm" :rules="rules">
        <el-form-item label="类别" prop="type">
          <el-select v-model="itemForm.type" placeholder="请选择">
            <el-option label="加油站" value="1" />
            <el-option label="油库" value="2" />
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
  </div>
</template>

<script lang="ts" setup>
import chinaGeoJson from "@/assets/json/provinceGeoJson.json";
import countryMapBg from "@/views/bigscreen/img/country_map_bg.png";
import oil from "@/views/bigscreen/img/oil.png";
import gas from "@/views/bigscreen/img/oil2.png";
import * as echarts from "echarts";
import "echarts/extension/bmap/bmap";
import { FormInstance } from "element-plus";
import { ref, onMounted, nextTick } from "vue";

interface ItemFormType {
  name: string | undefined;
  description: string | undefined;
  type: number | undefined;
}

const dialogVisible = ref(false);
const searchValue = ref("");
const itemForm = ref<ItemFormType>({
  name: undefined,
  description: undefined,
  type: undefined,
});
const itemFormRef = ref<Nullable<FormInstance>>(null);
const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
  type: [{ required: true, message: "请选择类别", trigger: "change" }],
};
const submitItemLoading = ref(false);

const gsListdata = ref([
  {
    id: 1,
    label: "加油站",
    children: [
      {
        id: 11,
        label: "五合加油站",
        description: "五合加油站",
        iconName: "gas",
        xOffSet: 719,
        yOffSet: 660,
      },
    ],
  },
  {
    id: 2,
    label: "油库",
    children: [
      {
        id: 21,
        label: "钦州油库",
        description: "钦州油库，永盛自建油库",
        iconName: "oil",
        xOffSet: 729,
        yOffSet: 660,
      },
      {
        id: 22,
        label: "东莞油库",
        description: "广东油库，租用",
        iconName: "oil",
        xOffSet: 800,
        yOffSet: 676,
      },
    ],
  },
]);

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
  console.log("enter!");
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
  // isPositionEdit.value = true;
  if (!isPositionEdit.value) {
    isPositionEdit.value = true;
  }
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

const onSubmitItemForm = () => {
  itemFormRef.value?.validate().then((valid) => {
    if (valid) {
      // 提交表单
      // console.log(itemForm.value);
      // 添加到gsListdata中
      submitItemLoading.value = true;
      setTimeout(() => {
        submitItemLoading.value = false;
        const type = itemForm.value.type;
        const item = {
          // type保证为1或2
          id: gsListdata.value[type - 1].children.length + 1,
          label: itemForm.value.name as unknown as string,
          description: itemForm.value.description as unknown as string,
          iconName: type === 1 ? "gas" : "oil",
          xOffSet: 0,
          yOffSet: 0,
        };
        gsListdata.value[type - 1].children.push(item);
        // 重置表单
        itemForm.value = {
          name: "",
          description: "",
          type: undefined,
        };
        itemFormRef.value?.resetFields();
        dialogVisible.value = false;
      }, 1000);
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

const initChart = () => {
  const myChart = echarts.init(chartDOM.value as HTMLDivElement);
  const option = {
    geo: {
      map: "china",
      roam: false,
      zoom: 1.5,
      regions: [
        {
          name: "广西壮族自治区",
          itemStyle: {
            borderColor: "rgba(0, 10, 52, 0)",
          },
        },
      ],
    },
    series: [
      {
        type: "scatter",
        symbol: "image://" + gas,
        coordinateSystem: "geo",
        data: [{ name: "永盛石化", value: [104.114129, 37.550339] }],
        symbolSize: 40,
        label: {
          show: false,
          formatter: "{b}",
        },
      },
    ],
  };
  myChart.setOption(option);
};

onMounted(() => {
  // chartDOM.value = document.getElementById("chart1");
  // echarts.registerMap("china", chinaGeoJson as any);
  // initChart();
});
</script>

<style lang="scss" scoped>
.main-wrapper {
  @apply flex;
  padding: 10px;
}

.item-menu-block {
  @apply flex bg-white mr-4;
  flex: 1;
  .item-menu {
    @apply mr-10px p-2 pr-15px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #fefefe;
    .item {
      margin: 10px;
      padding: 10px;
      border: 1px solid #ccc;
    }
  }
  .item-detail {
    @apply bg-white pl-20px pr-20px pt-10px shadow-coolGray-100;
  }
}

.map-block {
  flex: 0 0 auto;
  position: relative;
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
