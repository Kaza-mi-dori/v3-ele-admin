<template>
  <div>
    <el-select
      :value="number"
      :multiple="true"
      :placeholder="`请点击搜索`"
      @click.prevent="handleClick"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-dialog v-model="dialogVisible" title="选择用户" width="50%">
      <el-transfer
        v-model="selectedValue"
        style="text-align: left; display: inline-block"
        filterable
        :left-default-checked="[2, 3]"
        :right-default-checked="[1]"
        :render-content="renderFunc"
        :titles="['未选择', '已选择']"
        :button-texts="['取消', '选择']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="deptTree"
        @change="handleChangeSelection"
      >
        <template v-slot:left-footer>
          <el-button class="transfer-footer" size="small">操作</el-button>
        </template>
        <template v-slot:right-footer>
          <el-button class="transfer-footer" size="small">操作</el-button>
        </template>
      </el-transfer>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UserAPI_2 } from "@/api/system/user";
import { useDebounceFn } from "@vueuse/core";
import { useDeptStoreHook } from "@/store/modules/dept";
import { ElTree } from "element-plus";

const deptStore = useDeptStoreHook();
const number = ref("");
const options = ref<any>([]);
const props = defineProps<{
  value?: string[];
  // 值字段，如果没有传入则使用prop
  valueProp?: string;
  // 查询的属性
  prop: string;
  // 是否查询集合
  propQueryInList?: boolean;
}>();
const emits: any = defineEmits(["input", "selected"]);
const dialogVisible = ref(false);
const selectedValue = ref<string[]>([]);
const deptTree = ref<any>([]);
watch(
  () => props.value,
  (newVal) => {
    // TODO 根据props.prop查询合同确保有值
    initValue(newVal);
    emits("input", newVal);
  }
);

const handleChange = (newVal: string) => {
  emits("input", newVal);
};
const handleClick = () => {
  dialogVisible.value = true;
};

const handleChangeSelection = () => {
  // emits("input", newVal);
};

const renderFunc = (h: any, option: any) => {
  console.log(option);
  return h(
    "span",
    {
      class: "label",
    },
    option.label
  );
};

const data = ref<any>([]);

const initValue = async (newVal: string[] | undefined) => {
  if (!newVal) return;
  // TODO 根据props.prop查询合同
  try {
    const res: any = await UserAPI_2.getPage({
      [props.propQueryInList ? props.prop + "集合" : props.prop]:
        props.propQueryInList ? [newVal] : newVal,
      页码: 1,
      页容量: newVal.length,
    });
    const result = [];
    for (let i = 0; i < res["当前记录"].length; i++) {
      const item = {
        value: res["当前记录"][i][props.valueProp || props.prop],
        label: res["当前记录"][i][props.prop],
        dept: "",
      };
      if (res["当前记录"][i]?.["部门"]?.[0]) {
        const dept = await deptStore.getDeptList();
        item.dept = dept.find(
          (dept: any) => dept.id === res["当前记录"][i]?.["部门"]?.[0]
        )?.名称;
      }
      result.push(item);
    }
    // options.value = result;
    //     value: item[props.valueProp || props.prop],
    //     label: item[props.prop],
    //     dept: deptStore
    //       .getDeptList()
    //       .find((dept: any) => dept.id === item?.["部门"]?.[0])?.名称,
    //   };
    // });
    options.value = result;
  } catch (error) {
    console.error(error);
  }
};

const queryPaymentSearch = async (query: string) => {
  const res: any = await UserAPI_2.getPage({
    [props.propQueryInList ? props.prop + "集合" : props.prop]:
      props.propQueryInList ? [query] : query,
    页码: 1,
    页容量: 20,
  });
  const result = [];
  for (let i = 0; i < res["当前记录"].length; i++) {
    const item = {
      value: res["当前记录"][i][props.valueProp || props.prop],
      label: res["当前记录"][i][props.prop],
      dept: "",
    };
    if (res["当前记录"][i]?.["部门"]?.[0]) {
      const dept = await deptStore.getDeptList();
      item.dept = dept.find(
        (dept: any) => dept.id === res["当前记录"][i]?.["部门"]?.[0]
      )?.名称;
    }
    result.push(item);
  }
  // const result = res["当前记录"].map((item: any) => {
  //   return {
  //     value: item[props.valueProp || props.prop],
  //     label: item[props.prop],
  //     dept: deptStore
  //       .getDeptList()
  //       .find((dept: any) => dept.id === item?.["部门"]?.[0])?.名称,
  //   };
  // });
  options.value = result;
};

const debouncedSearch = useDebounceFn(queryPaymentSearch, 800);

onMounted(async () => {
  const data = await deptStore.getDeptList();
  deptTree.value = data.map((item: any) => {
    return {
      value: item.id,
      label: item.名称,
      key: item.id,
    };
  });
});
</script>

<style scoped>
.label {
  @apply float-left;
}
.value {
  @apply float-right;
  color: #999;
  font-size: 0.9em;
}
</style>
