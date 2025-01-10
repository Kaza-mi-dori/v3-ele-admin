<template>
  <div class="g-main-mapper">
    <!-- <div class="g-title-block">
      <div class="__title">体系概览</div>
    </div> -->
    <div class="mb-4 bg-white p-10px shadow-coolGray-100">
      <el-button v-model:disabled="notAllowedToAddPeer" @click="handleAddNode">
        同级新增
      </el-button>
      <!-- <el-button v-model:disabled="notAllowedToAddSub" @click="handleAddNode">
        下级新增
      </el-button> -->
      <el-button @click="handleGetMultipleImportTemplate">
        获取多个导入模板
      </el-button>
      <el-button @click="handleImportExcel">导入excel</el-button>
    </div>
    <div class="flex w-full">
      <div class="tree-wrapper">
        <!-- <el-input
          v-model="searchValue"
          search-icon="el-icon-search"
          class="mb-10px"
          size="small"
          placeholder="请输入搜索内容"
          clearable
          @clear="handleClear"
          @input="handleInput"
        /> -->
        <el-tree
          class="tree-menu"
          default-expand-all
          :data="data"
          :props="defaultProps"
          draggable
          @node-click="handleNodeClick"
          @node-drag-start="handleNodeDragStart"
          @node-drag-end="handleNodeDragEnd"
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
      <div class="flex-1 ml-4">
        <div class="info-card-level1">
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
            <el-col :span="6">
              <el-form-item label="数据标识">
                <span>{{ infoForm.no }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="info-card-level1">
          <div class="__title">
            <span>趋势图</span>
          </div>
          <div
            class="__content"
            style="width: calc(100% - 20px); height: 400px"
          >
            <div
              id="chart-container"
              style="width: 100%; height: 100%"
              @dragover="(e) => e.preventDefault()"
            />
          </div>
        </div>
        <div class="info-card-level1">
          <div class="__title">
            <span>最近数据</span>
          </div>
          <div class="__content">
            <!-- 表格操作区 -->
            <div class="op-block">
              <el-button
                type="primary"
                :disabled="!activeIndex"
                @click="handleAddRecord"
              >
                新增数据
              </el-button>
              <div>
                <el-button
                  icon="ArrowUp"
                  :disabled="!activeIndex"
                  @click="handleExportExcel"
                >
                  导出excel
                </el-button>
                <el-button
                  icon="Download"
                  @click="() => handleGetExcelTemplate()"
                >
                  获取excel模板
                </el-button>
                <el-button icon="ArrowDown" @click="handleImportExcel">
                  导入excel
                </el-button>
                <el-dropdown trigger="click" class="ml-4">
                  <el-button>
                    更多功能
                    <el-icon>
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                  <template v-slot:dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        :disabled="!activeIndex"
                        @click="handleBatchDelete"
                      >
                        <span class="text-red-5">批量删除</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <el-table
              :data="latestData"
              stripe
              border
              class="w-full"
              element-loading-text="拼命加载中"
            >
              <!-- <el-table-column prop="no" label="编号" width="80" align="center">
                <template v-slot="{ row }">
                  <el-link
                    type="primary"
                    underline
                    class="cursor-pointer"
                    @click="handleEditRecord(row)"
                  >
                    #{{ row.id }}
                  </el-link>
                </template>
              </el-table-column> -->
              <!-- 日期、值 -->
              <el-table-column
                prop="时间"
                label="时间"
                align="center"
                sortable
              />
              <el-table-column prop="数据" label="数据值" align="center" />
              <!-- 操作区 -->
              <el-table-column label="操作" align="center">
                <template v-slot="{ row }">
                  <el-button type="primary" @click="handleEditRecord(row)">
                    编辑
                  </el-button>
                  <el-button type="danger" @click="handleDeleteRecord(row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-model:current-page="dataPagination.currentPage"
              v-model:page-size="dataPagination.pageSize"
              class="mt-2 flex justify-end mb-4"
              background
              :page-sizes="dataPagination.sizes"
              layout="total, prev, pager, next, jumper, sizes"
              :total="dataPagination.total"
              @current-change="handleDataPageChange"
              @size-change="handleDataSizeChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 数据编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="activeRow.id ? '编辑数据' : '新增数据'"
      width="500px"
      label-width="100px"
    >
      <el-form
        ref="dataForm"
        :rules="singleDataRules"
        :model="activeRow"
        label-position="top"
        class="g-form-1"
      >
        <el-form-item label="标识">
          <el-input v-model="activeIndex.no" disabled />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="activeIndex.unit" disabled />
        </el-form-item>
        <el-form-item label="数据时间">
          <el-date-picker
            v-model="activeRow.date"
            type="datetime"
            placeholder="选择数据时间，如无精确时间统一选择00:00:00"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="数据值">
          <el-input v-model="activeRow.value" type="number" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="handleCancelEditData">取 消</el-button>
          <el-button type="primary" @click="handleSubmitSingleData">
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 导入excel弹窗 -->
    <importExcelDialog
      ref="importExcelDialogRef"
      :upload-url="uploadExcelUrl"
      :upload-name="'Excel文件'"
      @submit="handleSubmitDataInBatch"
    />
    <!-- 新增定义弹窗 -->
    <el-dialog
      v-model="definitionDialogVisible"
      title="新增数据定义"
      width="30%"
      center
    >
      <el-form
        ref="definitionFormRef"
        :model="definitionForm"
        :rules="definitionRules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="类别" prop="type">
          <el-select
            v-model="definitionForm.type"
            disabled
            placeholder="请选择"
          >
            <el-option label="其他数据" value="其他数据" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="definitionForm.name"
            placeholder="请输入数据大类名称(例如：市场日数据)"
          />
        </el-form-item>
        <el-form-item label="数据细分名称1" prop="name2">
          <el-input
            v-model="definitionForm.name2"
            placeholder="请输入数据细分名称(例如: 原油价格)"
          />
        </el-form-item>
        <el-form-item label="数据细分名称2" prop="name3">
          <el-input
            v-model="definitionForm.name3"
            placeholder="请输入数据细分名称(例如: 中海油报价)"
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input
            v-model="definitionForm.unit"
            placeholder="请输入单位，如：元/吨"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="definitionForm.status" placeholder="请选择">
            <el-option label="正常" value="正常" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="order">
          <el-input
            v-model="definitionForm.order"
            type="number"
            placeholder="请输入显示顺序"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="definitionForm.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="definitionDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="submitDefinitionLoading"
            @click="onSubmitDefinitionForm"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 选择要导入的数据指标 -->
    <el-dialog
      v-model="chooseDialogVisible"
      title="选择要导入的数据指标"
      width="50%"
      top="5vh"
    >
      <el-tree
        ref="chooseImportTreeRef"
        class="w-full max-h-600px overflow-y-auto"
        default-expand-all
        :data="data"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        @check-change="handleChoiceCheckChange"
      />
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseConfirmImportDialog">取 消</el-button>
          <el-button
            type="primary"
            :loading="confirmImportLoading"
            @click="handleConfirmImportData"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import importExcelDialog from "@/components/Dialogs/importExcelDialog.vue";
import { ref, onMounted } from "vue";
import { DataIndicesAPI } from "@/api/dataIndices";
import { DataDefinitionAPI } from "@/api/dataIndices/dataDefinition";
import { handleDeleteRow } from "@/hooks/useTableOp";
import * as echarts from "echarts";

const chartRef = shallowRef<echarts.ECharts | null>();
const treeLoading = ref(false);
const uploadExcelUrl =
  import.meta.env.VITE_APP_API_URL_DEV +
  "/Api/Business/IntegratedData/GetExcelData";

/** 单个指标的页码 */
const dataPagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  sizes: [10, 20, 50, 100],
});
/** 单个指标数据表格加载状态 */
const tableLoading = ref(false);
/** 单个指标数据规则 */
const singleDataRules = ref({
  date: [{ required: true, message: "请选择日期", trigger: "blur" }],
  value: [{ required: true, message: "请输入数据值", trigger: "blur" }],
});
const dataForm = ref<InstanceType<typeof ElForm> | null>(null);
/** 单个指标数据表格提交按钮加载状态 */
const singleDataFormSubmitLoading = ref(false);
/** 选中的指标 */
const activeIndex = ref<any>();
/** 数据弹窗是否显示 */
const dialogVisible = ref(false);
/** 当前行 */
const activeRow = ref<any>({
  id: undefined,
  no: undefined,
  date: undefined,
  value: undefined,
});
/** 导入弹窗ref */
const importExcelDialogRef = ref<InstanceType<typeof importExcelDialog> | null>(
  null
);
/** 选择导入指标弹窗是否显示 */
const chooseDialogVisible = ref(false);
/** 导入选择树ref */
const chooseImportTreeRef = ref<InstanceType<typeof ElTree> | null>(null);
/** 选择导入树选中的节点 */
const checkedNodes = ref<any[]>([]);
const confirmImportLoading = ref(false);

/** 新增定义表单 */
const definitionForm = ref({
  type: "其他数据",
  name: undefined,
  name2: undefined,
  name3: undefined,
  unit: undefined,
  status: "正常",
  order: 1,
  description: undefined,
});

/** 新增定义表单规则 */
const definitionRules = ref({
  type: [{ required: true, message: "请选择类别", trigger: "blur" }],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
});

/** 新增定义表单提交按钮加载状态 */
const submitDefinitionLoading = ref(false);

const definitionDialogVisible = ref(false);

const definitionFormRef = ref<InstanceType<typeof ElForm> | null>(null);

const data: Ref<any[]> = ref([]);

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
  /** 标识 */
  no: undefined,
});

const latestData: Ref<any[]> = ref([]);
const allData: Ref<any[]> = ref([]);

// 当前选中的节点
const selectedNode = ref<any>();

// 是否允许新增同级节点
const notAllowedToAddPeer: ComputedRef<boolean> = computed(() => {
  // return !selectedNode.value || !selectedNode.value.parent;
  return !selectedNode.value || selectedNode.value.children;
});

// 是否允许新增下级节点
const notAllowedToAddSub: ComputedRef<boolean> = computed(() => {
  return !selectedNode.value || !selectedNode.value.children;
});

/** 新增定义节点 */
const handleAddNode = () => {
  // 先将表单清空
  definitionForm.value = {
    type: "其他数据",
    name: activeIndex.value.name,
    name2: activeIndex.value.name2,
    name3: undefined,
    unit: undefined,
    status: "正常",
    order: 1,
    description: undefined,
  };
  definitionDialogVisible.value = true;
};

const handleClear = () => {
  searchValue.value = "";
};

const handleNodeDragStart = (data: any) => {
  // console.log(data);
};

const handleNodeDragEnd = (data: any) => {
  handleDropIndex(data);
};

const handleDropIndex = (item: any) => {
  // 如果没有activeIndex则什么也不做
  if (!activeIndex.value) return;
  let index = [];
  if (item.children) {
    index = item.children.map((item: any) => item.data["标识"]);
  } else {
    index = [item.data["标识"]];
  }
  DataIndicesAPI.getAllDataIndicesList({
    标识集合: index,
    页码: dataPagination.value.currentPage,
    页容量: dataPagination.value.pageSize,
  })
    .then((res: any) => {
      allData.value.push(...res);
      dataPagination.value.total = allData.value.length;
      latestData.value = allData.value.slice(
        (dataPagination.value.currentPage - 1) * dataPagination.value.pageSize,
        dataPagination.value.currentPage * dataPagination.value.pageSize
      );
      initChart(unref(allData));
    })
    .catch((err) => {
      console.error(err);
      ElMessage.error("获取数据失败");
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

const handleInput = (value: string) => {
  /**筛选 */
};

const handleNodeClick = (data: any) => {
  // console.log(data);
  // todo: 点击后获取该节点的详细信息，用数据编码获取schema、数据、展现图表
  // selectedNode.value = data;
  // DataDefinitionAPI.getDataDefinition(data.label).then((res) => {
  //   console.log(res);
  // });
  selectedNode.value = data;
  if (data.children) return;
  infoForm.value = {
    id: data.id,
    type: data["类型"],
    status: data["状态"],
    order: data["显示顺序"],
    name: data["名称1"],
    name2: data["名称2"],
    name3: data["名称3"],
    unit: data["单位"],
    description: data["描述"],
    no: data["标识"],
  };
  tableLoading.value = true;
  activeIndex.value = unref(infoForm);
  dataPagination.value.currentPage = 1;
  initActiveIndexData();
};

/** 单个指标的数据操作 */
const handleAddRecord = () => {
  // 弹窗新增数据
  dialogVisible.value = true;
};

const handleEditRecord = (row: any) => {
  // 弹窗编辑数据
  activeRow.value = {
    id: row.id,
    date: row["时间"],
    value: row["数据"],
  };
  dialogVisible.value = true;
};

const handleDeleteRecord = (row: any) => {
  // 删除数据
  tableLoading.value = true;
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    DataIndicesAPI.deleteDataIndices([
      {
        id: row.id,
        标识: row["标识"],
      },
    ])
      .then((res: any) => {
        console.log(res);
        ElMessage.success("删除成功");
        initActiveIndexData();
      })
      .catch((err) => {
        console.error(err);
        ElMessage.error("删除失败");
      })
      .finally(() => {
        tableLoading.value = false;
      });
  });
};

const handleExportExcel = () => {
  console.log("导出excel");
};

const handleGetExcelTemplate = (requestData?: any[]) => {
  // 有activeIndex则获取对应的导入模板
  // 无activeIndex则获取所有导入模板
  if (!activeIndex.value) {
    chooseDialogVisible.value = true;
    return;
  }
  const templateName =
    activeIndex.value.name +
    (activeIndex.value.name2 ? `-${activeIndex.value.name2}` : "") +
    (activeIndex.value.name3 ? `-${activeIndex.value.name3}` : "") +
    "导入模板.xlsx";
  // console.log(templateName);
  DataIndicesAPI.getImportTemplate([activeIndex.value.no])
    .then((res: any) => {
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateName}`;
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.error(err);
      ElMessage.error("获取模板失败");
    });
};

const handleImportExcel = () => {
  importExcelDialogRef.value?.open();
};

const handleBatchDelete = () => {
  console.log("批量删除");
};

const handleCancelEditData = () => {
  dialogVisible.value = false;
};

const handleSubmitSingleData = () => {
  dataForm.value?.validate(async (valid) => {
    if (valid) {
      singleDataFormSubmitLoading.value = true;
      const params = {
        id: activeRow.value.id,
        标识: activeIndex.value.no,
        时间: activeRow.value.date,
        数据: activeRow.value.value,
      };
      if (activeRow.value.id) {
        // 编辑
        DataIndicesAPI.updateDataIndices(params)
          .then((res: any) => {
            console.log(res);
            ElMessage.success("编辑成功");
            dialogVisible.value = false;
            initActiveIndexData();
          })
          .catch((err) => {
            console.error(err);
            ElMessage.error("编辑失败");
          })
          .finally(() => {
            singleDataFormSubmitLoading.value = false;
          });
      } else {
        // 新增
        DataIndicesAPI.addDataIndicesInBatch([params])
          .then((res: any) => {
            console.log(res);
            ElMessage.success("新增成功");
            initActiveIndexData();
            dialogVisible.value = false;
          })
          .catch((err: any) => {
            console.error(err);
            ElMessage.error("新增失败");
          })
          .finally(() => {
            singleDataFormSubmitLoading.value = false;
          });
      }
    }
  });
};

const initActiveIndexData = () => {
  if (!activeIndex.value) return;
  tableLoading.value = true;
  DataIndicesAPI.getAllDataIndicesList({
    标识集合: [activeIndex.value.no],
    页码: dataPagination.value.currentPage,
    页容量: dataPagination.value.pageSize,
  })
    .then((res: any) => {
      allData.value = res;
      dataPagination.value.total = allData.value.length;
      latestData.value = allData.value.slice(
        (dataPagination.value.currentPage - 1) * dataPagination.value.pageSize,
        dataPagination.value.currentPage * dataPagination.value.pageSize
      );
      initChart(unref(allData));
    })
    .catch((err) => {
      console.error(err);
      ElMessage.error("获取数据失败");
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

/**
 * 改变页码
 */
const handleDataPageChange = (val: number) => {
  latestData.value = allData.value.slice(
    (val - 1) * dataPagination.value.pageSize,
    val * dataPagination.value.pageSize
  );
};

/**
 * 改变页容量
 */
const handleDataSizeChange = (val: number) => {
  dataPagination.value.pageSize = val;
  dataPagination.value.currentPage = 1;
  initActiveIndexData();
};

/** 批量写入数据 */
const handleSubmitDataInBatch = (data: any) => {
  // console.log(data);
  importExcelDialogRef.value?.setSubmitLoading(true);
  DataIndicesAPI.addDataIndicesInBatch(data)
    .then((res: any) => {
      ElMessage.success("导入成功");
      importExcelDialogRef.value?.handleClose();
      dataPagination.value.currentPage = 1;
      initActiveIndexData();
    })
    .catch((err) => {
      console.error(err);
      importExcelDialogRef.value?.setSubmitLoading(false);
      ElMessage.error("导入失败");
    });
};

const initChart = (data: any) => {
  chartRef.value?.clear();
  chartRef.value = echarts.init(document.getElementById("chart-container"));
  /** 折线图 */
  // data按照时间排序
  data.sort((a: any, b: any) => {
    return new Date(a["时间"]).getTime() - new Date(b["时间"]).getTime();
  });
  const dataName =
    activeIndex.value.name +
    (activeIndex.value.name2 ? `/${activeIndex.value.name2}` : "") +
    (activeIndex.value.name3 ? `/${activeIndex.value.name3}` : "");
  const option = {
    // title: {
    //   text:
    //     activeIndex.value.name +
    //     (activeIndex.value.name2 ? `/${activeIndex.value.name2}` : "") +
    //     (activeIndex.value.name3 ? `/${activeIndex.value.name3}` : ""),
    // },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [dataName],
    },
    // 绘图位置靠左
    grid: {
      left: "2%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item: any) => item["时间"]),
      // 只显示时间戳前10位
      axisLabel: {
        formatter: (value: string) => {
          return value.slice(0, 10);
        },
      },
    },
    yAxis: {
      type: "value",
      name: activeIndex.value.unit,
    },
    series: [
      {
        name: dataName,
        type: "line",
        data: data.map((item: any) => item["数据"]),
        // 标出最高值、最低数据点
        markPoint: {
          data: [
            { type: "max", name: "最大值" },
            { type: "min", name: "最小值" },
          ],
        },
      },
    ],
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
};

/** 新增定义 */
const onSubmitDefinitionForm = () => {
  submitDefinitionLoading.value = true;
  definitionFormRef.value?.validate(async (valid) => {
    if (!valid) {
      submitDefinitionLoading.value = false;
      return;
    }
    const params = {
      类型: definitionForm.value.type,
      名称1: definitionForm.value.name,
      名称2: definitionForm.value.name2,
      名称3: definitionForm.value.name3,
      单位: definitionForm.value.unit,
      状态: definitionForm.value.status,
      显示顺序: definitionForm.value.order,
      描述: definitionForm.value.description,
    };
    DataDefinitionAPI.addDataDefinition(params)
      .then((res: any) => {
        console.log(res);
        ElMessage.success("新增成功");
        definitionDialogVisible.value = false;
        initMenuTreeData();
      })
      .catch((err) => {
        console.error(err);
        ElMessage.error("新增失败");
      })
      .finally(() => {
        submitDefinitionLoading.value = false;
      });
  });
};

interface IDataItem {
  类型: string;
  名称1: string;
  名称2?: string;
  名称3?: string;
  标识?: string;
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
        id: "-1",
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
        ...item,
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
        ...item,
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
        ...item,
      });
    }
  }
  // console.log(treeData);
  return treeData;
}

const handleCloseConfirmImportDialog = () => {
  chooseImportTreeRef.value?.setCheckedKeys([]);
  checkedNodes.value = [];
  chooseDialogVisible.value = false;
};

const handleGetMultipleImportTemplate = () => {
  chooseDialogVisible.value = true;
};

/** 选择导入数据改变回调 */
const handleChoiceCheckChange = (data: any) => {
  // console.log(data);
  checkedNodes.value = chooseImportTreeRef.value?.getCheckedNodes() as any[];
};

const handleConfirmImportData = () => {
  // console.log("确认导入数据");
  confirmImportLoading.value = true;
  const templateName = "数据导入模板.xlsx";
  // 去重一次
  const checkedNodesSet = new Set();
  checkedNodes.value.forEach((node) => {
    if (node["标识"]) {
      checkedNodesSet.add(node["标识"]);
    }
  });
  const checkedNodesArr = Array.from(checkedNodesSet) as string[];
  DataIndicesAPI.getImportTemplate(checkedNodesArr)
    .then((res: any) => {
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateName}`;
      a.click();
      window.URL.revokeObjectURL(url);
      ElMessage.success("获取模板成功");
      handleCloseConfirmImportDialog();
    })
    .catch((err) => {
      console.error(err);
      ElMessage.error("获取模板失败");
    })
    .finally(() => {
      confirmImportLoading.value = false;
    });
};

const initMenuTreeData = () => {
  treeLoading.value = true;
  DataDefinitionAPI.getDataDefinitionList({
    页码: 1,
    页容量: 1000,
  })
    .then((res: any) => {
      data.value = generateTreeData(
        res["当前记录"].sort((a: any, b: any) => {
          if (a["显示顺序"] && b["显示顺序"]) {
            return +a["显示顺序"] - +b["显示顺序"];
          }
          return a["名称3"] > b["名称3"] ? 1 : -1;
        })
      );
    })
    .catch((err) => {
      console.error(err);
      ElMessage.error("获取数据定义失败");
    })
    .finally(() => {
      treeLoading.value = false;
    });
};

onMounted(() => {
  // 获取所有定义，按照定义显示左侧树形结构
  initMenuTreeData();
  // 先随便画个图
  // initChart();
});
</script>

<style lang="scss" scoped>
@use "@/styles/index.scss" as *;

.tree-wrapper {
  @include g-scrollbar-1;
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

.op-block {
  @apply flex justify-between;
  margin-block: 10px;
}
.g-main-mapper {
  @apply w-full;
}
</style>
