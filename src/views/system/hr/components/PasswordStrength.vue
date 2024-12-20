<!-- 密码强度提示器 -->
<template>
  <div>
    <el-input
      v-model="password"
      placeholder="请输入密码"
      clearable
      show-password
      @input="attrs.handleInput as Attrs['handleInput']"
      @blur="attrs.handleBlur as Attrs['handleBlur']"
    />
    <div class="password-strength">
      <div
        class="strength-item __weak"
        :class="{ active: passwordStrength >= 1 }"
      />
      <div
        class="strength-item __medium"
        :class="{ active: passwordStrength >= 2 }"
      />
      <div
        class="strength-item __strong"
        :class="{ active: passwordStrength >= 3 }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, useAttrs } from "vue";

const password = ref("");
const passwordStrength = ref(0);
// 规定attrs的类型:
// const attrs = useAttrs<{
//   handleInput: () => void;
//   handleBlur: () => void;
// }>();

interface Attrs {
  handleInput: () => void;
  handleBlur: () => void;
  [key: string]: any;
}

const attrs = useAttrs();

const handleInput = () => {
  passwordStrength.value = 0;
  if (password.value.length >= 6) {
    passwordStrength.value++;
  }
  if (password.value.length >= 10) {
    passwordStrength.value++;
  }
  if (password.value.length >= 14) {
    passwordStrength.value++;
  }
};

const handleBlur = () => {
  passwordStrength.value = 0;
};

watch(password, handleInput, { immediate: true });
</script>

<style lang="scss" scoped>
.password-strength {
  display: flex;
  .strength-item {
    width: 20px;
    height: 5px;
    background-color: #e0e0e0;
    margin-right: 5px;
    &.__weak.active {
      background-color: #ff4d4f;
    }
    &.__medium.active {
      background-color: #faad14;
    }
    &.__strong.active {
      background-color: #52c41a;
    }
  }
}
</style>
