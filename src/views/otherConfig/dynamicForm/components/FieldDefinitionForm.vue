<template>
  <el-form ref="formRef" :model="form" label-width="120px" :rules="activeRules">
    <el-row :gutter="20">
      <!-- 编号 -->
      <el-col>
        <el-form-item label="编号" prop="编号">
          <el-input v-model="form.编号" />
        </el-form-item>
      </el-col>
      <!-- 名称 -->
      <el-col>
        <el-form-item label="字段名称" prop="名称">
          <el-input v-model="form.名称" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="字段类型" prop="类型">
          <el-select v-model="form.类型" placeholder="请选择字段类型">
            <el-option
              v-for="item in formFieldTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 描述 -->
      <el-col>
        <el-form-item label="描述" prop="描述">
          <el-input v-model="form.描述" />
        </el-form-item>
      </el-col>
      <!-- 表单渲染顺序 -->
      <el-col>
        <el-form-item label="表单渲染顺序" prop="顺序">
          <el-input v-model="form.顺序" type="number" :min="0" />
        </el-form-item>
      </el-col>
      <!-- 字符串最大长度 -->
      <el-col>
        <el-form-item label="字符串最大长度" prop="字符串最大长度">
          <el-input v-model="form.字符串最大长度" type="number" :min="0" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="数值精度" prop="数值精度">
          <el-input v-model="form.数值精度" type="number" :min="0" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="数值小数位数" prop="数值小数位数">
          <el-input v-model="form.数值小数位数" type="number" :min="0" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const formFieldTypeOptions = ref([
  { label: "未定义", value: "未定义" },
  { label: "字符串", value: "字符串" },
  { label: "整数", value: "整数" },
  { label: "浮点数", value: "浮点数" },
  { label: "定点数", value: "定点数" },
  { label: "布尔", value: "布尔" },
  { label: "字典项", value: "字典项" },
  { label: "日期时间", value: "日期时间" },
  { label: "附件", value: "附件" },
]);
const props = defineProps<{
  form: IFormFieldDefinitionForm;
  rules?: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: "update:form", value: IFormFieldDefinitionForm): void;
}>();

const form = ref(props.form);

const formRef = ref<InstanceType<typeof ElForm>>();

const activeRules = ref(
  props.rules || {
    编号: [{ required: true, message: "请输入编号" }],
    名称: [{ required: true, message: "请输入名称" }],
    类型: [{ required: true, message: "请选择类型" }],
  }
);

const onSubmit = () => {
  emit("update:form", form.value);
};

defineExpose({
  validate: () => {
    return new Promise((resolve, reject) => {
      formRef.value?.validate(resolve);
    });
  },
});
</script>
