<script setup lang="ts">
import { reactive, ref, render, watch } from "vue";
import Search from "./Search.vue"
import { onRenderTracked, onRenderTriggered } from 'vue'
import { TListTable, TContextProvider } from "tdesign-pure";
import { useSearch } from "./useSearch"

const paginationConfig = {
  pageSize: 50,
};
const { query, search, submit } = useSearch({})
const pagination = reactive({
  current: 1,
});
const list = reactive({
  data: [{ title: "123" }],
  total: 0,
});
const load = () => {
  console.log("load.pagination", pagination);
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
  [pagination],
  () => {
    load();
  },
  {
    deep: true,
  }
);
onRenderTracked((e) => {
  // debugger
  console.log("render app Tracked", e)
})

onRenderTriggered((e) => {
  console.log("render app Triggered", e)
  // debugger
})

const renderSearch = ref(true)
</script>

<template>
  <input v-model="query.keyword" /> {{ query }} 
  <button @click="renderSearch = false">不显示搜索</button>
  <TContextProvider :pagination="paginationConfig">
    {{ pagination }}
    <Search v-if="renderSearch" :search="search" @submit="submit" />
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
