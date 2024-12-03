<template>
  <div class="main-wrapper w-full h-full">
    <div class="m-container">
      <div class="menu-box">
        <div class="menu-box-title">
          <span class="__text">监控平台</span>
        </div>
        <div class="menu-box-list">
          <el-tree
            :data="nodelist"
            :props="defaultProps"
            draggable
            @node-drag-end="handleNodeDragEnd"
            @node-click="handleNodeClick"
          />
        </div>
      </div>
      <div class="monitors-box">
        <div
          v-for="monitor in maxShowMonitors"
          :key="monitor"
          :style="{
            width: getWidthByAmount(maxShowMonitors),
          }"
        >
          <MonitorCard :blockId="monitor" />
        </div>
        <div class="control-panel">
          <!-- 收起展开 -->
          <el-button
            v-if="panelCollapsed"
            round
            icon="arrow-left"
            @click="panelCollapsed = false"
          />
          <el-button
            v-else
            round
            icon="arrow-right"
            @click="panelCollapsed = true"
          />
          <div
            :style="{
              marginLeft: '15px',
              display: panelCollapsed ? 'none' : 'block',
            }"
          >
            <!-- 切换监控数量 -->
            <el-button
              icon="platform"
              round
              @click="onChangeMonitorAmount(1)"
            />
            <el-button icon="menu" round @click="onChangeMonitorAmount(4)" />
            <el-button icon="grid" round @click="onChangeMonitorAmount(9)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MonitorAPI } from "@/api/monitor";
import MonitorCard from "./MonitorCard.vue";

interface Monitor {
  [key: string]: any;
}

const monitors: Ref<Monitor[]> = ref([]);
const nodelist = ref([
  {
    id: 1,
    label: "监控(2/2)",
    children: [
      {
        id: 2,
        label: "监控1-1",
      },
      {
        id: 3,
        label: "监控1-2",
      },
    ],
  },
  {
    id: 4,
    label: "监控2",
    children: [
      {
        id: 5,
        label: "监控2-1",
      },
      {
        id: 6,
        label: "监控2-2",
      },
    ],
  },
]);
const defaultProps = {
  children: "children",
  label: "label",
};
const handleNodeClick = (data: any) => {
  console.log(data);
};
const panelCollapsed = ref(true);
const maxShowMonitors = ref(4);

const onChangeMonitorAmount = (amount: number) => {
  maxShowMonitors.value = amount;
};

const getWidthByAmount = (amount: number) => {
  if (amount === 1) {
    return "calc(100% - 10px)";
  } else if (amount === 4) {
    return "calc(50% - 10px)";
  } else if (amount === 9) {
    return "calc(33.33% - 10px)";
  }
};

const handleNodeDragEnd = (node: any, dest: any, pos: any, event: any) => {
  console.log(node, dest, pos, event);
};

onMounted(async () => {
  const res = await MonitorAPI.getMonitorList();
  monitors.value = res["当前记录"];
  console.log(monitors.value);
});
</script>

<style lang="scss" scoped>
.m-container {
  @apply flex pr-2 pb-2;
  height: 100%;
  width: 100%;
  .menu-box {
    width: 300px;
    @apply bg-white border-r-1 h-full border-b-1;
    .menu-box-title {
      @apply p-2 text-align-center;
      .__text {
        @apply text-24px font-bold;
        color: $bigscreen-primary-color-1;
      }
    }
    .menu-box-list {
      @apply p-2;
    }
  }
  .monitors-box {
    @apply flex flex-1 flex-wrap;
    @apply p-2;
    @apply relative;
    align-content: flex-start;
    gap: 10px;
    // .monitor-item {
    //   width: 600px;
    //   height: 400px;
    // }
    // .monitor-item:nth-child(odd) {
    //   margin-left: 0;
    // }
    .control-panel {
      @apply flex absolute bottom-0 right-0;
    }
  }
}
</style>
