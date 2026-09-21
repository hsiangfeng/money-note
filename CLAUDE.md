# CLAUDE.md

規格請看 @SPEC.md，設計規範則是 @DESIGN.md，只要跟畫面相關的調整一律必須遵守 DESIGN.md 的規範。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概況

Money Note —— 單人使用的記帳工具。純前端，沒有後端、沒有登入，資料只存在瀏覽器的 `localStorage`。

**目前狀態：SPEC 第 3 節「做」的項目都已實作。** 記帳頁（月份切換、總額、流水清單、新增／編輯／刪除）與統計頁（分類佔比圓餅圖）兩個分頁都在，總支出與記帳筆數在兩頁共用的摘要區。

**畫面相關的一切（色票、字級、間距、元件狀態、響應式與無障礙驗收）都在 [DESIGN.md](./DESIGN.md)，這裡不留第二份。** 動到樣式之前先讀那一份。

## 語言

**一律使用繁體中文（台灣用語）。** 適用於：對話回覆、程式碼註解、commit 訊息、文件、以及所有會出現在畫面上的 UI 文案。

不要出現簡體字或中國慣用語（例如「軟件」「屏幕」「用戶」「調用」「默認」「性能」），對應的台灣用法是「軟體」「螢幕」「使用者」「呼叫」「預設」「效能」。標點使用全形。

程式碼本身（變數、函式、檔名、`category` 的 id）維持英文。

## 指令

```bash
npm run dev            # 開發伺服器
npm run dev -- --host  # 開放區網，手機實機測試用
npm run build          # 產出 dist/
npm run preview        # 預覽 build 結果
npm test               # 單元測試（vitest run，跑完即結束，不進 watch 模式）
```

**單元測試用 Vitest，只測算錢的邏輯，不測畫面。** `npm test` 跑的是 `vitest run`，跑完自動結束、不會停在 watch 模式等人。測試檔放在被測檔案旁邊：

| 測試檔 | 守住的事 |
|---|---|
| `src/utils/stats.test.js` | 空月份回傳空陣列、同額分類退回 `CATEGORIES` 宣告順序（不受輸入順序影響）、百分比四捨五入到整數 |
| `src/utils/format.test.js` | 金額千分位、月份 key 跨年加減、「今天」「本月」用當地時間不用 UTC |
| `src/composables/useRecords.test.js` | 歸屬月份看 `date` 不看 `createdAt`、該月總額與筆數、CRUD 後統計同步、`localStorage` 讀壞時收斂成空陣列 |

環境是 node、不裝 jsdom，`localStorage` 在測試裡用 Map 假的。改到 `stats.js`、`format.js`、`useRecords.js` 之後先跑 `npm test`；新的計算邏輯要一起補測試，不要只補程式。

**畫面的驗證仍然是手動走一遍 SPEC.md 第 7 節那十一條驗收條件** —— 它們涵蓋了 CRUD、統計同步、跨月搬移、空狀態、重整後資料留存、分頁切換。單元測試不取代這十一條，新增功能後請照著走，不要只看畫面有沒有壞。

## 開發流程

**每完成一個功能、驗收通過後就 commit 一次。** 不要累積好幾個功能才一起提交 —— 一個 commit 對應一個可驗收的功能，出問題時才回得去。

這裡的「驗收」指走過 SPEC.md 第 7 節中與該功能相關的驗收條件，不是「看起來沒壞」。

只 commit，不 push。要推上去時由使用者決定。

### Plan Mode 的計畫要存檔

**每次 Plan Mode 的計畫放行之後，第一件事是把計畫原文存成 `docs/plans/NN-功能名稱.md`（`NN` 從 `01` 開始接續編號），存完再開始改程式。** 存原文，不要重寫或摘要。

計畫檔跟該功能的程式碼放在同一個 commit。

存檔是為了之後回頭對照：出 bug 時可以翻當初打算怎麼做、重構時可以看當初為什麼這樣拆。除錯或改動既有功能之前，先讀 `docs/plans/` 裡對應的那一份。

### Commit 訊息格式

`功能名稱：簡短描述`，**使用繁體中文**，中間用全形冒號。

```
月份切換：加入回到本月按鈕
分類佔比：改用圓餅圖呈現
記錄表單：金額為空或 0 時停用存檔按鈕
資料層：localStorage 解析失敗時回傳空陣列
```

不要加 gitmoji、不要加 `feat:` `fix:` 這類英文前綴、不要附任何 session 連結或 trailer。

## SPEC.md 是唯一真實來源

動手前先讀 [SPEC.md](./SPEC.md)。它不只是需求描述，還帶著已經拍板的決策：

- **第 3 節的「不做」清單是刻意排除，不是還沒做。** 收入、帳戶、預算、跨月趨勢、分類管理介面 —— 想加之前先問，不要自己補上去。
- **第 7 節的十一條驗收條件就是「完成」的定義。**
- **第 10 節是決策紀錄表。** 任何範圍或技術上的改變，補一列進去（日期 / 決策 / 理由），不要只改內文 —— 這張表的用途是避免日後重新爭論同一件事。

技術選型的完整比較在 [TECH_CHOICE.md](./TECH_CHOICE.md)（為什麼是 Vue 而不是純 HTML 或 React、部署選擇、iOS Safari 七天清 localStorage 的風險）。

## 資料模型的三個地雷

這三件事在 SPEC 裡有寫，但很容易寫錯，而且錯了不會馬上壞：

1. **判斷一筆屬於哪個月，一律看 `date`，不看 `createdAt`。** `createdAt` 只用於同一天內的排序。補記昨天的帳時兩者會是不同天。
2. **時間一律用當地時間，不用 UTC。** `date` 欄位、「本月」的判定都是。用 UTC 會在台灣的早上八點前產生差一天的記錄。
3. **分類的 `category` 存的是 id 不是顯示名稱。已經用過的 id 不可以刪除或改名**，否則舊記錄會對不到分類。要加分類就直接加一組新的 id。

其他規則：金額是**正整數**（> 0，不收小數與負數）、備註上限 50 字。

## 架構約束

- **`src/composables/useRecords.js` 是唯一碰 `localStorage` 的地方。** 元件不直接讀寫。這是為了將來要換成 API 呼叫時元件不用動。
- localStorage key 是 `money-note:records:v1`，整個陣列序列化成一個 JSON 字串。**`JSON.parse` 失敗時視為空陣列，不要讓整個 app 掛掉。** key 尾巴的 `v1` 是留給將來資料結構改動時做遷移判斷用的。
- **`src/utils/stats.js` 是統計計算的所在地，一律寫成純函式。** 吃一個記錄陣列、回傳結果，不碰 `localStorage`、不碰 Vue 的 `ref`。要算哪一段（哪個月）是 `useRecords.js` 的事，怎麼算是這個檔的事 —— 不要因為「順手」就把新的統計寫回 `useRecords.js` 的 computed 裡。
- **以下套件是刻意不裝的，不要因為「方便」就補上：**

  | 不裝 | 替代做法 |
  |---|---|
  | Vue Router | 只有兩個分頁，用一個 `ref` 切換；表單常駐在記帳頁上 |
  | Pinia | 一個 composable 就夠 |
  | day.js 等日期函式庫 | 只做「取月份」和「格式化」，原生 `Date` 足夠 |

- **圖表用 Chart.js + vue-chartjs**（2026-08-16 翻掉原本「不裝圖表函式庫」的決定，見 SPEC 第 10 節）。只註冊 `ArcElement`，Tooltip 與 Legend 刻意不註冊 —— 資料全在圓餅圖旁的文字明細裡（無障礙的要求見 DESIGN.md 的 A7）。
- 元件一律用 `<script setup>` Composition API。
- 樣式走 Tailwind CSS **v4** 的 `@tailwindcss/vite` plugin，token 全部收在 `src/style.css` 的 `@theme` 區塊。**沒有 `tailwind.config.js`，也沒有 postcss 設定 —— 不要去建。** token 的值與用途見 DESIGN.md。

## 部署

Build 產物是純靜態檔，**目標是 GitHub Pages**（2026-09-20 翻掉原本的 Cloudflare Pages／Vercel，見 SPEC 第 10 節）。

站台網址在 repo 子路徑底下（`https://hsiangfeng.github.io/ithelp-2026-vibe-coding/`），所以：

- **`vite.config.js` 要設 `base: '/ithelp-2026-vibe-coding/'`。** 不設的話 `dist/index.html` 會引用 `/assets/...` 這種絕對路徑，上去之後全部 404、畫面一片空白 —— 而且本機 `npm run dev` 與 `npm run preview` 都正常，只有部署後才看得出來。
- **GitHub Actions 要指定建置目錄是 `day-25/money-note/`。** 這個 repo 是 `day-N/` 逐日快照的 monorepo，根目錄沒有可建置的東西。

## Repo 慣例

這個 repo 以 `day-N/` 逐日保存開發過程，每個目錄是該天的快照 —— `day-9/money-note/` 是從 `day-8/money-note/` 複製過來再往前做的。**改東西時確認自己在正確的 day 目錄下**，不要回頭改舊天數的檔案。

Commit 訊息格式見上面的「開發流程」。舊的 commit 是 `feat: 🎸 <描述>` 這種 gitmoji 格式，**新的 commit 不要沿用**。
