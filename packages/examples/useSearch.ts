import { onUnmounted, ref, shallowRef, toRaw } from "vue";

export const useSearch = (initSearch = {}) => {
  onUnmounted(()=>{
    console.log("onUnmounted useSearch")
  })
  // 搜索参数
  const search = ref<any>(initSearch)
  // 查询参数
  const query = shallowRef({
    ...initSearch
  })
  return {
    search,
    query,
    submit() {
      query.value = {
        ...toRaw(search.value)
      }
    }
  };
}