<template>
  <div class="dashboard-header">
    <div class="stats-container">
      <div v-for="(stat, index) in stats" :key="index" class="stat-card">
        <img :src="stat.icon" alt="icon" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps({
  stats: {
    type: Array as PropType<{ value: number; label: string; icon: string }[]>,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.dashboard-header {
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-container {
  margin: 0 auto;
  display: flex;
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  // background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 5px;
}

.stat-icon {
  margin-right: 10px;
}

.stat-value {
  @apply text-7 text-center;
  font-weight: bold;
  color: $bigscreen-primary-color-1;
}

.stat-label {
  @apply text-5 font-bold;
  color: #fff;
}
</style>
