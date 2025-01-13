<template>
  <div class="g-main-mapper">
    <div class="flex w-full flex-gap-2">
      <div class="tree-wrapper">
        <el-tree
          class="tree-menu"
          default-expand-all
          node-key="pId"
          :data="dataIndexTree"
          :props="defaultProps"
          draggable
          :allow-drag="(node: any) => !node.data.children"
          @node-click="handleNodeClick"
          @node-drag-start="handleNodeDragStart"
          @node-drag-end="handleNodeDragEnd"
          @node-drop.capture="handleNodeDrop"
        >
          <template v-slot="{ node, data }">
            <el-icon v-if="data.children && data.children.length" class="ml-2">
              <Folder />
            </el-icon>
            <el-icon v-else>
              <Document />
            </el-icon>
            <span class="ml-2">{{ node.label }}</span>
          </template>
        </el-tree>
      </div>
      <div class="content-wrapper">
        <div class="setting-block">
          <div class="setting-unit">
            <div class="title-text">图表形式</div>
            <div class="setting-content">
              <el-radio-group v-model="chartType">
                <el-radio label="折线图" value="line" />
                <el-radio label="柱状图" value="bar" />
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="graph-block">
          <div class="graph-title">
            <div class="title-text">图表数据(将左侧数据拖入下方)</div>
            <el-tag
              v-for="item in dataIndexArray"
              :key="item"
              class="mt-2 mb-2 mr-2"
              closable
              @close="handleClose(item.value)"
            >
              {{ item.label }}
            </el-tag>
          </div>
          <div
            class="graph-wrapper"
            @dragover="
              (e) => {
                e.preventDefault();
              }
            "
          >
            <div id="graph-container" style="width: 100%; height: 650px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataIndexStoreHook } from "@/store/modules/dataIndex";
import { DataIndicesAPI } from "@/api/dataIndices";
import * as echarts from "echarts";
import { getDateOfOneYear } from "@/utils/time";

const dataIndexStore = useDataIndexStoreHook();
const dataIndexTree = ref<any[]>([]);
const defaultProps = ref({
  children: "children",
  label: "label",
});
const chartType = ref("line");
const chartRef = shallowRef<any>();

/** 数据池 */
const dataIndexSet = ref<Set<string>>(new Set());
const dataPool = ref<any[]>([]);

const dataIndexArray = ref<any[]>([]);

const handleNodeClick = (data: any) => {
  console.log(data);
};

const handleNodeDragStart = (data: any) => {
  // console.log(data);
};

// 删除数据池中的数据
const handleClose = (item: string) => {
  dataIndexSet.value.delete(item);
  dataIndexArray.value = dataIndexArray.value.filter(
    (item2: any) => item2.value !== item
  );
  // 剔除数据池中的数据
  dataPool.value = dataPool.value.filter((item: any) => item.标识 !== item);
};

const pushIndexToPool = (node: any) => {
  // 如果数据太多(> 10), 则终止
  if (dataIndexSet.value.size > 10) {
    ElMessage.warning("数据太多，请减少数据后再拖拽");
    return;
  }
  if (node.data.children) {
    node.data.children.forEach((item: any) => {
      pushIndexToPool(item);
    });
  } else {
    dataIndexSet.value.add(node.data["标识"]);
    if (
      !dataIndexArray.value.find(
        (item: any) => item.value === node.data["标识"]
      )
    ) {
      dataIndexArray.value.push({
        label: node.label,
        value: node.data["标识"],
      });
    }
  }
};

const handleNodeDragEnd = (
  node: any,
  dropNode: any,
  dropType: any,
  ev: any
) => {
  // 将相应数据拖入数据池
  pushIndexToPool(node);
  // 不再传递
  console.log(dropType);
  if (dropType === "inner") {
    return false;
  }
};

// tips：为了不触发拖拽效果，使用capture来在事件捕获阶段触发并阻止默认事件
const handleNodeDrop = (node: any, dropNode: any, dropType: any, ev: any) => {
  ev.preventDefault();
  // 不再传递
  return false;
};

function initChart() {
  if (!chartRef.value) {
    chartRef.value = echarts.init(document.getElementById("graph-container"));
  }
  chartRef.value.clear();
  const series: any[] = [];
  dataIndexArray.value.forEach((item: any) => {
    const datas = dataPool.value.filter(
      (item2: any) => item2.标识 === item.value
    );
    series.push({
      type: chartType.value,
      name: item.label,
      data: datas.map((item: any) => item.数据),
    });
  });
  const dates = getDateOfOneYear();
  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: dataIndexArray.value.map((item: any) => item.label),
    },
    xAxis: {
      type: "category",
      data: dates,
    },
    yAxis: {
      type: "value",
    },
    series,
    // scale
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        // 控制位置
        bottom: 5,
        start: 0,
        end: 100,
      },
    ],
  };
  chartRef.value.setOption(option);
}

// 如果数据index发生了变化，则将数据池中的数据拖入图表
watch(
  () => dataIndexSet.value,
  async () => {
    const res: any = await DataIndicesAPI.getAllDataIndicesList({
      标识集合: Array.from(dataIndexSet.value),
    });
    dataPool.value = res || [];
    initChart();
  },
  { deep: true }
);

watch(
  () => chartType.value,
  () => {
    initChart();
  }
);

onMounted(async () => {
  dataIndexTree.value = await dataIndexStore.getDataIndexTree();
  console.log(dataIndexTree.value);
});
</script>

<style lang="scss" scoped>
@use "@/styles/index.scss" as *;

.g-main-mapper {
  @apply w-full;
}
.tree-wrapper {
  @apply bg-white p-10px shadow-coolGray-100;
  height: calc(75vh + 20px);
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  .tree-menu {
    @apply w-250px h-[calc(75vh)] overflow-auto;
  }
}

:deep(.el-tree) {
  @include g-scrollbar-1;
  .el-tree-node {
    @apply text-ellipsis overflow-hidden whitespace-nowrap !important;
    .el-tree-node__content {
      @apply block text-ellipsis overflow-hidden whitespace-nowrap !important;
      @apply lh-normal;
      &:first-child {
        @apply ml-2;
      }
      &:hover {
        @apply bg-blue-5 color-white;
      }
    }
    .el-icon.el-tree-node__expand-icon.expanded {
      @apply hidden;
    }
  }
}

.content-wrapper {
  @apply shadow-coolGray-100 flex-1 bg-white p-10px;
  .setting-block {
    @apply w-full;
    .setting-unit {
      @apply flex flex-gap-4 items-center w-1/2;
      // @apply border-dashed border-coolGray-400 border-b-1;
      @apply mb-5px;
      .title-text {
        @apply text-coolGray-500;
      }
      .setting-content {
        @apply flex-1;
      }
    }
  }
  .graph-block {
    @apply mt-10px pr-10px;
    .graph-wrapper {
      @apply border-1 border-light;
    }
  }
}
</style>
