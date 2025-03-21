### 属性 
| 名称 | 类型 | 必填 | 默认值 | 描述 |
|------|------|----------|---------|-------------|
| max | number  | No | 0 | 最多个数 |
| multiple | boolean  | No |  | 是否支持多选 |
| theme | ThemeList | No | "image" as ThemeList | image 图片模式 |
| tips | string  | No | "" | 提示文字 |
| accept | string  | No |  | 文件类型  image/* 图片 video/* 视频, 更多常见类型 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/MIME_types/Common_types |
| upload | Function | Yes |  | 上传处理函数 `(file: UploadFile, _ref: typeof uploadRef) => Promise<{ url: string }>` |
| sizeLimit | string  | No | "" | 大小限制 |
| drag | boolean  | No | false | 是否开启拖拽 |
| placeholder | string  | No |  | 占位符 |
| locale | UploadConfig  | No |  | 国际化文本 |
| disabled | boolean  | No |  | 是否禁用 |
| classPrefix | string  | No | "t" | 自定义 class 前缀 |
| modelValue | string \| string[]  | No |  | v-model 初始化的文件url, 单文件上传字符串,多个用字符串数组 |