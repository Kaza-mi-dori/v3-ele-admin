<template>
  <div class="dashboard-container">
    <!-- <github-corner class="github-corner" /> -->

    <el-card shadow="never">
      <el-row justify="space-between">
        <el-col :span="18" :xs="24">
          <div class="flex h-full items-center">
            <img
              class="w-20 h-20 mr-5 rounded-full"
              :src="userStore.userInfo.avatar + '?imageView2/1/w/80/h/80'"
            />
            <div>
              <p>{{ greetings }}</p>
            </div>
          </div>
        </el-col>

        <el-col :span="6" :xs="24">
          <div class="flex h-full items-center justify-around">
            <el-statistic
              v-for="item in statisticData"
              :key="item.key"
              :value="item.value"
            >
              <template #title>
                <div class="flex items-center">
                  <svg-icon :icon-class="item.iconClass" size="20px" />
                  <span class="text-[16px] ml-1">{{ item.title }}</span>
                </div>
              </template>
              <template v-if="item.suffix" #suffix>/0</template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据卡片 -->
    <!-- <el-row :gutter="10" class="mt-5">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <template #header>
            <div class="flex-x-between">
              <span class="text-[var(--el-text-color-secondary)]">
                在线用户
              </span>
              <el-tag type="success" size="small">-</el-tag>
            </div>
          </template>

          <div class="flex-x-between mt-2">
            <span class="text-lg">{{ onlineUserCount }}</span>
            <svg-icon icon-class="user" size="2em" />
          </div>
          <div
            class="flex-x-between mt-2 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span>总用户数</span>
            <span>5</span>
          </div>
        </el-card>
      </el-col>

      <el-col
        v-for="(item, index) in visitStatsList"
        :key="index"
        :xs="24"
        :sm="12"
        :lg="6"
      >
        <el-skeleton :loading="visitStatsLoading" :rows="5" animated>
          <template #template>
            <el-card>
              <template #header>
                <div>
                  <el-skeleton-item variant="h3" style="width: 40%" />
                  <el-skeleton-item
                    variant="rect"
                    style="float: right; width: 1em; height: 1em"
                  />
                </div>
              </template>

              <div class="flex-x-between">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item
                  variant="circle"
                  style="width: 2em; height: 2em"
                />
              </div>
              <div class="mt-5 flex-x-between">
                <el-skeleton-item variant="text" style="width: 50%" />
                <el-skeleton-item variant="text" style="width: 1em" />
              </div>
            </el-card>
          </template>
          <template v-if="!visitStatsLoading">
            <el-card shadow="never">
              <template #header>
                <div class="flex-x-between">
                  <span class="text-[var(--el-text-color-secondary)]">
                    {{ item.title }}
                  </span>
                  <el-tag :type="item.tagType" size="small">
                    {{ item.granularity }}
                  </el-tag>
                </div>
              </template>

              <div class="flex-x-between mt-2">
                <div class="flex-y-center">
                  <span class="text-lg">{{ item.todayCount }}</span>
                  <span
                    :class="[
                      'text-xs',
                      'ml-2',
                      getGrowthRateClass(item.growthRate),
                    ]"
                  >
                    <el-icon>
                      <Top v-if="item.growthRate > 0" />
                      <Bottom v-else-if="item.growthRate < 0" />
                    </el-icon>
                    {{ formatGrowthRate(item.growthRate) }}
                  </span>
                </div>
                <svg-icon :icon-class="item.icon" size="2em" />
              </div>

              <div
                class="flex-x-between mt-2 text-sm text-[var(--el-text-color-secondary)]"
              >
                <span>总{{ item.title }}</span>
                <span>{{ item.totalCount }}</span>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </el-row> -->

    <el-row :gutter="10" class="mt-5">
      <el-col :xs="24" :span="16">
        <el-card>
          <template #header>
            <div class="flex-x-between">
              <div class="flex-y-center">通知待办</div>
              <el-link type="primary">
                <span class="text-xs" @click="viewMoreNotice">查看更多</span>
                <el-icon class="text-xs"><ArrowRight /></el-icon>
              </el-link>
            </div>
          </template>

          <el-scrollbar v-if="notices.length > 0" height="400px">
            <div
              v-for="(item, index) in notices"
              :key="index"
              class="flex-y-center py-3"
            >
              <DictLabel v-model="item.type" code="notice_type" size="small" />
              <el-text
                truncated
                class="!mx-2 flex-1 !text-xs !text-[var(--el-text-color-secondary)]"
              >
                {{ item.title }}
              </el-text>
              <el-link @click="viewNoticeDetail(item.id)">
                <el-icon class="text-sm"><View /></el-icon>
              </el-link>
            </div>
          </el-scrollbar>
          <el-empty v-else />
        </el-card>
      </el-col>
      <!-- 常用入口 -->
      <el-col :xs="24" :span="8">
        <el-card>
          <template #header>
            <div class="flex-x-between">
              <div class="flex-y-center">常用入口</div>
            </div>
          </template>

          <el-row :gutter="10">
            <el-col
              v-for="menu in myFavoMenu"
              :key="menu.name"
              :xs="24"
              :span="12"
            >
              <el-card shadow="never" class="flex-y-center mb-2">
                <div class="flex items-center">
                  <svg-icon
                    :icon-class="menu.iconClass"
                    :class="menu.class"
                    size="1.5em"
                  />
                  <el-link
                    type="primary"
                    class="text-sm ml-2"
                    @click.prevent="handleJump(menu)"
                  >
                    {{ menu.name }}
                  </el-link>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <NoticeDetail ref="noticeDetailRef" />
    <left5 />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

import VisitTrend from "./components/VisitTrend.vue";
import left5 from "../bigscreen/components/FirstPage/Left/left5.vue";

import WebSocketManager from "@/utils/websocket";
import router from "@/router";
import { useRouter } from "vue-router";

import { useUserStore } from "@/store/modules/user";
import StatsAPI, { VisitStatsVO } from "@/api/system/log";
import NoticeAPI, { NoticePageVO } from "@/api/system/notice";

const noticeDetailRef = ref();

const userStore = useUserStore();
const router2 = useRouter();
const date: Date = new Date();
const greetings = computed(() => {
  const hours = date.getHours();
  if (hours >= 6 && hours < 8) {
    return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
  } else if (hours >= 8 && hours < 12) {
    return "上午好，" + userStore.userInfo.nickname + "！";
  } else if (hours >= 12 && hours < 18) {
    return "下午好，" + userStore.userInfo.nickname + "！";
  } else if (hours >= 18 && hours < 24) {
    return "晚上好，" + userStore.userInfo.nickname + "！";
  } else {
    return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
  }
});

const myFavoMenu = ref([
  {
    name: "系统监控",
    iconClass: "monitor",
    routeName: "Monitor",
    routeType: "outer",
    class: "icon-monitor",
  },
  {
    name: "数据大屏",
    iconClass: "user",
    routeName: "BigScreenBoard",
    routeType: "outer",
  },
  {
    name: "系统日志",
    iconClass: "message",
    routeName: "Log",
    routeType: "inner",
  },
  {
    name: "业务经营报表",
    iconClass: "table",
    routeName: "YearlyReportMng",
    routeType: "inner",
    class: "icon-report",
  },
]);

// 右上角数量
const statisticData = ref([
  {
    value: 0,
    iconClass: "message",
    title: "消息",
    key: "message",
  },
  {
    value: 0,
    iconClass: "todo",
    title: "待办",
    suffix: "/0",
    key: "upcoming",
  },
  // {
  //   value: 10,
  //   iconClass: "project",
  //   title: "项目",
  //   key: "project",
  // },
]);

const onlineUserCount = ref(0);

const visitStatsLoading = ref(true);
const visitStatsList = ref<VisitStats[] | null>(Array(3).fill({}));
interface VisitStats {
  title: string;
  icon: string;
  tagType: "primary" | "success" | "warning";
  growthRate: number;
  // 粒度
  granularity: string;
  // 今日数量
  todayCount: number;
  totalCount: number;
}
// 加载访问统计数据
const loadVisitStatsData = async () => {
  const list: VisitStatsVO[] = await StatsAPI.getVisitStats();

  if (list) {
    const tagTypes: ("primary" | "success" | "warning")[] = [
      "primary",
      "success",
      "warning",
    ];
    const transformedList: VisitStats[] = list.map((item, index) => ({
      title: item.title,
      icon: getVisitStatsIcon(item.type),
      tagType: tagTypes[index % tagTypes.length],
      growthRate: item.growthRate,
      granularity: "日",
      todayCount: item.todayCount,
      totalCount: item.totalCount,
    }));
    visitStatsList.value = transformedList;
    visitStatsLoading.value = false;
  }
};

/** 格式化增长率 */
const formatGrowthRate = (growthRate: number): string => {
  if (growthRate === 0) {
    return "-";
  }

  const formattedRate = Math.abs(growthRate * 100)
    .toFixed(2)
    .replace(/\.?0+$/, "");
  return formattedRate + "%";
};

/** 获取增长率文本颜色类 */
const getGrowthRateClass = (growthRate: number): string => {
  if (growthRate > 0) {
    return "color-[--el-color-danger]";
  } else if (growthRate < 0) {
    return "color-[--el-color-success]";
  } else {
    return "color-[--el-color-info]";
  }
};

/** 获取访问统计图标 */
const getVisitStatsIcon = (type: string) => {
  switch (type) {
    case "pv":
      return "pv";
    case "uv":
      return "uv";
    case "ip":
      return "ip";
    default:
      return "pv";
  }
};

const notices = ref<NoticePageVO[]>([]);

// 查看更多
function viewMoreNotice() {
  router.push({ path: "/myNotice" });
}

// 阅读通知公告
function viewNoticeDetail(id: string) {
  noticeDetailRef.value.openNotice(id);
}

/** 跳转 */
function handleJump(menu: any) {
  if (menu.routeType === "inner") {
    // router.push({ name: menu.routeName });
    const url = router.resolve({ name: menu.routeName }).href;
    router.push({
      path: url,
    });
  } else {
    const url = router.resolve({ name: menu.routeName }).href;
    window.open(url, "_blank");
  }
}

onMounted(() => {
  loadVisitStatsData();

  // 获取我的通知公告
  NoticeAPI.getMyNoticePage({ pageNum: 1, pageSize: 10 }).then((data) => {
    notices.value = data.list;
  });

  WebSocketManager.subscribeToTopic("/topic/onlineUserCount", (data) => {
    console.log("收到在线用户数量：", data);
    onlineUserCount.value = JSON.parse(data);
  });
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }
}
.icon-monitor {
  fill: #01a4ea;
}
.icon-report {
  fill: #c055d3;
}
</style>
