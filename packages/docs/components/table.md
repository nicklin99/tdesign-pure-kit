# 表格 Table

1. 省略重复的分页,页码数切换处理
2. 默认禁用本地分页
3. 全部配置页码数

## 示例

### 基础表格

主要功能包括：
- 使用响应式数据定义分页配置、查询参数、分页状态和列表数据。
- 定义加载数据的函数 `load`，当分页或查询参数变化时触发。
- 定义表格列的配置，其中标题列使用了作用域插槽来自定义显示内容。
- 使用 `watch` 监听分页和查询参数的变化，以调用加载数据的函数。
- 在模板中使用 `TContextProvider` 提供分页配置，展示分页和查询参数，并包含输入框和表格组件。

:::demo src=demo/table.vue:::

### 本地分页

:::demo src=demo/local-table.vue:::

## TListTable API

<!--@include: @/../md/Table/Table.md-->

<!--@include: @/../md/table.md-->

更多`table`组件用法,具体可参考[tdesign-vue-next](https://tdesign.tencent.com/vue-next/components/table)

