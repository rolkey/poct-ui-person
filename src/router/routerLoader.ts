// 加载菜单项用于当前应用的路由

// todo: 可以路由多个菜单目录，现在只能应用 fund
import { RouteRecordRaw } from "vue-router";
import router from "./";

// 定义路由元数据类型
interface RouteMeta {
  component: string;
  [key: string]: any;
}

// 定义路由项类型
interface RouteItem {
  name?: string;
  path: string;
  component?: any;
  children?: RouteItem[];
  meta?: RouteMeta;
  [key: string]: any;
}

const basePath = import.meta.env.VITE_BASE_PATH;
const modules = import.meta.glob("@/views/**/*.vue");
const msgBus = (): IMessageBus => (window as any).__QIANKUN_MSG_BUS__ as IMessageBus;

export const loadView = (view: string): (() => Promise<any>) | null => {
  msgBus().on("m_getModules" + basePath, () => msgBus().emit("c_getModules" + basePath, modules));
  let res: (() => Promise<any>) | undefined;
  // 加载外部模块
  if (!view) return null;

  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = () => modules[path]();
    } else if (dir === view + "/index") {
      res = () => modules[path]();
    }
  }
  //   console.log("查找 view", view, "res", res);

  return res || null;
};

// 加载当前应用路由
export function loadRouters(): void {
  // 加载静态路由
  msgBus()
    .usePermissionStore()
    .routes.forEach((element: RouteItem) => {
      if (element.path.startsWith(basePath)) {
        console.log("load [" + basePath + "] router:", element);
        element.children?.forEach((item: RouteItem) => {
          if (item.meta?.component) {
            item.component = loadView(item.meta?.component || "");
            item.path = "/" + item.path;
            router.addRoute(item as RouteRecordRaw);
          } else {
            console.log(basePath + " not found component:", item);
          }
        });
      }
    });
}
