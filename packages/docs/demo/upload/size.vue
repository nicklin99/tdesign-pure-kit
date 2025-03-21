<!-- 大小限制 -->
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
    max: 3,
    upload: (file, _ref) => {
      // 模拟上传处理
      return new Promise((resolve) => {
        let i = 0
        const t = setInterval(() => {
          file.percent = i * 20;
          // 更新进度, file.percent 不能触发更新
          _ref.value!.uploadFilePercent({ file, percent: file.percent });
          if (i++ >= 5) {
            clearInterval(t)
            resolve({
              url: `https://api.wfell.top/storage/v1/render/image/public/kingtime/1.jpg?width=600`
            })
          }
        }, 1000)
      })
    },

    sizeLimit: "1MB"
}
</script>