<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="keywords">
          <el-input
            v-model="queryParams.名称"
            placeholder="部门名称"
            @keyup.enter.prevent="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <el-button
          v-hasPerm="['sys:dept:add']"
          type="success"
          @click="handleOpenDialog(0, undefined)"
        >
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['sys:dept:delete']"
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>

      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="名称" label="部门名称" min-width="200" />
        <el-table-column prop="描述" label="部门描述" min-width="200" />
        <!-- <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column> -->

        <el-table-column prop="层级" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="scope">
            <el-button
              v-hasPerm="['sys:dept:add']"
              type="primary"
              link
              size="small"
              @click.stop="
                handleOpenDialog(+scope.row.id, undefined, scope.row)
              "
            >
              <template #icon>
                <Plus />
              </template>
              新增
            </el-button>
            <el-button
              v-hasPerm="['sys:dept:edit']"
              type="primary"
              link
              size="small"
              @click.stop="handleOpenDialog(null, scope.row.id)"
            >
              <template #icon>
                <Edit />
              </template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['sys:dept:delete']"
              type="danger"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)"
            >
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="600px"
      @closed="handleCloseDialog"
    >
      <el-form
        ref="deptFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            placeholder="选择上级部门"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            @change="handleParentDeptChange"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="名称">
          <el-input v-model="formData.名称" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门描述" prop="描述">
          <el-input v-model="formData.描述" placeholder="请输入部门描述" />
        </el-form-item>
        <!-- <el-form-item label="显示排序" prop="sort">
          <el-input-number
            v-model="formData.层级"
            controls-position="right"
            style="width: 100px"
            :min="0"
          />
        </el-form-item> -->
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
          >
            确 定
          </el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dept",
  inheritAttrs: false,
});

import DeptAPI, {
  DeptAPI2,
  DeptVO,
  DeptForm2,
  DeptQuery2,
} from "@/api/system/dept";
import { getTreeFromLeftRightTreeNodes } from "@/utils/datastruct";

const queryFormRef = ref(ElForm);
const deptFormRef = ref(ElForm);

const loading = ref(false);
const submitLoading = ref(false);
const parentIdMap = ref<Map<number, string>>(new Map());
const ids = ref<number[]>([]);
const dialog = reactive({
  title: "",
  visible: false,
});

const queryParams = reactive<Partial<DeptQuery2> & PageQueryDev>({
  名称: undefined,
  id集合: undefined,
  页码: 1,
  页容量: 1000,
});

// const deptList = ref<DeptVO[]>();
const deptList = ref<any[]>();
const deptTree = ref<any[]>();

const deptOptions = ref<OptionType[]>();

const formData = reactive<
  DeptForm2 & {
    parentId: number | undefined | null;
  }
>({
  id: undefined,
  名称: "",
  描述: "",
  左值: 0,
  右值: 0,
  角色: [],
  parentId: undefined,
});

const rules = reactive({
  parentId: [
    { required: true, message: "上级部门不能为空", trigger: "change" },
  ],
  名称: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  // code: [{ required: true, message: "部门编号不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
});

/** 查询部门 */
async function handleQuery() {
  // loading.value = true;
  // DeptAPI2.getList(queryParams).then((data: any) => {
  //   deptList.value = data["当前记录"];
  //   loading.value = false;
  // });
  loading.value = true;
  await initDeptTree();
  deptList.value = deptOptions.value?.slice(1);
  console.log("deptList", deptList.value);
  loading.value = false;
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开部门弹窗
 *
 * @param parentId 父部门ID
 * @param deptId 部门ID
 */
async function handleOpenDialog(
  parentId?: number | null,
  deptId?: number,
  currentDetp?: any
) {
  // 加载部门下拉数据
  if (!deptOptions.value) {
    await initDeptTree();
  }
  // 父部门id有三种情况：非0正数(当前部门新增子部门)、0(新增顶级部门)、null(修改部门)
  if (parentId === null && deptId) {
    // 对应修改部门，寻找当前部门的父部门
    formData.parentId = parseInt(parentIdMap.value.get(deptId) || "0");
  } else if (parentId) {
    // 新增子部门
    // console.log(currentDetp);
    formData.parentId = parentId;
    formData.左值 = currentDetp.左值;
    formData.右值 = currentDetp.右值;
  } else {
    // 新增顶级部门
    formData.parentId = parentId ?? 0;
  }
  // console.log("parentId", parentId, "deptId", deptId);
  dialog.visible = true;
  if (deptId) {
    dialog.title = "修改部门";
    DeptAPI2.getFormData(deptId).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增部门";
    // formData.parentId = parentId ?? 0;
  }
}

/** 上级部门选择变化 */
function handleParentDeptChange(value: number) {
  // formData.parentId = value;
  // 不能选择自己作为上级部门
  if (formData.id && +formData.id === value) {
    ElMessage.warning("不能选择自己作为上级部门");
    formData.parentId = parseInt(parentIdMap.value.get(+formData.id) || "0");
  }
}

/** 提交部门表单
 * 新建:
 *    无父部门 - null - 不做更改
 *    有父部门 - 不做更改（父部门左值右值）
 * 修改
 *    有父部门 - 不做更改
 *    无父部门 -
 *        原本无父部门 - 和缓存保持一致
 *        原本有父部门 - null
 */
function handleSubmit() {
  deptFormRef.value.validate((valid: any) => {
    if (valid) {
      submitLoading.value = true;
      const deptId = formData.id;
      if (deptId) {
        // 当前选择顶级部门作为父部门时，如果层级不为0（原本有父部门），赋值为null
        // 如果层级为0（原本无父部门），不做更改
        if (formData.parentId === 0) {
          formData.左值 =
            parseInt(formData.层级 + "") === 0 ? formData.左值 : null;
          formData.右值 =
            parseInt(formData.层级 + "") === 0 ? formData.右值 : null;
        }
        DeptAPI2.update(deptId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleQuery();
          })
          .finally(() => {
            loading.value = false;
            submitLoading.value = false;
          });
      } else {
        if (formData.parentId === 0) {
          formData.左值 = null;
          formData.右值 = null;
        }
        // console.log("新增部门", formData);
        DeptAPI2.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleQuery();
          })
          .finally(() => {
            loading.value = false;
            submitLoading.value = false;
          });
      }
    }
  });
}

/** 删除部门 */
function handleDelete(deptId?: number) {
  const deptIds = [deptId || ids.value].join(",");

  if (!deptIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      DeptAPI2.deleteByIds(deptIds)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

/** 关闭弹窗 */
function handleCloseDialog() {
  dialog.visible = false;

  deptFormRef.value.resetFields();
  deptFormRef.value.clearValidate();

  formData.id = undefined;
  formData.parentId = undefined;
  formData.名称 = "";
  formData.描述 = "";
  formData.层级 = 0;
  formData.左值 = 0;
  formData.右值 = 0;
  formData.角色 = [];
  // formData.parentId = 0;
  // formData.status = 1;
  // formData.sort = 1;
}

/**
 * 初始化部门树
 */
async function initDeptTree() {
  // 根据左右值算法构建部门树
  try {
    const data: any = await DeptAPI2.getAllDeptList();
    const treeNodes = data["当前记录"];
    const treeData = treeNodes.map((node: any) => {
      return {
        id: node.id,
        value: +node.id,
        leftValue: +node.左值,
        rightValue: +node.右值,
        label: node.名称,
        ...node,
      };
    });
    // console.log("1", treeData);
    deptOptions.value = getTreeFromLeftRightTreeNodes(
      treeData,
      "leftValue",
      "rightValue"
    );
    // console.log("部门树", deptOptions.value);
    deptOptions.value.unshift({
      label: "顶级部门",
      value: 0,
      children: [],
    });
    // 构造部门ID和父部门ID的映射关系
    treeNodes.forEach((node: any) => {
      parentIdMap.value.set(node.id, node.parentId);
    });
  } catch (error) {
    console.error("初始化部门树失败: " + error);
  }
}

onMounted(() => {
  try {
    handleQuery();
  } catch (error) {
    console.error("初始化部门列表失败: " + error);
  }
});
</script>
