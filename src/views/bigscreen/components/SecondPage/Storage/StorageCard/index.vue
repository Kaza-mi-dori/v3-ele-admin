<template>
  <div class="storage-card">
    <div class="card-header">
      <span>{{ title }}</span>
      <span class="status">*{{ status }}</span>
    </div>
    <div class="card-content">
      <div class="liquid-bar-container">
        <div class="liquid-bar">
          <div class="liquid-bar-left">
            <span>15.3m</span>
            <span>2.3m</span>
          </div>
          <div class="liquid-bar-right">
            <div
              class="__remaining-bar"
              :style="{
                height: `${100 - (heightPercentage || 0)}%`,
                background: `${(heightPercentage || 0) > 50 ? '#96C11F' : 'crimson'}`,
              }"
            />
          </div>
        </div>
      </div>
      <div class="bar-container">
        <div class="bar" :style="{ height: `${usagePercentage}%` }">
          <span class="percentage">{{ usagePercentage || 0 }}%</span>
        </div>
        <div
          class="remaining"
          :style="{ height: `${100 - (usagePercentage || 0)}%` }"
        />
      </div>
      <div class="details">
        <p>满载: {{ fullLoad }}m</p>
        <p>剩余: {{ remaining }}m</p>
        <p>体积: {{ volume }}m³</p>
        <p>实际: {{ actual }}m³</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  status: String,
  usagePercentage: Number,
  heightPercentage: Number,
  fullLoad: Number,
  remaining: Number,
  volume: Number,
  actual: Number,
});
</script>

<style scoped lang="scss">
.storage-card {
  // background: #1e2a44;
  border: 1px solid #1e3a8a;
  border-radius: 5px;
  padding: 20px 10px;
  min-width: 200px;
  // max-width: 300px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: center;
  font-size: 14px;
  color: #fff;
}

.card-content {
  @apply flex-grow-1 flex flex-gap-2 items-center justify-center;
}

.liquid-bar-container {
  @apply w-80px;
  height: 200px;
}

.liquid-bar {
  @apply w-full h-full flex;
  .liquid-bar-left {
    @apply w-10 h-full flex flex-col justify-between;
    float: left;
  }
  .liquid-bar-right {
    @apply h-full w-4;
    float: right;
    border: 1px solid #2a4066;
    border-radius: 5px;
    background: #0a1a3e;
    position: relative;
    .__remaining-bar {
      @apply w-[calc(100%-2px)] absolute bottom-0 left-1px;
      border-radius: 5px;
    }
  }
}

.bar-container {
  display: flex;
  gap: 10px;
  position: relative;
  width: 100%;
  max-width: 200px;
  height: 200px;
  background: #0a1a3e;
  border: 1px solid #2a4066;
}

.bar {
  background: #f4a261;
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 5px 5px;
  animation: bar-animation 1.5s ease-in-out;
  @keyframes bar-animation {
    0% {
      height: 0;
    }
    100% {
      height: 100%;
    }
  }
}

.remaining {
  background: #0a1a3e;
  width: 100%;
  position: absolute;
  border-radius: 5px 5px 0 0;
  top: 0;
}

.percentage {
  @apply text-6;
  color: black;
  font-weight: bold;
}

.details {
  @apply w-240px;
  font-size: 12px;
  color: #b0c4de;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .storage-card {
    width: 150px;
    height: 200px;
  }

  .bar-container {
    height: 120px;
  }

  .details {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .storage-card {
    width: 120px;
    height: 180px;
  }

  .bar-container {
    height: 100px;
  }

  .details {
    font-size: 9px;
  }
}
</style>
