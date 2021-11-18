//vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  server: {
    host: true,
    proxy: {
      // Using the proxy instance
      //'/search'にアクセスが来た時に、target: 'https://itunes.apple.com/',へ変換
      '/search': {
        target: 'https://itunes.apple.com/',
        changeOrigin: true,
        secure: false,             
      }
    },
  },
  base:'/',
  assetsDir:'./',
  outDir: '',
})