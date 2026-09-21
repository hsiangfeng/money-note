---
version: alpha
name: Money Note 暖色紙本帳冊
description: 單人記帳工具的設計系統。紙底墨字、帳冊欄位線、合計雙底線，數字優先，不做藍白後台。
colors:
  # === 底色 ===
  paper: "#F3EFE7"
  card: "#FFFDF8"
  # === 墨色 ===
  ink: "#1F2925"
  ink-soft: "#56625C"
  # === 動作與重點 ===
  ledger: "#245C4A"
  clay: "#9A4F20"
  alert: "#962E2E"
  # === 帳冊線 ===
  rule: "#DCD5C8"
  rule-soft: "#EBE5DA"
  # === 分類色（圓餅圖與明細色塊；id 對應 constants/categories.js）===
  category-food: "#9A4F20"
  category-transport: "#245C4A"
  category-daily: "#6B7A52"
  category-entertainment: "#5D5480"
  category-medical: "#8E3B4A"
  category-other: "#8A8377"
  category-fallback: "#B8AFA0"
  # === 語意別名（只給讀 DESIGN.md 的人與工具對照，Tailwind 沒有這些 utility）===
  primary: "{colors.ledger}"
  secondary: "{colors.clay}"
  tertiary: "{colors.ink-soft}"
  neutral: "{colors.rule}"
  surface: "{colors.card}"
  on-surface: "{colors.ink}"
  error: "{colors.alert}"
typography:
  brand:
    fontFamily: Georgia, "Songti TC", "Noto Serif TC", "Source Han Serif TC", serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.2em
  headline-md:
    fontFamily: Georgia, "Songti TC", "Noto Serif TC", "Source Han Serif TC", serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  total-display:
    fontFamily: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1
    fontFeature: '"tnum"'
  total-display-lg:
    fontFamily: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1
    fontFeature: '"tnum"'
  amount-input:
    fontFamily: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: '"tnum"'
  amount-md:
    fontFamily: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4286
    fontFeature: '"tnum"'
  amount-sm:
    fontFamily: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3333
    fontFeature: '"tnum"'
  month-label:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    fontFeature: '"tnum"'
  body-md:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4286
  label-sm:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3333
  column-head:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.05em
  button-lg:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  button-md:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4286
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  xxxl: 32px
  page-x: 16px
  page-x-md: 32px
  page-top: 32px
  page-bottom: 64px
  card-padding: 16px
  block-gap: 32px
  field-gap: 20px
  column-gap: 8px
  row-y: 14px
  stats-row-y: 12px
  amount-col-pad: 12px
  base-width: 375px
  breakpoint-md: 768px
  content-max: 780px
rounded:
  none: 0px
  focus: 2px
  sm: 4px
components:
  page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 16px
    width: 780px
  card:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.sm}"
    padding: 16px
  empty-state:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.rule}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 24px
  button-primary:
    backgroundColor: "{colors.ledger}"
    textColor: "{colors.card}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.sm}"
    height: 52px
  button-primary-disabled:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-soft}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.sm}"
    height: 52px
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    borderColor: "{colors.rule}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    height: 44px
    padding: 16px
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    height: 44px
  button-ghost-active:
    backgroundColor: "{colors.rule-soft}"
  button-danger-quiet:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    height: 44px
  button-danger-quiet-hover:
    textColor: "{colors.alert}"
  button-danger:
    backgroundColor: "{colors.alert}"
    textColor: "{colors.card}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    height: 44px
  chip-category:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    borderColor: "{colors.rule}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    height: 44px
  chip-category-selected:
    backgroundColor: "{colors.ledger}"
    textColor: "{colors.card}"
    borderColor: "{colors.ledger}"
  input-underline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    borderColor: "{colors.rule}"
    typography: "{typography.amount-input}"
    height: 44px
  input-underline-focus:
    borderColor: "{colors.ledger}"
  input-boxed:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    borderColor: "{colors.rule}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    height: 44px
    padding: 12px
  tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    borderColor: transparent
    typography: "{typography.button-md}"
    height: 44px
    padding: 20px
  tab-active:
    textColor: "{colors.ink}"
    borderColor: "{colors.ledger}"
  table-header:
    textColor: "{colors.ink-soft}"
    borderColor: "{colors.rule}"
    typography: "{typography.column-head}"
  list-row:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    borderColor: "{colors.rule-soft}"
    typography: "{typography.body-md}"
    padding: 14px
  list-row-editing:
    backgroundColor: "color-mix(in srgb, #EBE5DA 60%, #FFFDF8)"
    borderColor: "{colors.ledger}"
  total-amount:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.clay}"
    typography: "{typography.total-display}"
  total-amount-lg:
    typography: "{typography.total-display-lg}"
  category-swatch:
    rounded: "{rounded.none}"
    size: 10px
---

# Money Note 設計規範

實作規格見 [SPEC.md](./SPEC.md)。這份文件只管畫面長什麼樣子：色票、字級、間距、元件狀態與驗收條件。

**唯一真實來源是程式碼裡的 token。** YAML front matter 的值與 `src/style.css` 的 `@theme` 區塊、`src/constants/categories.js` 逐一對應，改一邊就要改另一邊。

## Overview

Money Note 是一個人用的記帳工具。核心情境是「花完錢的當下，站在超商門口拿手機記一筆」，所以整套視覺只服務一件事：**讓數字最快被讀到、最快被寫進去。**

視覺方向是**暖色紙本帳冊**，不是後台管理介面。畫面應該讀起來像一本翻開的手記帳冊：米黃紙底、深墨字、橫向欄位線一列一筆、金額欄有一條直線把錢跟文字分開、月總額下面壓一條會計慣例的合計雙底線。

帳冊的三種線本身就帶著資訊（一列一筆、錢與文字分欄、單線小計雙線總計），拿來當版面骨架就不需要另外加裝飾。**層級一律靠線條粗細與紙／卡兩層底色差建立，不靠陰影、不靠圓角、不靠顏色數量。**

情緒上要安靜、可信、耐看，接近「工具」而不是「App」。不做漸層、玻璃效果、emoji 功能圖示、浮誇陰影、彩色標籤牆。畫面上最亮眼的東西永遠是那個月總額的數字，其他全部退到它後面。

### 設定寫在哪裡

Tailwind CSS **v4**，走 `@tailwindcss/vite` plugin。**沒有 `tailwind.config.js`，也沒有 postcss 設定 —— 不要去建。** v4 的設定寫在 CSS 裡，全部收在 `src/style.css` 的 `@theme` 區塊。

## Colors

只有淺色一套，不做深色模式（`index.html` 已宣告 `<meta name="color-scheme" content="light">`，否則部分瀏覽器會在系統深色模式下自動反轉表單控制項，把紙底墨字洗成灰底）。

**一律用 token，不要在元件裡寫 hex。** 下表的 token 名稱就是 Tailwind 的 utility 後綴 —— `paper` 對應 `bg-paper`、`ink-soft` 對應 `text-ink-soft`。

| Token | 值 | 用途 |
|---|---|---|
| `paper` | `#F3EFE7` | 頁面背景（紙） |
| `card` | `#FFFDF8` | 卡片、表單、明細底（貼在紙上的那張紙） |
| `ink` | `#1F2925` | 主要文字、合計雙線 |
| `ink-soft` | `#56625C` | 次要文字、欄頭、標籤、未選中的分頁 |
| `ledger` | `#245C4A` | 主要動作：存檔、已選分類、目前分頁、編輯中那列的左標、focus ring |
| `clay` | `#9A4F20` | 重點：**只給月總支出那個數字** |
| `alert` | `#962E2E` | **只給刪除**，不做他用 |
| `rule` | `#DCD5C8` | 帳冊線：卡片外框、欄頭底線、金額欄直線 |
| `rule-soft` | `#EBE5DA` | 明細列之間的細分隔線、按下去的底色 |

- **`paper` 與 `card` 的差距刻意做得很小**（兩者相對亮度 0.866 對 0.983，對比只有 1.13:1）。它們是「紙上再放一張紙」，不是「背景與前景」—— 差太多就變成後台的卡片陰影感。也因為差這麼小，**卡片一定要同時有 `rule` 外框**，光靠底色差撐不起邊界。
- **帳冊線用實色，不用透明度疊色。** 半透明的墨疊在 `paper` 上與疊在 `card` 上會變成兩種灰，金額欄那條直線跨過卡片邊界時就接不起來。
- **`clay` 與 `alert` 是專用色，不要挪用。** 全站只有一個數字是 `clay`、只有刪除相關是 `alert`；一旦拿去做別的強調，這兩個顏色就不再有意義。

### 分類色

圓餅圖與明細色塊用的六色，定義在 `src/constants/categories.js`，**六色全部從全站同一組墨水裡調**（`category-food` 就是 `clay`、`category-transport` 就是 `ledger`），圓餅圖才不會引進外來色相把暖色紙面拉回藍白後台。

| 分類 id | 值 | 色名 | 亮度 L |
|---|---|---|---|
| `food` | `#9A4F20` | 赭石 | 0.126 |
| `transport` | `#245C4A` | 墨綠 | 0.085 |
| `daily` | `#6B7A52` | 苔綠 | 0.177 |
| `entertainment` | `#5D5480` | 靛 | 0.102 |
| `medical` | `#8E3B4A` | 玫瑰 | 0.094 |
| `other` | `#8A8377` | 暖灰 | 0.230 |
| （對不到 id 的 fallback） | `#B8AFA0` | 淺暖灰 | 0.434 |

亮度刻意拉開，印成灰階或色覺障礙者看，靠深淺一樣分得出來。**但顏色永遠只是輔助** —— 每個分類的名稱、金額、百分比都另外有文字（見〈響應式與無障礙驗收〉）。

要加分類就直接補一組新的 id 與一個同組墨水的顏色；**已經用過的 id 不可以刪除或改名**（`localStorage` 裡的舊記錄靠 id 對應）。

### 對比度

實測值（WCAG 2.1，AA 內文門檻 4.5:1）：

| 前景 / 背景 | 對比 | |
|---|---|---|
| `ink` / `paper` | 13.06 | AAA |
| `ink` / `card` | 14.73 | AAA |
| `ink-soft` / `paper` | 5.55 | AA |
| `ink-soft` / `card` | 6.26 | AA |
| `clay` / `paper` | 5.21 | AA |
| `ledger` / `paper` | 6.77 | AA |
| `card` / `ledger`（存檔鈕） | 7.64 | AAA |
| `card` / `alert`（刪除鈕） | 7.58 | AAA |

**唯二的例外是 placeholder**：金額欄的 `0` 用 `text-rule`（1.44:1）、備註欄用 `text-ink-soft/60`（2.63:1）。兩者都只是格式示範、不承載任何資訊，欄位本身有可見標籤，所以刻意壓到最低存在感。**除此之外，任何承載資訊的文字都必須 ≥ 4.5:1。**

## Typography

三套系統字，**不載入任何遠端字型** —— 純靜態部署不該為了字型多一個外部相依。

| 家族 token | 內容 | 用途 |
|---|---|---|
| `font-title` | `Georgia, "Songti TC", …, serif` | **只給標題**：書名與區塊標題 |
| `font-sans` | `-apple-system, …, "PingFang TC", …` | 內文、標籤、按鈕 |
| `font-mono` | `ui-monospace, …, Menlo, monospace` | **所有金額、日期、百分比** |

- **明體只出現在標題**（`Money Note`、`記一筆`、`支出明細`、`分類佔比`）。用得少才是味道，用多了是裝飾。Georgia 排拉丁字，中文退到系統明體。
- **所有數字一律 `font-mono` 加 `tabular-nums`。** 字寬固定，明細的金額欄才對得成一直排 —— 這是「數字優先」在排版上的實際做法，不是風格偏好。月份標籤（`2026 年 8 月`）雖然用黑體，也要加 `tabular-nums`，8 月換 12 月時左右箭頭才不會被撐開。

### 字級

| Token | 值 | 用在哪 |
|---|---|---|
| `brand` | 明體 15px / 字距 0.2em | 頁首書名「Money Note」 |
| `headline-md` | 明體 16px | 區塊標題 |
| `total-display` | 等寬 48px / 700 / leading-none | 月總支出（手機） |
| `total-display-lg` | 等寬 60px / 700 | 月總支出（≥768px） |
| `amount-input` | 等寬 30px / 700 | 表單的金額輸入 |
| `amount-md` | 等寬 14px | 明細金額、統計金額 |
| `amount-sm` | 等寬 12px | 清單日期、佔比百分比 |
| `month-label` | 黑體 16px / 500 | 月份標籤 |
| `body-md` | 黑體 14px | 內文、備註、分類名 |
| `label-sm` | 黑體 12px | 欄位標籤、摘要列、存檔提示 |
| `column-head` | 黑體 11px / 字距 0.05em | 帳冊欄頭（日期／分類／備註／金額）、區塊標題上方的小標籤 |
| `button-lg` | 黑體 16px / 500 | 存檔 |
| `button-md` | 黑體 14px | 其餘按鈕、分頁、分類鈕 |

**月總額的 48px 是有上限的**：375px 扣掉左右內距剩 343px，等寬字每字約 31px，`$12,345,678`（含錢字號與逗號共 11 字）剛好貼齊。再放大就會撐出水平捲動，要改先量過這條線。

## Layout

手機優先的單欄版面，**沒有第二種版面**。桌機只是同一欄置中放寬，不另外設計。

```
外層容器  mx-auto  min-h-dvh  max-w-[780px]  px-4 md:px-8
          pb-[calc(4rem + env(safe-area-inset-bottom))]

頁首（兩頁共用）  pt-32px
  書名 ─────────────────── 1px rule    ← 識別與工作區的分界
  月份切換列（44px 觸控高）
  摘要：本月支出／共 N 筆 ＋ 月總額
  ═══════════════════════ 3px double ink  ← 合計雙底線
分頁列（在頁面流裡，不固定底部）  1px rule
主內容  區塊間距 32px
```

- 設計基準 **375px**（iPhone SE），內容最大寬 **780px**，唯一斷點 **768px**（Tailwind `md`）。
- 間距用 Tailwind v4 的 4px 基準：卡片內距 16px、欄位之間 20px、區塊之間 32px、格線欄間距 8px。
- 底部留 64px＋安全區，讓最後一列不貼著螢幕邊緣。

### 帳冊格線

兩張表（記帳頁的支出明細、統計頁的分類佔比）**用同一套骨架**，看起來要像同一本帳冊裡的兩頁。

| | 軌道寬度 | 列高內距 |
|---|---|---|
| 支出明細 | `3.25rem 4.25rem minmax(0,1fr) 6rem` | 上下 14px |
| 分類佔比 | `0.625rem minmax(0,1fr) 5.5rem 3.25rem` | 上下 12px |

- **軌道寬度寫死**，各列才對得齊 —— 每一列各自是一個 grid，寬度不固定的話欄位落點會跟著內容跑。
- **文字欄一律 `minmax(0,1fr)` ＋ `truncate`**，長備註截斷而不是把版面推到水平捲動。
- **金額欄的直線靠每一格自己畫 1px 左框接起來**，從欄頭一路貫穿到最後一列；列與列之間被橫線切斷 1px，就是紙本帳冊的樣子。欄頭要補一條同寬的透明左框，否則它的欄位會比下面每一列少 2px，直線就對不起來。

## Elevation & Depth

**沒有陰影，一個都沒有。** 深度完全由兩件事表達：

1. **紙／卡兩層底色差**（`paper` → `card`）。內容區塊放在 `card` 上，等於紙上再放一張紙。
2. **線條粗細**。這是主要的層級語言：

| 粗細 | 用途 |
|---|---|
| 1px `rule` | 卡片外框、欄頭底線、金額欄直線 |
| 1px `rule-soft` | 明細列之間的分隔線（比欄頭輕，列不搶欄頭） |
| 2px `ledger` | 目前分頁、金額欄 focus、編輯中那列的左標 |
| 2px `rule` | 金額輸入的底線（未 focus） |
| 3px `double` `ink` | 合計雙底線 |

**合計雙底線是會計慣例，不是裝飾**：單線是小計、雙線是總計，這條線本身就在說「上面那個數字是這個月的總數」。`border-double` 要 3px 才畫得出「線—空—線」，小於 3px 會退化成單線。

## Shapes

**幾乎是直角的。** 全站只有一種圓角：`rounded-sm`（4px），用在卡片、輸入框、按鈕、分類鈕。它小到只是把切口磨掉、不足以讓人覺得「圓」，正好符合紙頁的質地。

- `:focus-visible` 的 outline 圓角是 2px，比元件本身更硬。
- 明細的分類色塊是 **10px 正方形，不加圓角** —— 那是帳冊上蓋的印色，不是標籤。
- 圓餅圖是甜甜圈，`cutout: '62%'`；相鄰扇形用 2px 的 `card` 色描邊切開，不靠色差硬分。

## Components

> 讀 front matter 的兩點提醒：
>
> 1. **`backgroundColor` 填的是元件「實際疊上去的那層底色」。** 按鈕、分類鈕、清單列在程式碼裡本身是 `transparent`，這裡填 `paper` 或 `card` 是為了讓對比度檢查有東西可比 —— 不代表要在元件上真的寫一個 `bg-`。
> 2. **`borderColor` 不是 DESIGN.md 規格認可的 sub-token**，`design.md lint` 會對每一個發出 warning。這是刻意保留的：整套視覺的層級靠線建立，拿掉邊框色等於拿掉一半的設計系統。同理，六個分類色是資料驅動的，不會被任何元件引用，`orphaned-tokens` 的 warning 也是預期內。**lint 只要 `errors: 0` 就算過。**

### 按鈕

| 變體 | 樣子 | 用在哪 |
|---|---|---|
| `button-primary` | `ledger` 底、`card` 字、52px 高、滿寬 | 存檔（每個畫面只有一顆） |
| `button-primary-disabled` | 透明底、`rule` 框、`ink-soft` 字 | 存檔的禁用態 |
| `button-secondary` | 透明底、`rule` 框、`ink-soft` 字、44px | 「本月」、二次確認的「取消」 |
| `button-ghost` | 無框無底、`ink-soft` 字、44px | 月份箭頭、「取消編輯」 |
| `button-danger-quiet` | 無框無底、`ink-soft` 字 → hover / focus / active 轉 `alert` | 「刪除這筆」的入口 |
| `button-danger` | `alert` 底、`card` 字 | 二次確認後真的刪除的那顆 |

- **存檔按鈕禁用時要說明缺什麼。** 上方固定留一行 20px 高的提示（能存檔時留白），有字沒字都是一樣高，版面不跳動。按鈕變灰卻不說原因，使用者只會一直戳。
- **刪除入口平常維持 `ink-soft`。** 常駐的紅字會變成整頁最吵的東西，而它按下去還有一道確認才真的刪。觸控沒有 hover，所以 `hover` / `focus-visible` / `active` 三個狀態都要轉色。
- **二次確認就地展開**（刪除鈕原地換成「確定要刪除這筆嗎？」＋ 取消／刪除兩顆），不用 `window.confirm()`。
- 按下去的回饋一律用 `active:bg-rule-soft`，不做縮放或陰影動畫。

### 分類鈕（chips）

六顆一組、`grid-cols-3`、gap 8px、每顆 44px 高。未選：`rule` 框 ＋ `ink` 字；已選：`ledger` 底 ＋ `card` 字 ＋ `font-medium`。

**不用 `<select>`** —— 少一次展開收合，直接看得到六個選項。按鈕組不是單一控制項、`<label>` 綁不上去，必須用 `<fieldset>` ＋ `<legend>`；每顆要帶 `aria-pressed`。

### 輸入欄位

- **金額欄是底線式**（`input-underline`）：無外框、底部 2px `rule`，focus 時轉 `ledger`。輸入框本身 `outline-none`，**ring 與變色都掛在外層 wrapper 上** —— 全域的 focus ring 直接套在裸的 input 上會沿著整條線畫一圈。
- **日期與備註是框線式**（`input-boxed`）：1px `rule` 框、4px 圓角、44px 高、左右內距 12px。
- 每個欄位都有可見的 `label`（12px `ink-soft`），標籤與欄位間距 6px。
- 金額欄 `inputmode="numeric"`，手機直接跳數字鍵盤。

### 清單與表格

- **整列可點**（外層是 `<button>`，才拿得到原生觸控區與鍵盤焦點），點下去把該筆帶進上方的表單。**清單列不放刪除鈕** —— 375px 的一列已經排了四段，再塞一顆只能吃掉備註的可讀寬度，也會壓在整列的觸控區上。
- **編輯中那列**：底色 `rule-soft` 60%、左邊 2px `ledger` 標記，並帶 `aria-current`。
- 欄頭 11px `ink-soft` ＋ 0.05em 字距，底線 1px `rule`。

### 分頁

在頁面流裡的索引標籤（不是固定在底部的 app 式底列），底線 1px `rule`，目前分頁用 2px `ledger` 底框 ＋ `ink` 字。**刻意不用 `role="tablist"`** —— 那套要配 roving tabindex 與方向鍵才算完整，兩顆按鈕留在自然的 Tab 順序裡更單純。

### 空狀態

`card` 底 ＋ `rule` 框 ＋ 置中的 14px `ink-soft` 一句話，上下內距 56px。**空狀態要指路**（「用上面的表單記下第一筆支出」），不要只留一片空白。圓餅圖在無資料時整塊不顯示 —— 空資料丟給 Chart.js 會畫出一個沒有扇形的空白圓，看起來像壞掉。

## 響應式與無障礙驗收

**這一節是硬性下限，不是加分項。** 每次改動畫面後照著走一遍；沒過就是沒做完。

### 響應式

| # | 驗收條件 | 怎麼驗 |
|---|---|---|
| R1 | **375px 寬不得出現水平捲動。** 任何頁、任何狀態（含最長的備註、八位數金額、六顆分類鈕） | DevTools 切 iPhone SE，確認 `document.documentElement.scrollWidth === 375` |
| R2 | 月總額在 375px 放到 `$12,345,678`（11 字）仍不撐版 | 手動塞一筆大額記錄看 |
| R3 | ≥768px 時內容置中、最大寬 780px，左右內距由 16px 變 32px | 拉寬視窗看兩側留白對稱 |
| R4 | 桌機不另外設計版面 —— 只有月總額（48→60px）、圓餅圖（176→224px）、日期與備註欄（單欄→兩欄）三處隨斷點變 | 對照 `md:` 前綴只出現在這幾處 |
| R5 | 長備註以省略號截斷，不換行、不推寬欄位 | 輸入 50 字備註看 |
| R6 | 切換月份時，左右箭頭與「本月」按鈕位置不位移（「本月」用 `invisible` 隱藏而非 `v-if`） | 在本月與非本月之間來回切，盯著箭頭 |
| R7 | 頁面底部留 64px ＋ `env(safe-area-inset-bottom)`，iPhone 底部橫條不壓到最後一列 | 實機或模擬器看 |

### 無障礙

| # | 驗收條件 | 怎麼驗 |
|---|---|---|
| A1 | **所有 `input`、`button` 至少 44px 高**（`min-h-11`；存檔鈕 52px、色塊等非互動元素不在此限） | DevTools 量每一顆 |
| A2 | 每個輸入欄位都有**可見的文字標籤**；分類按鈕組用 `<fieldset>` ＋ `<legend>` | 看畫面，不要只看 `aria-label` |
| A3 | 只有圖示的按鈕（月份箭頭）要有 `aria-label` | 檢查 `◀` `▶` |
| A4 | **鍵盤 Tab 走得完整頁**，每個焦點都看得到 focus ring | 從網址列按 Tab 走到底 |
| A5 | **focus ring 只定義在 `src/style.css` 的 `:focus-visible` 一處**（2px `ledger` ＋ 2px offset），不要在元件裡各寫一套 | grep `focus-visible`，元件裡只該有語意上的例外（金額欄的 `focus-within`、刪除鈕的轉色） |
| A6 | **文字對比 ≥ 4.5:1**，唯二例外是兩處 placeholder（見〈Colors〉） | 用〈Colors〉的對比度表比對 |
| A7 | **不得有任何資訊只靠顏色傳達。** 圓餅圖旁一律附文字明細（分類名、金額、百分比），canvas 本身標 `aria-hidden="true"`，色塊也標 `aria-hidden` | 把畫面轉成灰階看，資訊要一樣完整 |
| A8 | `prefers-reduced-motion: reduce` 時，轉場、捲動與**圓餅圖動畫**全部停掉 | 系統開「減少動態效果」後點清單列（捲動）、切月份（圖表重畫） |
| A9 | 圓餅圖畫在 canvas 上，**CSS 的 `prefers-reduced-motion` 管不到** —— `CategoryPieChart.vue` 必須自己讀 `matchMedia` | 改圖表相關程式時特別確認這條還在 |
| A10 | 首次載入**不自動聚焦**（否則手機一開頁鍵盤就頂上來）；進入編輯與存完一筆後才把游標送回金額欄 | 手機開頁看鍵盤有沒有跳出來 |
| A11 | 一律系統字，**不載入任何遠端字型** | 看 Network 面板沒有字型請求 |

## Do's and Don'ts

- **Do** 一律用 token（`bg-paper`、`text-ink-soft`），**Don't** 在元件裡寫任何 hex 或 Tailwind 的內建色（`slate-500`、`red-600` 一律不用）。唯一例外是 `constants/categories.js` 的分類色定義與圓餅圖描邊。
- **Do** 用線條粗細與紙／卡兩層底色差建立層級，**Don't** 用陰影、漸層、玻璃效果、彩色標籤或第二種圓角。
- **Do** 讓所有數字走 `font-mono` ＋ `tabular-nums`，**Don't** 為了「好看」把金額換成比例字型 —— 欄位會對不齊。
- **Do** 把 `clay` 留給月總額、`alert` 留給刪除，**Don't** 拿這兩個顏色做別的強調。
- **Do** 帳冊線用實色，**Don't** 用透明度疊色（跨卡片邊界時會變兩種灰，直線接不起來）。
- **Do** 每張圖表都附等價的文字呈現，**Don't** 做出「只能靠顏色分辨」的畫面。
- **Do** 用 `<fieldset>` ＋ `<legend>` 包按鈕組，**Don't** 只丟一個 `aria-label` 就當作有標籤。
- **Do** 讓禁用的按鈕說明還缺什麼，且提示行固定佔位，**Don't** 讓提示出現／消失時把按鈕推上推下。
- **Do** 用文字標籤表達功能（「本月」「存檔」「刪除這筆」），**Don't** 放 emoji 或圖示字型當功能鈕；唯二的符號是月份箭頭 `◀` `▶`，而且它們各自帶 `aria-label`。
- **Do** 改 token 時同步改 `src/style.css` 與這份文件，**Don't** 建 `tailwind.config.js` 或 postcss 設定檔。
