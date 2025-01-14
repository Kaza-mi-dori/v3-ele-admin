<template>
  <el-select
    :value="number"
    filterable
    remote
    :remote-method="debouncedSearch"
    :placeholder="`请输入${props.prop}搜索`"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BusinessStandbookAPI from "@/api/businessStandBook";
import { useDebounceFn } from "@vueuse/core";

const number = ref("");
const options = ref<any>([]);
const props = defineProps<{
  value?: string;
  // 值字段，如果没有传入则使用prop
  valueProp?: string;
  // 查询的属性
  prop: string;
  // 是否查询集合
  propQueryInList?: boolean;
}>();
const emits: any = defineEmits(["input", "selected"]);

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

const initValue = async (newVal: string | undefined) => {
  if (!newVal) return;
  // TODO 根据props.prop查询合同
  try {
    const res: any = await BusinessStandbookAPI.getPaymentLedgerRecordList({
      [props.propQueryInList ? props.prop + "集合" : props.prop]:
        props.propQueryInList ? [newVal] : newVal,
      页码: 1,
      页容量: 1,
    });
    const result = res["当前记录"].map((item: any) => {
      return {
        value: item[props.valueProp || props.prop],
        label: item["款项名称"],
      };
    });
    options.value = result;
  } catch (error) {
    console.error(error);
  }
};

const queryPaymentSearch = async (query: string) => {
  const res: any = await BusinessStandbookAPI.getPaymentLedgerRecordList({
    [props.propQueryInList ? props.prop + "集合" : props.prop]:
      props.propQueryInList ? [query] : query,
    页码: 1,
    页容量: 20,
  });
  const result = res["当前记录"].map((item: any) => {
    return {
      value: item[props.valueProp || props.prop],
      label:
        item[props.valueProp || props.prop] +
        (item["款项名称"] ? " " + item["款项名称"] : ""),
    };
  });
  options.value = result;
};

const debouncedSearch = useDebounceFn(queryPaymentSearch, 800);
</script>
