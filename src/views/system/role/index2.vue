<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input
            v-model="queryParams.keywords"
            placeholder="角色名称"
            clearable
            @keyup.enter.prevent="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <el-button type="success" @click="handleOpenDialog()">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色名称" prop="名称" min-width="100" />
        <el-table-column label="角色描述" prop="描述" min-width="150" />

        <!-- <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="排序" align="center" width="80" prop="sort" /> -->

        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleOpenAssignPermDialog(scope.row)"
            >
              <template #icon><Position /></template>
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.页码"
        v-model:limit="queryParams.页容量"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 角色表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form
        ref="roleFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="名称">
          <el-input v-model="formData.名称" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色描述" prop="描述">
          <el-input v-model="formData.描述" placeholder="请输入角色描述" />
        </el-form-item>

        <el-form-item label="权限" prop="权限">
          <el-select v-model="formData.权限" multiple>
            <el-option
              v-for="item in permissionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            controls-position="right"
            :min="0"
            style="width: 100px"
          />
        </el-form-item> -->
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-drawer
      v-model="assignPermDialogVisible"
      :title="'【' + checkedRole.名称 + '】权限分配'"
      size="500"
    >
      <el-checkbox-group v-model="checkedRole.权限">
        <el-checkbox
          v-for="item in permissionOptions"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleAssignPermSubmit">
            确 定
          </el-button>
          <el-button @click="assignPermDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Role",
  inheritAttrs: false,
});

import RoleAPI, {
  RoleAPI2,
  type RolePageQueryDev,
  type RoleFormDev,
  RolePageVO,
  RoleForm,
  RolePageQuery,
} from "@/api/system/role";
import PermissionApi from "@/api/system/permission";
import MenuAPI from "@/api/system/menu";

const queryFormRef = ref(ElForm);
const roleFormRef = ref(ElForm);
const permTreeRef = ref<InstanceType<typeof ElTree>>();

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<Partial<RolePageQuery> & PageQueryDev>({
  页码: 1,
  页容量: 20,
});

// 角色表格数据
// const roleList = ref<RolePageVO[]>();
const roleList = ref<any[]>([]);
// 菜单权限下拉
const menuPermOptions = ref<OptionType[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});
// 角色表单
const formData = reactive<RoleFormDev>({
  id: undefined,
  名称: "",
  描述: "",
  权限: [],
});

const rules = reactive({
  名称: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  描述: [{ required: true, message: "请输入角色描述", trigger: "blur" }],
  // dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
  // status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

// 选中的角色
interface CheckedRole {
  id?: number;
  名称?: string;
  权限?: number[];
}
const checkedRole = ref<CheckedRole>({});
const assignPermDialogVisible = ref(false);

const permKeywords = ref("");
const isExpanded = ref(true);

const permissionOptions = ref<OptionType[]>([]);
const parentChildLinked = ref(true);

/** 查询 */
function handleQuery() {
  loading.value = true;
  RoleAPI2.getPage(queryParams)
    .then((data: any) => {
      roleList.value = data["当前记录"];
      total.value = data["记录总数"];
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 打开角色弹窗 */
function handleOpenDialog(roleId?: number) {
  dialog.visible = true;
  if (roleId) {
    dialog.title = "修改角色";
    RoleAPI2.getFormData(roleId).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增角色";
  }
}

/** 提交角色表单 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const roleId = formData.id;
      if (roleId) {
        RoleAPI2.update(formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        RoleAPI2.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭角色弹窗 */
function handleCloseDialog() {
  dialog.visible = false;

  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
  formData.名称 = "";
  formData.描述 = "";
  formData.权限 = [];
}

/** 删除角色 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId || ids.value].join(",");
  if (!roleIds) {
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
      RoleAPI2.deleteByIds(roleIds)
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

/** 打开分配菜单权限弹窗 */
async function handleOpenAssignPermDialog(row: any) {
  const roleId = row.id;
  if (roleId) {
    assignPermDialogVisible.value = true;
    loading.value = true;

    checkedRole.value.id = roleId;
    checkedRole.value.名称 = row.名称;

    // 获取所有的菜单
    // menuPermOptions.value = await MenuAPI.getOptions();

    // 回显角色已拥有的菜单
    RoleAPI2.getFormData(roleId).then((data) => {
      checkedRole.value.权限 = data.权限;
      loading.value = false;
    });
  }
}

/** 分配菜单权限提交 */
function handleAssignPermSubmit() {
  const roleId = checkedRole.value.id;
  if (roleId) {
    console.log("checkedRole", checkedRole.value.权限);
  }
}

/** 展开/收缩 菜单权限树  */
function togglePermTree() {
  isExpanded.value = !isExpanded.value;
  if (permTreeRef.value) {
    Object.values(permTreeRef.value.store.nodesMap).forEach((node: any) => {
      if (isExpanded.value) {
        node.expand();
      } else {
        node.collapse();
      }
    });
  }
}

/** 权限筛选 */
watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val);
});

function handlePermFilter(
  value: string,
  data: {
    [key: string]: any;
  }
) {
  if (!value) return true;
  return data.label.includes(value);
}

/** 父子菜单节点是否联动 change*/
function handleparentChildLinkedChange(val: any) {
  parentChildLinked.value = val;
}

/** 权限加载 */
async function initPermissionList(): Promise<any> {
  const { 当前记录: permissionList } = await PermissionApi.getAllPermission();
  permissionOptions.value = permissionList.map((item: any) => ({
    label: item.名称,
    value: item.id,
  }));
}
onMounted(async () => {
  try {
    await initPermissionList();
  } catch (error) {
    console.error(error);
    ElMessage.error("权限加载失败, 请重试");
  }
  handleQuery();
});
</script>
