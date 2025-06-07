<template>
  <Model1 class="model1" title="监控视频">
    <div class="flex justify-between items-center mb-2 mr-2 pl-5">
      <el-select
        v-model="monitorArea"
        class="monitor-selector"
        style="width: 200px"
        placeholder="所有监控"
        @change="onChangeMonitorArea"
      >
        <!-- <el-option
          v-for="item in monitorList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        /> -->
        <el-option-group
          v-for="item in monitorOptions"
          :key="item.label"
          :label="item.label"
        >
          <el-option
            v-for="option in item.options"
            :key="option.id"
            :label="option.label"
            :value="option.value"
          />
        </el-option-group>
      </el-select>
      <a class="text-sm link" @click="onCheckMore">更多>></a>
    </div>
    <div class="box1">
      <div v-for="k in 4" :key="k" class="item-box">
        <video
          :id="`monitor${k}`"
          :ref="`videoRef${k}`"
          :key="`monitor${k}`"
          class="video"
          preload="metadata"
          autoPlay
          muted
        />
      </div>
    </div>
  </Model1>
</template>

<script setup lang="ts">
import Item1 from "../DescribeItems/Item1.vue";
import inventory from "@/views/bigscreen/img/inventory.png";
import business from "@/views/bigscreen/img/business.png";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { MapElementEnumMap, MapElementEnum } from "@/enums/BusinessEnum";
import { GsLocationAPI } from "@/api/config/gsLocation";
import {
  getDeviceList,
  getCameraList,
  getMonitorUrl,
} from "@/api/thirdSystem/ysy";
import mpegts from "mpegts.js";

const props = defineProps({
  // 受控属性，如果传入则改变一次
  monitorAreaProp: {
    type: String,
    default: "1",
  },
});

// 视频播放器
const videoRef1 = ref();
const videoRef2 = ref();
const videoRef3 = ref();
const videoRef4 = ref();

const accessToken =
  "at.2centvrl9i8bcfxibpl6khrg4jyf13gm-70alaxlc3g-1a1aug0-sf3tcfo5n";

const oilStorage = ref<string>("254,38");
const oilBargain = ref<string>("254,38");
const monitorArea = ref<string>();
const monitorOptions = ref<any[]>();
const monitorList = ref<any[]>([
  {
    // url: `/monitor-api/playback?dev=G00079959&serial=G00079959&chn=1&str…n=100&begin=20250605T000000Z&end=20250605T235959Z`,
    // flv
    url: `/monitor-api/v3/openlive/G00079959_1_2.flv?expire=1749198415&id=850772689205014528&t=94b1d1033e6aa8badbf2eec430a74bb70a6201cb5311653f3214186286de7893&ev=100&supportH265=1`,
    // hls
    // url: `/video-api/v3/openlive/G00079959_1_2.m3u8?expire=1749197832&id=850770242001457152&t=0b130e4a1cfaceebc7dbbd91b8e444a94fd04c4c68ea8a7d9cf80c9652986b23&ev=100`,
  },
  {
    url: `/monitor-api/v3/openlive/C71393315_2_2.flv?expire=1749199160&id=850775814768168960&t=7f86e5c5bb3e50e045fcb47bf0287848b507ee7d2cb25db270524c5b14f7eeef&ev=100&supportH265=1`,
  },
  {
    url: `/monitor-api/v3/openlive/C71393315_3_2.flv?expire=1749199211&id=850776028614250496&t=b92a7fa21c52cd47f8573504b0db6a551d1bce0bca4b3963602ddafe5ff2b669&ev=100&supportH265=1`,
  },
  {
    url: `/monitor-api/v3/openlive/C71393315_6_2.flv?expire=1749199358&id=850776641746165760&t=065debd4ccd05e3d987d6aeba78b0f75f5aef6885b121476e548ef957de5346a&ev=100&supportH265=1`,
  },
]);
const router = useRouter();
const onCheckMore = async () => {
  const route = router.resolve({
    name: "Monitor",
  });
  window.open(route.href, "_blank");
};

watch(
  () => props.monitorAreaProp,
  (newVal) => {
    monitorArea.value = newVal;
  }
);

function onChangeMonitorArea(val: string) {
  // TODO 根据监控区域获取监控视频
}
const getGsLocation = async () => {
  const res: any = await GsLocationAPI.getAllMapElement();
  const list = res["当前记录"];
  // TODO 判断是否有监控视频
  // list = list.filter((item: any) => item.类型 === MapElementEnum.监控);
  // monitorList.value = list.map((item: any) => {
  //   return {
  //     id: item.id,
  //     name: item.名称,
  //     type: item.类型,
  //   };
  // });
  // 按照类型分组
  const groupByType = list.reduce((acc: any, item: any) => {
    acc[item.类型] = acc[item.类型] || [];
    acc[item.类型].push({
      id: item.id,
      name: item.名称,
      type: item.类型,
    });
    return acc;
  }, {});
  // Object.keys(groupByType).forEach((key) => {
  //   monitorList.value.push({
  //     label: key,
  //     options: groupByType[key],
  //   });
  // });
  // monitorList.value = monitorList.value.filter(
  //   (item) => !(item.label === "组织机构" || item.label === "运油船")
  // );
};

const initVideoChannel = () => {
  // 取4个
  const videoRefs = [videoRef1];
  videoRefs.forEach((ref, index) => {
    if (ref.value) {
      const player = mpegts.createPlayer(
        {
          type: "mse",
          // type: "application/x-mpegURL",
          isLive: true,
          hasAudio: false,
          cors: true,
          url: monitorList.value[index].url,
        },
        {
          liveBufferLatencyChasing: true,
          enableWorker: false, //启用分离的线程进行转换（如果不想看到控制台频繁报错把它设置为false，官方的回答是这个属性还不稳定，所以要测试实时视频流的话设置为true控制台经常报错）
          enableStashBuffer: false, //关闭IO隐藏缓冲区（如果需要最小延迟，则设置为false，此项设置针对直播视频流）
          stashInitialSize: 128, //减少首帧等待时长（针对实时视频流）
          lazyLoad: false, //关闭懒加载模式（针对实时视频流）
          lazyLoadMaxDuration: 0.2, //懒加载的最大时长。单位：秒。建议针对直播：调整为200毫秒
          deferLoadAfterSourceOpen: false, //在MediaSource sourceopen事件触发后加载。在Chrome上，在后台打开的标签页可能不会触发sourceopen事件，除非切换到该标签页。实时流延迟
          liveBufferLatencyMaxLatency: 1.5, //HTMLMediaElement 中可接受的最大缓冲区延迟（以秒为单位）之前使用flv.js发现延时严重，还有延时累加的问题，而mpegts.js对此做了优化，不需要我们自己设置快进追帧了
          liveBufferLatencyMinRemain: 0.3, //HTMLMediaElement 中可接受的最小缓冲区延迟（以秒为单位）
        }
      );
      player.attachMediaElement(ref.value[0]);
      player.load();
      player.play();
    }
  });
};

onMounted(async () => {
  getGsLocation();
  const { data: deviceList } = await getDeviceList();
  const { data: cameraList } = await getCameraList();
  if (deviceList && deviceList.length > 0) {
    monitorOptions.value = deviceList.map((device: any) => {
      return {
        label: device.deviceName,
        options: cameraList
          .filter((item: any) => {
            return item.deviceSerial === device.deviceSerial;
          })
          .map((item: any) => {
            return {
              id: item.channelName,
              label: item.channelName,
              value: item.channelNo,
            };
          }),
      };
    });
    const device = deviceList[0];
    const list = cameraList.filter((item: any) => {
      return item.deviceSerial === device.deviceSerial;
    });
    for (let i = 0; i < 4; i++) {
      const camera = list[i];
      const res = await getMonitorUrl(device.deviceSerial, camera.channelNo);
      // console.log("res==", res);
      monitorList.value[i].url = res.data.url.replace(
        "https://rtmp01open.ys7.com:9188",
        "/monitor-api"
      );
      // setTimeout(() => {
      //   ElMessage.info(monitorList.value[i].url);
      // }, 0);
    }
    nextTick(() => {
      initVideoChannel();
    });
  }
});
</script>

<style lang="scss" scoped>
.box1 {
  // 四宫格布局
  @apply flex items-center w-full flex-wrap pl-4 pr-4 pt-2;
  .item-box {
    width: calc(50% - 10px);
    margin: 5px;
    height: 100px;
    border: 1px solid #ccc;
  }
}

.link {
  color: $bigscreen-primary-color-1;
  &:hover {
    text-decoration: underline;
  }
}

.model1 {
  @apply flex flex-1 flex-col h-full;
}

:deep(.monitor-selector) {
  .el-select__wrapper {
    // border: 1px solid #fff;
    @apply bg-transparent;
    box-shadow: 0 0 0 1px $bigscreen-primary-color-1;
    .el-select__selected-item.el-select__placeholder {
      // color: $bigscreen-primary-color-1;
      color: #fff;
    }
  }
}

.video {
  object-fit: fill;
  width: calc(100%);
  // height: calc(100% - 50px);
  height: calc(100%);
}
</style>
