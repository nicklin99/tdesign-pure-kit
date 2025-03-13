<template>
  <br />
   搜索条件参数: {{ querys }} <br />
  <t-input v-model="search.keyword" /><button @click="emits('submit')">搜索</button>
</template>

<script setup lang="ts">
import { getCurrentScope, onScopeDispose, ref } from "vue";
import { Input as TInput } from "tdesign-vue-next";
import { onRenderTracked, onRenderTriggered } from 'vue'

type Props = {
  search: { keyword?: string }
}
const props = defineProps<Props>();

const querys = ref(props.search);
const emits = defineEmits(['submit'])

onRenderTracked((e) => {
  // debugger
  console.log("render search Tracked", e)
})

onRenderTriggered((e) => {
  console.log("render search Triggered", e)
  // debugger
})
console.log("search.vue scope", getCurrentScope())

onScopeDispose(() => {
  console.log("search.vue scope dispose")
})
</script>