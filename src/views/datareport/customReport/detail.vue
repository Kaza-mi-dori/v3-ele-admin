<!-- 纯配置式 -->
<template>
  <div>
    <div class="mb-4 p-10px bg-white">
      <el-button class="g-button-1" type="primary" @click="submitForm">
        提交
      </el-button>
      <el-button class="g-button-1" @click="favoForm">收藏</el-button>
      <el-button class="g-button-1" @click="exportForm">导出</el-button>
    </div>
    <el-form
      label-position="top"
      label-width="200px"
      inline
      class="w-full g-form-1"
      :model="formModel"
      :rules="rules"
    >
      <!-- 根据blocks渲染 -->
      <div
        v-for="block in exampleData.blocks"
        :key="block.title"
        class="info-card-level1 w-full mb-4 shadow-sm"
      >
        <div class="__title">
          <span>{{ block.title }}</span>
        </div>
        <div class="__content">
          <el-row class="w-full">
            <el-col
              v-for="field in block.fields as any"
              :key="field.label"
              :span="8"
            >
              <el-form-item :label="field.label" :prop="field.prop">
                <span>{{ formModel[field.prop] }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
// 获取元数据、定义，然后渲染
import { ref, onMounted } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
  editing: {
    type: Boolean,
    default: false,
  },
});

const { id, editing } = toRefs(props);
/**
 * 元数据的结构应为
 *  id: string,  // 元数据的id,
 *  no: string,  // 元数据的编号，应该能够用这个编号找到存储的表
 *  blocks: []  // 一个数组，每个元素是一个对象，代表一个显示的块
 *  每个块的结构为
 *  {
 *   title: string,  // 块的标题
 *  fields: []  // 一个数组，每个元素是一个对象，代表一个字段
 * 每个字段的结构为
 * {
 *  label: string,  // 字段的标签
 *  prop: string,  // 字段的属性
 *  valueType: string,  // 字段的值类型, 可能的值有 string, number, date, datetime, boolean, singleEnum, multiEnum
 *  value: string,  // 字段的值
 *  visibility: boolean  // 字段的可见性
 *  validator: []  // 一个数组，每个元素是一个对象，代表一个验证器定义
 * }
 * 以下包含了上述的所有字段，但是只有部分字段是必须的
 * 该数据为年度经营报表的数据，包含了年度、利润、收入、成本等字段
 *
 **/
const exampleData = ref({
  id: "1",
  no: "1",
  blocks: [
    {
      title: "报表信息",
      fields: [
        {
          label: "年度",
          prop: "year",
          valueType: "string",
          value: "2021",
          visibility: true,
          validator: [],
        },
        {
          label: "利润",
          prop: "profit",
          valueType: "number",
          value: "1000",
          visibility: true,
          validator: [
            {
              type: "required",
              message: "利润不能为空",
            },
            {
              type: "greaterThan",
              value: "0",
              message: "利润必须大于0",
            },
          ],
        },
        {
          label: "收入",
          prop: "revenue",
          valueType: "number",
          value: "2000",
          visibility: true,
          validator: [],
        },
        {
          label: "成本",
          prop: "cost",
          valueType: "number",
          value: "1000",
          visibility: true,
          validator: [],
        },
      ],
    },
    {
      title: "其他信息",
      fields: [
        {
          label: "其他字段1",
          prop: "other1",
          valueType: "string",
          value: "其他字段1的值",
          visibility: true,
          validator: [],
        },
        {
          label: "其他字段2",
          prop: "other2",
          valueType: "string",
          value: "其他字段2的值",
          visibility: true,
          validator: [],
        },
      ],
    },
  ],
});

interface FormModel {
  [key: string]: any;
}

const formModel = ref<FormModel>({});

const rules = ref<FormModel>({});

const transformMetadataToForm = () => {
  // 根据元数据转化为表单所需, 应该将每个字段的prop作为key，value作为value
  // 以下为示例代码
  exampleData.value.blocks.forEach((block) => {
    block.fields.forEach((field) => {
      // formModel.value[field.prop] = field.value;
      // 需要确保响应式
      formModel.value = { ...formModel.value, [field.prop]: field.value };
    });
  });
  // 根据元数据转化为表单验证规则
  exampleData.value.blocks.forEach((block) => {
    block.fields.forEach((field) => {
      rules.value[field.prop] = [];
      field.validator.forEach((validator) => {
        if (validator.type === "required") {
          rules.value[field.prop].push({
            required: true,
            message: validator.message,
            trigger: "blur",
          });
        } else if (validator.type === "greaterThan") {
          rules.value[field.prop].push({
            validator: (rule: any, value: any) => {
              // 如果没有设置value，则不验证
              if (!validator.value || value > validator.value) {
                return Promise.resolve();
              }
              return Promise.reject(validator.message);
            },
            trigger: "blur",
          });
        }
      });
    });
  });
};

const submitForm = () => {
  console.log("submit form");
};

const favoForm = () => {
  console.log("favo form");
};

const exportForm = () => {
  console.log("export form");
};

onMounted(() => {
  console.log("mounted");
  // 模拟获取元数据
  // fetchMetadata();
  // 根据元数据转化为表单所需
  transformMetadataToForm();
});
</script>

<style lang="scss" scoped>
.form-block {
  @apply block mb-20px w-full bg-white;
  &.__title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  &.__content {
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
}
</style>
