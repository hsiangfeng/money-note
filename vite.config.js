/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // 站台掛在 GitHub Pages 的 repo 子路徑底下（https://hsiangfeng.github.io/money-note/）。
  // 沒設 base 的話 dist/index.html 會引用 /assets/... 這種絕對路徑，部署後全部 404、畫面一片空白，
  // 而且本機 npm run dev 與 npm run preview 都正常，只有部署後才看得出來。
  base: '/money-note/',
  plugins: [vue(), tailwindcss()],
  // 測試只跑 src/ 底下的純函式（算錢的邏輯），畫面不測。
  // 用 node 環境就好，不裝 jsdom —— 被測的檔案不碰 DOM、不碰 localStorage。
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
