<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="用户名" label="用户名">
          <el-input
            v-model="queryParams.用户名"
            placeholder="用户名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="地址" label="地址">
          <el-input
            v-model="queryParams.地址"
            placeholder="目标地址"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="createTime" label="操作时间">
          <el-date-picker
            v-model="queryParams.时间区段"
            :editable="false"
            class="!w-[240px]"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
      >
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column prop="用户名" label="用户名" />
        <el-table-column prop="地址" label="地址" />
        <el-table-column prop="时间" label="操作时间" width="180" />
        <el-table-column prop="目标" label="目标" />
        <el-table-column prop="耗时" label="耗时" />
        <el-table-column prop="异常" label="是否返回异常" />
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.页码"
        v-model:limit="queryParams.页容量"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Log",
  inheritAttrs: false,
});

import LogAPI, {
  LogAPI2,
  LogPageVO,
  LogPageQuery,
  LogPageQuery2,
} from "@/api/system/log";

const queryFormRef = ref(ElForm);

const loading = ref(false);
const total = ref(0);

const queryParams = reactive<
  Partial<LogPageQuery2> &
    PageQueryDev & {
      时间区段?: [string, string];
    }
>({
  页码: 1,
  页容量: 20,
});

// 日志表格数据
const pageData = ref<any[]>();

/** 查询 */
function handleQuery() {
  loading.value = true;
  // 将时间区段拆分为开始时间和结束时间
  if (queryParams.时间区段) {
    const [startTime, endTime] = queryParams.时间区段;
    queryParams.时间开始 = startTime;
    queryParams.时间结束 = endTime;
  }
  LogAPI2.getPage(queryParams)
    .then((data: any) => {
      pageData.value = data.当前记录;
      total.value = data.记录总数;
    })
    .finally(() => {
      loading.value = false;
    });
}
/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.页码 = 1;
  queryParams.页容量 = 20;
  queryParams.时间区段 = undefined;
  queryParams.时间开始 = undefined;
  queryParams.时间结束 = undefined;
  queryParams.用户名 = undefined;
  queryParams.地址 = undefined;
  handleQuery();
}

onMounted(() => {
  handleQuery();
});
</script>
