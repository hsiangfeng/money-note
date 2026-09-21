# Money Note

一個人用的記帳小工具。資料只存在自己的瀏覽器（`localStorage`），不上傳伺服器。

- 規格：[SPEC.md](./SPEC.md)
- 技術選型評估：[TECH_CHOICE.md](./TECH_CHOICE.md)

## 開發

```bash
npm install
npm run dev      # 開發伺服器
npm run build    # 產出 dist/
npm run preview  # 本機預覽 build 結果
npm test         # 單元測試（只測算錢的邏輯，跑完即結束）
```

手機實機測試（同一個 Wi-Fi 下用手機開）：

```bash
npm run dev -- --host
```

## 技術

| 項目 | 選擇 |
|---|---|
| 框架 | Vue 3（`<script setup>` Composition API） |
| 建置 | Vite |
| 樣式 | Tailwind CSS v4（`@tailwindcss/vite` plugin） |
| 圖表 | Chart.js + vue-chartjs（只用統計頁的圓餅圖） |
| 測試 | Vitest（只測 `stats.js`、`format.js`、`useRecords.js`，不測畫面） |
| 路由 / 狀態管理 / 日期函式庫 | 都不裝，見 SPEC 第 6 節 |

## 目錄結構

```
src/
├─ App.vue                    # 版面組裝、分頁切換
├─ main.js
├─ style.css                  # 只有 @import "tailwindcss"
├─ constants/
│  └─ categories.js           # 分類清單（唯一真實來源），含圓餅圖用的顏色
├─ composables/
│  ├─ useRecords.js           # 讀寫 localStorage、CRUD、月份篩選
│  └─ useRecords.test.js
├─ utils/
│  ├─ format.js               # 金額與日期格式化、「今天」「本月」的取值
│  ├─ format.test.js
│  ├─ stats.js                # 統計計算（純函式）
│  └─ stats.test.js
└─ components/
   ├─ MonthSwitcher.vue       # 月份切換 + 該月總額
   ├─ RecordList.vue          # 流水清單
   ├─ RecordForm.vue          # 新增 / 編輯 bottom sheet
   ├─ TabBar.vue              # 底部分頁
   ├─ StatsPanel.vue          # 統計頁內容
   └─ CategoryPieChart.vue    # 分類佔比圓餅圖 + 文字明細
```

`useRecords.js` 是唯一碰 `localStorage` 的地方，元件不直接讀寫。
`stats.js` 只放純函式，不碰 `localStorage` 也不碰 Vue 的 `ref`。
