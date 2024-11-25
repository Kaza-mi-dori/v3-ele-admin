<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <DeptTree v-model="queryParams.部门id" @node-click="handleQuery" />
      </el-col>

      <!-- 用户列表 -->
      <el-col :lg="20" :xs="24">
        <div class="search-bar">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="姓名" prop="显示名">
              <el-input
                v-model="queryParams.显示名"
                placeholder="用户的显示名"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="手机号码" prop="手机">
              <el-input
                v-model="queryParams.显示名"
                placeholder="用户的手机号码"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <!-- <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                class="!w-[100px]"
              >
                <el-option label="正常" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item label="创建时间">
              <el-date-picker
                v-model="queryParams.createTime"
                :editable="false"
                class="!w-[240px]"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="YYYY-MM-DD"
              />
            </el-form-item> -->

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

        <el-card shadow="never">
          <div class="flex-x-between mb-10px">
            <div>
              <el-button
                v-hasPerm="['sys:user:add']"
                type="success"
                @click="handleOpenDialog()"
              >
                <template #icon><Plus /></template>
                新增
              </el-button>
              <!-- <el-button
                v-hasPerm="['sys:user:delete']"
                type="danger"
                :disabled="removeIds.length === 0"
                @click="handleDelete()"
              >
                <template #icon><Delete /></template>
                删除
              </el-button> -->
            </div>
            <div>
              <el-button
                v-hasPerm="['sys:user:import']"
                type="default"
                icon="upload"
                @click="handleOpenImportDialog"
              >
                导入
              </el-button>

              <el-button
                v-hasPerm="['sys:user:export']"
                type="default"
                icon="download"
                @click="handleExport"
              >
                导出
              </el-button>
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="pageData"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="80"
            />
            <el-table-column
              key="登录名"
              label="账号"
              align="center"
              prop="登录名"
            />
            <el-table-column
              key="显示名"
              label="用户名"
              align="center"
              prop="显示名"
            />
            <el-table-column
              label="部门"
              width="150"
              align="center"
              prop="deptName"
            />
            <el-table-column
              label="手机号码"
              align="center"
              prop="手机"
              width="120"
            />

            <el-table-column
              label="状态"
              align="center"
              prop="status"
              width="100"
            >
              <template #default="scope">
                <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
                  {{ scope.row.status == 1 ? "正常" : "禁用" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  v-hasPerm="['sys:user:password:reset']"
                  type="primary"
                  size="small"
                  link
                  @click="hancleResetPassword(scope.row)"
                >
                  <template #icon><RefreshLeft /></template>
                  重置密码
                </el-button>
                <el-button
                  v-hasPerm="['sys:user:edit']"
                  type="primary"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row.id)"
                >
                  <template #icon><Edit /></template>
                  编辑
                </el-button>
                <el-button
                  v-hasPerm="['sys:user:delete']"
                  type="danger"
                  link
                  size="small"
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
      </el-col>
    </el-row>

    <!-- 用户表单弹窗 -->
    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      append-to-body
      @close="handleCloseDialog"
    >
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="账号" prop="登录名">
          <el-input
            v-model="formData.登录名"
            :readonly="!!formData.id"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="显示名" prop="显示名">
          <el-input v-model="formData.显示名" placeholder="请输入用户显示名" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-tree-select
            v-model="formData.deptId"
            placeholder="请选择所属部门"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <Dict v-model="formData.gender" code="gender" />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 用户导入弹窗 -->
    <UserImport
      v-model:visible="importDialogVisible"
      @import-success="handleQuery()"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "User",
  inheritAttrs: false,
});

import { UserAPI_2 } from "@/api/system/user";
import { type UserForm_2 } from "@/api/system/user";

import DeptAPI from "@/api/system/dept";
import RoleAPI from "@/api/system/role";
import { DeptAPI2 } from "@/api/system/dept";
import { getTreeFromLeftRightTreeNodes } from "@/utils/datastruct";

import DeptTree from "./components/DeptTree.vue";
import UserImport from "./components/UserImport.vue";

const queryFormRef = ref(ElForm);
const userFormRef = ref(ElForm);

interface UserPageQuery {
  用户id集合: string[];
  部门id: number;
  职务id集合: string[];
  角色id集合: string[];
  显示名: string;
  登录名: string;
}

const loading = ref(false);
const removeIds = ref([]);
const total = ref(0);
const pageData = ref<any[]>();
// 部门下拉数据源
const deptOptions = ref<OptionType[]>();
// 角色下拉数据源
const roleOptions = ref<OptionType[]>();
// 用户查询参数
const queryParams = ref<Partial<UserPageQuery> & PageQueryDev>({
  页码: 1,
  页容量: 20,
});

// 用户弹窗
const dialog = reactive({
  visible: false,
  title: "",
});

// 导入弹窗显示状态
const importDialogVisible = ref(false);

// 用户表单数据
const formData = ref<UserForm_2>({
  id: undefined,
  密码: "",
  登录名: "",
  显示名: "",
  部门: [],
  职务: [],
  角色: [],
  手机: "",
  优先级: 1,
});

// 用户表单校验规则
const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  nickname: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  deptId: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

//查询
function handleQuery() {
  loading.value = true;
  UserAPI_2.getPage(queryParams.value)
    .then((data: any) => {
      // console.log(data);
      pageData.value = data["当前记录"];
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.value.页码 = 1;
  queryParams.value.页容量 = 20;
  handleQuery();
}

// 行复选框选中记录选中ID集合
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

// 重置密码
function hancleResetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    "请输入用户「" + row.username + "」的新密码",
    "重置密码",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  ).then(
    ({ value }) => {
      if (!value || value.length < 6) {
        // 检查密码是否为空或少于6位
        ElMessage.warning("密码至少需要6位字符，请重新输入");
        return false;
      }
      UserAPI_2.resetPassword(row.id, value).then(() => {
        ElMessage.success("密码重置成功，新密码是：" + value);
      });
    },
    () => {
      ElMessage.info("已取消重置密码");
    }
  );
}

/**
 * 打开弹窗
 *
 * @param id 用户ID
 */
async function handleOpenDialog(id?: number) {
  dialog.visible = true;

  try {
    // 加载角色下拉数据源
    roleOptions.value = await RoleAPI.getOptions();
    // 加载部门下拉数据源
    // deptOptions.value = await DeptAPI.getOptions();
    const { 当前记录: deptList } = await DeptAPI2.getAllDeptList();
    const treeNodes = deptList.map((node: any) => {
      return {
        id: node.id,
        value: +node.id,
        leftValue: +node.左值,
        rightValue: +node.右值,
        label: node.名称,
        ...node,
      };
    });
    deptOptions.value = getTreeFromLeftRightTreeNodes(
      treeNodes,
      "leftValue",
      "rightValue"
    );
  } catch (error) {
    console.error(error + "加载数据源失败，请重试");
  }

  if (id) {
    dialog.title = "修改用户";
    UserAPI_2.getFormData(id).then((data) => {
      Object.assign(formData, { ...data });
    });
  } else {
    dialog.title = "新增用户";
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  formData.value.id = undefined;
  formData.value.密码 = "";
  formData.value.登录名 = "";
  formData.value.显示名 = "";
  formData.value.部门 = [];
  formData.value.职务 = [];
  formData.value.角色 = [];
  formData.value.手机 = "";
  formData.value.优先级 = 1;
}

// 表单提交
const handleSubmit = useThrottleFn(() => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        UserAPI_2.update(userId, formData)
          .then(() => {
            ElMessage.success("修改用户成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAPI_2.add(formData)
          .then(() => {
            ElMessage.success("新增用户成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 3000);

// 删除用户
function handleDelete(id?: number) {
  const userIds = [id || removeIds.value].join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    function () {
      loading.value = true;
      UserAPI_2.delete(userIds)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info("已取消删除");
    }
  );
}
// 打开导入弹窗 *
function handleOpenImportDialog() {
  importDialogVisible.value = true;
}

// 导入用户成功
function handleUserImportSuccess() {
  handleQuery();
}

// 导出用户
function handleExport() {
  console.log("导出用户");
}

onMounted(() => {
  handleQuery();
});
</script>
