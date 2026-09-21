// stats.js 的單元測試。這裡的函式都是純函式：吃一個記錄陣列、回傳結果，
// 所以不需要 DOM、不需要 localStorage，用 node 環境直接測。
//
// 三個特別在意的情境（見 CLAUDE.md）：
// 1. 那個月完全沒有記錄
// 2. 好幾個分類金額一樣時，順序不能跟著輸入順序漂移
// 3. 百分比是整數，不能帶一串小數
import { describe, expect, it } from 'vitest'
import { CATEGORIES } from '../constants/categories.js'
import { buildCategoryStats, sumAmount } from './stats.js'

// 測試資料只需要 amount 與 category，其他欄位對統計沒有影響，
// 但還是照 SPEC 第 4 節的資料模型補齊，避免之後有人拿它當範例照抄。
let seq = 0
function record(category, amount, date = '2026-08-07') {
  seq += 1
  return {
    id: `test-${seq}`,
    amount,
    category,
    date,
    note: '',
    createdAt: 1786077000000 + seq,
  }
}

const idsOf = (stats) => stats.map((row) => row.id)

describe('sumAmount', () => {
  it('沒有記錄時回傳 0，不是 undefined 或 NaN', () => {
    expect(sumAmount([])).toBe(0)
  })

  it('把所有記錄的 amount 加起來', () => {
    const records = [record('food', 120), record('transport', 32), record('food', 60)]
    expect(sumAmount(records)).toBe(212)
  })

  it('單一筆時就是那筆的金額', () => {
    expect(sumAmount([record('daily', 999)])).toBe(999)
  })
})

describe('buildCategoryStats：那個月完全沒有記錄', () => {
  it('空陣列回傳空陣列，不會列出一排 0', () => {
    expect(buildCategoryStats([])).toEqual([])
  })

  it('回傳的是陣列，元件可以直接 v-for 不用另外判斷 null', () => {
    expect(Array.isArray(buildCategoryStats([]))).toBe(true)
  })
})

describe('buildCategoryStats：基本計算', () => {
  it('只有一個分類時佔比是 100%', () => {
    const stats = buildCategoryStats([record('food', 500)])
    expect(stats).toEqual([
      { id: 'food', name: '飲食', color: '#9A4F20', amount: 500, percent: 100 },
    ])
  })

  it('同一分類多筆會合併成一列', () => {
    const stats = buildCategoryStats([record('food', 100), record('food', 250), record('food', 50)])
    expect(stats).toHaveLength(1)
    expect(stats[0].amount).toBe(400)
  })

  it('各分類的金額加總等於總額', () => {
    const records = [
      record('food', 5200),
      record('transport', 2800),
      record('daily', 1980),
      record('entertainment', 1500),
      record('medical', 700),
      record('other', 300),
    ]
    const stats = buildCategoryStats(records)
    expect(sumAmount(stats)).toBe(sumAmount(records))
  })

  it('依金額由大到小排序', () => {
    const stats = buildCategoryStats([
      record('other', 300),
      record('food', 5200),
      record('daily', 1980),
      record('transport', 2800),
    ])
    expect(idsOf(stats)).toEqual(['food', 'transport', 'daily', 'other'])
  })

  it('該月沒花到的分類不出現', () => {
    const stats = buildCategoryStats([record('food', 100), record('medical', 50)])
    expect(idsOf(stats)).toEqual(['food', 'medical'])
    expect(stats.some((row) => row.amount === 0)).toBe(false)
  })

  it('每一列都帶 id、name、color、amount、percent，元件直接畫就好', () => {
    const [row] = buildCategoryStats([record('transport', 32)])
    expect(row).toEqual({
      id: 'transport',
      name: '交通',
      color: '#245C4A',
      amount: 32,
      percent: 100,
    })
  })

  it('不會改動傳進來的陣列（純函式）', () => {
    const records = [record('other', 10), record('food', 500), record('daily', 300)]
    const snapshot = structuredClone(records)
    buildCategoryStats(records)
    expect(records).toEqual(snapshot)
  })
})

describe('buildCategoryStats：金額相同時順序不能亂跳', () => {
  // 六個分類各記一筆同額，不管記錄用什麼順序餵進來，
  // 結果一律等於 CATEGORIES 的宣告順序。
  const declaredOrder = CATEGORIES.map((category) => category.id)

  it('全部同額時等於 CATEGORIES 的宣告順序', () => {
    const records = declaredOrder.map((id) => record(id, 100))
    expect(idsOf(buildCategoryStats(records))).toEqual(declaredOrder)
  })

  it('記錄倒著餵進來，結果還是宣告順序（不是 Map 的插入順序）', () => {
    const records = [...declaredOrder].reverse().map((id) => record(id, 100))
    expect(idsOf(buildCategoryStats(records))).toEqual(declaredOrder)
  })

  it('記錄亂序餵進來，結果還是宣告順序', () => {
    const shuffled = ['medical', 'daily', 'other', 'food', 'entertainment', 'transport']
    const records = shuffled.map((id) => record(id, 100))
    expect(idsOf(buildCategoryStats(records))).toEqual(declaredOrder)
  })

  it('同一份資料不論輸入順序，輸出完全一樣', () => {
    const base = [
      record('daily', 300),
      record('food', 500),
      record('other', 100),
      record('transport', 300),
      record('entertainment', 100),
    ]
    const permutations = [
      base,
      [...base].reverse(),
      [base[2], base[0], base[4], base[1], base[3]],
      [base[4], base[3], base[2], base[1], base[0]],
    ]
    const results = permutations.map((records) => buildCategoryStats(records))
    for (const result of results) {
      expect(result).toEqual(results[0])
    }
  })

  it('部分平手：先比金額，平手的那幾個再退回宣告順序', () => {
    // 300 有 transport 與 daily 平手、100 有 entertainment 與 other 平手。
    // transport 宣告在 daily 前面、entertainment 宣告在 other 前面。
    const stats = buildCategoryStats([
      record('other', 100),
      record('daily', 300),
      record('entertainment', 100),
      record('food', 500),
      record('transport', 300),
    ])
    expect(idsOf(stats)).toEqual(['food', 'transport', 'daily', 'entertainment', 'other'])
  })

  it('同一分類拆成多筆與單筆同額，排序結果一樣', () => {
    // food 是 100 + 200，transport 是一筆 300：合併後同額，退回宣告順序 food 在前。
    const stats = buildCategoryStats([
      record('transport', 300),
      record('food', 100),
      record('food', 200),
    ])
    expect(idsOf(stats)).toEqual(['food', 'transport'])
  })

  it('對不到 CATEGORIES 的舊 id 還是算得進去，平手時排在最後', () => {
    const stats = buildCategoryStats([
      record('legacy-id', 100),
      record('other', 100),
      record('food', 100),
    ])
    expect(idsOf(stats)).toEqual(['food', 'other', 'legacy-id'])
    // 名稱對不到就顯示原字串，顏色給 fallback 的暖灰，那一列不能消失。
    const legacy = stats.find((row) => row.id === 'legacy-id')
    expect(legacy.name).toBe('legacy-id')
    expect(legacy.color).toBe('#B8AFA0')
    expect(sumAmount(stats)).toBe(300)
  })
})

describe('buildCategoryStats：百分比顯示整數', () => {
  it('三等分不會出現 33.333…，一律是 33', () => {
    const stats = buildCategoryStats([
      record('food', 1),
      record('transport', 1),
      record('daily', 1),
    ])
    expect(stats.map((row) => row.percent)).toEqual([33, 33, 33])
  })

  it('每一列的 percent 都是整數，字串裡沒有小數點', () => {
    // 故意挑除不盡的組合：7 / 31、11 / 31、13 / 31
    const stats = buildCategoryStats([
      record('food', 13),
      record('transport', 11),
      record('daily', 7),
    ])
    for (const row of stats) {
      expect(Number.isInteger(row.percent)).toBe(true)
      expect(String(row.percent)).not.toContain('.')
    }
    expect(stats.map((row) => row.percent)).toEqual([42, 35, 23])
  })

  it('四捨五入：小數 .5 進位', () => {
    // 1 / 8 = 12.5% → 13；7 / 8 = 87.5% → 88
    const stats = buildCategoryStats([record('food', 7), record('transport', 1)])
    expect(stats.map((row) => row.percent)).toEqual([88, 13])
  })

  it('四捨五入：未滿 .5 捨去', () => {
    // 1 / 3 = 33.33… → 33；2 / 3 = 66.66… → 67
    const stats = buildCategoryStats([record('food', 2), record('transport', 1)])
    expect(stats.map((row) => row.percent)).toEqual([67, 33])
  })

  it('金額很小的分類可以是 0%，但那一列還在', () => {
    // 10 / 5010 ≈ 0.2% → 0。SPEC 5.4：不補下限、明細照列。
    const stats = buildCategoryStats([record('food', 5000), record('other', 10)])
    expect(stats.map((row) => row.percent)).toEqual([100, 0])
    expect(stats[1].amount).toBe(10)
  })

  it('不強求加總剛好 100%（SPEC 5.4 明寫允許）', () => {
    const stats = buildCategoryStats([
      record('food', 1),
      record('transport', 1),
      record('daily', 1),
    ])
    const total = stats.reduce((sum, row) => sum + row.percent, 0)
    expect(total).toBe(99)
  })

  it('整除時剛好是整數', () => {
    const stats = buildCategoryStats([
      record('food', 700),
      record('transport', 200),
      record('daily', 100),
    ])
    expect(stats.map((row) => row.percent)).toEqual([70, 20, 10])
  })
})
