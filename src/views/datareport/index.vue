<template>
  <div class="g-main-mapper">
    <!-- <div class="g-title-block">
      <div class="__title">体系概览</div>
    </div> -->
    <div class="flex">
      <div class="bg-white p-10px shadow-coolGray-100 max-w-250px">
        <el-input
          v-model="searchValue"
          search-icon="el-icon-search"
          class="mb-10px"
          size="small"
          placeholder="请输入搜索内容"
          clearable
          @clear="handleClear"
          @input="handleInput"
        />
        <el-tree
          class="w-full"
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="w-full">
        <div class="info-card-level1 ml-20px">
          <div class="__title">
            <span>定义信息</span>
          </div>
          <!-- todo: form -->
          <el-form
            class="g-form-1"
            :model="infoForm"
            label-position="top"
            inline
          >
            <el-col :span="8">
              <el-form-item label="名称">
                <span>{{ infoForm.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编号">
                <span>{{ infoForm.no }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型">
                <span>{{ infoForm.type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="描述">
                <span>{{ infoForm.description }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人">
                <span>{{ infoForm.createdBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">
                <span>{{ infoForm.createdAt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新人">
                <span>{{ infoForm.updatedBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新时间">
                <span>{{ infoForm.updatedAt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据来源">
                <span>{{ infoForm.relatedDatasource }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="允许手动更新">
                <span>{{ infoForm.isHandy ? "是" : "否" }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="info-card-level1 ml-20px">
          <div class="__title">
            <span>最近数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const data = ref([
  {
    label: "定期报表类",
    children: [
      {
        label: "经营报表",
        children: [
          {
            label: "年度经营报表",
            children: [
              {
                label: "原油",
              },
              {
                label: "成品油",
              },
            ],
          },
          {
            label: "月度经营报表",
            children: [
              {
                label: "原油",
              },
              {
                label: "成品油",
              },
            ],
          },
          {
            label: "每日经营报表",
            children: [
              {
                label: "原油",
              },
              {
                label: "成品油",
              },
            ],
          },
        ],
      },
      {
        label: "企业概况表",
        children: [
          {
            label: "广投石化",
          },
        ],
      },
    ],
  },
  {
    label: "台账记录类",
    children: [
      {
        label: "合同展示台账",
      },
      {
        label: "结算展示台账",
      },
    ],
  },
]);

const defaultProps = {
  children: "children",
  label: "label",
};

const searchValue = ref("");

const infoForm = ref({
  name: "名称",
  no: "编号",
  type: "类型1",
  description: "测试数据",
  createdBy: "管理员",
  createdAt: "2021-09-01",
  updatedBy: "管理员",
  updatedAt: "2021-09-02",
  relatedDatasource: "数据来源1",
  isHandy: true,
});

const handleClear = () => {
  searchValue.value = "";
};

const handleInput = (value: string) => {
  console.log(value);
};

const handleNodeClick = (data: any) => {
  console.log(data);
};
</script>

<style lang="scss" scoped></style>
