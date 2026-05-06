import { defineConfig, loadEnv } from "vite";
import path from "path";
import createPlugins from "./vite/plugins";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const plugins = createPlugins({ VITE_BASE_PATH: env.VITE_BASE_PATH }, true);

  return {
    base: env.VITE_BASE_PATH,
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: Number(env.VITE_BASE_PORT),
      host: "0.0.0.0",
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    // 添加 build 配置，关闭生产环境的 source map 生成（如果不需要）
    build: {
      sourcemap: false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  };
});
