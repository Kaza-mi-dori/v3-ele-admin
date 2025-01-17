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
          :allow-drop="allowDrop"
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
            <el-tooltip :content="node.label" placement="top">
              <span class="ml-2">{{ node.label }}</span>
            </el-tooltip>
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
                <el-radio label="表格" value="table" />
              </el-radio-group>
            </div>
          </div>
          <!-- <div class="setting-unit">
            <div class="title-text">年份</div>
            <div class="setting-content">
              <el-date-picker
                v-model="tableDataYear"
                type="year"
                format="YYYY"
                value-format="YYYY"
              />
            </div>
          </div> -->
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
            <div
              v-show="chartType !== 'table'"
              id="graph-container"
              style="width: 100%; height: 650px"
            />
            <div v-show="chartType === 'table'" class="table-container">
              <el-table
                :data="currentPageData"
                max-height="600px"
                stripe
                border
                style="width: 100%; overflow-x: auto"
              >
                <el-table-column
                  prop="日期"
                  label="日期"
                  width="100px"
                  align="center"
                />
                <el-table-column
                  v-for="item in dataIndexArray"
                  :key="item"
                  :prop="item.value"
                  :label="item.label"
                  align="center"
                />
              </el-table>
              <el-pagination
                v-if="tableData.length > 0"
                v-model:current-page="currentPage"
                class="mt-4 flex justify-end"
                background
                :page-size="pageSize"
                :total="tableData.length"
                layout="prev, pager, next, sizes"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
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
import { getDateOfOneYear, getDateOfOneYearToNow } from "@/utils/time";

const dataIndexStore = useDataIndexStoreHook();
const dataIndexTree = ref<any[]>([]);
const defaultProps = ref({
  children: "children",
  label: "label",
});
const chartType = ref("line");
const chartRef = shallowRef<any>();
const tableData = ref<any[]>([]);
const tableDataYear = ref(new Date().getFullYear());
/** 数据池 */
const dataIndexSet = ref<Set<string>>(new Set());
const dataPool = ref<any[]>([]);

const dataIndexArray = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const handleNodeClick = (data: any) => {
  console.log(data);
};

const handleNodeDragStart = (data: any) => {
  // console.log(data);
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

const currentPageData = computed(() => {
  return tableData.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});

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
  if (dropType === "inner") {
    return false;
  }
};

function allowDrop(dropType: any) {
  return dropType === "none";
}

// tips：为了不触发拖拽效果，使用capture来在事件捕获阶段触发并阻止默认事件
const handleNodeDrop = (node: any, dropNode: any, dropType: any, ev: any) => {
  ev.preventDefault();
  ev.stopPropagation();
  // 不再传递
  return false;
};

/**
 * 初始化表格
 * 将数据池中的数据展示在表格中, 并支持排序; 每一行应该是一个日期对应的数据，每列是一个数据index对应的数据
 */
function initTable() {
  // tsx动态生成表格
  const columns = dataIndexArray.value.map((item: any) => {
    return {
      prop: item.value,
      label: item.label,
    };
  });
  if (tableData.value.length === 0) {
    const year = new Date().getFullYear();
    tableData.value = getDateOfOneYearToNow(true).map((item: any) => {
      return {
        日期: `${year}-${item}`,
      };
    });
  }
  tableData.value.forEach((item: any) => {
    // 寻找日期
    const dateData = dataPool.value.filter(
      (item2: any) => item2.时间?.substring(0, 10) === item.日期
    );
    columns.forEach((column: any) => {
      const data = dateData.find((item2: any) => item2.标识 === column.prop);
      item[column.prop] = data ? data.数据 : "";
    });
  });
}

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
    switch (chartType.value) {
      case "line":
        series.push({
          type: chartType.value,
          name: item.label,
          data: datas.map((item: any) => item.数据),
        });
        break;
      case "bar":
        series.push({
          type: chartType.value,
          name: item.label,
          data: datas.map((item: any) => item.数据),
        });
        break;
    }
  });
  const dates = getDateOfOneYear();
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
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
    initTable();
  },
  { deep: true }
);

watch(
  () => chartType.value,
  () => {
    switch (chartType.value) {
      case "line":
      case "bar":
        initChart();
        break;
    }
  }
);

onMounted(async () => {
  dataIndexTree.value = await dataIndexStore.getDataIndexTree();
  // console.log(dataIndexTree.value);
});
</script>

<style lang="scss" scoped>
@use "@/styles/gmixin.scss" as *;

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
  max-width: calc(100% - 250px - 0.5rem);
  .setting-block {
    @apply w-full flex flex-gap-2;
    .setting-unit {
      @apply flex flex-gap-4 items-center w-1/2 pb-5px;
      @apply border-solid border-coolGray-200 border-b-1;
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
    .table-container {
      @apply w-full;
    }
  }
}
</style>
