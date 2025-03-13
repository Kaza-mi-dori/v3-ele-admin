<template>
  <div>
    <div class="info-card-level1">
      <div class="__title">
        <span>定义信息</span>
      </div>
      <div class="__content">
        <el-form
          ref="formRef"
          label-position="top"
          label-width="100px"
          inline
          :rules="rules"
          class="w-full g-form-1"
          :model="firmReportDetailForm"
        >
          <el-row class="w-full">
            <el-col :span="8">
              <el-form-item label="编号" prop="编号">
                <el-input v-model="form.编号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="名称" prop="名称">
                <el-input v-model="form.名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型" prop="类型">
                <el-select v-model="form.类型" placeholder="请选择类型">
                  <el-option label="单行文本" value="单行文本" />
                  <el-option label="多行文本" value="多行文本" />
                  <el-option label="单选" value="单选" />
                  <el-option label="多选" value="多选" />
                  <el-option label="日期" value="日期" />
                  <el-option label="时间" value="时间" />
                  <el-option label="日期时间" value="日期时间" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="表名" prop="表名">
                <el-input v-model="form.表名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="描述" prop="描述">
                <el-input v-model="form.描述" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间精度" prop="时间精度">
                <el-input v-model="form.时间精度" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="!editing" class="info-card-level1">
      <div class="__title">
        <span>包含字段</span>
      </div>
      <div class="__content">
        <el-table border class="w-full" :data="fieldTableData" row-key="id">
          <el-table-column prop="编号" label="编号" align="center" />
          <el-table-column prop="名称" label="名称" align="center" />
          <el-table-column prop="类型" label="类型" align="center" />
          <el-table-column prop="表名" label="表名" align="center" />
          <el-table-column prop="描述" label="描述" align="center" />
          <el-table-column prop="时间精度" label="时间精度" align="center" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { DynamicFormAPI, DynamicFormFieldAPI } from "@/api/dynamicForm";
import { useRoute } from "vue-router";

const route = useRoute();

const form = ref({
  编号: "",
  名称: "",
  类型: "",
  表名: "",
  描述: "",
  时间精度: "",
  顺序: "",
  字段列表: [],
});

const fieldTableData = ref([
  {
    id: "1",
    编号: "1",
    名称: "名称",
    类型: "类型",
    描述: "描述",
    时间精度: "时间精度",
    顺序: "顺序",
  },
]);

const rules = ref({});

const editing = ref(false);

const firmReportDetailForm = ref({
  source: "",
});

onMounted(() => {
  initData();
});

const initDefinitionInfo = async () => {
  const res: any = await DynamicFormAPI.getDynamicFormDefinition(
    route.query.id as string
  );
  // form.value = res.data;
  form.value = res;
};

const initFieldTableData = async () => {
  // console.log("initFieldTableData");
  if (form.value.编号) {
    const res: any = await DynamicFormFieldAPI.getDynamicFormFieldList({
      表单定义编号集合: [form.value.编号],
    });
    fieldTableData.value = res["当前记录"];
  }
};

const initData = async () => {
  try {
    await initDefinitionInfo();
    await initFieldTableData();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped lang="scss"></style>
