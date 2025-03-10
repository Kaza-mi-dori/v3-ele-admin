<template>
  <div class="dashboard-header">
    <div class="stats-container">
      <div v-for="(stat, index) in stats" :key="index" class="stat-card">
        <img :src="stat.icon" alt="icon" class="stat-icon" />
        <div class="stat-content">
          <div>
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-unit">{{ stat.unit }}</span>
          </div>
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
    type: Array as PropType<
      { value: number; label: string; icon: string; unit: string }[]
    >,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.dashboard-header {
  @apply flex justify-evenly items-center text-white;
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
  @apply text-6 text-center mr-3;
  font-weight: bold;
  color: $bigscreen-primary-color-1;
}

.stat-unit {
  @apply text-5 font-bold;
  color: #fff;
}

.stat-label {
  @apply text-5 font-bold;
  color: #fff;
}
</style>
