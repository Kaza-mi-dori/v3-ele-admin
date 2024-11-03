<template>
  <div>
    <h1>单行可编辑可校验表格</h1>
    <EditableTable />
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
          options: ['18', '19', '20'],
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
import GeneralDataTable from "./GeneralDataTable.vue";

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
