<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="keywords">
          <el-input
            v-model="queryParams.名称"
            placeholder="组织名称"
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
        <el-table-column prop="id" label="组织id" width="80" />
        <el-table-column prop="名称" label="名称" min-width="200" />
        <el-table-column prop="类型" label="类型" width="100" />
        <el-table-column prop="地址" label="地址" min-width="200" />
        <el-table-column prop="备注" label="描述" min-width="200" />
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
        <el-form-item label="上级组织" prop="上级id">
          <el-tree-select
            v-model="formData.上级id"
            placeholder="选择上级组织"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            @change="handleParentDeptChange"
          />
        </el-form-item>
        <el-form-item label="名称" prop="名称">
          <el-input v-model="formData.名称" placeholder="请输入组织名称" />
        </el-form-item>
        <el-form-item label="地址" prop="地址">
          <el-input v-model="formData.地址" placeholder="请输入组织地址" />
        </el-form-item>
        <!-- 类型 -->
        <el-form-item label="类型" prop="类型">
          <el-select v-model="formData.类型" placeholder="请选择组织类型">
            <el-option
              v-for="item in orgTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="描述">
          <el-input v-model="formData.备注" placeholder="请输入组织描述" />
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
import { HR_API, OrgQuery, OrgForm } from "@/api/hr";
import { getTreeFromFlatNodes } from "@/utils/datastruct";

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

const queryParams = reactive<Partial<OrgQuery> & PageQueryDev>({
  名称: undefined,
  id集合: undefined,
  上级id集合: undefined,
  页码: 1,
  页容量: 1000,
});

// const deptList = ref<DeptVO[]>();
const deptList = ref<any[]>();
const deptTree = ref<any[]>();

const deptOptions = ref<OptionType[]>();
const orgTypeOptions = ref<OptionType[]>([
  { label: "公司", value: "公司" },
  { label: "部门", value: "部门" },
  { label: "岗位", value: "岗位" },
]);

const formData = reactive<Partial<OrgForm>>({
  id: undefined,
  上级id: undefined,
  名称: undefined,
  备注: undefined,
  类型: undefined,
  状态: undefined,
});

const rules = reactive({
  // 上级id: [{ required: true, message: "上级组织不能为空", trigger: "change" }],
  名称: [{ required: true, message: "组织名称不能为空", trigger: "blur" }],
  // code: [{ required: true, message: "组织编号不能为空", trigger: "blur" }],
});

/** 查询组织 */
async function handleQuery() {
  // loading.value = true;
  // DeptAPI2.getList(queryParams).then((data: any) => {
  //   deptList.value = data["当前记录"];
  //   loading.value = false;
  // });
  loading.value = true;
  await initDeptTree();
  deptList.value = deptOptions.value?.slice(1);
  // console.log("deptList", deptList.value);
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
 * 打开组织弹窗
 *
 * @param parentId 父组织ID
 * @param deptId 组织ID
 */
async function handleOpenDialog(
  parentId?: number | null,
  deptId?: number,
  currentDetp?: any
) {
  // 加载组织下拉数据
  if (!deptOptions.value) {
    await initDeptTree();
  }
  // console.log("parentId", parentId, "deptId", deptId);
  dialog.visible = true;
  if (deptId) {
    dialog.title = "修改组织";
    HR_API.getOrgDetail(deptId).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增组织";
    // formData.parentId = parentId ?? 0;
  }
}

/** 上级组织选择变化 */
function handleParentDeptChange(value: number) {
  // formData.parentId = value;
  // 不能选择自己作为上级组织
  if (formData.id && +formData.id === value) {
    ElMessage.warning("不能选择自己作为上级组织");
    formData.上级id = 0;
  }
}

/** 提交组织表单
 * 新建:
 *    无父组织 - null - 不做更改
 *    有父组织 - 不做更改（父组织左值右值）
 * 修改
 *    有父组织 - 不做更改
 *    无父组织 -
 *        原本无父组织 - 和缓存保持一致
 *        原本有父组织 - null
 */
function handleSubmit() {
  deptFormRef.value.validate((valid: any) => {
    if (valid) {
      submitLoading.value = true;
      const deptId = formData.id;
      if (deptId) {
        HR_API.updateOrg(formData)
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
        HR_API.addOrg(formData)
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

/** 删除组织 */
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
  formData.上级id = undefined;
  formData.名称 = undefined;
  formData.备注 = undefined;
  formData.地址 = undefined;
  formData.类型 = undefined;
  formData.状态 = undefined;
  // formData.parentId = 0;
  // formData.status = 1;
  // formData.sort = 1;
}

/**
 * 初始化组织树
 */
async function initDeptTree() {
  // 根据左右值算法构建组织树
  try {
    const data: any = await HR_API.getOrgList({
      页码: 1,
      页容量: 1000,
    });
    const treeNodes = data["当前记录"];
    const treeData = treeNodes.map((node: any) => {
      return {
        value: +node.id,
        label: node.名称,
        ...node,
        id: +node.id,
        上级id: +node.上级id,
      };
    });
    // console.log("1", treeData);
    deptOptions.value = getTreeFromFlatNodes(treeData, "id", "上级id");
    // console.log("组织树", deptOptions.value);
    deptOptions.value.unshift({
      label: "顶级组织",
      value: 0,
      children: [],
    });
  } catch (error) {
    console.error("初始化组织树失败: " + error);
  }
}

onMounted(() => {
  try {
    handleQuery();
  } catch (error) {
    console.error("初始化组织列表失败: " + error);
  }
});
</script>
