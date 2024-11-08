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
  // {
  //   path: "/datasource",
  //   name: "DataSource",
  //   component: Layout,
  //   redirect: "/list",
  //   meta: {
  //     title: "数据源管理",
  //     icon: "hdd",
  //   },
  //   children: [
  //     {
  //       path: "list",
  //       name: "DataSourceList",
  //       component: () => import("@/views/datasource/index.vue"),
  //       meta: { title: "数据源列表" },
  //     },
  //   ],
  // },
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
