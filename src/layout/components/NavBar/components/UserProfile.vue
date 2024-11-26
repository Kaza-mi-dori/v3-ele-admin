<template>
  <div>
    <el-dropdown trigger="click">
      <div class="flex-center h100% p13px">
        <img
          :src="userStore.userInfo.avatar"
          class="rounded-full mr-10px w24px h24px"
        />
        <span>{{ userStore.userInfo.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleOpenUserProfile">
            {{ $t("navbar.profile") }}
          </el-dropdown-item>
          <el-dropdown-item divided @click="handleLoginDevEnv">
            登录开发后台
          </el-dropdown-item>
          <el-dropdown-item divided @click="logout">
            {{ $t("navbar.logout") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "UserProfile",
});

import { useTagsViewStore, useUserStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { AuthAPI_2, type LoginData_2 } from "@/api/auth";

const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

/**
 * 打开个人中心页面
 */
function handleOpenUserProfile() {
  router.push({ name: "Profile" });
}

/**
 * 注销登出
 */
function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}

/**
 * 登录开发后台
 */
function handleLoginDevEnv() {
  // window.open("http://localhost:7001/admin");
  dialogVisible.value = true;
}

const dialogVisible = ref(false);
const captcha = ref("");
const captchaLoading = ref(false);
const form: Ref<LoginData_2> = ref({
  username: "",
  password: "",
  captcha: "",
});
const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};
const getCaptcha = async () => {
  captchaLoading.value = true;
  try {
    if (!form.value.username) {
      return;
    }
    const captChaBase64 = await AuthAPI_2.getCaptCha(form.value.username);
    captcha.value = captChaBase64;
  } catch (error) {
    console.error(error);
  } finally {
    captchaLoading.value = false;
  }
};
const login = async () => {
  try {
    if (!form.value.username || !form.value.password || !form.value.captcha) {
      return;
    }
    const loginData = unref(form);
    const res = await AuthAPI_2.login(loginData);
    // console.log(res);
    dialogVisible.value = false;
    router.push("/dashboard");
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped></style>
