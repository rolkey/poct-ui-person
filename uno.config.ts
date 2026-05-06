// import { defineConfig, presetUno } from "unocss";
import { defineConfig } from "unocss";

export default defineConfig({
  //   presets: [
  //     presetUno(), // 必须包含这个预设才能使用工具类
  //   ],
  // 指定扫描哪些文件
  content: {
    filesystem: ["src/**/*.{vue,js,ts,jsx,tsx,html}"],
  },
});
