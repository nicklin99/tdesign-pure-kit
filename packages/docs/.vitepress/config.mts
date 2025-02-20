import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'
import { viteDemoPreviewPlugin } from '@vitepress-code-preview/plugin'
import app from './app'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  vite: {
    // 该插件使用会导致原vitepress的vue组件带@click发生解析错误
    // v-on:click 可以临时解决
    // 外层套个div也可以临时解决
    plugins: [viteDemoPreviewPlugin()],
  },
  markdown: {
    config(md) {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    },
  },
  ...app
})
