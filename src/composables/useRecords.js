import { computed, ref } from 'vue'
import { currentMonthKey, shiftMonthKey } from '../utils/format.js'
import { buildCategoryStats, sumAmount } from '../utils/stats.js'

// 全專案唯一碰 localStorage 的地方。元件不直接讀寫，將來要換成 API 呼叫時只改這個檔。
const STORAGE_KEY = 'money-note:records:v1'

// 讀不到或讀壞了一律當成空陣列，不要讓整個 app 掛掉。
// JSON.parse(null) 會回傳 null、壞字串會 throw，兩種都要收斂，所以兩道防線都不能省。
function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// crypto.randomUUID 只在 secure context 有值。手機實機測試走 `npm run dev -- --host`
// 是 http，沒有這個 fallback 的話按下存檔會直接爆，而且只在手機上爆。
function newId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// module 層級的單例：所有元件共用同一份 state，才不會各自持有一份舊資料。
const records = ref(load())
const monthKey = ref(currentMonthKey())

// 一筆屬於哪個月一律看 date，不看 createdAt（補記昨天的帳時兩者會是不同天）。
// date 本身就是當地時間的字串，直接切前七碼比較，不要繞去 new Date()。
const monthRecords = computed(() =>
  records.value
    .filter((record) => record.date.slice(0, 7) === monthKey.value)
    // 日期新到舊，同一天再依 createdAt 新到舊
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
)

// 統計的算法都在 utils/stats.js，這裡只負責把「該月的記錄」餵進去、包成 computed。
// 資料怎麼存、要算哪一段是這個檔的事；怎麼算是那個檔的事。
const monthTotal = computed(() => sumAmount(monthRecords.value))

const monthCount = computed(() => monthRecords.value.length)

// 「本月」依當地時間的今天判定，與 date 欄位的時區規則一致（都走 format.js）。
const isCurrentMonth = computed(() => monthKey.value === currentMonthKey())

// 切上／下個月。SPEC 5.1 明寫不限制可切到多久以前或以後，所以這裡不設上下限。
function shiftMonth(delta) {
  monthKey.value = shiftMonthKey(monthKey.value, delta)
}

function goToCurrentMonth() {
  monthKey.value = currentMonthKey()
}

const categoryStats = computed(() => buildCategoryStats(monthRecords.value))

function addRecord({ amount, category, date, note }) {
  records.value.push({
    id: newId(),
    amount,
    category,
    date,
    note,
    createdAt: Date.now(),
  })
  save(records.value)
}

// 識別一律用 id，不用畫面上的 index。畫面清單（monthRecords）是篩過、排過的，
// 順序跟 records（存檔先後）不同，拿畫面 index 來動 records 會改到別筆，而且不會報錯。
function updateRecord(id, { amount, category, date, note }) {
  const index = records.value.findIndex((record) => record.id === id)
  if (index === -1) return
  // 展開合併而不是逐欄指派：id 與 createdAt 自動留著（SPEC 5.2「編輯時」），
  // 將來資料多一個欄位也不會漏掉。
  records.value[index] = { ...records.value[index], amount, category, date, note }
  save(records.value)
}

function deleteRecord(id) {
  const index = records.value.findIndex((record) => record.id === id)
  if (index === -1) return
  records.value.splice(index, 1)
  save(records.value)
}

export function useRecords() {
  return {
    records,
    monthKey,
    monthRecords,
    monthTotal,
    monthCount,
    categoryStats,
    isCurrentMonth,
    shiftMonth,
    goToCurrentMonth,
    addRecord,
    updateRecord,
    deleteRecord,
  }
}
