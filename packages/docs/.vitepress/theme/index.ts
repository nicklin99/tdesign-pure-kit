import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import TDesign from "tdesign-vue-next"
import 'tdesign-vue-next/es/style/index.css';
import { TListTable, TContextProvider, TListField } from "tdesign-pure";
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import '@vitepress-code-preview/container/dist/style.css'
// 自定义css
import "./style.css"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(TDesign)
    useComponents(app, DemoPreview)
    app.component("TListTable", TListTable)
    app.component("TContextProvider", TContextProvider)
    app.component("TListField", TListField)
  }
} satisfies Theme