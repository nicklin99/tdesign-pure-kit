<!-- 查看 -->
<template>
    <TUploader
        v-model="url"
        v-bind="args"
    />
</template>

<script setup lang="ts">
import { ref } from "vue"

const url = ref()
const args = {
    multiple: true,
    upload: (file, _ref) => {
      return Promise.reject("多图上传失败")
    }
  }
</script>