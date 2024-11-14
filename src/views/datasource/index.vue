<template>
  <div class="g-main-mapper">
    <!-- <div class="g-title-block">
      <div class="__title">体系概览</div>
    </div> -->
    <div class="mb-4 bg-white p-10px shadow-coolGray-100">
      <el-button v-model:disabled="notAllowedToAddPeer">同级新增</el-button>
      <el-button v-model:disabled="notAllowedToAddSub">下级新增</el-button>
    </div>
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
            <el-col :span="8">
              <el-form-item label="更新频率">
                <el-radio-group v-model="infoForm.updateFrequency" disabled>
                  <el-radio label="1">每日</el-radio>
                  <el-radio label="2">每周</el-radio>
                  <el-radio label="3">每月</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="info-card-level1 ml-20px">
          <div class="__title">
            <span>最近数据</span>
          </div>
          <div class="__content">
            <el-table
              :data="latestData"
              stripe
              border
              class="w-full"
              element-loading-text="拼命加载中"
            >
              <el-table-column prop="no" label="编号">
                <template v-slot="{ row }">
                  <a>{{ row.no }}</a>
                </template>
              </el-table-column>
              <el-table-column
                v-for="prop in infoForm.props"
                :key="prop.prop"
                :prop="prop.prop"
                :label="prop.label + (prop.unit ? `(${prop.unit})` : '')"
              >
                <template v-slot="{ row }">
                  <span>{{ row[prop.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
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
    label: "泛微",
    children: [
      {
        label: "项目",
        children: [
          {
            label: "#A001",
            children: [
              {
                label: "#A001-01",
              },
              {
                label: "#A001-02",
              },
            ],
          },
          {
            label: "订单",
            children: [
              {
                label: "#A002-01",
              },
              {
                label: "#A002-02",
              },
            ],
          },
          {
            label: "产品",
            children: [
              {
                label: "#A003-01",
              },
              {
                label: "#A003-02",
              },
            ],
          },
        ],
      },
      {
        label: "流程",
        children: [
          {
            label: "#A004",
          },
        ],
      },
    ],
  },
  {
    label: "钉钉",
    children: [
      {
        label: "合同流程",
      },
      {
        label: "提货流程",
      },
      {
        label: "卸货流程",
      },
      {
        label: "付款流程",
      },
    ],
  },
  {
    label: "库区ERP",
    children: [
      {
        label: "卸船",
        children: [
          {
            label: "卸船记录表",
          },
          {
            label: "卸船作业流水表",
          },
        ],
      },
      {
        label: "装车",
        children: [
          {
            label: "装车作业表",
          },
          {
            label: "月度作业流水表",
          },
        ],
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
  updateFrequency: "3",
  props: [
    {
      label: "属性1",
      prop: "prop1",
      unit: "单位1",
    },
    {
      label: "属性2",
      prop: "prop2",
      unit: "单位2",
    },
    {
      label: "创建人",
      prop: "createdBy",
    },
    {
      label: "创建时间",
      prop: "createdAt",
    },
    {
      label: "更新人",
      prop: "updatedBy",
    },
    {
      label: "更新时间",
      prop: "updatedAt",
    },
  ],
});

const latestData = ref([
  {
    name: "数据1",
    value: "100",
    unit: "单位1",
    no: "123456",
    createdAt: "2021-09-01",
    createdBy: "管理员",
  },
  {
    name: "数据2",
    no: "123457",
    value: "200",
    unit: "单位2",
    createdAt: "2021-09-02",
    createdBy: "管理员",
  },
  {
    name: "数据3",
    no: "123458",
    value: "300",
    unit: "单位3",
    createdAt: "2021-09-03",
    createdBy: "管理员",
  },
  {
    name: "数据4",
    value: "400",
    unit: "单位4",
    createdAt: "2021-09-04",
    createdBy: "管理员",
  },
]);

// 当前选中的节点
const selectedNode = ref<any>();

// 是否允许新增同级节点
const notAllowedToAddPeer: ComputedRef<boolean> = computed(() => {
  return !selectedNode.value || !selectedNode.value.parent;
});

// 是否允许新增下级节点
const notAllowedToAddSub: ComputedRef<boolean> = computed(() => {
  return !selectedNode.value || !selectedNode.value.children;
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
