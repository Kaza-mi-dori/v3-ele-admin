<!-- 导入excel弹窗 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="导入excel"
    width="50%"
    :before-close="handleClose"
  >
    <el-upload
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">只能上传excel文件</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";
const dialogVisible = ref<boolean>(false);

const open = () => {
  console.log("open");
  dialogVisible.value = true;
};

defineExpose({
  open,
});

const handleClose = () => {
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped></style>
