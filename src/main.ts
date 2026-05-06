// import "virtual:uno.css";

import { createApp } from "vue";
import { renderWithQiankun, qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "uno.css";

// 注册插件
import plugins from "./plugins/index"; // plugins

import ElementPlus from "element-plus";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
// import "element-plus/theme-chalk/dark/css-vars.css";
import locale from "element-plus/es/locale/lang/zh-cn";
import "@/assets/styles/index.scss";

import { loadRouters } from "./router/routerLoader";
import { useServiceStore } from "./store/modules/services";

// 高亮组件
// import 'highlight.js/styles/a11y-light.css';
import "highlight.js/styles/atom-one-dark.css";
import "highlight.js/lib/common";
import HighLight from "@highlightjs/vue-plugin";

// svg图标
import "virtual:svg-icons-register";
import ElementIcons from "@/plugins/svgicon";

const appName = import.meta.env.VITE_BASE_PATH;
const microAppName = appName.substr(1);

// 国际化
import i18n from "@/lang/index";
import directive from "./directive";
import { useDict } from "./utils/dict";

let app: ReturnType<typeof createApp> | null = null;

const render = (container?: any) => {
  const appDom = container ? container.querySelector("#app") : "#app";
  app = createApp(App);

  app.config.globalProperties.msgBus = (window as any).__QIANKUN_MSG_BUS__;
  app.config.globalProperties.useDict = useDict;

  app.use(store);

  // TODO: 读取服务配置

  // 读取主应用路由
  loadRouters();
  app.use(ElementPlus, {
    locale: locale,
  });
  useServiceStore().init();
  app.use(HighLight);
  app.use(ElementIcons);

  app.use(router);
  app.use(i18n);
  app.use(plugins);
  directive(app);

  app.mount(appDom);
};

renderWithQiankun({
  bootstrap() {
    console.log(`[${microAppName}] bootstrap`);
  },
  mount(props: any) {
    console.log(`[${microAppName}] mount`, props);
    (window as any).__QIANKUN_MSG_BUS__ = props.msgBus;
    render(props.container);
  },
  unmount() {
    console.log(`[${microAppName}] unmount`);
    app?.unmount();
    app = null;
  },
  update(props: any) {
    console.log(`[${microAppName}] update`, props);
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  const redirect = encodeURIComponent(window.location.pathname + window.location.search);
  console.log("!qiankun", redirect);
  window.location.href = `/?redirect=${redirect}`;
}
