<!-- 视频上传 -->
<template>
  <div>
    <h1>限制文件类型</h1>
    <p>前置选择限制: 通过设置input的`accept`属性=`video/*`, 限制文件类型视频</p>
    <p>v-model: {{ url }}</p>
    <TUploader
      v-model="url"
      v-bind="args"
      :locale="{
        triggerUploadText: {
          image: '点击上传视频'
        }
      }"
    >
    </TUploader>

    <p>后置选择后限制: 通过判断文件类型, 后置对于移动端很有用(pc端意义不大)</p>
    <TUploader
      v-model="url2"
      v-bind="args"
      :accept="undefined"
      :locale="{
        triggerUploadText: {
          image: '点击上传视频'
        }
      }"
      :beforeUpload="validFile"
    >
    </TUploader>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from "tdesign-vue-next"
import { ref } from "vue";

const url = ref();
const url2 = ref();
const args = {
  theme: "video",
  accept: "video/*",
  multiple: true,
  max: 3,
  onUpload: (file, _ref) => {
    // 模拟上传处理
    return new Promise((resolve) => {
      let i = 0;
      const t = setInterval(() => {
        file.percent = i * 50;
        // 更新进度, file.percent 不能触发更新
        _ref.value!.uploadFilePercent({ file, percent: file.percent });
        if (i++ >= 2) {
          clearInterval(t);
          resolve({
            url: `https://api.wfell.top/storage/v1/render/video/public/kingtime/haha/small_bunny.MP4`,
          });
        }
      }, 1000);
    });
  },
};

const validFile = (f) => {
  if (f.type.startsWith("video/")) {
    return true
  }
  MessagePlugin.warning("请上传视频文件");
  return false
}
</script>
