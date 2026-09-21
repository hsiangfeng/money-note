<script setup>
import MonthSwitcher from './MonthSwitcher.vue'
import { formatAmount } from '../utils/format.js'

// 標題區 + 月份導覽 + 該月摘要。兩個分頁共用，所以總支出與筆數都放在這裡，
// 切到統計頁一樣看得到（SPEC 驗收條件 10、11）。
// 一樣只收 props、不碰資料層，月份導覽的三個事件原樣往上轉發。
defineProps({
  monthKey: { type: String, required: true },
  total: { type: Number, required: true },
  count: { type: Number, required: true },
  isCurrentMonth: { type: Boolean, required: true },
})

const emit = defineEmits(['prev', 'next', 'current'])
</script>

<template>
  <header class="pt-8">
    <h1 class="font-title text-[0.9375rem] tracking-[0.2em]">Money Note</h1>

    <!-- 把識別（書名）跟工作區（月份與數字）分開的那條線。 -->
    <div class="mt-3 border-t border-rule"></div>

    <div class="mt-3">
      <MonthSwitcher
        :month-key="monthKey"
        :is-current-month="isCurrentMonth"
        @prev="emit('prev')"
        @next="emit('next')"
        @current="emit('current')"
      />
    </div>

    <section class="mt-5">
      <p class="flex items-baseline justify-between text-xs text-ink-soft">
        <!-- 切到別的月份還寫「本月支出」會跟正上方的年月矛盾，跟統計頁同一條規則。 -->
        <span>{{ isCurrentMonth ? '本月支出' : '當月支出' }}</span>
        <span
          >共 <span class="tabular-nums">{{ count }}</span> 筆</span
        >
      </p>

      <!--
        整頁最重要的一個數字，所以字級給到能放的最大。
        375px 扣掉左右內距剩 343px，text-5xl 的等寬字每字約 31px ——
        八位數的 $12,345,678（含錢字號與逗號共 11 字）剛好貼齊，再大就會撐出水平捲動。
        個人記帳的月總額不會到這個量級，但要再放大就得先確認這條線。
      -->
      <p class="mt-2 font-mono text-5xl leading-none font-bold tabular-nums text-clay md:text-6xl">
        {{ formatAmount(total) }}
      </p>

      <!--
        合計雙底線。會計慣例：單線是小計、雙線是總計，所以這條線本身就在說
        「上面那個數字是這個月的總數」，不是裝飾。
        border-double 要 3px 才畫得出「線—空—線」，小於 3px 會退化成單線。
      -->
      <div class="mt-3 border-t-[3px] border-double border-ink"></div>
    </section>
  </header>
</template>
