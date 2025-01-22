<!-- 导入excel弹窗 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="导入excel"
    width="80%"
    :before-close="handleClose"
  >
    <el-upload
      v-if="fileList.length === 0"
      v-model:file-list="fileList"
      drag
      :name="props.uploadName"
      :show-file-list="false"
      :action="props.uploadUrl"
      :headers="props.headers"
      :on-success="handleSuccess"
      class="mb-4"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <!-- 否则显示图片式上传 -->
    <div v-else class="uploaded-block">
      <div v-for="(item, index) in fileList" :key="index" class="uploaded-item">
        <div class="uploaded-item-name">{{ item.name }}</div>
        <div class="uploaded-item-action">
          <el-link type="primary" @click="handlePreview(item)">预览</el-link>
          <el-link type="primary" @click="handleDownload(item)">下载</el-link>
          <el-link type="danger" @click="handleRemove(item, fileList)">
            删除
          </el-link>
        </div>
      </div>
      <div class="text-red-5">请确认数据是否正确，再点击确定按钮导入数据</div>
    </div>
    <el-table
      v-if="tableData.length > 0"
      :header-cell-style="() => ({ textAlign: 'center' })"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
      style="width: 100%"
      row-key="名称"
      default-expand-all
      stripe
    >
      <!-- 名称 -->
      <el-table-column label="名称" prop="名称" width="100" align="center" />
      <!-- 固定成本 -->
      <el-table-column
        label="全年预测固定成本"
        prop="全年预测固定成本"
        width="150"
        align="center"
      >
        <template v-slot="{ row }">
          <span>
            {{
              row["全年预测固定成本"]
                ? parseFloat(row["全年预测固定成本"]).toFixed(2)
                : "-"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(unit, key) of tableData[0].数据"
        :key="key"
        :label="unit['类型']"
      >
        <el-table-column label="报告日" prop="报告日" sortable>
          <template v-slot="{ row }">
            <span>
              {{
                row["数据"][key] && row["数据"][key]["报告日"]
                  ? parseFloat(row["数据"][key]["报告日"]).toFixed(2)
                  : "-"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="月累计" prop="月累计" sortable>
          <template v-slot="{ row }">
            <span>
              {{
                row["数据"][key] && row["数据"][key]["月累计"]
                  ? parseFloat(row["数据"][key]["月累计"]).toFixed(2)
                  : "-"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="年累计" prop="年累计" sortable>
          <template v-slot="{ row }">
            <span>
              {{
                row["数据"][key] && row["数据"][key]["年累计"]
                  ? parseFloat(row["数据"][key]["年累计"]).toFixed(2)
                  : "-"
              }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
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
    <!-- 按钮 -->
    <div class="flex justify-end mt-4">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps } from "vue";
import { ElMessageBox, ElMessage, UploadFiles } from "element-plus";
import { getToken } from "@/utils/auth2";

const emit = defineEmits(["submit"]);
const props = defineProps({
  uploadUrl: {
    type: String,
    required: true,
  },
  headers: {
    type: Object,
    required: false,
    default: () => ({
      "Gtzn-Token": getToken(),
    }),
  },
  uploadName: {
    type: String,
    required: false,
    default: "file",
  },
  devType: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const fileList = ref<UploadFiles>([]);
const tableData = ref<any[]>([]);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const submitLoading = ref<boolean>(false);

const dialogVisible = ref<boolean>(false);

const open = () => {
  dialogVisible.value = true;
};

const handleSuccess = (response: any, file: any) => {
  if (response.data) {
    // 后端1
    const data = response.data;
    if (Array.isArray(data)) {
      tableData.value = data;
    } else {
      ElMessage.error("解析数据失败，请检查文件格式是否正确！");
    }
  } else {
    // 后端2
    const data: any = response["对象"];
    // 241230 特殊表格处理
    if (!data) {
      ElMessage.error("解析数据失败，请检查文件格式是否正确！");
      return;
    }
    const {
      内容: { 数据列表: list },
    } = data;
    if (Array.isArray(list)) {
      const parentNodeNames = ["广投石化", "永盛公司"];
      // 找出父节点的位置，假定顺序严格按照父1-子11-子12-父2-子21-子22
      const parentIndexs = list
        .map((item, index) =>
          parentNodeNames.includes(item.名称) ? index : -1
        )
        .filter((index) => index !== -1);
      // 生成树形结构
      const treeData: any[] = [];
      parentIndexs.forEach((parentIndex, index) => {
        const result = {
          名称: list[parentIndex].名称,
          全年预测固定成本: list[parentIndex].全年预测固定成本,
          数据: list[parentIndex].数据,
          children: [] as any[],
        };
        const children = list.slice(parentIndex + 1, parentIndexs[index + 1]);
        result.children = children.map((child) => {
          // 将父节点中数据字段有的key，复制到子节点中
          const keys = ["报告日", "月累计", "年累计"];
          if (child.数据) {
            keys.forEach((key) => {
              child.数据.forEach((item: any) => {
                item[key] = item[key] || undefined;
              });
              // 如果发现child.数据长度小于父节点，则需要补充到父节点长度
              if (child.数据.length < list[parentIndex].数据.length) {
                const len = list[parentIndex].数据.length - child.数据.length;
                const originalLength = child.数据.length;
                for (let i = 0; i < len; i++) {
                  child.数据.push({
                    类型: list[parentIndex].数据[i + originalLength].类型,
                    报告日: undefined,
                    月累计: undefined,
                    年累计: undefined,
                  });
                }
              }
            });
          }
          return {
            名称: child.名称,
            全年预测固定成本: child.全年预测固定成本,
            数据: child.数据,
          };
        }) as any[];
        // if (result.children.length === 0) {
        //   result.hasChildren = false;
        // }
        treeData.push(result);
      });
      tableData.value = treeData;
      // console.log("tableData==", tableData.value);
    } else {
      ElMessage.error("解析数据失败，请检查文件格式是否正确！");
    }
  }
};

const handlePreview = (file: any) => {
  console.log(file);
};

const handleDownload = (file: any) => {
  console.log(file);
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};
/** */
const handleRemove = (file: any, fileList: any) => {
  // 询问是否删除数据
  ElMessageBox.confirm("是否清空数据？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      tableData.value = [];
    })
    .catch(() => {})
    .finally(() => {
      // 不论是否清空数据，都删除文件
      fileList.splice(fileList.indexOf(file), 1);
    });
};

const handleClose = () => {
  fileList.value = [];
  tableData.value = [];
  currentPage.value = 1;
  submitLoading.value = false;
  dialogVisible.value = false;
};

const handleSubmit = () => {
  emit("submit", tableData.value);
};

const setSubmitLoading = (loading: boolean) => {
  submitLoading.value = loading;
};

defineExpose({
  open,
  handleClose,
  setSubmitLoading,
});
</script>

<style lang="scss" scoped>
.uploaded-block {
  .uploaded-item {
    @apply flex items-center justify-between cursor-pointer;
    padding: 10px;
    .uploaded-item-name {
      color: blue;
      flex: 1;
    }
    .uploaded-item-action {
      @apply flex items-center;
      .el-link {
        margin-left: 10px;
      }
    }
  }
}
</style>
