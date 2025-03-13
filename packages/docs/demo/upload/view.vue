<!-- 查看 -->
<template>
    <TUploader
        v-model="url"
    />
</template>

<script setup lang="ts">
import { ref } from "vue"
const url = ref('https://api.wfell.top/storage/v1/render/image/public/kingtime/IMG_7736.JPG?width=600')
</script>