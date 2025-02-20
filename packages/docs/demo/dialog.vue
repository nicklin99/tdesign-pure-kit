<template>
  <t-button @click="show"> 打开弹窗 </t-button>
</template>

<script setup>
import { DialogPlugin } from "tdesign-vue-next";

const show = () => {
  const d = DialogPlugin({
    header: "弹窗标题",
    body: "弹窗内容",
    // 关闭弹窗后，弹窗内容会被销毁, 默认为false(不推荐)会导致重复弹窗
    destroyOnClose: true, 
    onConfirm: () => {
      d.destroy();
    },
  });
};
</script>
