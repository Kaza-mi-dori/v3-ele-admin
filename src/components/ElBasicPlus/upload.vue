<template>
  <el-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    list-type="picture-card"
    v-bind="attrs"
  >
    <el-icon>
      <Plus />
    </el-icon>
    <template v-slot:file="{ file }">
      <!-- 根据文件类型显示缩略图 -->
      <img
        v-if="['image/jpeg', 'image/png'].includes(file.raw?.type || '')"
        :src="file.url"
        class="el-upload-list__item-thumbnail"
      />
      <img
        v-else-if="['application/pdf'].includes(file.raw?.type || '')"
        :src="pdfPNG"
        alt=""
      />
      <img
        v-else-if="
          [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ].includes(file.raw?.type || '')
        "
        :src="WordPNG"
        alt=""
      />
      <img
        v-else-if="
          [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ].includes(file.raw?.type || '')
        "
        :src="ExcelPNG"
        alt=""
      />
      <i
        v-else-if="
          [
            'application/zip',
            'application/x-zip-compressed',
            'application/x-rar-compressed',
          ].includes(file.raw?.type || '')
        "
        :src="ZipSVG"
        alt=""
      />
      <i v-else class="el-icon-document el-upload-list__item-icon" />
      <span class="el-upload-list__item-actions flex flex-wrap">
        <div class="w-full text-sm text-center">{{ file.name }}</div>
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <el-icon>
            <View />
          </el-icon>
        </span>
        <span class="el-upload-list__item-delete" @click="handleDownload(file)">
          <el-icon>
            <Download />
          </el-icon>
        </span>
        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
          <el-icon>
            <Delete />
          </el-icon>
        </span>
      </span>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import pdfPNG from "@/assets/icons/pdf.png";
import ExcelPNG from "@/assets/icons/excel.png";
import WordPNG from "@/assets/icons/WORD.png";
import ZipSVG from "@/assets/icons/zip.svg";

import { useAttrs } from "vue";

// 允许使用attrs
const attrs = useAttrs();

// 预览图片
const handlePictureCardPreview = (file: any) => {
  if (attrs.onPreview) {
    const onPreview = attrs.onPreview as Function;
    onPreview(file);
  }
};

// 下载文件
const handleDownload = (file: any) => {
  if (attrs.onDownload) {
    const onDownload = attrs.onDownload as Function;
    onDownload(file);
  }
};

// 删除文件
const handleRemove = (file: any) => {
  if (attrs.onRemove) {
    const onRemove = attrs.onRemove as Function;
    onRemove(file);
  }
};
</script>
