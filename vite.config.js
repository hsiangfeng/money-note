/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // 測試只跑 src/ 底下的純函式（算錢的邏輯），畫面不測。
  // 用 node 環境就好，不裝 jsdom —— 被測的檔案不碰 DOM、不碰 localStorage。
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
