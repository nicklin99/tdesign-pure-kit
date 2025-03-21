<!-- 自定义拖拽上传区域 -->
<template>
  <div>
    <p>完全自己控制样式以及管理操作</p>
    <p>{{ url }}</p>
    <TUploader v-model="url" v-bind="args">
      <template #drag="{ files, dragActive }">
        <template v-if="!files.length">
          <p v-if="dragActive">释放鼠标</p>
          <p v-else>可以上传 jpg、png,最大 10MB</p>
        </template>
        <ul v-if="files && files.length">
          <li v-for="(file, index) in files" :key="file.name">
            {{ file.name }}
            <t-progress
              :percentage="file.percent"
              :status="
                file.percent === 100
                  ? 'success'
                  : file.response?.error
                  ? 'error'
                  : ''
              "
            />
            <t-button
              v-if="file.status !== 'progress'"
              size="small"
              @click.stop="
                () => {
                  files.splice(index, 1);
                }
              "
              >删除文件</t-button
            >
          </li>
        </ul>
      </template>
    </TUploader>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const url = ref();
const args = {
  drag: true,
  multiple: true,
  max: 3,
  upload: (file, _ref) => {
    // 模拟上传处理
    return new Promise((resolve) => {
      let i = 0;
      const t = setInterval(() => {
        file.percent = i * 20;
        // 更新进度, file.percent 不能触发更新
        _ref.value!.uploadFilePercent({ file, percent: file.percent });
        if (i++ >= 5) {
          clearInterval(t);
          resolve({
            url: `https://api.wfell.top/storage/v1/render/image/public/kingtime/1.jpg?width=600`,
          });
        }
      }, 1000);
    });
  },
};
</script>
