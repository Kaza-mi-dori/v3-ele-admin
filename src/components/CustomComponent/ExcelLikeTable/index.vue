<template>
  <!-- excel表 -->
  <div class="table-container">
    <table class="g-input-table-1">
      <colgroup>
        <col />
        <col v-for="col in props.colsDef" :key="col.prop" />
      </colgroup>
      <thead>
        <template v-if="extraHeaders.length > 0">
          <tr
            v-for="(header, index) in extraHeaders"
            :key="index"
            class="__header __row"
          >
            <th v-for="col in header" :key="col.title" :colspan="col.colspan">
              {{ col.title }}
            </th>
          </tr>
        </template>
      </thead>
      <tbody>
        <tr class="__header __row">
          <!-- 表头显示 -->
          <!-- 如果传入了行定义，则渲染多一个th叫项目且colspan根据最长的行来定 -->
          <th
            v-if="props.inputItemDefsByRow"
            :colspan="longestRow.names.length"
          >
            项目
          </th>
          <!-- 然后根据列定义渲染, 宽度为该name的长度 + 10px -->
          <th
            v-for="col in props.colsDef"
            :key="col.name"
            :colspan="1"
            :style="{
              padding: '0 20px',
            }"
          >
            <div :style="{ width: col.name.length * 15 + 30 + 'px' }">
              {{ col.name }}
            </div>
            <!-- 如果是不可编辑则多显示一个锁icon -->
            <el-popover
              v-if="!col.editable"
              placement="top"
              width="200"
              trigger="hover"
            >
              <div style="text-align: center">该列不可编辑</div>
              <template v-slot:reference>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
            </el-popover>
          </th>
        </tr>
        <tr v-for="item in tableData" :key="item.name" class="__row">
          <!-- 先按需要渲染行头 -->
          <template v-if="props.inputItemDefsByRow">
            <!-- 如果不是index === 0则只渲染最后一个名字 -->
            <td
              v-for="(name, index) in item.names.slice(
                item.isFirstChild ? 0 : item.names.length - 1,
                item.names.length
              )"
              :key="name"
              :class="{
                'sticky-cell':
                  index === (item.isFirstChild ? item.names.length - 1 : 0),
              }"
              :rowspan="
                item.isFirstChild ? (index === 0 ? item.childrenCount : 1) : 1
              "
              :colspan="
                index === item.names.length - 1
                  ? longestRow.names.length - index
                  : 1
              "
            >
              <div>{{ name }}</div>
            </td>
          </template>
          <td
            v-for="col in props.colsDef"
            :key="col.prop"
            :colspan="1"
            :rowspan="1"
          >
            <template v-if="col.editable && editing">
              <el-input
                v-if="col.inputType === 'input'"
                v-model="item[col.prop]"
                :type="col.isNumber ? 'number' : ''"
              />
              <el-select
                v-else-if="col.inputType === 'select'"
                v-model="item[col.prop]"
                :multiple="col.selectType === 'multiple'"
                :placeholder="'请选择' + col.name"
              >
                <el-option
                  v-for="option in col.options"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>
              <el-input
                v-else
                v-model="item[col.prop]"
                :type="col.isNumber ? 'number' : ''"
              />
            </template>
            <template v-else>
              <div>{{ item[col.prop] }}</div>
            </template>
          </td>
        </tr>
        <!-- 汇总行，定义一样，每一个单元格都由上面所有数据汇总而来 -->
        <tr v-if="props.needSummary" class="__row">
          <td
            v-if="props.inputItemDefsByRow"
            :colspan="longestRow.names.length"
            class="sticky-cell"
          >
            汇总
          </td>
          <td
            v-for="col in props.colsDef"
            :key="col.prop"
            :colspan="1"
            :rowspan="1"
          >
            {{ summaryRow[col.prop] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  /** 定义是否固定格式 */
  type: string;
  /** 如果有特殊的行头(如合并单元格)，则传入且不论type如何都固定行数 */
  inputItemDefsByRow: rowDef[];
  /** 列定义 */
  colsDef: ColumnDef[];
  /** 是否需要合计 */
  needSummary: boolean;
  /** 是否可编辑 */
  editing: boolean;
  /** 额外的表头 */
  headers?: Header[][];
}>();

/** 额外的表头 */
export interface Header {
  /** 标题 */
  title: string;
  /** 列跨度 */
  colspan: number;
  /** 顺序 */
  order?: number;
}

export interface rowDef {
  /** 行名 */
  names: string[];
  /** 是否是父级行的第一个子行 */
  isFirstChild: boolean;
  /** 子行数 */
  childrenCount: number;
}

// 列定义
export interface ColumnDef {
  /** 列名 */
  name: string;
  /** 对应的prop */
  prop: string;
  /** 输入类型 */
  inputType?: "input" | "select";
  /** 默认值 */
  default?: any;
  /** 是否为数值 */
  isNumber: boolean;
  /** 顺序 */
  order: number;
  /** 是否可编辑 */
  editable: boolean;
  /** 是否计算属性 */
  computed: boolean;
  /** 计算类型 */
  computeType: string;
  /** 计算公式 */
  computeFormula: string;
  /** 汇总方式 */
  summaryType: "same" | "sum";
  /** 是否为叶子节点 */
  isLeaf?: boolean;
  /** 孩子节点 */
  children?: ColumnDef[];
  /** 可选选项 */
  options?: string[];
  /** 是否为必填项 */
  isRequired?: boolean;
  /** 选择类型(单选/多选) */
  selectType?: "single" | "multiple";
}

// tableData的结构也应该由某种定义得出
const tableData = ref<any[]>([]);
// 是否编辑，如果传入为true则为true
const editing = computed(() => !!props.editing);

// 最长的行，用于计算colspan
const longestRow = props.inputItemDefsByRow.reduce((prev, curr) =>
  prev.names.length > curr.names.length ? prev : curr
);

// 根据列定义增加监听计算逻辑
props.colsDef.forEach((col) => {
  // 如果是计算属性且**不可**编辑，则监听数据变化
  if (col.computed && !col.editable) {
    watch(
      tableData,
      (newVal) => {
        newVal.forEach((row) => {
          if (col.computeType === "formula") {
            // computeFormula的格式为"prop1 运算符 prop2"的形式
            // 当前只支持行内公式计算
            console.log(
              // 查看正则替换捕获的结果
              col.computeFormula.matchAll(/(\w+)/g).toArray()
            );
            row[col.prop] = eval(
              col.computeFormula.replace(/(\w+)/g, (prop: any) => row[prop])
            );
          }
        });
      },
      { deep: true }
    );
  }
});

// 如果需要合计，则监听数据变化
const summaryRow = computed(() => {
  const summary: any = {};
  props.colsDef.forEach((col) => {
    if (col.summaryType === "sum") {
      summary[col.prop] = tableData.value.reduce(
        (prev, curr) => prev + parseFloat(curr[col.prop]),
        0
      );
    } else {
      summary[col.prop] = tableData.value[0][col.prop];
    }
  });
  return summary;
});

// 额外的表头
const extraHeaders = computed(() => {
  if (!props.headers) {
    return [];
  }
  const result = props.headers.slice();
  result.forEach((header) => {
    header.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  });
  return result;
});

// 根据列定义、外部数据初始化表格数据
const initTableData = () => {
  if (!props.inputItemDefsByRow) {
    // 如果没有行定义，则直接用列定义初始化表格数据
    tableData.value = [
      {
        ...Object.fromEntries(
          props.colsDef.map((col) => [col.prop, col.default ?? ""])
        ),
      },
    ];
    return;
  }
  tableData.value = props.inputItemDefsByRow.map((row) => {
    // 先加入行名
    const rowObj: any = {
      names: row.names,
      isFirstChild: row.isFirstChild,
      childrenCount: row.childrenCount,
    };
    // 再加入列名、
    props.colsDef.forEach((col) => {
      rowObj[col.prop] = col.default ?? "";
    });
    return rowObj;
  });
  console.log("tableData", tableData);
};

// 初始化表格数据
onBeforeMount(() => {
  initTableData();
});
</script>

<style lang="scss" scoped>
.table-container {
  @apply w-full overflow-x-auto;
}

.sticky-header {
  @apply left-0 sticky z-1;
  background-color: #f5f7fa; /* 确保固定列背景色不被覆盖 */
}

.sticky-cell {
  @apply left-0 sticky z-1;
  background-color: #f5f7fa; /* 确保固定列背景色不被覆盖 */
}

.g-input-table-1 {
  @apply border-collapse border-spacing-0 table-fixed;
  margin-top: 20px;
  // min-width: 100%;
  // 边框
  border: 1px solid #7c7d81;
  :deep(tr) {
    &.__header {
      background-color: #f5f7fa;
      th {
        @apply font-bold text-center whitespace-nowrap;
        padding: 10px 0;
        color: #303133;
        border-right: 1px solid #7c7d81;
        border-bottom: 1px solid #7c7d81;
        &:last-child {
          border-right: none;
        }
      }
    }
    &.__row {
      td {
        @apply text-center whitespace-nowrap;
        line-height: 32px;
        color: #46474b;
        border-bottom: 1px solid #7c7d81;
        border-right: 1px solid #7c7d81;
        // 对于el-input的样式
        .el-input {
          @apply w-full m-0 p-0 border-none bg-transparent;
          .el-input__inner {
            @apply p-0 border-none text-center bg-transparent;
          }
        }
        // 对于el-select的样式
        .el-select {
          @apply w-full m-0 p-0 border-none bg-transparent;
          .el-input__inner {
            @apply p-0 text-center border-none bg-transparent;
          }
        }
        &:last-child {
          border-right: none;
        }
      }
    }
  }
}

// 美化滚动条
::-webkit-scrollbar {
  @apply w-2.5 h-2.5;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
</style>
