<template>
  <div>
    <el-form :model="form" class="w-full">
      <el-table
        v-loading="loading"
        stripe
        border
        class="w-full"
        :data="form.tableData"
        :columns="columnsDefinition"
      >
        <el-table-column
          v-if="props.needIndexColumn"
          type="index"
          label="序号"
          width="60"
          align="center"
        >
          <template v-slot="scope">
            <el-link type="primary">#{{ scope.$index + 1 }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          v-for="column in columnsDefinition"
          :key="column.prop"
          :label="column.label"
        >
          <template v-slot:header>
            <span>{{ column.label }}</span>
            <span v-if="column.required" class="text-red-500">*</span>
          </template>
          <template v-slot="scope">
            <el-form-item
              class="wrapped-item"
              :prop="`tableData.${scope.$index}.${column.prop}`"
              :rules="rules[column.prop]"
            >
              <el-input v-model="scope.row[column.prop]" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template v-slot="scope">
            <div class="flex w-full justify-evenly">
              <el-link type="danger" @click="handleDelete(scope.row)">
                删除
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div v-if="props.addable" class="w-full">
      <el-button icon="plus" class="w-full g-button-1" @click="handleAddRecord">
        添加
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

type validator = (value: any) => boolean | string | undefined;
type asyncValidator = (
  value: any
) => Promise<boolean | string | undefined> | undefined;

interface ColumnDefinition {
  prop: string;
  label: string;
  required: boolean;
  validator: Array<any>;
}

type RowData = {
  [key: string]: any;
};

const attrs = useAttrs();
const props = defineProps({
  columnsDefinition: {
    type: Array<ColumnDefinition>,
    required: true,
  },
  data: {
    type: Array,
    required: false,
    default: () => [],
  },
  addable: {
    type: Boolean,
    required: false,
    default: true,
  },
  needIndexColumn: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const activeColumns = ref(props.columnsDefinition);
const loading = ref(false);
const form = ref({
  tableData: props.data,
});
// const tableData = ref(props.data);
const rules: Ref<{
  [key: string]: Array<any>;
}> = ref({});

watch(
  () => props.columnsDefinition,
  (newColumns) => {
    activeColumns.value = newColumns;
    const newRules: any = {};
    newColumns.forEach((column) => {
      // newRules[column.prop] = column.validator;
      newRules[column.prop] = [
        { required: column.required, message: "不能为空", trigger: "blur" },
      ];
    });
    rules.value = newRules;
    console.log("rules", rules.value);
  },
  {
    immediate: true,
    deep: true,
  }
);

const handleAddRecord = () => {
  const newRow: RowData = {};
  props.columnsDefinition.forEach((column) => {
    newRow[column.prop] = undefined;
  });
  form.value.tableData.push(newRow);
};

const handleDelete = (row: RowData) => {
  const index = form.value.tableData.indexOf(row);
  form.value.tableData.splice(index, 1);
};
</script>

<style lang="scss" scoped>
:deep(.wrapped-item) {
  @apply m-0;
  .el-form-item__content > .el-form-item__error {
    position: static !important;
  }
}
</style>
