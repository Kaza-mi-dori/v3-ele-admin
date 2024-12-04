<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="名称">
          <el-input
            v-model="queryParams.名称"
            placeholder="权限名称"
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
        <el-button
          v-hasPerm="['sys:menu:add']"
          type="success"
          @click="handleOpenDialog(undefined)"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
      </template>

      <el-table
        v-loading="loading"
        :data="menuTableData"
        highlight-current-row
        row-key="id"
        :expand-row-keys="['1']"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
        }"
        @row-click="handleRowClick"
      >
        <el-table-column label="权限名称" min-width="200">
          <template #default="scope">
            <span v-if="scope.row.类型 === PermissionEnum.MENU">
              <el-icon>
                <Menu />
              </el-icon>
              {{ scope.row.名称 }}
            </span>
            <span v-else-if="scope.row.类型 === PermissionEnum.BUTTON">
              <el-icon>
                <Button />
              </el-icon>
              {{ scope.row.名称 }}
            </span>
            <span v-else-if="scope.row.类型 === PermissionEnum.API">
              <el-icon>
                <Interface />
              </el-icon>
              {{ scope.row.名称 }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" width="80">
          <template #default="scope">
            <el-tag
              v-if="scope.row.类型 === PermissionEnum.MENU"
              type="success"
              size="small"
            >
              菜单
            </el-tag>
            <el-tag
              v-else-if="scope.row.类型 === PermissionEnum.BUTTON"
              type="info"
              size="small"
            >
              按钮
            </el-tag>
            <el-tag
              v-else-if="scope.row.类型 === PermissionEnum.API"
              type="warning"
              size="small"
            >
              接口
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="权限编码"
          align="center"
          width="200"
          prop="编码"
        />

        <el-table-column fixed="right" align="center" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-if="scope.row.type == 'CATALOG' || scope.row.type == 'MENU'"
              v-hasPerm="['sys:menu:add']"
              type="primary"
              link
              size="small"
              @click.stop="handleOpenDialog(undefined)"
            >
              <template #icon><Plus /></template>
              新增
            </el-button>

            <el-button
              v-hasPerm="['sys:menu:edit']"
              type="primary"
              link
              size="small"
              @click.stop="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['sys:menu:delete']"
              type="danger"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      size="30%"
      class="pr-4"
      @close="handleCloseDialog"
    >
      <el-form
        ref="menuFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="权限名称" prop="名称">
          <el-input v-model="formData.名称" placeholder="请输入权限名称" />
        </el-form-item>

        <el-form-item label="权限类型" prop="类型">
          <el-radio-group v-model="formData.类型">
            <el-radio value="菜单">菜单</el-radio>
            <el-radio value="按钮">按钮</el-radio>
            <el-radio value="接口">接口</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item
          v-if="formData.type == '地址'"
          label="外链地址"
          prop="path"
        >
          <el-input
            v-model="formData.routePath"
            placeholder="请输入外链完整路径"
          />
        </el-form-item> -->

        <el-form-item prop="描述" label="描述">
          <el-input v-model="formData.描述" placeholder="请输入权限描述" />
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item label="权限编码" prop="编码">
          <el-input v-model="formData.编码" placeholder="sys:user:add" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="submitForm"
          >
            确 定
          </el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "SysMenu",
  inheritAttrs: false,
});

import MenuAPI, { MenuQuery, MenuForm, MenuVO } from "@/api/system/menu";
import PermissionApi, {
  type PermissionForm,
  type PermissionQuery,
} from "@/api/system/permission";
import { ElMessage } from "element-plus";
import { MenuTypeEnum } from "@/enums/MenuTypeEnum";
import { PermissionEnum } from "@/enums/PermissionEnum";

const queryFormRef = ref(ElForm);
const menuFormRef = ref(ElForm);

const loading = ref(false);
const submitLoading = ref(false);
const dialog = reactive({
  title: "新增菜单",
  visible: false,
});

// 查询参数
const queryParams = reactive<Partial<PermissionQuery> & PageQueryDev>({
  页码: 1,
  页容量: 10,
});
// 菜单表格数据
const menuTableData = ref<any[]>([]);
// 顶级菜单下拉选项
const menuOptions = ref<OptionType[]>([]);

// 初始菜单表单数据
const initialMenuFormData = ref<PermissionForm>({
  id: undefined,
  名称: "",
  编码: "",
  描述: "",
  类型: "菜单",
  地址: "",
});

// 菜单表单数据
const formData = ref<any>({ ...initialMenuFormData.value });

// 表单验证规则
const rules = reactive({
  名称: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  类型: [{ required: true, message: "请选择权限类型", trigger: "blur" }],
  编码: [{ required: true, message: "请输入菜单编码", trigger: "blur" }],
});

// 选择表格的行菜单ID
const selectedMenuId = ref<number | undefined>();

// 查询菜单
function handleQuery() {
  loading.value = true;
  PermissionApi.getPermissionList(queryParams)
    .then((data: any) => {
      menuTableData.value = data["当前记录"];
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

// 行点击事件
function handleRowClick(row: MenuVO) {
  // 记录表格选择的菜单ID，新增子菜单作为父菜单ID
  selectedMenuId.value = row.id;
}

/**
 * 打开表单弹窗
 */
function handleOpenDialog(id?: number | string) {
  dialog.visible = true;
  if (id) {
    dialog.title = "编辑菜单";
    PermissionApi.getPermissionDetail(id).then((data) => {
      formData.value = { ...data };
    });
  } else {
    dialog.title = "新增菜单";
    formData.value = { ...initialMenuFormData.value };
  }
}

// 菜单类型切换
function handleMenuTypeChange() {
  // 如果菜单类型改变
  if (formData.value.type !== initialMenuFormData.value.type) {
    if (formData.value.type === MenuTypeEnum.MENU) {
      // 目录切换到菜单时，清空组件路径
      if (initialMenuFormData.value.type === MenuTypeEnum.CATALOG) {
        formData.value.component = "";
      } else {
        // 其他情况，保留原有的组件路径
        formData.value.routePath = initialMenuFormData.value.routePath;
        formData.value.component = initialMenuFormData.value.component;
      }
    }
  }
}

/** 菜单保存提交 */
function submitForm() {
  menuFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      const menuId = formData.value.id;
      if (menuId) {
        submitLoading.value = true;
        PermissionApi.updatePermission(formData.value)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleQuery();
          })
          .catch((err) => {
            ElMessage.error("修改失败" + err);
          })
          .finally(() => {
            submitLoading.value = false;
          });
      } else {
        PermissionApi.addPermission(formData.value)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleQuery();
          })
          .catch((err) => {
            ElMessage.error("新增失败" + err);
          })
          .finally(() => {
            submitLoading.value = false;
          });
      }
    }
  });
}

// 删除菜单
function handleDelete(menuId: number) {
  if (!menuId) {
    ElMessage.warning("请勾选删除项");
    return false;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      PermissionApi.deletePermission(menuId)
        .then(() => {
          ElMessage.success("删除成功");
          handleQuery();
        })
        .finally(() => {
          loading.value = false;
        });
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  menuFormRef.value.resetFields();
  menuFormRef.value.clearValidate();
  formData.value.id = undefined;
  formData.value = { ...initialMenuFormData.value };
}

onMounted(() => {
  handleQuery();
});
</script>
