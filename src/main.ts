import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";
import TlbsMap from "tlbs-map-vue";

// 本地SVG图标
import "virtual:svg-icons-register";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
import "animate.css";

const app = createApp(App);
// 注册插件
app.use(setupPlugins);
// 注册地图组件
app.use(TlbsMap);
app.mount("#app");
