<!-- 拖拽上传 -->
<template>
    <div>
    <p>theme=image-flow multiple=true, 开启批量上传, TODO 这里控制可以优化简单点</p>
    <p>自定义触发上传</p>
    <p>v-model: {{ url }}</p>
    <TUploader v-model="url" tips="提示文本" v-bind="args" :locale="{dragger: { clickAndDragText: '支持拖放/选择文件上传'}}">
      <t-button>选择</t-button>
    </TUploader>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const url = ref()
const args = {
    theme: "image-flow",
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
}
</script>