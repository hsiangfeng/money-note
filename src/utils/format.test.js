// format.js 的單元測試：金額千分位、日期字串切法、月份 key 的加減，
// 以及「今天」「本月」必須用當地時間而不是 UTC。
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  currentMonthKey,
  formatAmount,
  formatMonthDay,
  formatMonthLabel,
  shiftMonthKey,
  today,
} from './format.js'

describe('formatAmount', () => {
  it('0 顯示成 $0', () => {
    expect(formatAmount(0)).toBe('$0')
  })

  it('三位數以內沒有逗號', () => {
    expect(formatAmount(999)).toBe('$999')
  })

  it('千分位逗號，前面加 $', () => {
    expect(formatAmount(1200)).toBe('$1,200')
    expect(formatAmount(12480)).toBe('$12,480')
    expect(formatAmount(1234567)).toBe('$1,234,567')
  })
})

describe('formatMonthDay', () => {
  it('YYYY-MM-DD 切成 MM/DD，保留前導零', () => {
    expect(formatMonthDay('2026-08-07')).toBe('08/07')
    expect(formatMonthDay('2026-12-31')).toBe('12/31')
  })
})

describe('formatMonthLabel', () => {
  it('YYYY-MM 顯示成「YYYY 年 M 月」，月份去掉前導零', () => {
    expect(formatMonthLabel('2026-08')).toBe('2026 年 8 月')
    expect(formatMonthLabel('2026-01')).toBe('2026 年 1 月')
  })

  it('兩位數月份照常顯示', () => {
    expect(formatMonthLabel('2026-12')).toBe('2026 年 12 月')
  })
})

describe('shiftMonthKey', () => {
  it('往前一個月會跨年', () => {
    expect(shiftMonthKey('2026-01', -1)).toBe('2025-12')
  })

  it('往後一個月會跨年', () => {
    expect(shiftMonthKey('2026-12', 1)).toBe('2027-01')
  })

  it('同年內加減', () => {
    expect(shiftMonthKey('2026-08', -1)).toBe('2026-07')
    expect(shiftMonthKey('2026-08', 1)).toBe('2026-09')
  })

  it('加 0 回傳原月份', () => {
    expect(shiftMonthKey('2026-08', 0)).toBe('2026-08')
  })

  it('一次跨好幾年也算得對', () => {
    expect(shiftMonthKey('2026-03', -15)).toBe('2024-12')
    expect(shiftMonthKey('2026-03', 24)).toBe('2028-03')
  })

  it('往前再往後會回到原點', () => {
    let key = '2026-08'
    for (let i = 0; i < 30; i += 1) key = shiftMonthKey(key, -1)
    for (let i = 0; i < 30; i += 1) key = shiftMonthKey(key, 1)
    expect(key).toBe('2026-08')
  })
})

describe('today 與 currentMonthKey：一律用當地時間', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('當地時間早上 7 點，today 還是當天（不會被 UTC 拉回前一天）', () => {
    // new Date(y, m, d, h) 用的是當地時間。在台灣（UTC+8）2/1 早上 7 點換算 UTC
    // 還是 1/31 晚上 11 點，走 toISOString() 會拿到 "2026-01-31"，那就是錯的。
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 1, 1, 7, 0))
    expect(today()).toBe('2026-02-01')
    expect(currentMonthKey()).toBe('2026-02')
  })

  it('月底最後一分鐘還是同一個月', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 11, 31, 23, 59))
    expect(today()).toBe('2026-12-31')
    expect(currentMonthKey()).toBe('2026-12')
  })

  it('月份與日期都補到兩位數', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 2, 5, 12, 0))
    expect(today()).toBe('2026-03-05')
    expect(currentMonthKey()).toBe('2026-03')
  })
})
