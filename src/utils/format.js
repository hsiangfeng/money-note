// 金額與日期的格式化，以及「今天」「本月」的取值。
//
// 時間一律用當地時間，不用 UTC —— toISOString() 會在台灣早上八點前產生差一天的結果，
// 所以這裡全部走 Date 的 getFullYear / getMonth / getDate。
// 這條規則只寫在這個檔案裡，其他地方一律呼叫這些函式，不要自己組。

const amountFormatter = new Intl.NumberFormat('zh-TW')

const pad = (value) => String(value).padStart(2, '0')

// 1200 → "$1,200"
export function formatAmount(amount) {
  return `$${amountFormatter.format(amount)}`
}

// "2026-08-07" → "08/07"
// 直接切字串，不繞去 new Date()：那會把日期當成 UTC 午夜解析，在台灣是前一天。
export function formatMonthDay(date) {
  return `${date.slice(5, 7)}/${date.slice(8, 10)}`
}

// "2026-08" → "2026 年 8 月"
// 月份去掉前導零：帳冊上寫的是「8 月」不是「08 月」。
// 一樣直接切字串，理由同 formatMonthDay。
export function formatMonthLabel(monthKey) {
  return `${monthKey.slice(0, 4)} 年 ${Number(monthKey.slice(5, 7))} 月`
}

// 當地時間的今天，YYYY-MM-DD
export function today() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// Date → YYYY-MM（當地時間）
function monthKeyOf(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

// 當地時間的本月，YYYY-MM
export function currentMonthKey() {
  return monthKeyOf(new Date())
}

// 月份加減：("2026-01", -1) → "2025-12"
//
// 跨年交給原生 Date 進位 —— 月份參數給 -1 或 12 它會自己往前後年推，
// 不用另外判斷邊界。日固定給 1，避開「1/31 加一個月」溢位到 3 月那種老問題。
export function shiftMonthKey(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number)
  return monthKeyOf(new Date(year, month - 1 + delta, 1))
}
