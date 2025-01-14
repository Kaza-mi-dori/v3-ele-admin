<template>
  <div class="flex flex-gap-2">
    <!-- <h1>单行可编辑可校验表格</h1>
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
    <GeneralDataTable /> -->
    <div
      v-for="component of components"
      :key="component.name"
      class="w-300px text-center p-4 bg-white border-1 border-gray-200 rounded-md"
    >
      <h4>{{ component.name }}</h4>
      <component :is="component.component" v-bind="component.props" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, DefineComponent } from "vue";
import SearchBar from "./SearchBar.vue";
import EditableTable from "./EditableTable.vue";
import ValidatableTable from "./ValidatableTable/index.vue";
import GeneralDataTable from "./GeneralDataTable.vue";
import { valueEquals } from "element-plus";
import contractSelector from "../Business/Selector/contract.vue";
import paymentSelector from "../Business/Selector/paymentSelector.vue";
import companySelector from "../Business/Selector/companySelector.vue";
import orderSelector from "../Business/Selector/orderSelector.vue";
import userSelector from "../Business/Selector/userSelector.vue";

defineProps({
  itemList: {
    type: Array,
    required: true,
  },
});

// components是vue组件的数组
const components = ref<any[]>([
  {
    name: "合同选择器",
    component: contractSelector,
    props: {
      prop: "合同编号",
      propQueryInList: true,
    },
  },
  {
    name: "订单选择器",
    component: orderSelector,
    props: {
      prop: "订单编号",
      propQueryInList: true,
    },
  },
  {
    name: "款项选择器",
    component: paymentSelector,
    props: {
      prop: "合同编号",
      valueProp: "款项编号",
      propQueryInList: true,
    },
  },
  {
    name: "客商选择器(未完成)",
    component: companySelector,
    props: {
      prop: "客商名称",
      propQueryInList: false,
    },
  },
  {
    name: "用户选择器",
    component: userSelector,
    props: {
      prop: "显示名",
      valueProp: "id",
      propQueryInList: false,
    },
  },
]);
</script>

<style lang="scss" scoped></style>
