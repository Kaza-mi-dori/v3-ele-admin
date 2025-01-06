<template>
  <div ref="left54Ref" style="height: 320px" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { businessFormats } from "../../../constants";
import { ref, onMounted, shallowRef } from "vue";
import { useRouter } from "vue-router";
import {
  OurCompanyEnum,
  OurCompanyEnumMap,
  BusinessEnumMap,
  BusinessEnum,
} from "@/enums/BusinessEnum";
import { companyStoreHook } from "@/store/modules/company";

const companyStore = companyStoreHook();
const props = defineProps<{
  year: number;
}>();
const router = useRouter();
const left54Ref = ref<HTMLElement>();
const chartRef = shallowRef<echarts.ECharts>();
const data = ref<any[]>([
  { title: "贸易", value: 120, color: "#ea5a5a" },
  { title: "仓储", value: 70, color: "#d9c621" },
  { title: "油站运营", value: 50, color: "#1785d2" },
]);

// 点击回调
function onClickPie(params: any) {
  const { name } = params;
  if (!name) return;
  const format = businessFormats.find((item) => item.label === name);
  if (format) {
    const route = router.resolve({
      name: "BusinessType",
      params: {
        typeName: format.name,
      },
    });
    window.open(route.href, "_blank");
  }
}

// 初始化图表
function initChart() {
  // 饼图
  if (!chartRef.value) {
    chartRef.value = echarts.init(left54Ref.value as HTMLDivElement);
    // 增加点击回调
    chartRef.value.on("click", "series", onClickPie);
  }
  chartRef.value.clear();
  const option = {
    title: {
      text: `${props.year}年各业态利润`,
      left: "center",
      top: 20,
      textStyle: {
        color: "lightblue",
        fontSize: 16,
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 30,
      bottom: 30,
    },
    series: [
      {
        type: "pie",
        radius: "50%",
        avoidLabelOverlap: true,
        label: {
          show: true,
          textStyle: {
            fontSize: 14,
            color: "#fff",
          },
          edgeDistance: 10,
          lineHeight: 20,
          // 上面一行是标题+百分比，下一行是数值
          // {rich|{d}%}的意思是使用rich中的d字段，d字段是百分比, {c}是数值, {b}是标题, {a}是标题+百分比
          formatter: `{b}\n{d}%\n{c}万元`,
          rich: {
            a: {
              color: "#fff",
              fontSize: 12,
              lineHeight: 20,
              marginRight: 20,
            },
          },
        },
        labelLine: {
          show: true,
          length: 5,
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: "bold",
          },
        },
        data: data.value.map((item) => {
          return {
            value: item.value,
            name: item.title,
            itemStyle: {
              color: item.color, // 使用自定义颜色
            },
          };
        }),
      },
    ],
  };
  chartRef.value.setOption(option);
}

async function initData() {
  const res: any = await companyStore.getFirmReportMap(
    OurCompanyEnum.GTSHC,
    props.year.toString()
  );
  if (res) {
    // 抽取对应的贸易（六个业态加和）、仓储、油站运营
    const rows = res["内容"]?.["详情"] || [];
    const trade = rows
      .filter((item: any) =>
        Object.values(BusinessEnumMap).includes(item.业态类型)
      )
      .reduce(
        (sum: number, item: any) => sum + parseFloat(item.累计利润金额),
        0
      );
    const storage = rows.find((item: any) => item.业态类型 === BusinessEnum.CC);
    const oilStation = rows.find(
      (item: any) => item.业态类型 === BusinessEnum.YZ
    );
    data.value = [
      { title: "贸易", value: trade ?? 0, color: "#ea5a5a" },
      { title: "仓储", value: storage?.累计利润金额 ?? 0, color: "#d9c621" },
      {
        title: "油站运营",
        value: oilStation?.累计利润金额 ?? 0,
        color: "#1785d2",
      },
    ];
  } else {
    data.value = [
      { title: "贸易", value: 0, color: "#ea5a5a" },
      { title: "仓储", value: 0, color: "#d9c621" },
      { title: "油站运营", value: 0, color: "#1785d2" },
    ];
  }
}

// 监听年份变化，重新初始化图表
watch(
  () => props.year,
  async () => {
    // await initData();
    initChart();
  }
);

onMounted(async () => {
  // await initData();
  initChart();
  // 监听窗口变化，重置图表
  window.addEventListener("resize", () => {
    try {
      chartRef.value?.resize();
    } catch (e) {
      console.log(e);
    }
  });
});
</script>
