<script setup>
import { formatMonthLabel } from '../utils/format.js'

// 只負責月份導覽。跟 RecordList、StatsPanel 一樣只收 props、不碰資料層，
// 要切到哪一個月是 useRecords 的事，這裡只負責發出「往前」「往後」「回本月」。
// 總額不在這裡 —— 那是 AppHeader 摘要區的事。
defineProps({
  monthKey: { type: String, required: true },
  isCurrentMonth: { type: Boolean, required: true },
})

const emit = defineEmits(['prev', 'next', 'current'])
</script>

<template>
  <div class="flex items-center">
    <button
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-sm text-xs text-ink-soft transition-colors active:bg-rule-soft"
      aria-label="上個月"
      @click="emit('prev')"
    >
      ◀
    </button>

    <!--
      寬度寫死加 tabular-nums：8 月換成 12 月時字數會多一個，
      不固定寬度的話左右箭頭會被撐開推走。
    -->
    <span class="w-32 text-center text-base font-medium tabular-nums">
      {{ formatMonthLabel(monthKey) }}
    </span>

    <button
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-sm text-xs text-ink-soft transition-colors active:bg-rule-soft"
      aria-label="下個月"
      @click="emit('next')"
    >
      ▶
    </button>

    <!--
      看的就是本月時用 invisible 藏起來，不是 v-if —— v-if 會讓這顆按鈕整個不佔空間，
      而它靠 ml-auto 把自己推到最右邊，一消失左右箭頭就會跟著位移（SPEC 5.1
      「隱藏但保留版面空間」）。visibility: hidden 同時擋掉點擊與鍵盤聚焦，
      不用另外加 disabled。
    -->
    <button
      type="button"
      class="ml-auto min-h-11 rounded-sm border border-rule px-4 text-sm text-ink-soft transition-colors active:bg-rule-soft"
      :class="{ invisible: isCurrentMonth }"
      @click="emit('current')"
    >
      本月
    </button>
  </div>
</template>
