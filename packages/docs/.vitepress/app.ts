import { DefaultTheme, UserConfig } from "vitepress";

export default {
  lang: 'zh-CN',
  title: "tdesign-pure组件库",
  description: "扩展tdesign-vue-next使用起来更纯粹,方便业务开箱即用",
  themeConfig: {
    outline: "deep" as DefaultTheme.Outline,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'UI组件', link: '/components/table' }
    ],
    sidebarMenuLabel: '导航',
    outlineTitle: '页面导航',
    sidebar: [
      {
        text: 'UI组件',
        items: [
          { text: '全局配置组件', link: '/components/config' },
          { text: '表格', link: '/components/table' },
          { text: '列表', link: '/components/list' },
          { text: '弹窗', link: '/components/dialog' },
          { text: '文件', link: '/components/file' },
        ]
      },
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nicklin99/tdesign-pure-kit' }
    ],
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
} satisfies UserConfig<DefaultTheme.Config>;