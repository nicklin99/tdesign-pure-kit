
# 全局配置

```vue
<script setup lang="ts">
const paginationConfig = {
  pageSize: 50,
};
</script>

<template>
  <TContextProvider :pagination="paginationConfig">
    <!-- 组件 -->
  </TContextProvider>
</template>
```