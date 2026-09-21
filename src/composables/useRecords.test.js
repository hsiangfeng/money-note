// useRecords.js 的單元測試：月份篩選、該月總額與筆數、CRUD 之後統計是否同步、
// localStorage 讀壞時的收斂。這一層決定「哪些記錄算進這個月」，算法本身在 stats.js。
//
// useRecords 是 module 層級的單例，所以每個測試都 vi.resetModules() 之後重新 import，
// 才不會上一個測試存的記錄漏到下一個測試。localStorage 用一個 Map 假的，node 環境沒有真的。
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const STORAGE_KEY = 'money-note:records:v1'

function createFakeStorage() {
  const store = new Map()
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value))
    },
    removeItem: (key) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  }
}

// 「今天」固定在 2026-08-15 中午（當地時間），本月就是 2026-08。
const TODAY = new Date(2026, 7, 15, 12, 0)

let storage

async function loadUseRecords() {
  vi.resetModules()
  const { useRecords } = await import('./useRecords.js')
  return useRecords()
}

beforeEach(() => {
  storage = createFakeStorage()
  vi.stubGlobal('localStorage', storage)
  vi.useFakeTimers()
  vi.setSystemTime(TODAY)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('讀取 localStorage', () => {
  it('什麼都沒存過：空清單、總額 0、筆數 0、統計空陣列', async () => {
    const { records, monthTotal, monthCount, categoryStats, monthRecords } = await loadUseRecords()
    expect(records.value).toEqual([])
    expect(monthRecords.value).toEqual([])
    expect(monthTotal.value).toBe(0)
    expect(monthCount.value).toBe(0)
    expect(categoryStats.value).toEqual([])
  })

  it('存的不是合法 JSON：當成空陣列，不讓整個 app 掛掉', async () => {
    storage.setItem(STORAGE_KEY, '{這不是 JSON')
    const { records, monthTotal } = await loadUseRecords()
    expect(records.value).toEqual([])
    expect(monthTotal.value).toBe(0)
  })

  it('存的是 JSON 但不是陣列：一樣當成空陣列', async () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ amount: 100 }))
    const { records } = await loadUseRecords()
    expect(records.value).toEqual([])
  })

  it('用的是 money-note:records:v1 這把 key', async () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 'a', amount: 120, category: 'food', date: '2026-08-07', note: '', createdAt: 1 },
      ]),
    )
    const { monthTotal, monthCount } = await loadUseRecords()
    expect(monthTotal.value).toBe(120)
    expect(monthCount.value).toBe(1)
  })
})

describe('那個月完全沒有記錄', () => {
  it('預設檢視本月（依當地時間），這個月沒記錄但別的月有：三個數字都是空的', async () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 'a', amount: 500, category: 'food', date: '2026-07-31', note: '', createdAt: 1 },
        { id: 'b', amount: 300, category: 'daily', date: '2026-09-01', note: '', createdAt: 2 },
      ]),
    )
    const { monthKey, monthRecords, monthTotal, monthCount, categoryStats } = await loadUseRecords()
    expect(monthKey.value).toBe('2026-08')
    expect(monthRecords.value).toEqual([])
    expect(monthTotal.value).toBe(0)
    expect(monthCount.value).toBe(0)
    expect(categoryStats.value).toEqual([])
  })

  it('切到沒有記錄的月份，統計跟著變空；切回來又回來', async () => {
    const { addRecord, shiftMonth, monthTotal, monthCount, categoryStats } = await loadUseRecords()
    addRecord({ amount: 120, category: 'food', date: '2026-08-07', note: '' })
    expect(monthTotal.value).toBe(120)

    shiftMonth(-1)
    expect(monthTotal.value).toBe(0)
    expect(monthCount.value).toBe(0)
    expect(categoryStats.value).toEqual([])

    shiftMonth(1)
    expect(monthTotal.value).toBe(120)
    expect(monthCount.value).toBe(1)
    expect(categoryStats.value).toHaveLength(1)
  })
})

describe('一筆屬於哪個月看 date，不看 createdAt', () => {
  it('8 月補記 7 月的帳：本月不算，切到 7 月才算', async () => {
    const { addRecord, shiftMonth, monthTotal, monthCount } = await loadUseRecords()
    // createdAt 會是 Date.now()，也就是 2026-08-15；date 是 7 月。
    addRecord({ amount: 250, category: 'transport', date: '2026-07-20', note: '補記' })

    expect(monthTotal.value).toBe(0)
    expect(monthCount.value).toBe(0)

    shiftMonth(-1)
    expect(monthTotal.value).toBe(250)
    expect(monthCount.value).toBe(1)
  })

  it('總額只加當前檢視月份的記錄', async () => {
    const { addRecord, monthTotal, monthCount, records } = await loadUseRecords()
    addRecord({ amount: 100, category: 'food', date: '2026-08-01', note: '' })
    addRecord({ amount: 200, category: 'food', date: '2026-08-31', note: '' })
    addRecord({ amount: 400, category: 'food', date: '2026-07-31', note: '' })
    addRecord({ amount: 800, category: 'food', date: '2026-09-01', note: '' })

    expect(records.value).toHaveLength(4)
    expect(monthTotal.value).toBe(300)
    expect(monthCount.value).toBe(2)
  })
})

describe('該月清單的排序', () => {
  it('日期新到舊，同一天再依 createdAt 新到舊', async () => {
    const { addRecord, monthRecords } = await loadUseRecords()
    vi.setSystemTime(new Date(2026, 7, 15, 9, 0))
    addRecord({ amount: 1, category: 'food', date: '2026-08-07', note: '早的' })
    vi.setSystemTime(new Date(2026, 7, 15, 10, 0))
    addRecord({ amount: 2, category: 'food', date: '2026-08-07', note: '晚的' })
    vi.setSystemTime(new Date(2026, 7, 15, 11, 0))
    addRecord({ amount: 3, category: 'food', date: '2026-08-01', note: '更早的日期' })
    addRecord({ amount: 4, category: 'food', date: '2026-08-12', note: '最新的日期' })

    expect(monthRecords.value.map((record) => record.note)).toEqual([
      '最新的日期',
      '晚的',
      '早的',
      '更早的日期',
    ])
  })
})

describe('新增、編輯、刪除之後統計同步', () => {
  it('新增後總額、筆數、分類佔比都更新，並寫進 localStorage', async () => {
    const { addRecord, monthTotal, monthCount, categoryStats } = await loadUseRecords()
    addRecord({ amount: 120, category: 'food', date: '2026-08-07', note: '全家咖啡' })
    addRecord({ amount: 32, category: 'transport', date: '2026-08-07', note: '捷運' })

    expect(monthTotal.value).toBe(152)
    expect(monthCount.value).toBe(2)
    expect(categoryStats.value.map((row) => [row.id, row.amount, row.percent])).toEqual([
      ['food', 120, 79],
      ['transport', 32, 21],
    ])

    const saved = JSON.parse(storage.getItem(STORAGE_KEY))
    expect(saved).toHaveLength(2)
    expect(saved[0]).toMatchObject({ amount: 120, category: 'food', date: '2026-08-07' })
    expect(typeof saved[0].id).toBe('string')
    expect(saved[0].createdAt).toBe(TODAY.getTime())
  })

  it('編輯金額後總額跟著變，id 與 createdAt 保留', async () => {
    const { addRecord, updateRecord, records, monthTotal } = await loadUseRecords()
    addRecord({ amount: 100, category: 'food', date: '2026-08-07', note: '' })
    const [original] = records.value

    updateRecord(original.id, { amount: 250, category: 'daily', date: '2026-08-07', note: '改過' })

    expect(monthTotal.value).toBe(250)
    expect(records.value[0]).toEqual({
      ...original,
      amount: 250,
      category: 'daily',
      note: '改過',
    })
    expect(JSON.parse(storage.getItem(STORAGE_KEY))[0].amount).toBe(250)
  })

  it('把日期改到上個月：本月消失、上個月出現', async () => {
    const { addRecord, updateRecord, shiftMonth, records, monthTotal, monthCount } =
      await loadUseRecords()
    addRecord({ amount: 300, category: 'food', date: '2026-08-07', note: '' })
    const [record] = records.value

    updateRecord(record.id, { ...record, date: '2026-07-07' })

    expect(monthTotal.value).toBe(0)
    expect(monthCount.value).toBe(0)

    shiftMonth(-1)
    expect(monthTotal.value).toBe(300)
    expect(monthCount.value).toBe(1)
  })

  it('刪除後該筆從總額與分類佔比消失', async () => {
    const { addRecord, deleteRecord, records, monthTotal, monthCount, categoryStats } =
      await loadUseRecords()
    addRecord({ amount: 100, category: 'food', date: '2026-08-07', note: '' })
    addRecord({ amount: 50, category: 'medical', date: '2026-08-07', note: '' })
    const medical = records.value.find((record) => record.category === 'medical')

    deleteRecord(medical.id)

    expect(monthTotal.value).toBe(100)
    expect(monthCount.value).toBe(1)
    expect(categoryStats.value.map((row) => row.id)).toEqual(['food'])
    expect(JSON.parse(storage.getItem(STORAGE_KEY))).toHaveLength(1)
  })

  it('刪到一筆都不剩：回到空狀態', async () => {
    const { addRecord, deleteRecord, records, monthTotal, monthCount, categoryStats } =
      await loadUseRecords()
    addRecord({ amount: 100, category: 'food', date: '2026-08-07', note: '' })
    deleteRecord(records.value[0].id)

    expect(monthTotal.value).toBe(0)
    expect(monthCount.value).toBe(0)
    expect(categoryStats.value).toEqual([])
  })

  it('找不到 id 時 update 與 delete 什麼都不動', async () => {
    const { addRecord, updateRecord, deleteRecord, records, monthTotal } = await loadUseRecords()
    addRecord({ amount: 100, category: 'food', date: '2026-08-07', note: '' })
    // records 是 reactive Proxy，structuredClone 複製不了，逐筆展開成普通物件。
    const before = records.value.map((record) => ({ ...record }))

    updateRecord('不存在的 id', { amount: 999, category: 'other', date: '2026-08-07', note: '' })
    deleteRecord('不存在的 id')

    expect(records.value).toEqual(before)
    expect(monthTotal.value).toBe(100)
  })
})

describe('月份切換', () => {
  it('shiftMonth 可以跨年，goToCurrentMonth 一次跳回本月', async () => {
    const { monthKey, shiftMonth, goToCurrentMonth, isCurrentMonth } = await loadUseRecords()
    expect(isCurrentMonth.value).toBe(true)

    for (let i = 0; i < 10; i += 1) shiftMonth(-1)
    expect(monthKey.value).toBe('2025-10')
    expect(isCurrentMonth.value).toBe(false)

    goToCurrentMonth()
    expect(monthKey.value).toBe('2026-08')
    expect(isCurrentMonth.value).toBe(true)
  })
})
