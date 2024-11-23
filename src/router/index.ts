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
  {
    path: "/customComponent",
    name: "CustomComponent",
    component: Layout,
    meta: {
      title: "自定义组件",
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
  {
    path: "/reportMng",
    name: "ReportMng",
    component: Layout,
    meta: {
      title: "报表管理",
      icon: "report",
    },
    children: [
      {
        path: "yearlyReportMng",
        name: "YearlyReportMng",
        component: () => import("@/views/datareport/yearlyReport/index.vue"),
        meta: {
          title: "业态经营报表管理",
          icon: "el-icon-coin",
        },
      },
    ],
  },
  /**
   * 此路由可能直接由能源一体化跳转故用独立路由守卫
   * 仍然需要鉴权，先查看有无token, 没有的话查看是否有code
   */
  {
    path: "/bigScreenBoard",
    component: () => import("@/views/bigscreen/index.vue"),
    beforeEnter: (to, from, next) => {
      next();
    },
  },
  // 开发环境后端登录页
  {
    path: "/devLogin",
    component: () => import("@/views/login/loginDev.vue"),
    meta: { hidden: true },
  },
  // 开发环境系统管理
  {
    path: "/devSystemMng",
    component: Layout,
    meta: {
      title: "系统管理2",
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
        path: "logMng",
        name: "LogMngDev",
        component: () => import("@/views/system/log/index2.vue"),
        meta: {
          title: "操作日志",
          icon: "document",
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
