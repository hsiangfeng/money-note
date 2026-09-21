// 統計的計算邏輯，全部是純函式：吃一個記錄陣列、回傳結果，
// 不碰 localStorage、不碰 Vue 的 ref、不知道畫面長什麼樣子。
//
// 這裡 import CATEGORIES 不影響「純」—— 分類是寫死在程式碼裡的編譯期常數，
// 不是會變動的狀態，同樣的輸入永遠得到同樣的輸出。
//
// 傳進來的陣列必須先篩過月份。要算哪一段是呼叫端的事，這個檔只負責算。
import { CATEGORIES, getCategoryColor, getCategoryName } from '../constants/categories.js'

export function sumAmount(records) {
  return records.reduce((sum, record) => sum + record.amount, 0)
}

// 金額相同時的排序依據。SPEC 只寫「依金額由大到小」，沒說平手怎麼辦 ——
// 不定規則的話順序會跟著記錄的輸入順序漂移，同一份資料重整前後可能換位。
const CATEGORY_ORDER = new Map(CATEGORIES.map((category, index) => [category.id, index]))
const orderOf = (id) => CATEGORY_ORDER.get(id) ?? CATEGORIES.length

// 各分類的金額與佔比，已排序、已算好百分比與顏色，元件直接畫就好。
//
// 從記錄反推分類，不是拿 CATEGORIES 去對記錄 —— 沒花到的分類根本不會進 Map，
// 自然不會列出一排 0。順帶讓萬一對不到 CATEGORIES 的舊 id 也還是算得進去，
// 各分類加起來才不會跟總額對不上。
export function buildCategoryStats(records) {
  const total = sumAmount(records)
  if (total === 0) return []

  const sums = new Map()
  for (const record of records) {
    sums.set(record.category, (sums.get(record.category) ?? 0) + record.amount)
  }

  return [...sums]
    .map(([id, amount]) => ({
      id,
      name: getCategoryName(id),
      color: getCategoryColor(id),
      amount,
      // 四捨五入到整數，加起來不見得剛好 100%，這是 SPEC 允許的，不要另外補償。
      percent: Math.round((amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount || orderOf(a.id) - orderOf(b.id))
}
