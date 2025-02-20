<template>
    <div class="demo-container">
      <div class="demo-description" v-if="$slots.description">
        <slot name="description" />
      </div>
      <div class="demo-component">
        <slot />
      </div>
      <div class="demo-code" v-if="$slots.code">
        <slot name="code" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DemoContainer'
  }
  </script>
  
  <style scoped>
  .demo-container {
    border: 1px solid #e2e2e2;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
  }
  .demo-description {
    margin-bottom: 1rem;
  }
  .demo-code {
    margin-top: 1rem;
  }
  </style>