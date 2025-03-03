<template>
  <div class="bumping-text-container">
    <span v-for="item in textList" :key="item" class="bumping-text-item">
      {{ item }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  text: string;
  lineHeight: number;
  spliter: string;
}>();

const activeIndex = ref(0);

const handleBumping = () => {
  activeIndex.value = (activeIndex.value + 1) % textList.value.length;
  // y方向偏移相应的高度
  const item = document.querySelector(".bumping-text-container") as HTMLElement;
  if (item) {
    item.style.transform = `translateY(-${activeIndex.value * (props.lineHeight + 16)}px)`;
  }
};

const textList = computed(() => {
  return props.text.split(props.spliter);
});

const timer = ref<NodeJS.Timeout | null>(null);

onMounted(() => {
  timer.value = setInterval(() => {
    handleBumping();
  }, 5000);
});

onUnmounted(() => {
  timer.value && clearInterval(timer.value);
});
</script>

<style scoped lang="scss">
.bumping-text-container {
  @apply w-full h-full text-center;
  transform: translateY(0);
  transition: transform 0.5s ease-in-out;
  .bumping-text-item {
    @apply flex items-center justify-center w-full h-full;
  }
}
</style>
