<template>
  <div class="wrapper">
    <!-- 写成headless的纯逻辑抽象 -->
    <!-- 筛选区 -->
    <div>
      <div class="active-filters-block">
        <div v-for="item in selectedItems" :key="item.label" class="__item">
          <span class="__label">{{ item.label }}</span>
          <div v-if="Array.isArray(item.value)">
            <span
              v-for="option in item.value"
              :key="option"
              class="closable-tag line-height-normal"
            >
              {{ option }}
            </span>
            <el-icon
              name="close"
              class="cursor-pointer color-red font-size-14px"
              @click="handleSelect(item, null)"
            >
              <CircleClose />
            </el-icon>
          </div>
          <span v-else class="closable-tag">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <!-- 条件区 -->
    <div class="flex flex-wrap">
      <div
        v-for="item in itemList as any"
        :key="item.label"
        class="condition-block"
      >
        <span class="__name">{{ item.label }}</span>
        <div class="__options">
          <template v-if="item.inputType === 'select'">
            <span
              v-for="option in item.options"
              :key="option"
              :class="{
                __item: true,
                active: Array.isArray(item.value)
                  ? item.value.includes(option)
                  : item.value === option,
              }"
              @click="handleSelect(item, option)"
            >
              {{ option }}
            </span>
          </template>
          <template v-else-if="item.inputType === 'input'">
            <el-input v-model="item.value" placeholder="请输入" clearable />
          </template>
          <template v-else-if="item.inputType === 'date'">
            <el-date-picker
              v-model="item.value"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择日期"
              clearable
            />
          </template>
          <template v-else-if="item.inputType === 'month'">
            <el-date-picker
              v-model="item.value"
              value-format="YYYY-MM"
              type="month"
              placeholder="请选择月份"
              clearable
            />
          </template>
          <template v-else-if="item.inputType === 'daterange'">
            <el-date-picker
              v-model="item.value"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              clearable
            />
          </template>
          <template v-else-if="item.inputType === 'checkbox'">
            <el-checkbox-group v-model="item.selected">
              <el-checkbox
                v-for="option in item.options"
                :key="option"
                :label="option"
              >
                {{ option }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="item.inputType === 'radio'">
            <el-radio-group v-model="item.selected">
              <el-radio
                v-for="option in item.options"
                :key="option"
                :label="option"
              >
                {{ option }}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.inputType === 'cascader'">
            <el-cascader
              v-model="item.selected"
              :options="item.options"
              :props="{ label: 'label', value: 'value' }"
              clearable
            />
          </template>
          <template v-else-if="item.inputType === 'input-number'">
            <el-input-number
              v-model="item.selected"
              :min="item.min"
              :max="item.max"
              :step="item.step"
            />
          </template>
          <template v-else>
            <!-- 都当输入处理 -->
            <el-input v-model="item.value" placeholder="请输入" clearable />
          </template>
        </div>
      </div>
      <div class="__actions">
        <el-button
          v-if="props.initialAmount && itemList.length > props.initialAmount"
          size="small"
          :icon="collapse ? 'Arrow-down' : 'Arrow-up'"
          @click="collapse = !collapse"
        >
          {{ collapse ? "展开" : "收起" }}
        </el-button>
        <el-button
          size="small"
          icon="Search"
          type="primary"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { emit } from "process";
import { defineProps, getCurrentInstance, nextTick } from "vue";
import { deepUnref } from "@/utils";

const { ctx: that } = getCurrentInstance() as any;
let selectedItems = ref<Array<any>>([]);
let collapse = ref(false);

// 定义emit函数
const emit = defineEmits(["confirmFilter", "resetFilter"]);

const props = defineProps({
  itemList: {
    type: Array,
    required: true,
    default: () => [],
  },
  initialAmount: {
    type: Number,
    required: false,
  },
});

/**
 * @description 处理筛选条件的选择，计算selectedItems的值将选择(指定了值)的条件显示出来
 * @param item
 * @param option
 */
const handleSelect = (item: any, option: any) => {
  // 查找当前选中的条件
  const index = selectedItems.value.findIndex(
    (i: any) => i.label === item.label
  );
  if (index !== -1) {
    // 如果存在，则更新当前条件的值
    if (!option) {
      // 如果option为空，则重置当前条件的值
      switch (item.inputType) {
        case "select":
          item.value = item.multiple ? [] : null;
          break;
        case "input":
          item.value = "";
          break;
        case "date":
          item.value = null;
          break;
        case "month":
          item.value = null;
          break;
        case "daterange":
          item.value = [null, null];
          break;
        case "checkbox":
          item.value = [];
          break;
        case "radio":
          item.value = null;
          break;
        case "cascader":
          item.value = [];
          break;
        case "input-number":
          item.value = null;
          break;
        default:
          item.value = "";
          break;
      }
      return;
    }
    if (item.multiple && Array.isArray(item.value)) {
      // 如果是多选，则更新当前条件的选中值: 如果当前选中的值中包含当前选项，则移除，否则添加
      if (item.value.includes(option)) {
        item.value = item.value.filter((v: any) => v !== option);
      } else {
        item.value.push(option);
      }
    } else {
      // 如果是单选，则更新当前条件的选中值
      item.value = option;
    }
  } else {
    // 如果不存在，则添加当前条件
    if (item.multiple && Array.isArray(item.value)) {
      item.value = [option];
    } else {
      item.value = option;
    }
  }
};

// 将所有选中的条件获取并显示在顶部
// 动态获取所有选中的条件

// 通过watchEffect监听itemList的变化，重新计算selectedItems的值

// const selectedItems = computed(() => {
//   // 这里会有一个问题，就是selectedItems的值不会更新，因为selectedItems是一个计算属性，只有在依赖的值发生变化时才会重新计算
//   // 而因为selectedItems依赖的值是itemList，而itemList的值是不会发生变化的，所以selectedItems的值也不会发生变化
//   // 所以这里需要使用watchEffect来监听itemList的变化，然后重新计算selectedItems的值
//   const result = props.itemList
//     .map((item: any) => {
//       return {
//         name: item.name,
//         selected: item.selected,
//       };
//     })
//     .filter((item: any) => {
//       if (Array.isArray(item.selected)) {
//         return item.selected.length > 0;
//       } else {
//         return item.selected;
//       }
//     });
//   console.log(result);
//   return result;
// });

// 监听itemList的变化
// 当itemList发生变化时，重新计算selectedItems的值
// watchEffect的用法是：watchEffect(effect: () => void, options?: WatchEffectOptions)
// 例如：watchEffect(() => { console.log('effect') })
watch(
  () => props.itemList,
  (newList: any, oldList: any) => {
    // 如果itemList为空，则清空selectedItems
    if (!newList || newList.length === 0) {
      selectedItems.value = [];
      return;
    }
    selectedItems.value = newList
      .map((item: any) => {
        return {
          label: item.label,
          prop: item.prop,
          value: item.value,
          multiple: item.multiple,
          inputType: item.inputType,
        };
      })
      .filter((item: any) => {
        switch (item.inputType) {
          case "select":
            return item.multiple ? item.value.length > 0 : item.value !== null;
          case "input":
            return item.value && item.value !== "";
          case "date":
            return item.value && item.value !== null;
          case "month":
            return item.value && item.value !== null;
          case "daterange":
            return item.value[0] !== null && item.value[1] !== null;
          case "checkbox":
            return item.value?.length > 0;
          case "radio":
            return item.value !== null;
          case "cascader":
            return item.value?.length > 0;
          case "input-number":
            return item.value !== null;
          default:
            return item.value;
        }
      });
    // console.log(selectedItems.value);
  },
  {
    deep: true,
    immediate: true,
  }
);

// 逻辑处理
// 1. 筛选条件
// 2. 筛选结果
// 3. 筛选结果展示
// 4. 筛选结果操作
// 5. 筛选结果分页
const handleSearch = () => {
  // 直接返回{ prop: value }的形式
  const itemUnref = unref(selectedItems);
  const values = itemUnref.reduce((acc: any, item: any) => {
    acc[item.prop] = item.value;
    return acc;
  }, {});
  emit("confirmFilter", values);
};

const handleReset = () => {
  props.itemList.forEach((item: any) => {
    switch (item.inputType) {
      case "select":
        item.value = item.multiple ? [] : null;
        break;
      case "input":
        item.value = "";
        break;
      case "date":
        item.value = null;
        break;
      case "month":
        item.value = null;
        break;
      case "daterange":
        item.value = [null, null];
        break;
      case "checkbox":
        item.value = [];
        break;
      case "radio":
        item.value = null;
        break;
      case "cascader":
        item.value = [];
        break;
      case "input-number":
        item.value = null;
        break;
      default:
        item.value = "";
        break;
    }
  });
  selectedItems.value = [];
  that.$forceUpdate();
};

// 监听itemList的变化
</script>

<style lang="scss" scoped>
.wrapper {
  @apply p-3;
}

.active-filters-block {
  @apply flex;
  & > .__item {
    @apply flex inline-block bg-white p-1 mr-1 border border-gray-100 rounded items-center font-size-14px;
    .__label {
      @apply font-bold mr-2 color-gray-500 font-size-12px;
    }
  }
}
.closable-tag {
  @apply inline-block font-bold color-black p-1 m-1;
}
.condition-block {
  @apply lh-8 h-10 pl-10px pr-10px bg-white flex justify-between items-center relative;
  // width: 50%;
  // 根据屏幕宽度自适应宽度, 大于768px时，每行显示两个条件，小于768px时，每行显示一个条件
  width: 100%;
  @media (min-width: 768px) {
    width: 50%;
  }
  &::before {
    @apply content-[''] absolute h-4 w-0.5 bg-blue-4 top-30%;
    left: 0;
  }
  // 奇数行为灰底，偶数行为白底
  // &:nth-child(odd) {
  //   @apply bg-gray-1;
  // }
  & > .__name {
    @apply inline-block w-20 font-size-14px;
  }
  .__item {
    @apply inline-block lh-6 font-size-14px cursor-pointer pl-1 pr-1 mr-1 border border-gray-200 rounded;
    // 单数行则为白底，双数行则为灰底
    &:hover {
      @apply bg-blue-3 color-black;
    }
    &.active {
      @apply bg-blue-5 color-white;
    }
  }
}

.__actions {
  @apply mt-2 flex justify-end;
}
</style>
