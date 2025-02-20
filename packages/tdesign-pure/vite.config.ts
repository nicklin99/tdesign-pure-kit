import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    // outDir: "./src/ui",
    lib: {
      entry: "src/main.ts",
      fileName: (format, entryName) => {
        return `${format}/${entryName}.js`
      },
      formats: ["es"],
      cssFileName: "style"
    },
    rollupOptions: {
      external: ['vue', 'tdesign-vue-next']
    },
  }
})
