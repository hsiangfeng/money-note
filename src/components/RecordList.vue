<script setup>
import { getCategoryName } from '../constants/categories.js'
import { formatAmount, formatMonthDay } from '../utils/format.js'

// 整列可點，點下去把該筆帶進上方的表單。刪除入口不放在列上，在表單裡（SPEC 5.3）。
defineProps({
  records: { type: Array, required: true },
  // 目前在表單裡編輯的那一筆。null 就是沒有人在編輯。
  editingId: { type: String, default: null },
})

// 傳出去的是這筆記錄的 id，不是「畫面上的第幾筆」——
// 這份清單是篩過、排過的，畫面 index 跟儲存陣列的位置對不上。
const emit = defineEmits(['select'])

/*
  四個欄位的軌道寬度寫死，各列才對得齊 —— 每一列各自是一個 grid（外層包 <button>
  才拿得到原生觸控區與鍵盤焦點），寬度不固定的話每列的欄位落點會跟著內容跑。
  備註欄用 minmax(0,1fr) 吃掉剩下的空間，長了就截斷，375px 才不會被推到水平捲動。
  欄頭也要跟著加一條同寬的透明左框，否則它的欄位會比下面每一列少 2px，
  金額欄那條直線就對不起來。
*/
const COLUMNS = 'grid-cols-[3.25rem_4.25rem_minmax(0,1fr)_6rem] gap-x-2'
</script>

<template>
  <div>
    <!-- 欄頭。帳冊的欄位名稱本身就是資訊：這四欄各是什麼，一眼看得出來。 -->
    <div
      :class="COLUMNS"
      class="grid items-end border-b border-l-2 border-b-rule border-l-transparent pb-1.5 text-[0.6875rem] tracking-wider text-ink-soft"
    >
      <span class="pl-1">日期</span>
      <span>分類</span>
      <span>備註</span>
      <span class="border-l border-rule pl-3 text-right">金額</span>
    </div>

    <ul>
      <!--
        :key 與 select 事件都用 record.id：前者給 Vue 判斷節點重用，後者告訴外層點了哪一筆。
        兩者剛好同一個值，但用途不同，不要因此改成用 index 省事。
      -->
      <li v-for="record in records" :key="record.id" class="border-b border-rule-soft">
        <!--
          金額欄的 border-l 從欄頭一路貫穿到最後一列 —— 靠每一格自己畫左框接起來，
          列與列之間被橫線切斷 1px，就是紙本帳冊的樣子。
        -->
        <button
          type="button"
          class="grid w-full border-l-2 text-left transition-colors"
          :class="[
            COLUMNS,
            editingId === record.id
              ? 'border-l-ledger bg-rule-soft/60'
              : 'border-l-transparent active:bg-rule-soft/60',
          ]"
          :aria-current="editingId === record.id ? 'true' : undefined"
          @click="emit('select', record.id)"
        >
          <span class="py-3.5 pl-1 font-mono text-xs tabular-nums text-ink-soft">
            {{ formatMonthDay(record.date) }}
          </span>
          <span class="py-3.5 text-sm text-ink-soft">
            {{ getCategoryName(record.category) }}
          </span>
          <span class="min-w-0 truncate py-3.5 text-sm">
            {{ record.note }}
          </span>
          <span
            class="flex items-center justify-end border-l border-rule py-3.5 pl-3 font-mono text-sm tabular-nums"
          >
            {{ formatAmount(record.amount) }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
