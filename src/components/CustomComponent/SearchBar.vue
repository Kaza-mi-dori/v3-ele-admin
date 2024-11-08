<template>
  <div>
    <!-- 写成headless的纯逻辑抽象 -->
    <!-- 筛选区 -->
    <div>
      <div class="active-filters-block">
        <div v-for="item in selectedItems" :key="item.name" class="__item">
          <span>{{ item.name }}:</span>
          <div v-if="Array.isArray(item.selected)">
            <span
              v-for="option in item.selected"
              :key="option"
              class="closable-tag line-height-normal"
            >
              {{ option }}
              <el-icon
                name="close"
                class="cursor-pointer color-red"
                @click="handleSelect(item, option)"
              >
                <CircleClose />
              </el-icon>
            </span>
          </div>
          <span v-else>{{ item.selected }}</span>
        </div>
      </div>
    </div>
    <!-- 条件区 -->
    <div>
      <div
        v-for="item in itemList as any"
        :key="item.name"
        class="condition-block"
      >
        <span class="__name">{{ item.name }}</span>
        <div>
          <el-input
            v-if="item.input"
            v-model="item.selected"
            placeholder="请输入"
            @input="handleSelect(item, item.selected)"
          />
        </div>
        <div v-if="item.options" class="__options">
          <span
            v-for="option in item.options"
            :key="option"
            :class="{
              __item: true,
              active: Array.isArray(item.selected)
                ? item.selected.includes(option)
                : item.selected === option,
            }"
            @click="handleSelect(item, option)"
          >
            {{ option }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, getCurrentInstance, nextTick } from "vue";

const { ctx: that } = getCurrentInstance() as any;
let selectedItems = ref();

const props = defineProps({
  itemList: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const handleSelectOptions = (item: any, option: any) => {
  if (!item.multiple) {
    if (item.selected === option) {
      item.selected = null;
    } else {
      item.selected = option;
    }
  } else {
    if (item.selected.includes(option)) {
      item.selected = item.selected.filter((v: any) => v !== option);
    } else {
      item.selected.push(option);
    }
  }
  selectedItems.value = props.itemList
    .map((item: any) => {
      return {
        name: item.name,
        selected: item.selected,
      };
    })
    .filter((item: any) => {
      if (Array.isArray(item.selected)) {
        return item.selected.length > 0;
      } else {
        return item.selected;
      }
    });
};

const handleSelectInput = (item: any, option: any) => {
  item.selected = option;
  selectedItems.value = props.itemList
    .map((item: any) => {
      return {
        name: item.name,
        selected: item.selected,
      };
    })
    .filter((item: any) => {
      if (Array.isArray(item.selected)) {
        return item.selected.length > 0;
      } else {
        return item.selected;
      }
    });
};

const handleSelect = (item: any, option: any) => {
  if (item.options) {
    handleSelectOptions(item, option);
  } else {
    handleSelectInput(item, option);
  }
  that.$forceUpdate();
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
// watchEffect(() => {
//   selectedItems.value;
// });

// 逻辑处理
// 1. 筛选条件
// 2. 筛选结果
// 3. 筛选结果展示
// 4. 筛选结果操作
// 5. 筛选结果分页
</script>

<style lang="scss" scoped>
.active-filters-block {
  @apply flex;
  & > .__item {
    @apply flex inline-block p-1 m-1 border border-gray-200 rounded items-center line-height-normal;
  }
}
.closable-tag {
  @apply inline-block  color-black p-1 m-1 border-dashed border-1 border-light;
}
.condition-block {
  @apply w-full p-1 bg-white border-t-1 border-dashed flex items-center;
  // 第一个元素的上边框不显示
  &:first-child {
    @apply border-t-0;
  }
  // 奇数行为灰底，偶数行为白底
  &:nth-child(odd) {
    @apply bg-gray-1;
  }
  & > .__name {
    @apply inline-block w-20 mr-4 text-right;
  }
  .__item {
    @apply inline-block cursor-pointer m-1 p-1 border border-gray-200 rounded;
    // 单数行则为白底，双数行则为灰底
    &:hover {
      @apply bg-blue-3 color-black;
    }
    &.active {
      @apply bg-blue-5 color-white;
    }
  }
}
</style>
