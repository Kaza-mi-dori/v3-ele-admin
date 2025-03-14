<template>
  <div>
    <OpBar
      :showBackBtn="true"
      :showEditBtn="true"
      :showSubmitBtn="true"
      :loading="formLoading"
      @submit="onSubmit"
      @edit="onEdit"
      @back="handleBack"
    />
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
          :disabled="!editing"
          :rules="rules"
          class="w-full g-form-1"
          :model="form"
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
                  <el-option
                    v-for="item in formFieldTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据表名" prop="表名">
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
                <el-input v-model="form.时间精度" type="number" :min="0" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="form.id !== -1" class="info-card-level1">
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
        <div v-if="editing" class="w-full">
          <el-button
            icon="plus"
            class="w-full g-button-1"
            @click="handleAddRecord"
          >
            添加
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="fieldDefinitionDialogVisible"
      :title="`${fieldDefinitionForm.id === -1 ? '新增' : '编辑'}字段`"
      width="600px"
      :close-on-click-modal="false"
    >
      <FieldDefinitionForm
        ref="fieldDefinitionFormRef"
        :form="fieldDefinitionForm"
      />
      <template #footer>
        <el-button
          type="primary"
          :loading="fieldDefinitionFormLoading"
          @click="submitFieldDefinition"
        >
          确定
        </el-button>
        <el-button @click="fieldDefinitionDialogVisible = false">
          取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { DynamicFormAPI, DynamicFormFieldAPI } from "@/api/dynamicForm";
import { useRoute, useRouter } from "vue-router";
import FieldDefinitionForm from "./components/FieldDefinitionForm.vue";
import OpBar from "@/components/CustomComponent/OpBar/index.vue";

const route = useRoute();

const router = useRouter();

const formLoading = ref(false);

const formRef = ref();

const fieldDefinitionFormRef = ref<InstanceType<typeof FieldDefinitionForm>>();

const form = ref<IFormDefinitionForm>({
  id: -1,
  编号: undefined,
  名称: undefined,
  类型: "融合表",
  表名: undefined,
  描述: undefined,
  // 数据源id: 0,
  字段列表: [],
});

const formFieldTypeOptions = ref<
  {
    label: string;
    value: IFormTypeEnum;
  }[]
>([
  { label: "融合表", value: "融合表" },
  { label: "普通表", value: "普通表" },
]);

const fieldDefinitionForm = ref<IFormFieldDefinitionForm>({
  id: -1,
  表单定义编号: "",
  编号: undefined,
  名称: undefined,
  类型: "未定义",
  描述: undefined,
  索引名: undefined,
  索引唯一: false,
  顺序: undefined,
  索引顺序: undefined,
  字符串最大长度: undefined,
  数值精度: undefined,
  数值小数位数: undefined,
  时间精度: undefined,
});

const fieldTableData = ref([]);

const rules = ref({
  编号: [{ required: true, message: "请输入编号" }],
  名称: [{ required: true, message: "请输入名称" }],
  类型: [{ required: true, message: "请选择类型" }],
});

const editing = ref(false);

const fieldDefinitionDialogVisible = ref(false);

const fieldDefinitionFormLoading = ref(false);

const firmReportDetailForm = ref({
  source: "",
});

const handleBack = () => {
  router.back();
};

const handleAddRecord = () => {
  // TODO: 弹出弹窗
  fieldDefinitionDialogVisible.value = true;
};

const onSubmit = async () => {
  // console.log("onSubmit");
  try {
    await formRef.value?.validate();
    editing.value = false;
    formLoading.value = true;
    const remoteApi =
      form.value.id === -1
        ? DynamicFormAPI.addDynamicFormDefinition
        : DynamicFormAPI.editDynamicFormDefinition;
    const res: any = await remoteApi({
      ...form.value,
    });
    ElMessage.success("保存成功");
    // 如果新增，则跳转至列表页
    initData(res.id);
  } catch (error) {
    ElMessage.error("保存失败");
    console.error(error);
  } finally {
    formLoading.value = false;
  }
};

const submitFieldDefinition = async () => {
  // 校验
  const valid = await fieldDefinitionFormRef.value?.validate();
  if (valid) {
    fieldDefinitionFormLoading.value = true;
    try {
      await DynamicFormFieldAPI.addDynamicFormField({
        ...fieldDefinitionForm.value,
        表单定义编号: form.value.编号,
      });
      fieldDefinitionDialogVisible.value = false;
      ElMessage.success("添加成功");
      initFieldTableData();
    } catch (error) {
      ElMessage.error("添加失败");
      console.error(error);
    } finally {
      fieldDefinitionDialogVisible.value = false;
    }
  }
};

const onEdit = () => {
  // console.log("onEdit");
  editing.value = true;
};

onMounted(() => {
  if (route.query.id) {
    initData(route.query.id as string);
  } else {
    editing.value = true;
  }
});

const initDefinitionInfo = async (id: string) => {
  const res: any = await DynamicFormAPI.getDynamicFormDefinition(id);
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

const initData = async (id: string) => {
  try {
    await initDefinitionInfo(id);
    await initFieldTableData();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped lang="scss"></style>
