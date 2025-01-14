import type { App } from "vue";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true, // 固定标签
          keepAlive: true,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心", icon: "user", hidden: true },
      },
      {
        path: "myNotice",
        name: "MyNotice",
        component: () =>
          import("@/views/system/notice/components/MyNotice.vue"),
        meta: { title: "我的通知", icon: "user", hidden: true },
      },
    ],
  },
  /**
   * 此路由可能直接由能源一体化跳转故用独立路由守卫
   * 仍然需要鉴权，先查看有无token, 没有的话查看是否有code
   */
  {
    path: "/bigScreenBoard",
    name: "BigScreenBoardNav",
    component: () => import("@/views/bigscreen/index.vue"),
    meta: {
      title: "数据大屏",
      icon: "fullscreen",
      // hidden: true,
    },
    redirect: "/bigScreenBoard/index",
    children: [
      {
        path: "index",
        name: "BigScreenBoard",
        component: () => import("@/views/bigscreen/index.vue"),
        meta: {
          title: "大屏看板(数据大屏首页)",
          icon: "el-icon-monitor",
          hidden: true,
        },
      },
      {
        // path: "business/:businessName",
        path: "business",
        name: "Business",
        meta: {
          hidden: true,
        },
        component: () =>
          import("@/views/bigscreen/components/SecondPage/second-index.vue"),
        children: [
          {
            path: "cpy",
            name: "Cpy",
            component: () =>
              import(
                "@/views/bigscreen/components/SecondPage/Products/cpy.vue"
              ),
          },
          {
            path: "yy",
            name: "Yy",
            component: () =>
              import("@/views/bigscreen/components/SecondPage/Products/yy.vue"),
          },
          {
            path: "mt",
            name: "Mt",
            component: () =>
              import("@/views/bigscreen/components/SecondPage/Products/mt.vue"),
          },
          {
            path: "rly",
            name: "Rly",
            component: () =>
              import(
                "@/views/bigscreen/components/SecondPage/Products/rly.vue"
              ),
          },
          {
            path: "lng",
            name: "Lng",
            component: () =>
              import(
                "@/views/bigscreen/components/SecondPage/Products/lng.vue"
              ),
          },
          {
            path: "hgcp",
            name: "Hgcp",
            component: () =>
              import(
                "@/views/bigscreen/components/SecondPage/Products/hgcp.vue"
              ),
          },
        ],
      },
      {
        path: "subject",
        name: "SubjectSubsidiary",
        meta: {
          hidden: true,
        },
        component: () =>
          import("@/views/bigscreen/components/SecondPage/subject-index.vue"),
        children: [
          {
            path: "yscc",
            name: "Yscc",
            component: () =>
              import(
                "@/views/bigscreen/components/SecondPage/Subjects/yscc.vue"
              ),
          },
          {
            path: "gtsh",
            name: "Gtsh",
            component: () =>
              import(
                "@/views/bigscreen/components/SecondPage/Subjects/gtsh.vue"
              ),
          },
          {
            path: "gtshzs",
            name: "Gtshzs",
            component: () =>
              import(
                "@/views/bigscreen/components/SecondPage/Subjects/gtshzs.vue"
              ),
          },
          {
            path: "gtshgd",
            name: "Gtshgd",
            component: () =>
              import(
                "@/views/bigscreen/components/SecondPage/Subjects/gtshgd.vue"
              ),
          },
        ],
      },
      {
        path: "businessType/:typeName",
        name: "BusinessType",
        meta: {
          hidden: true,
        },
        component: () =>
          import(
            "@/views/bigscreen/components/SecondPage/businesstype-index.vue"
          ),
      },
      {
        path: "thirdPage",
        name: "ThirdPage",
        meta: {
          hidden: true,
        },
        component: () =>
          import("@/views/bigscreen/components/ThirdPage/third-index.vue"),
        children: [
          {
            name: "ContractList",
            path: "contractList",
            component: () =>
              import(
                "@/views/bigscreen/components/ThirdPage/Components/contract.vue"
              ),
          },
          // 营收分析
          {
            name: "RevenueAnalysis",
            path: "revenueAnalysis",
            component: () =>
              import(
                "@/views/bigscreen/components/ThirdPage/Components/revenue.vue"
              ),
          },
          // 利润分析
          {
            name: "ProfitAnalysis",
            path: "profitAnalysis",
            component: () =>
              import(
                "@/views/bigscreen/components/ThirdPage/Components/profit.vue"
              ),
          },
        ],
      },
    ],
  },
  // {
  //   path: "/business/:businessName",
  //   name: "Business",
  //   meta: {
  //     hidden: true,
  //   },
  //   component: () =>
  //     import("@/views/bigscreen/components/SecondPage/second-index.vue"),
  // },
  // 监控页独立放，避免被缩放影响
  {
    path: "/monitor",
    name: "Monitor",
    meta: {
      title: "监控平台",
      icon: "el-icon-monitor",
    },
    component: () =>
      import("@/views/bigscreen/components/MonitorPage/index.vue"),
  },
  // 数据看板
  {
    path: "/dataBoard",
    name: "DataBoard",
    component: Layout,
    meta: {
      title: "指标管理",
      icon: "dict",
    },
    redirect: "/marketData",
    children: [
      {
        path: "marketData",
        name: "MarketData",
        component: () => import("@/views/databoard/index.vue"),
        meta: {
          title: "指标管理",
          icon: "monitor",
        },
      },
      {
        path: "customDataBoard",
        name: "CustomDataBoard",
        component: () => import("@/views/databoard/customDataboard.vue"),
        meta: {
          title: "自定义查询",
          icon: "monitor",
        },
      },
    ],
  },
  {
    path: "/reportMng",
    name: "ReportMng",
    component: Layout,
    meta: {
      title: "报表管理",
      icon: "el-icon-MessageBox",
    },
    children: [
      {
        path: "firmMngReportMng",
        name: "FirmMngReportMng",
        component: () => import("@/views/datareport/firmMngReport/index.vue"),
        meta: {
          title: "企业经营报表管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "yearlyReportMng",
        name: "YearlyReportMng",
        component: () => import("@/views/datareport/yearlyReport/index.vue"),
        meta: {
          title: "业态经营报表管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "yearlyPlanReportMng",
        name: "YearlyPlanReportMng",
        component: () =>
          import("@/views/datareport/yearlyPlanReport/index.vue"),
        meta: {
          title: "年度计划报表管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "marketPriceReportMng",
        name: "MarketPriceReportMng",
        component: () =>
          import("@/views/datareport/marketPriceReport/index.vue"),
        meta: {
          title: "市场价格报表管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "partnerReportMng",
        name: "PartnerReportMng",
        component: () => import("@/views/datareport/partnerReport/index.vue"),
        meta: {
          title: "合作伙伴报表管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "firmReportMng",
        name: "FirmReportMng",
        component: () => import("@/views/datareport/firmReport/index.vue"),
        meta: {
          title: "企业概况报表管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "purchaseDetailReportMng",
        name: "PurchaseDetailReportMng",
        component: () =>
          import("@/views/datareport/purchaseDetailReport/index.vue"),
        meta: {
          title: "采购明细报表管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "sellDetailReportMng",
        name: "SellDetailReportMng",
        component: () =>
          import("@/views/datareport/sellDetailReport/index.vue"),
        meta: {
          title: "销售明细报表管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "bargainReportMng",
        name: "BargainReportMng",
        component: () => import("@/views/datareport/bargainReport/index.vue"),
        meta: {
          title: "贸易板块跟踪表",
          icon: "el-icon-coin",
        },
      },
      {
        path: "fixedCostReportMng",
        name: "FixedCostReportMng",
        component: () => import("@/views/datareport/fixedCostReport/index.vue"),
        meta: {
          title: "固定成本月表",
          icon: "el-icon-coin",
        },
      },
    ],
  },
  // 台账类
  {
    path: "/ledgerMng",
    name: "LedgerMng",
    component: Layout,
    meta: {
      title: "台账管理",
      icon: "document",
    },
    children: [
      {
        path: "contractLedgerMng",
        name: "ContractLedgerMng",
        component: () => import("@/views/business/contract.vue"),
        meta: {
          title: "合同台账管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "goodsLedgerMng",
        name: "GoodsLedgerMng",
        component: () => import("@/views/business/goods.vue"),
        meta: {
          title: "产品台账管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "storageLedgerMng",
        name: "StorageLedgerMng",
        component: () => import("@/views/business/storage.vue"),
        meta: {
          title: "库存台账管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "orderLedgerMng",
        name: "OrderLedgerMng",
        component: () => import("@/views/business/order.vue"),
        meta: {
          title: "订单台账管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "paymentLedgerMng",
        name: "PaymentLedgerMng",
        component: () => import("@/views/business/payment.vue"),
        meta: {
          title: "款项台账管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "settlementLedgerMng",
        name: "SettlementLedgerMng",
        component: () => import("@/views/business/settlement.vue"),
        meta: {
          title: "结算台账管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "purchaseDetailLedgerMng",
        name: "PurchaseDetailLedgerMng",
        component: () => import("@/views/business/purchaseRecord.vue"),
        meta: {
          title: "采购业务台账",
          icon: "el-icon-coin",
        },
      },
      {
        path: "sellRecordLedgerMng",
        name: "SellRecordLedgerMng",
        component: () => import("@/views/business/sellRecord.vue"),
        meta: {
          title: "销售业务台账",
          icon: "el-icon-coin",
        },
      },
      {
        path: "partnerLedgerMng",
        name: "PartnerLedgerMng",
        component: () => import("@/views/business/partner.vue"),
        meta: {
          title: "客商台账管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "safetyLedgerMng",
        name: "SafetyLedgerMng",
        component: () => import("@/views/safety/index.vue"),
        meta: {
          title: "安全台账管理",
          icon: "el-icon-coin",
        },
      },
    ],
  },
  // 数据源管理
  {
    path: "/dataSourceMng",
    name: "DataSourceMng",
    component: Layout,
    meta: {
      title: "采集数据管理",
      icon: "el-icon-s-data",
    },
    children: [
      {
        path: "dataSource",
        name: "DataSource",
        component: () => import("@/views/datasource/ysOilStorage/index.vue"),
        meta: {
          title: "永盛油库库存",
          icon: "el-icon-coin",
        },
      },
    ],
  },
  // 开发环境后端登录页
  {
    path: "/devLogin",
    component: () => import("@/views/login/loginDev.vue"),
    meta: { hidden: true },
  },
  // 综合管理2
  {
    path: "/otherMng",
    name: "OtherMng",
    component: Layout,
    meta: {
      title: "综合管理",
      icon: "setting",
    },
    redirect: "/otherMng/mapElementMng",
    children: [
      {
        path: "/sysMng/partnerMng",
        name: "PartnerMng",
        component: () => import("@/views/partner/index.vue"),
        meta: {
          title: "客商管理",
          icon: "role",
        },
      },
      {
        path: "/sysMng/employeesMng",
        name: "EmployeesMng",
        component: () => import("@/views/system/hr/employee.vue"),
        meta: {
          title: "员工花名册",
          icon: "role",
        },
      },
      {
        path: "/sysMng/orgsMng",
        name: "OrgsMng",
        component: () => import("@/views/system/hr/org.vue"),
        meta: {
          title: "组织架构管理 ",
          icon: "role",
        },
      },
      {
        path: "/sysMng/partnerDetail",
        name: "PartnerDetail",
        component: () => import("@/views/partner/detail.vue"),
        meta: {
          title: "客商详情",
          icon: "el-icon-menu",
          hidden: true,
        },
      },
      {
        path: "dataDefinitionMng",
        name: "DataDefinitionMng",
        component: () => import("@/views/otherConfig/dataDefinitionMng.vue"),
        meta: {
          title: "数据定义管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "mapElementMng",
        name: "MapElementMng",
        component: () => import("@/views/otherConfig/gsLocationMng.vue"),
        meta: {
          title: "地图元素管理",
          icon: "el-icon-coin",
        },
      },
      {
        path: "/sysMng/gsLocationConfig",
        name: "GsLocationConfig",
        component: () => import("@/views/otherConfig/gsLocationConfig.vue"),
        meta: {
          title: "地图配置",
          icon: "el-icon-monitor",
        },
      },
    ],
  },
  // 开发环境系统管理
  {
    path: "/devSystemMng",
    component: Layout,
    meta: {
      title: "系统管理",
      icon: "setting",
    },
    children: [
      {
        path: "userMng",
        name: "UserMngDev",
        component: () => import("@/views/system/user/index2.vue"),
        meta: {
          title: "用户管理",
          icon: "user",
        },
      },
      {
        path: "deptMng",
        name: "DeptMngDev",
        component: () => import("@/views/system/dept/index2.vue"),
        meta: {
          title: "部门管理",
          icon: "tree",
        },
      },
      {
        path: "roleMng",
        name: "RoleMngDev",
        component: () => import("@/views/system/role/index2.vue"),
        meta: {
          title: "角色管理",
          icon: "role",
        },
      },
      {
        path: "permissionMng",
        name: "PermissionMngDev",
        component: () => import("@/views/system/permission/index.vue"),
        meta: {
          title: "权限管理",
          icon: "document",
        },
      },
      {
        path: "logMng",
        name: "LogMngDev",
        component: () => import("@/views/system/log/index2.vue"),
        meta: {
          title: "操作日志",
          icon: "document",
        },
      },
      {
        path: "dictMng",
        name: "DictMngDev",
        component: () => import("@/views/system/dictdev/index.vue"),
        meta: {
          title: "字典管理",
          icon: "document",
        },
      },
      {
        path: "processMng",
        name: "ProcessMngDev",
        component: () => import("@/views/system/process/index.vue"),
        meta: {
          title: "流程管理",
          icon: "document",
        },
      },
      // todo 维护导入导出功能
    ],
  },
  {
    path: "/customComponent",
    name: "CustomComponent",
    component: Layout,
    meta: {
      title: "开发测试用",
      icon: "component",
    },
    children: [
      {
        path: "index",
        name: "CustomComponentIndex",
        component: () => import("@/components/CustomComponent/index.vue"),
        meta: {
          title: "自定义组件预览",
          icon: "el-icon-coin",
        },
      },
    ],
  },
  // 系统管理(旧)
  {
    path: "/system",
    name: "System",
    component: Layout,
    meta: {
      title: "系统管理",
      icon: "setting",
      hidden: true,
    },
    children: [
      {
        path: "user",
        name: "User",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          title: "用户管理",
          icon: "user",
        },
      },
      {
        path: "dept",
        name: "Dept",
        component: () => import("@/views/system/dept/index.vue"),
        meta: {
          title: "部门管理",
          icon: "tree",
        },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          title: "角色管理",
          icon: "role",
        },
      },
      {
        path: "menu",
        name: "Menu",
        component: () => import("@/views/system/menu/index.vue"),
        meta: {
          title: "菜单管理",
          icon: "menu",
        },
      },
    ],
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
