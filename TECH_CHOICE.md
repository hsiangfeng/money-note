# Money Note — 技術選型評估

> 日期：2026-08-09
> 對應規格：[SPEC.md](./SPEC.md)
> 結論：**維持 SPEC 第 6 節的決定 —— Vue 3 + Vite + Tailwind CSS**

---

## 1. 評估前提

SPEC 已經在第 6 節拍板 Vue 3 + Vite，這份文件把它當開放題重新評一次，
確認這個決定禁得起檢驗，而不是照抄。

評估基準（三個考量）：

- 夠簡單
- 夠主流
- 部署容易

### 這個 app 的真實需求

**沒有任何伺服器端需求。** 不做註冊登入、沒有 API、資料只存在 localStorage、
只有一頁、不裝 Router 也不裝 Pinia。

所以整個選型只剩一個問題：**需要多少「反應式」的幫忙。**
真正有份量的邏輯只有三件 —— 月份篩選、分類統計、表單狀態。

任何要談 SSR、SEO、資料庫、後端框架的方案，在這裡都是多的，一律先排除。

---

## 2. 選項比較

### 選項 A：Vue 3 + Vite + Tailwind CSS（SPEC 原案）

**優點**

| 項目 | 說明 |
|---|---|
| 需求對得上 | 月份篩選與分類統計用 `computed` 各一行；表單用 `v-model`；bottom sheet 用 `v-if` + transition |
| 免寫同步邏輯 | SPEC 的「存檔後清單即時更新」「統計同步變動」由反應式系統直接處理，不用手動觸發重繪 |
| 資料層乾淨 | 一個 `useRecords.js` composable 收掉整個資料存取，對應 SPEC 第 9 節「將來抽換成 API 呼叫時元件不用動」 |
| 部署簡單 | Vite build 出來是純靜態 `dist/`，部署等於丟一個資料夾 |
| 主場語言 | 寫文章時 code 最短、最好講 |

**缺點**

- 多了 `node_modules` 與 build step。以這個規模算是大砲打小鳥，但成本大約就一次 `npm create vite`。
- 全球聲量小於 React（在台灣不構成問題）。

---

### 選項 B：純 HTML + JS + CSS，單一檔案，不 build

**優點**

- 部署天花板等級的簡單：一個 `.html` 丟 GitHub Pages、丟任何靜態空間，甚至 double click 直接開都能用。
- 零依賴、零版本升級，五年後打開還是能跑。
- 沒有工具鏈可壞。

**缺點**

- **反應式要自己手刻。** 清單重繪、表單帶值、新增與編輯共用同一個表單、刪除後統計重算 ——
  用 DOM 操作寫很容易變成一坨互相呼叫的 `render()`。
  SPEC 的驗收條件 2、4、8 全都是「改一處、三個地方要同步更新」，正是手刻最容易出錯的地方。
- **Tailwind 只能走 CDN 版**，官方本來就不建議上 production（檔案大、有 console warning）。
  想留 Tailwind 就得 build，那 B 的最大優點也就沒了。
- 折衷做法是掛 Alpine.js 或 petite-vue（CDN 一行），但那本質上就是選項 A 的簡陋版。

---

### 選項 C：React + Vite + Tailwind CSS

**優點**

- 全世界最主流，生態、教學資源、AI 生成品質都最好。
- 部署方式與選項 A 完全相同，都是靜態檔。

**缺點**

- 對這個規格反而比 Vue 囉唆：表單每個欄位要自己寫 `onChange`、統計要包 `useMemo`、
  寫回 localStorage 要進 `useEffect`。
- StrictMode 在開發模式下 effect 會跑兩次，容易在 localStorage 重複寫入這件事上踩雷。
- **收益是零** —— React 的強項（大型元件樹、複雜狀態、豐富生態）這個 app 一項都用不到。

---

## 3. 結論

**選 A：Vue 3 + Vite + Tailwind CSS。**

| 考量 | A（Vue） | B（Vanilla） | C（React） |
|---|---|---|---|
| 夠簡單 | ✅ Composition API 對這規模剛好 | ⚠️ 表面簡單，同步邏輯要手刻 | ⚠️ 樣板碼比 Vue 多 |
| 夠主流 | ✅ 台灣前端主流 | ✅ 沒有比原生更主流的 | ✅ 全球最主流 |
| 部署容易 | ✅ 純靜態一鍵 | ✅ 一個檔案 | ✅ 純靜態一鍵 |

理由整理：

- **B 的簡單是假的。** 它把 build 的複雜度換成手刻同步邏輯的複雜度，
  而 SPEC 的驗收條件有一半在考同步。
- **C 沒有比 A 好的地方。** 它的優勢在這個規格下完全用不到，缺點卻會實際發生。
- SPEC 原本的決定是對的，不需要改。

---

## 4. 部署

> **2026-09-20 更新：改走 GitHub Pages。** 下面這張表是 2026-08-09 當初的比較，
> 保留原文供對照；結論已在第 6 節翻案。

| 方案 | 設定成本 | 說明 |
|---|---|---|
| **Cloudflare Pages / Vercel**（當初的建議） | 幾乎為零 | 接上 repo 自動 build，不用管路徑 |
| **GitHub Pages**（現行） | 中 | 專案已在 GitHub，但因為是子路徑，`vite.config.js` 要設 `base: '/repo-name/'`；加上 monorepo 結構（`day-9/money-note/`）要多寫一點 GitHub Actions |

### 現行做法

站台網址是 `https://hsiangfeng.github.io/ithelp-2026-vibe-coding/`，所以兩件事跑不掉：

1. **`vite.config.js` 設 `base: '/ithelp-2026-vibe-coding/'`。**
   不設的話產出的 `index.html` 會引用 `/assets/...` 絕對路徑，部署後全數 404、畫面全白。
   這個坑本機看不出來 —— `npm run dev` 與 `npm run preview` 都正常。
2. **GitHub Actions 指定建置目錄是當天的 `day-N/money-note/`。**
   repo 是逐日快照的 monorepo，根目錄沒有可建置的東西。

兩件都是一次性設定。資料存在 `localStorage`、沒有後端，換 host 不影響既有資料。

### 實作補充

Tailwind 現在（v4）走 `@tailwindcss/vite` plugin，CSS 裡一行 `@import "tailwindcss";` 即可，
**不需要** `tailwind.config.js` 與 postcss 設定。比 SPEC 撰寫當下更省事。

---

## 5. 一個 SPEC 沒寫、但會打臉驗收條件 6 的坑

SPEC 驗收條件 6 是「重新整理頁面，所有資料還在」。這在桌機成立，但：

> **iOS Safari 會清掉七天內沒再造訪過的網站的 localStorage**
> （ITP 對 script-writable storage 的上限）。

而 SPEC 的主要情境正好是「站在超商門口拿手機記帳」——
出國兩週回來，帳本可能是空的。

### 兩個緩解方式（都很便宜）

1. **做成 PWA，讓使用者「加到主畫面」。**
   從主畫面啟動的 web app 不受那個七天上限。Vite 加 `vite-plugin-pwa` 大約十行設定。
2. **SPEC 第 8 節那顆「匯出 JSON」按鈕。**
   它不只是 nice-to-have，是這個架構下唯一的備份手段。

這兩件事都不影響選型（選項 A 都能做），
但**建議把「匯出 JSON」從 SPEC 第 8 節的待決定移進 v1 範圍**。

---

## 6. 決策紀錄

| 日期 | 決策 | 理由 |
|---|---|---|
| 2026-08-09 | 維持 Vue 3 + Vite + Tailwind，不改用 vanilla 或 React | 三個考量（簡單／主流／部署）Vue 全數過關；vanilla 把 build 複雜度換成手刻同步複雜度，React 的優勢在此規格用不到 |
| 2026-08-09 | ~~部署走 Cloudflare Pages 或 Vercel，不走 GitHub Pages~~（2026-09-20 翻案） | monorepo 子路徑要額外設 `base` 與 Actions，收益不成比例 |
| 2026-08-09 | Tailwind 採 v4 的 `@tailwindcss/vite` plugin | 免 `tailwind.config.js` 與 postcss 設定 |
| 2026-08-09 | 提案：把「匯出 JSON」移入 v1（待 SPEC 更新確認） | iOS Safari 七天清除 localStorage，匯出是此架構下唯一備份手段，直接影響驗收條件 6 |
| 2026-09-20 | **部署改走 GitHub Pages**，`base: '/ithelp-2026-vibe-coding/'` + Actions 從 `day-N/money-note/` 建置 | 程式碼本來就在這個 GitHub repo，部署不必再接第三方服務、不必多管一組帳號與權限。當初嫌的 `base` 與 Actions 是一次性設定，設完不再碰，跟「多一個服務要長期維護」比起來划算 |
