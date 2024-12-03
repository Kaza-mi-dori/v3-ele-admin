<template>
  <div>
    <h1>单行可编辑可校验表格</h1>
    <EditableTable />
    <br />
    <h1>可校验表格</h1>
    <ValidatableTable
      :columnsDefinition="[
        {
          prop: 'name',
          label: '姓名',
          required: true,
          validator: [
            // {
            //   trigger: 'blur',
            //   validator: (rule, value) => {
            //     return new Promise((resolve, reject) => {
            //       setTimeout(() => {
            //         if (!value || value.length === 0) {
            //           reject('不能为空');
            //         } else {
            //           resolve();
            //         }
            //       }, 1000);
            //     });
            //   },
            // },
          ],
        },
        {
          prop: 'age',
          label: '年龄',
          required: true,
          validator: [
            // {
            //   trigger: 'blur',
            //   validator: (rule, value) => {
            //     return new Promise((resolve, reject) => {
            //       setTimeout(() => {
            //         if (!value || value.length === 0) {
            //           reject('不能为空');
            //         } else {
            //           resolve();
            //         }
            //       }, 1000);
            //     });
            //   },
            // },
          ],
        },
      ]"
    />
    <br />
    <h1>搜索栏</h1>
    <SearchBar
      :itemList="[
        {
          name: '姓名',
          options: ['张三', '李四', '王五'],
          selected: null,
          multiple: false,
        },
        {
          name: '年龄',
          input: true,
          selected: null,
          multiple: false,
        },
        {
          name: '性别',
          options: ['男', '女'],
          selected: null,
          multiple: false,
        },
        {
          name: '学历',
          options: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士'],
          selected: [],
          multiple: true,
        },
      ]"
    />
    <br />
    <h1>通用表格</h1>
    <GeneralDataTable />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SearchBar from "./SearchBar.vue";
import EditableTable from "./EditableTable.vue";
import ValidatableTable from "./ValidatableTable/index.vue";
import GeneralDataTable from "./GeneralDataTable.vue";
import { valueEquals } from "element-plus";

defineComponent({
  components: {
    EditableTable,
    SearchBar,
    GeneralDataTable,
  },
});

defineProps({
  itemList: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
