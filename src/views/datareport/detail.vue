<template>
  <div>
    <div class="info-card-level1 ml-20px">
      <div class="__title">
        <span>定义信息</span>
      </div>
      <!-- todo: form -->
      <el-form class="g-form-1" :model="infoForm" label-position="top" inline>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { watch } from "vue";

const $route = useRoute();

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

watch(
  // 路由参数中是否有 id
  () => $route.params.id,
  (value) => {
    console.log(value);
  }
);

onMounted(() => {
  console.log("mounted");
});
</script>
