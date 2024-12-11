import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import NProgress from "@/utils/nprogress";
import { getToken } from "@/utils/auth";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login"];
  // 外链路由，如果是外链则打开新页面
  const externalLink = ["/bigScreenBoard/index"];
  router.beforeEach(async (to, from, next) => {
    // console.log("beforeEach", to, from);
    NProgress.start();

    const isLogin = !!getToken(); // 判断是否登录
    if (isLogin) {
      if (to.path === "/login") {
        // 已登录，访问登录页，跳转到首页
        next({ path: "/" });
      } else {
        const permissionStore = usePermissionStore();
        // 判断路由是否加载过
        if (permissionStore.isRoutesLoaded) {
          if (to.matched.length === 0) {
            // 路由未匹配，跳转到404
            next("/404");
          } else {
            // 动态设置页面标题
            const title =
              (to.params.title as string) || (to.query.title as string);
            if (title) {
              to.meta.title = title;
            }
            // 如果是外链则打开新页面并跳转相应路由
            if (externalLink.includes(to.path)) {
              // 避免重复打开同一个外链
              if (from.path !== "/" && from.path !== to.path) {
                const fullPath = router.resolve(to).href;
                window.open(fullPath, "_blank");
                next(false);
              } else {
                next();
              }
            } else {
              next();
            }
            // next();
          }
        } else {
          try {
            // 生成动态路由
            const dynamicRoutes = await permissionStore.generateRoutes();
            dynamicRoutes.forEach((route: RouteRecordRaw) =>
              router.addRoute(route)
            );
            next({ ...to, replace: true }); // 添加动态路由后重新导航
          } catch (error) {
            console.error(error);
            // 路由加载失败，重置 token 并重定向到登录页
            await useUserStore().clearUserSession();
            redirectToLogin(to, next);
            NProgress.done();
          }
        }
      }
    } else {
      // 未登录，判断是否在白名单中
      if (whiteList.includes(to.path)) {
        next();
      } else {
        // 不在白名单，重定向到登录页
        redirectToLogin(to, next);
        NProgress.done(); // 关闭进度条
      }
    }
  });

  // 后置守卫，保证每次路由跳转结束时关闭进度条
  router.afterEach(() => {
    NProgress.done();
  });
}

/** 重定向到登录页 */
function redirectToLogin(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const params = new URLSearchParams(to.query as Record<string, string>);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/login?redirect=${encodeURIComponent(redirect)}`);
}

/**
 ** 判断是否有权限
 * @param value 权限值，可以是单个值或数组
 * @param type 权限类型，默认为按钮权限
 * @returns 是否有权限
 * */
export function hasAuth(
  value: string | string[],
  type: "button" | "role" = "button"
) {
  const { roles, perms } = useUserStore().userInfo;

  // 超级管理员 拥有所有权限
  if (type === "button" && roles.includes("ROOT")) {
    return true;
  }
  // 如果是按钮权限，判断是否有该权限
  // 如果是角色权限，判断是否有该角色
  const auths = type === "button" ? perms : roles;
  return typeof value === "string"
    ? auths.includes(value)
    : value.some((perm) => auths.includes(perm));
}
