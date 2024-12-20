<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <DeptTreeDev
          ref="deptTreeRef"
          v-model="queryParams.部门id"
          @node-click="handleQuery"
        />
        <!-- <el-tree
          ref="deptTreeRef"
          class="mt-2"
          :data="deptOptions"
          :props="{ children: 'children', label: 'label', disabled: '' }"
          :expand-on-click-node="false"
          :filter-node-method="handleFilter"
          default-expand-all
          @node-click="handleQuery"
        /> -->
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

            <el-form-item label="账号" prop="登录名">
              <el-input
                v-model="queryParams.登录名"
                placeholder="用户的登录账号"
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
            <!-- <el-table-column label="部门" width="150" align="center">
              <template #default="scope">
                <span v-if="scope.row.部门">{{ scope.row.部门.名称 }}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              label="手机号码"
              align="center"
              prop="手机"
              width="120"
            />

            <!-- <el-table-column
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
            </el-table-column> -->

            <el-table-column
              label="创建时间"
              align="center"
              prop="创建时间"
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
        label-width="120px"
      >
        <el-form-item label="账号" prop="登录名">
          <el-input
            v-model="formData.登录名"
            :readonly="!!formData.id"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="显示名" prop="显示名">
          <el-input
            v-model="formData.显示名"
            autocomplete="off"
            placeholder="请输入用户显示名"
          />
        </el-form-item>

        <el-form-item v-if="!formData.id" label="密码" prop="密码">
          <template #default>
            <el-input
              v-model="formData.密码"
              autocomplete="off"
              type="password"
              placeholder="请输入密码"
            />
            <div class="password-strength">
              <div
                class="strength-item"
                :class="{
                  __weak: passwordStrength >= 1,
                  __medium: passwordStrength >= 2,
                  __strong: passwordStrength >= 3,
                }"
              />
              <span class="color-red">
                {{
                  passwordStrength >= 3
                    ? ""
                    : passwordStrength >= 2
                      ? "强度: 中"
                      : passwordStrength >= 1
                        ? "强度: 弱"
                        : ""
                }}
              </span>
            </div>
          </template>
        </el-form-item>

        <el-form-item
          v-if="!formData.id && formData.密码"
          label="再次输入密码"
          prop="密码2"
        >
          <el-input
            v-model="formData.密码2"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>

        <!-- <el-form-item label="职务" prop="职务">
          <el-select v-model="formData.职务" multiple placeholder="请选择">
            <el-option
              v-for="item in jobOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="所属部门" prop="部门">
          <el-tree-select
            v-model="formData.部门"
            placeholder="请选择所属部门"
            :data="deptOptions"
            filterable
            check-strictly
            default-expand-all
            :render-after-expand="false"
          />
        </el-form-item>

        <!-- <el-form-item label="性别" prop="gender">
          <Dict v-model="formData.gender" code="gender" />
        </el-form-item> -->

        <el-form-item label="角色" prop="角色">
          <el-select v-model="formData.角色" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="手机">
          <el-input
            v-model="formData.手机"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>
        <!-- 
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item> -->

        <el-form-item label="显示优先级" prop="优先级">
          <el-input-number
            v-model="formData.优先级"
            controls-position="right"
            :min="1"
            :max="999"
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
import RoleAPI, { RoleAPI2 } from "@/api/system/role";
import { DeptAPI2 } from "@/api/system/dept";
import { getTreeFromLeftRightTreeNodes } from "@/utils/datastruct";
import DeptTreeDev from "./components/DeptTreeDev.vue";
import UserImport from "./components/UserImport.vue";

const queryFormRef = ref(ElForm);
const userFormRef = ref(ElForm);

interface UserPageQuery {
  用户id集合: string[];
  部门id: number;
  部门id集合: number[];
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
const allDeptList = ref<any>({});
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
const formData = reactive<
  UserForm_2 & {
    密码2?: string;
  }
>({
  id: undefined,
  密码: "",
  密码2: "",
  登录名: "",
  显示名: "",
  部门: [],
  职务: [],
  角色: [],
  手机: "",
  优先级: 1,
});

const passwordStrength = ref(0);

// 用户表单校验规则
const rules = reactive({
  登录名: [{ required: true, message: "请输入登录名", trigger: "blur" }],
  显示名: [{ required: true, message: "请输入显示名", trigger: "blur" }],
  密码: [
    { required: true, message: "请输入密码", trigger: "blur" },
    // { min: 6, message: "密码至少6位字符", trigger: "blur" },
    {
      // 密码强度校验
      validator: (rule: any, value: string, callback: any) => {
        if (!value) {
          return callback(new Error("请输入密码"));
        }
        passwordStrength.value = 0;
        if (value.length >= 1) {
          passwordStrength.value++;
        }
        if (value.length >= 10) {
          passwordStrength.value++;
        }
        if (value.length >= 14) {
          passwordStrength.value++;
        }
        callback();
      },
    },
  ],
  密码2: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== formData.密码) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  部门: [{ required: true, message: "请选择部门", trigger: "blur" }],
  角色: [{ required: true, message: "请选择角色", trigger: "blur" }],
  // 手机: [
  //   { required: true, message: "请输入手机号码", trigger: "blur" },
  //   {
  //     pattern: /^1[3456789]\d{9}$/,
  //     message: "手机号码格式不正确",
  //     trigger: "blur",
  //   },
  // ],
  优先级: [{ required: true, message: "请输入显示优先级", trigger: "blur" }],
});

function findParentDeptId(
  deptId: number,
  deptTree: any[] = [],
  path: any[] = []
) {
  // dfs暴力找
  for (const dept of deptTree) {
    if (+dept.id === deptId) {
      path.push(+dept.id);
      return true;
    }
    if (dept.children) {
      path.push(+dept.id);
      const result = findParentDeptId(deptId, dept.children, path);
      if (result) {
        return true;
      } else {
        path.pop();
      }
    }
  }
}

function getParentsDeptId(deptId: number) {
  // dfs暴力找
  const deptTree = deptOptions.value;
  const result: any[] = [];
  findParentDeptId(deptId, deptTree, result);
  return result;
}

function getAllDescendantDeptId(deptId: number, deptList: any[] = []) {
  const result: any[] = [];
  // 现在deptList已经摊平并带有children属性, 只需要遍历后dfs找到所有子节点
  const dept = deptList[deptId];
  if (!dept) return [];
  result.push(+dept.id);
  const dfs = (nodes: any[]) => {
    for (const node of nodes) {
      result.push(+node.id);
      if (node.children) {
        dfs(node.children);
      }
    }
  };
  dept.children && dfs(dept.children);
  // console.log(result);
  return result;
}

function getFlatTreeNodesByDFS(treeNodes: any[], childrenKey: string) {
  const result: any = {};
  const dfs = (nodes: any[]) => {
    for (const node of nodes) {
      result[node.id] = node;
      if (node[childrenKey]) {
        dfs(node[childrenKey]);
      }
    }
  };
  dfs(treeNodes);
  return result;
}

//查询
function handleQuery() {
  loading.value = true;
  if (queryParams.value.部门id) {
    queryParams.value.部门id集合 = Array.from(
      getAllDescendantDeptId(queryParams.value.部门id, allDeptList.value)
    );
  }
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
  ElMessageBox.prompt("请输入用户「" + row.显示名 + "」的新密码", "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(
    async ({ value }) => {
      if (!value || value.length < 6) {
        // 检查密码是否为空或少于6位
        ElMessage.warning("密码至少需要6位字符，请重新输入");
        return false;
      }
      const form = await UserAPI_2.getFormData(row.id);
      form.密码 = value;
      UserAPI_2.update(form).then(() => {
        ElMessage.success("密码重置成功，新密码是：" + value);
      });
      // UserAPI_2.resetPassword(row.id, value).then(() => {
      //   ElMessage.success("密码重置成功，新密码是：" + value);
      // });
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

  if (id) {
    dialog.title = "修改用户";
    UserAPI_2.getFormData(id).then((data) => {
      Object.assign(formData, {
        ...data,
        部门: Array.isArray(data.部门)
          ? +data.部门[data.部门.length - 1]
          : data.部门,
      });
      console.log(formData);
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

  formData.id = undefined;
  formData.密码 = "";
  formData.登录名 = "";
  formData.显示名 = "";
  formData.部门 = [];
  formData.职务 = [];
  formData.角色 = [];
  formData.手机 = "";
  formData.优先级 = 1;
}

function handleFilter(value: string, data: any) {
  if (!value) {
    return true;
  }
  return data.label.indexOf(value) !== -1;
}

// 表单提交
const handleSubmit = useThrottleFn(() => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      const submitData = {
        ...formData,
        部门: Array.isArray(formData.部门) ? formData.部门 : [formData.部门],
      };
      if (userId) {
        UserAPI_2.update(submitData)
          .then(() => {
            ElMessage.success("修改用户成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAPI_2.add(submitData)
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

// 初始化部门树\角色下拉数据
async function initOptions() {
  try {
    // 加载角色下拉数据源
    // roleOptions.value = await RoleAPI.getOptions();
    const { 当前记录: options } = await RoleAPI2.getOptions();
    roleOptions.value = options.map((item: any) => {
      return {
        value: item.id,
        label: item.名称,
      };
    });
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
    // 将树结构节点一次dfs展开为数组
    allDeptList.value = getFlatTreeNodesByDFS(deptOptions.value, "children");
  } catch (error) {
    console.error(error + "加载数据源失败，请重试");
  }
}

onMounted(async () => {
  await initOptions();
  handleQuery();
});
</script>

<style lang="scss" scoped>
.password-strength {
  // display: flex;
  @apply flex mt-1 w-full items-center;
  .strength-item {
    height: 10px;
    // line-height: 18px;
    background-color: #e0e0e0;
    margin-right: 5px;
    &.__weak {
      background-color: #ff4d4f;
      width: 33%;
    }
    &.__medium {
      background-color: #faad14;
      width: 66%;
    }
    &.__strong {
      background-color: #52c41a;
      width: 100%;
    }
  }
}
</style>
