<template>
  <div class="json-editor">
    <el-card v-loading="loading" class="box-card">
      <template #header>
        <div class="card-header">
          <span>JSON 树状结构编辑器</span>
          <div class="header-actions">
            <el-upload
              class="json-upload"
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".json"
              @change="handleFileChange"
            >
              <el-button type="primary">导入 JSON</el-button>
            </el-upload>
            <el-button type="primary" @click="reInitializeData">
              重新初始化数据
            </el-button>
            <el-button type="primary" @click="handleReadCache">
              读取数据
            </el-button>
            <el-button type="primary" @click="handleBuildTree">
              将数据转为树结构
            </el-button>
            <el-button type="success" @click="handleSaveCache">
              保存修改
            </el-button>
            <el-button type="warning" @click="handleExportJson">
              导出 JSON
            </el-button>
            <el-button
              :type="dataType === 'year' ? 'success' : 'primary'"
              @click="toggleDataType"
            >
              当前: {{ dataType === "year" ? "年度" : "月度" }}
            </el-button>
          </div>
        </div>
      </template>

      <el-tree
        ref="treeRef"
        :data="treeData"
        node-key="id"
        :props="{
          children: 'children',
          label: 'key',
        }"
        :default-expand-all="false"
        :expand-on-click-node="true"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div class="node-content">
              <el-input
                v-if="data.isEditing"
                v-model="data.key"
                size="small"
                @blur="handleKeyEditComplete(data)"
                @keyup.enter="handleKeyEditComplete(data)"
              />
              <span v-else @dblclick="handleEdit(data)">{{ data.key }}</span>

              <el-select
                v-model="data.type"
                size="small"
                style="width: 100px; margin: 0 10px"
                @change="handleTypeChange(data)"
              >
                <el-option label="对象" value="object" />
                <el-option label="数组" value="array" />
                <el-option label="字符串" value="string" />
                <el-option label="数字" value="number" />
                <el-option label="布尔值" value="boolean" />
              </el-select>

              <template v-if="data.type === 'string' || data.type === 'number'">
                <el-input
                  v-model="data.value"
                  size="small"
                  style="width: 150px"
                />
              </template>
              <template v-else-if="data.type === 'boolean'">
                <el-switch v-model="data.value" />
              </template>
            </div>

            <div class="node-actions">
              <el-button type="primary" link @click="handleAddChild(data)">
                添加子节点
              </el-button>
              <el-button type="danger" link @click="handleDelete(node, data)">
                删除
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>

      <!-- <div class="json-preview">
        <h3>JSON 预览</h3>
        <pre>{{ JSON.stringify(convertToJson(treeData), null, 2) }}</pre>
      </div> -->
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { businessStoreHook } from "@/store/modules/business";

interface TreeNode {
  id: string;
  key: string;
  type: "object" | "array" | "string" | "number" | "boolean";
  value: any;
  children?: TreeNode[];
  isEditing?: boolean;
  rawData?: any;
}

interface BusinessCache {
  yearCache?: any;
  monthCache?: any;
}

const treeRef = ref();
const treeData = ref<TreeNode[]>([]);
const businessStore = businessStoreHook();
const dataType = ref<"year" | "month">("year");
const rootData = ref<any>({});
const loading = ref<boolean>(false);

// 生成唯一ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// 添加根节点
const handleAddRoot = () => {
  treeData.value.push({
    id: generateId(),
    key: "root",
    type: "object",
    value: {},
    children: [],
  });
};

// 添加子节点
const handleAddChild = (parent: TreeNode) => {
  if (!parent.children) {
    parent.children = [];
  }

  const newNode: TreeNode = {
    id: generateId(),
    key: "newKey",
    type: "string",
    value: "",
    isEditing: true,
    rawData: "",
  };

  parent.children.push(newNode);
};

// 处理编辑
const handleEdit = (data: TreeNode) => {
  data.isEditing = true;
};

// 处理编辑完成
const handleKeyEditComplete = (data: TreeNode) => {
  data.isEditing = false;
};

// 处理类型变更
const handleTypeChange = (data: TreeNode) => {
  switch (data.type) {
    case "object":
      data.value = {};
      data.rawData = {};
      data.children = [];
      break;
    case "array":
      data.value = [];
      data.rawData = [];
      data.children = [];
      break;
    case "string":
      data.value = "";
      data.rawData = "";
      delete data.children;
      break;
    case "number":
      data.value = 0;
      data.rawData = 0;
      delete data.children;
      break;
    case "boolean":
      data.value = false;
      data.rawData = false;
      delete data.children;
      break;
  }
};

// 处理删除
const handleDelete = (node: any, data: TreeNode) => {
  const parent = node.parent;
  const children = parent.data.children || parent.data;
  const index = children.findIndex((item: TreeNode) => item.id === data.id);
  children.splice(index, 1);
};

// 转换为JSON对象
const convertToJson = (nodes: TreeNode[]): any => {
  if (!nodes || nodes.length === 0) return {};

  const result: any = {};

  nodes.forEach((node) => {
    if (node.type === "object") {
      result[node.key] = node.children ? convertToJson(node.children) : {};
    } else if (node.type === "array") {
      result[node.key] = node.children
        ? node.children.map((child) => convertToJson([child]))
        : [];
    } else {
      result[node.key] = node.value;
    }
  });

  return result;
};

// 处理文件上传
const handleFileChange = (file: any) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target?.result as string);
      const cache = localStorage.getItem("business-local-database");
      const cacheData = JSON.parse(cache as string);

      if (dataType.value === "year") {
        cacheData.yearCache = jsonData;
      } else {
        cacheData.monthCache = jsonData;
      }

      localStorage.setItem(
        "business-local-database",
        JSON.stringify(cacheData)
      );
      ElMessage.success("JSON 数据导入成功");
    } catch (error) {
      ElMessage.error("JSON 数据格式错误");
    }
  };
  reader.readAsText(file.raw);
};

// 将 JSON 对象转换为树节点
const convertToTreeNodes = (data: any, parentKey = ""): TreeNode[] => {
  if (!data || typeof data !== "object") {
    return [];
  }

  return Object.entries(data).map(([key, value]) => {
    const node: TreeNode = {
      id: generateId(),
      key,
      type: Array.isArray(value)
        ? "array"
        : typeof value === "object" && value !== null
          ? "object"
          : (typeof value as any),
      value: value,
    };

    if (node.type === "object" || node.type === "array") {
      node.children = convertToTreeNodes(value, key);
    }

    return node;
  });
};

// 懒加载节点数据
const loadNode = (node: any, resolve: (data: TreeNode[]) => void) => {
  console.log("node", node);
  if (node.level === 0) {
    // 根节点
    resolve(treeData.value);
    return;
  }

  const data = node.data;
  if (!data.rawData) {
    resolve([]);
    return;
  }
  // if (!data.children) {
  //   resolve([]);
  //   return;
  // }

  // 根据节点类型处理子节点
  let children: TreeNode[] = [];
  if (data.type === "object" && typeof data.rawData === "object") {
    children = Object.entries(data.rawData).map(([key, value]) => ({
      id: generateId(),
      key,
      type: Array.isArray(value)
        ? "array"
        : typeof value === "object" && value !== null
          ? "object"
          : (typeof value as any),
      value: value,
      rawData: value,
    }));
  } else if (data.type === "array" && Array.isArray(data.rawData)) {
    children = data.rawData.map((value: any, index: number) => ({
      id: generateId(),
      key: index.toString(),
      type: Array.isArray(value)
        ? "array"
        : typeof value === "object" && value !== null
          ? "object"
          : (typeof value as any),
      value: value,
      rawData: value,
    }));
  }

  resolve(children);
};

// 将年度数据转为树结构
const handleBuildTree = () => {
  try {
    treeData.value = [];
    treeData.value = convertToTreeNodes(rootData.value);
    console.log(treeData.value);
  } catch (e) {
    console.log(e);
  }
};

// 切换数据类型
const toggleDataType = () => {
  dataType.value = dataType.value === "year" ? "month" : "year";
  ElMessage.success(
    `已切换到${dataType.value === "year" ? "年度" : "月度"}数据`
  );
};

const reInitializeData = () => {
  try {
    businessStore.initLocalBusinessDatabase(true);
    ElMessage.success("初始化成功");
  } catch (e) {
    console.log(e);
    ElMessage.error("初始化失败");
  }
};

// 读取数据
const handleReadCache = () => {
  try {
    const cache = localStorage.getItem("business-local-database");
    const cacheData = JSON.parse(cache as string);
    const yearCache =
      dataType.value === "year" ? cacheData.yearCache : undefined;
    const monthCache =
      dataType.value === "month" ? cacheData.monthCache : undefined;

    if (!yearCache && !monthCache) {
      ElMessage.warning("未找到缓存数据");
      return;
    }
    loading.value = true;
    ElMessage.success("缓存数据构建中，可能需要一些时间，请稍后...");

    rootData.value = dataType.value === "year" ? yearCache : monthCache;
    ElMessage.success("缓存数据读取成功");
  } catch (error) {
    ElMessage.error("读取缓存数据失败");
    console.error("读取缓存数据失败:", error);
  } finally {
    loading.value = false;
  }
};

// 导出 JSON 数据
const handleExportJson = () => {
  try {
    const cache = localStorage.getItem("business-local-database");
    const cacheData = JSON.parse(cache as string);
    const exportData =
      dataType.value === "year" ? cacheData.yearCache : cacheData.monthCache;

    if (!exportData) {
      ElMessage.warning("未找到可导出的数据");
      return;
    }

    // 创建 Blob 对象
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dataType.value}Cache.json`;

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("数据导出成功");
  } catch (error) {
    ElMessage.error("数据导出失败");
    console.error("数据导出失败:", error);
  }
};

// 保存修改后的数据到缓存
const handleSaveCache = () => {
  try {
    const jsonData = convertToJson(treeData.value);
    const cache = localStorage.getItem("business-local-database");
    const cacheData = JSON.parse(cache as string);

    if (dataType.value === "year") {
      let root = jsonData;
      while (root.yearCache) {
        root = root.yearCache;
      }
      cacheData.yearCache = root;
    } else {
      let root = jsonData;
      while (root.monthCache) {
        root = root.monthCache;
      }
      cacheData.monthCache = root;
    }

    localStorage.setItem("business-local-database", JSON.stringify(cacheData));
    ElMessage.success("数据保存成功，请刷新页面以应用更改");
  } catch (error) {
    ElMessage.error("保存数据失败");
    console.error("保存数据失败:", error);
  }
};
</script>

<style scoped>
.json-editor {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.node-content {
  display: flex;
  align-items: center;
}

.node-actions {
  margin-left: 20px;
}

.json-preview {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.json-upload {
  display: inline-block;
}
</style>
