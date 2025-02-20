<script setup lang="ts">
import { reactive, watch } from "vue";

const paginationConfig = {
  pageSize: 5,
};
const query = reactive({
  keyword: "",
});
const pagination = reactive({
  current: 1,
});
const list = reactive({
  data: [
    { id: "deepseek-chat", object: "model", owned_by: "deepseek" },
    { id: "deepseek-reasoner", object: "model", owned_by: "deepseek" },
    { id: "hunyuan", object: "model", owned_by: "tencent" },
    { id: "tongyi", object: "model", owned_by: "aliyun" },
    { id: "gpt-4o-mini", object: "model", owned_by: "openai" },
  ],
  total: 5,
});
const load = () => {
  console.log("load.pagination", pagination, query);
};
const columns = [
  {
    colKey: "id",
    title: "id",
  },
  {
    colKey: "object",
    title: "类型",
  },
  {
    colKey: "owned_by",
    title: "所有者",
  },
];

watch(
  [pagination, query],
  () => {
    load();
  },
  {
    deep: true,
  }
);
</script>

<template>
  <TContextProvider :pagination="paginationConfig">
    分页参数: {{ pagination }} <br />
    查询参数: {{ query }} <br /><br />

    <h3>支持模型</h3>
    <p></p>
    <t-input v-model="query.keyword" />
    <TListTable
      rowKey="id"
      :data="list.data"
      :total="list.total"
      :pagination="pagination"
      :columns="columns"
    >
      <template #title="{ row }">
        <span>456</span>
      </template>
    </TListTable>
  </TContextProvider>
</template>
