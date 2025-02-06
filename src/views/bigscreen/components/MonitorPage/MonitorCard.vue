<template>
  <video
    :id="`monitor-${props.blockId}`"
    ref="monitorRef"
    class="card-video"
    autoPlay
    muted
  />
</template>

<script setup lang="ts">
import Mpegts from "mpegts.js";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  // 编号，用于区分不同的监控区域
  blockId: {
    type: [String, Number],
    required: true,
  },
});
const monitorRef = ref<HTMLVideoElement | null>(null);

watch(
  () => props.url,
  (url: string) => {
    if (monitorRef.value) {
      monitorRef.value.src = url;
      monitorRef.value.play();
    } else {
      monitorRef.value = Mpegts.createPlayer(
        {
          type: "mse", // could also be mpegts, m2ts, flv
          isLive: true,
          hasAudio: false,
          cors: true,
          url: url,
        },
        {
          enableWorker: false, //启用分离的线程进行转换（如果不想看到控制台频繁报错把它设置为false，官方的回答是这个属性还不稳定，所以要测试实时视频流的话设置为true控制台经常报错）
          enableStashBuffer: false, //关闭IO隐藏缓冲区（如果需要最小延迟，则设置为false，此项设置针对直播视频流）
          stashInitialSize: 128, //减少首帧等待时长（针对实时视频流）
          lazyLoad: false, //关闭懒加载模式（针对实时视频流）
          lazyLoadMaxDuration: 0.2, //懒加载的最大时长。单位：秒。建议针对直播：调整为200毫秒
          deferLoadAfterSourceOpen: false, //在MediaSource sourceopen事件触发后加载。在Chrome上，在后台打开的标签页可能不会触发sourceopen事件，除非切换到该标签页。
          liveBufferLatencyChasing: true, //追踪内部缓冲区导致的实时流延迟
          liveBufferLatencyMaxLatency: 1.5, //HTMLMediaElement 中可接受的最大缓冲区延迟（以秒为单位）之前使用flv.js发现延时严重，还有延时累加的问题，而mpegts.js对此做了优化，不需要我们自己设置快进追帧了
          liveBufferLatencyMinRemain: 0.3, //HTMLMediaElement 中可接受的最小缓冲区延迟（以秒为单位）
        }
      );
      const element = document.getElementById(`monitor-${props.blockId}`);
      monitorRef.value.attachMediaElement(element);
      monitorRef.value.load();
      monitorRef.value.play().catch((e) => console.log(e));
      monitorRef.value.on(Mpegts.Events.LOADING_COMPLETE, () => {
        console.log("loading complete");
      });
      monitorRef.value.on(
        Mpegts.Events.ERROR,
        (errorType: any, errorDetail: any, errorInfo: any) => {
          console.log(
            "类型:" + JSON.stringify(errorType),
            "报错内容" + errorDetail,
            "报错信息" + errorInfo
          );
        }
      );
    }
  }
);
</script>

<style lang="scss" scoped>
.card-video {
  @apply border-1 w-full h-full object-cover;
  border-color: #e2e8f0;
}
</style>
