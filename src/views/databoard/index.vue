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
            <el-col :span="6">
              <el-form-item label="名称">
                <span>{{ infoForm.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="名称2">
                <span>{{ infoForm.name2 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="名称3">
                <span>{{ infoForm.name3 }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单位">
                <span>{{ infoForm.unit }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="info-card-level1 ml-20px">
          <div class="__title">
            <span>趋势图</span>
          </div>
          <div class="__content" style="width: 100%; height: 400px">
            <div id="chart-container" style="width: 100%; height: 100%" />
          </div>
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
import { DataIndicesAPI } from "@/api/dataIndices";
import { DataDefinitionAPI } from "@/api/dataIndices/dataDefinition";
import * as echarts from "echarts";

const chartRef = shallowRef<echarts.ECharts | null>();

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
  id: undefined,
  /** 类型 */
  type: "其他数据",
  /** 状态 */
  status: "正常",
  /** 显示顺序 */
  order: 1,
  /** 名称1 */
  name: undefined,
  /** 名称2 */
  name2: undefined,
  /** 名称3 */
  name3: undefined,
  /** 单位 */
  unit: undefined,
  /** 描述 */
  description: undefined,
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
  // console.log(data);
  // todo: 点击后获取该节点的详细信息，用数据编码获取schema、数据、展现图表
  // selectedNode.value = data;
  // DataDefinitionAPI.getDataDefinition(data.label).then((res) => {
  //   console.log(res);
  // });
  initChart();
};

const initChart = () => {
  chartRef.value?.clear();
  chartRef.value = echarts.init(document.getElementById("chart-container"));
  const option = {
    title: {
      text: "ECharts 入门示例",
    },
    tooltip: {},
    legend: {
      data: ["销量"],
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  };
  chartRef.value.setOption(option);
};

interface IDataItem {
  类型: string;
  名称1: string;
  名称2?: string;
  名称3?: string;
}
/** 按名称1、名称2、名称3组织出树形结构(BFS) */
function generateTreeData(data: IDataItem[]): any[] {
  const treeData: any[] = [];
  const typeMap = new Map();
  for (const item of data) {
    const type = item["类型"];
    const name1 = item["名称1"];
    const name2 = item["名称2"];
    const name3 = item["名称3"];
    if (!typeMap.has(type)) {
      typeMap.set(type, {
        label: type,
        children: [],
      });
      treeData.push(typeMap.get(type));
    }
    const typeNode = typeMap.get(type);
    const name1Node = typeNode.children.find(
      (node: any) => node.label === name1
    );
    if (!name1Node) {
      typeNode.children.push({
        label: name1,
        children: [],
      });
    }
    const name1NodeIndex = typeNode.children.findIndex(
      (node: any) => node.label === name1
    );
    const name2Node = typeNode.children[name1NodeIndex].children.find(
      (node: any) => node.label === name2
    );
    if (!name2Node) {
      typeNode.children[name1NodeIndex].children.push({
        label: name2,
        children: [],
      });
    }
    const name2NodeIndex = typeNode.children[name1NodeIndex].children.findIndex(
      (node: any) => node.label === name2
    );
    const name3Node = typeNode.children[name1NodeIndex].children[
      name2NodeIndex
    ].children.find((node: any) => node.label === name3);
    if (!name3Node) {
      typeNode.children[name1NodeIndex].children[name2NodeIndex].children.push({
        label: name3,
      });
    }
  }
  return treeData;
}

onMounted(() => {
  // 获取所有定义，按照定义显示左侧树形结构
  // DataIndicesAPI.getAllDataIndices().then((res) => {
  //   console.log(res);
  // });
  // 先随便画个图
  // initChart();
});
</script>

<style lang="scss" scoped></style>
