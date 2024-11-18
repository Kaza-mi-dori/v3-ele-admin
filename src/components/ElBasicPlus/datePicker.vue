<template>
  <el-date-picker v-bind="attrs" :shortcuts="shortcuts" />
</template>

<script setup lang="ts">
// 固定几个选择
import { useAttrs, ref } from "vue";
const attrs = useAttrs();
const shortcuts = ref([
  {
    text: "今天",
    value: new Date(),
  },
  {
    text: "昨天",
    value: (() => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      // console.log("昨天", date);
      return date;
    })(),
  },
  {
    text: "一周前",
    value: (() => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    })(),
  },
  {
    text: "一个月前",
    value: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date;
    })(),
  },
  {
    text: "三个月前",
    value: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date;
    })(),
  },
  {
    text: "半年前",
    value: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 6);
      return date;
    })(),
  },
  {
    text: "一年前",
    value: (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      return date;
    })(),
  },
]);
</script>

<style lang="scss" scoped></style>
