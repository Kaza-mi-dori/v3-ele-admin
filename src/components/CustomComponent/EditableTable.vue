<template>
  <div>
    <!-- 筛选操作区 -->
    <div>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        style="width: 200px"
      />
      <!-- 标签式选择 -->
      <el-select
        v-model="selectedItems"
        multiple
        placeholder="请选择"
        style="width: 200px"
      >
        <el-option
          v-for="item in selectableOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button type="primary" @click="handleFilter">更多条件</el-button>
    </div>
    <el-table
      v-loading="loading"
      stripe
      border
      :data="exampleData"
      element-loading-text="拼命加载中"
    >
      <!-- 根据columnsDefintion来 -->
      <el-table-column
        v-for="column in columnsDefinition"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
      >
        <!-- 自定义表头 -->
        <template #header>
          <div class="flex-x-between">
            <span>
              {{ column.label }}
              <span v-if="column.validate" style="color: red">*</span>
            </span>
            <!-- <el-popover placement="bottom" width="200" trigger="click">
              <template #default>
                <el-input
                  v-model="filterValue"
                  placeholder="请输入筛选条件"
                  clearable
                />
              </template>
              <template #reference>
                <el-icon
                  v-if="column.filterable"
                  style="
                    cursor: pointer;
                    border: 1px solid #d7d7bd;
                    box-shadow: 0 0 2px #d7d7bd;
                    position: relative;
                  "
                  @click="handleFilter(column)"
                >
                  <Filter />
                </el-icon>
              </template>
            </el-popover> -->
          </div>
        </template>
        <!-- 自定义单元格 -->
        <template #default="{ row, $index }">
          <div
            style="display: flex; justify-content: space-between"
            :class="`${column.label}-${$index}`"
            @mouseenter="(e) => handleMouseEnter(e, row)"
            @mouseleave="(e) => handleMouseLeave(e, row)"
          >
            <el-input
              v-if="row.editable"
              v-model="row[column.prop]"
              :placeholder="'请输入' + column.label"
              :disabled="column.prop === 'id'"
              clearable
              @change="validate(row, column)"
            />
            <span v-else style="width: 85%" @click="handleEdit(row, $index)">
              {{ row[column.prop] }}
            </span>
            <!-- <i v-if="row.editable" class="el-icon-check" @click="save(row)" />
            <el-icon
              v-else
              class="el-icon-edit inactive c-white"
              
            /> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const columnsDefinition = ref([
  {
    prop: "name",
    label: "姓名",
    width: "150",
    filterable: true,
    // validate: (value: string) => {
    //   if (!value) {
    //     return "姓名不能为空";
    //   }
    //   return "";
    // },
  },
  {
    prop: "age",
    label: "年龄",
    width: "150",
  },
  {
    prop: "address",
    label: "地址",
    width: "150",
  },
]);

const selectableOptions = ref(["张三", "李四", "王五"]);
const selectedItems = ref([]);

const exampleData = ref([
  // 搜索行
  {
    id: 0,
    name: "",
    age: undefined,
    address: "",
    editable: true,
  },
  {
    id: 1,
    name: "张三",
    age: 18,
    address: "北京市朝阳区",
    editable: false,
  },
  {
    id: 2,
    name: "李四",
    age: 20,
    address: "上海市浦东新区",
    editable: false,
  },
  {
    id: 3,
    name: "王五",
    age: 22,
    address: "广州市天河区",
    editable: false,
  },
]);

const activeIndex = ref(-1);
const date = ref();
const loading = ref(false);

const validate = (row: any, column: any) => {
  if (row.id === 0) {
    // filter row
    if (activeIndex.value > 0) {
      return;
    }
    // or filter all rows with id > 0 by the type/filterMethod of the column
    exampleData.value = exampleData.value.filter((item) => {
      if (item.id === 0) {
        return true;
      }
      // 默认都是字符串
      return (item[column.prop as keyof typeof item] as unknown as string)
        .toString()
        .startsWith(row[column.prop].toString());
    });
  }
  const error = column?.validate?.(row[column.prop]);
  if (error) {
    console.error(error);
  }
};

const handleMouseEnter = (event: any, row: any) => {
  const { target } = event;
  // console.log("target:", target, target.querySelector(".el-icon-edit"));
  target.querySelector(".el-icon-edit")?.classList.remove("inactive");
};

const handleMouseLeave = (event: any, row: any) => {
  const { target } = event;
  target.querySelector(".el-icon-edit")?.classList.add("inactive");
};

const handleEdit = (row: any, index: number) => {
  row.editable = true;
  if (activeIndex.value !== -1) {
    const prevRow = exampleData.value.find(
      (item) => item.id === activeIndex.value
    );
    if (prevRow) {
      prevRow.editable = false;
    }
  }
  activeIndex.value = row.id || index;
};

const handleFilter = (column: any) => {
  console.log("column:", column);
};

const save = (row: any) => {
  row.editable = false;
};

onMounted(() => {
  console.log("exampleData:", exampleData.value);
});
</script>

<style lang="scss" scoped>
.inactive {
  @apply hidden;
}
</style>
