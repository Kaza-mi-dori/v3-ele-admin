<template>
  <div class="main-wrapper w-full h-full">
    <div class="m-container">
      <div class="menu-box">
        <div class="menu-box-title">
          <span class="__text">广投石化视频监控平台</span>
        </div>
        <div class="menu-box-list">
          <div class="w-full flex flex-gap-2 justify-evenly items-center mb-2">
            <el-input
              v-model="searchValue"
              placeholder="搜索监控名称"
              clearable
            />
            <el-icon
              style="font-size: 22px; cursor: pointer"
              @click="onRefresh"
            >
              <RefreshLeft />
            </el-icon>
            <el-icon
              style="font-size: 22px; cursor: pointer"
              @click="showAddMonitorDialog"
            >
              <Plus />
            </el-icon>
          </div>
          <el-tree
            ref="treeRef"
            :data="nodelist"
            :props="defaultProps"
            :allow-drag="(node: any) => node.children === undefined"
            :allow-drop="() => false"
            draggable
            :filter-node-method="filterNode"
            @node-drag-start="handleNodeDragStart"
            @node-drag-end="handleNodeDragEnd"
          />
          <!-- <div class="__collapse">
            <el-button round icon="ArrowLeft" @click="toggleMenu" />
          </div> -->
          <div class="__return-entry">
            <el-link type="primary" underline @click="toHomePage">
              返回首页
            </el-link>
          </div>
        </div>
      </div>
      <div class="monitors-box">
        <div
          v-for="monitor in maxShowMonitors"
          :key="monitor"
          :style="{
            width: getWidthByAmount(maxShowMonitors),
          }"
          :class="{
            relative: true,
            active: monitor === activeMonitorIndex,
          }"
          @click="handleClickMonitorBox(monitor)"
          @drop="handleDrop"
          @dragover="(e) => e.preventDefault()"
        >
          <div
            v-if="monitors[monitor - 1]?.name"
            class="absolute top-1 left-2 color-black font-700"
          >
            {{ monitors[monitor - 1].name }}
          </div>
          <MonitorCard
            :blockId="monitor"
            :url="monitors[monitor - 1]?.url || ';javascript:void(0);'"
          />
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
            <!-- 全屏 -->
            <el-popover placement="top" width="100" trigger="hover">
              <template #reference>
                <el-button round icon="FullScreen" @click="toggleFullScreen" />
              </template>
              <div style="text-align: center">全屏显示</div>
            </el-popover>
            <!-- <el-button icon="FullScreen" round @click="toggleFullScreen" /> -->
            <!-- 侧边菜单显示 -->
            <el-popover placement="top" width="100" trigger="hover">
              <template #reference>
                <el-button round icon="Operation" @click="toggleMenu" />
              </template>
              <div style="text-align: center">侧边菜单</div>
            </el-popover>
            <!-- 切换监控数量 -->
            <el-popover placement="top" width="100" trigger="hover">
              <template #reference>
                <el-button
                  icon="platform"
                  round
                  @click="onChangeMonitorAmount(1)"
                />
              </template>
              <div style="text-align: center">显示一个监控</div>
            </el-popover>
            <el-popover placement="top" width="100" trigger="hover">
              <template #reference>
                <el-button
                  icon="menu"
                  round
                  @click="onChangeMonitorAmount(4)"
                />
              </template>
              <div style="text-align: center">显示四个监控</div>
            </el-popover>
            <el-popover placement="top" width="100" trigger="hover">
              <template #reference>
                <el-button
                  icon="grid"
                  round
                  @click="onChangeMonitorAmount(9)"
                />
              </template>
              <div style="text-align: center">显示九个监控</div>
            </el-popover>

            <!-- <el-button icon="menu" round @click="onChangeMonitorAmount(4)" /> -->
            <!-- <el-button icon="grid" round @click="onChangeMonitorAmount(9)" /> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 新增监控 -->
    <el-dialog v-model="addMonitorDialog" title="新增监控" width="500px">
      <el-form
        ref="addMonitorFormRef"
        :model="addMonitorForm"
        :rules="addMonitorFormRules"
        label-width="100px"
      >
        <el-form-item label="监控组" prop="group">
          <el-select v-model="addMonitorForm.group" placeholder="请选择监控组">
            <el-option label="监控组1" value="1" />
            <el-option label="监控组2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="监控名称" prop="name">
          <el-input v-model="addMonitorForm.name" />
        </el-form-item>
        <el-form-item label="监控地址" prop="url">
          <el-input v-model="addMonitorForm.url" />
        </el-form-item>
        <el-form-item label="协议" prop="protocol">
          <el-select v-model="addMonitorForm.protocol" placeholder="请选择协议">
            <el-option label="rtmp" value="rtmp" />
            <el-option label="rtsp" value="rtsp" />
          </el-select>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="addMonitorForm.port" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addMonitorForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addMonitorForm.password" />
        </el-form-item>
        <el-form-item>
          <div class="flex justify-end w-full">
            <el-button type="primary" @click="addMonitor">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MonitorAPI } from "@/api/monitor";
import { ElTree } from "element-plus";
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

const treeRef = ref<InstanceType<typeof ElTree>>();
const panelCollapsed = ref(true);
const maxShowMonitors = ref(4);
const draggedNode = ref(null);
const searchValue = ref<string | undefined>();
const activeMonitorIndex = ref(-1);
const addMonitorDialog = ref(false);
const addMonitorName = ref("");
const addMonitorUrl = ref("");
const addMonitorForm = ref({
  group: "",
  name: "",
  url: "",
  protocol: "rtmp",
  port: "",
  username: "",
  password: "",
});
const addMonitorFormRef = ref<InstanceType<typeof ElForm>>();
const addMonitorFormRules = ref({
  group: [{ required: true, message: "请选择监控组", trigger: "blur" }],
  name: [{ required: true, message: "请输入监控名称", trigger: "blur" }],
  url: [{ required: true, message: "请输入监控访问地址", trigger: "blur" }],
  protocol: [{ required: true, message: "请选择协议", trigger: "blur" }],
  port: [{ required: true, message: "请输入端口号", trigger: "blur" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
const showAddMonitorDialog = () => {
  addMonitorDialog.value = true;
};

const addMonitor = () => {
  // console.log(addMonitorName.value, addMonitorUrl.value);
  ElMessageBox.confirm("确定新增监控吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      addMonitorFormRef.value?.validate((valid: boolean) => {
        if (valid) {
          ElMessage.warning("新增功能未开放");
          console.log(addMonitorForm.value);
        }
      });
    })
    .catch(() => {
      ElMessage.info("已取消新增");
    });
};

const handleNodeClick = (data: any) => {
  console.log(data);
};

const handleClickMonitorBox = (index: number) => {
  activeMonitorIndex.value = index;
};

const toggleMenu = () => {
  const menuBox = document.getElementsByClassName("menu-box")[0] as HTMLElement;
  if (menuBox) {
    menuBox.style.display = menuBox.style.display === "none" ? "block" : "none";
  }
};

const onRefresh = () => {
  searchValue.value = undefined;
};

const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

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

const toggleFullScreen = () => {
  const element = document.getElementsByClassName("monitors-box")?.[0];
  if (!element) return;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};

const handleNodeDragEnd = (node: any, dest: any, pos: any, event: any) => {
  // console.log(node, dest, pos, event);
};

const handleNodeDragStart = (node: any, event: any) => {
  draggedNode.value = Array.isArray(node) ? node[0] : node;
};

const handleDrop = (event: any) => {
  // 这里需要获取放置的位置的MonitorCard的blockId
  const blockId = event.target.getAttribute("id");
  if (blockId) {
    const index = parseInt(blockId.split("-")[1]) - 1;
    if (draggedNode.value) {
      const { data } = draggedNode.value as unknown as Monitor;
      monitors.value[index] = {
        name: data.label,
        url: "",
        id: data.id,
      };
      console.log(monitors.value);
      // 这里需要调用接口，将draggedNode.value.id的监控放到blockId的监控区域
    }
  }
};

const toHomePage = () => {
  window.location.href = "/";
};

/**
 * 监控最大数量变化时，重新计算监控区域的宽度，且清除原先的monitor
 */
watch(
  () => maxShowMonitors.value,
  () => {
    monitors.value = [];
  }
);

/**
 * 监控过滤值调用过滤方法
 */
watch(
  () => searchValue.value,
  (val) => {
    treeRef.value!.filter(val);
  }
);

/**
 * 屏幕尺寸变化时，重新计算监控区域的宽度
 */
const resize = () => {
  maxShowMonitors.value = maxShowMonitors.value;
};

/**
 * 卸载时清除resize事件
 */
onUnmounted(() => {
  window.removeEventListener("resize", resize);
});

onMounted(async () => {
  const res: any = await MonitorAPI.getMonitorList();
  monitors.value = res["当前记录"];
  window.addEventListener("resize", resize);
  // console.log(monitors.value);
});
</script>

<style lang="scss" scoped>
.m-container {
  @apply flex pr-2 pb-2;
  height: 100%;
  width: 100%;
  .menu-box {
    @apply relative;
    width: 300px;
    @apply bg-white border-r-1 h-full;
    border-color: #e2e8f0;
    .menu-box-title {
      @apply p-2 text-align-center;
      .__text {
        @apply text-24px font-bold;
        // color: $bigscreen-primary-color-1;
        color: #333;
      }
    }
    .menu-box-list {
      @apply p-2;
    }
    .__collapse {
      @apply absolute top-50% right-0;
    }
    .__return-entry {
      @apply absolute bottom-0 right-50% transform-translate-x-50%;
    }
    transition: all ease 0.3s;
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
    .active {
      @apply border-2 border-solid border-primary;
    }
  }
}
</style>
