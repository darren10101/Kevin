import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import process from 'process';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@" : path.resolve(__dirname, "./src"),
      "@components" : path.resolve(__dirname, "./src/components"),
      "@assets" : path.resolve(__dirname, "./src/assets"),
      "@routes" : path.resolve(__dirname, "./src/routes"),
      process: 'process/browser'
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/variables.scss";`
      }
    }
  },

  define: {
    'process.env': {}, // Polyfill for process.env
  }
})
