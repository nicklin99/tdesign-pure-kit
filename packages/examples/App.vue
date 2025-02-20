<script setup lang="ts">
import { reactive, watch } from "vue";

import { Input as TInput } from "tdesign-vue-next";
import { TListTable, TContextProvider } from "tdesign-pure";
const paginationConfig = {
  pageSize: 50,
};
const query = reactive({
  keyword: "",
});
const pagination = reactive({
  current: 1,
});
const list = reactive({
  data: [{ title: "123" }],
  total: 0,
});
const load = () => {
  console.log("load.pagination", pagination, query);
};
const columns = [
  {
    colKey: "title",
    title: "标题",
    // cell: (h, { row }) => {
    //   return h("div", row.title + ':title');
    // },
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
    {{ pagination }}
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
