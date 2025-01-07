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
      :data="currentTableData"
      border
      max-height="600px"
      style="width: 100%"
      stripe
    >
      <el-table-column type="index" label="序号" width="50" />
      <!-- 按照第一行的属性名，生成表头 -->
      <el-table-column
        v-for="(value, key) of tableData[0]"
        :key="key"
        :prop="key + ''"
        :label="key + ''"
        sortable
      >
        <template v-slot="{ row }">
          <span>{{ row[key] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
        提交
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
const currentTableData = computed(() => {
  return tableData.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});
const pageSize = ref<number>(10);
const submitLoading = ref<boolean>(false);

const dialogVisible = ref<boolean>(false);

const open = () => {
  dialogVisible.value = true;
};

const handleSuccess = (response: any, file: any) => {
  console.log(response);
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
    if (Array.isArray(data)) {
      tableData.value = data;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    .uploaded-item-name {
      color: blue;
      flex: 1;
    }
    .uploaded-item-action {
      display: flex;
      align-items: center;
      .el-link {
        margin-left: 10px;
      }
    }
  }
}
</style>
