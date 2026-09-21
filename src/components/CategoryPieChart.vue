<script setup>
import { Chart as ChartJS, ArcElement } from 'chart.js'
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { formatAmount } from '../utils/format.js'

// Chart.js v4 要自己註冊用得到的部件。這裡只註冊 ArcElement：
// controller 由 vue-chartjs 的 <Doughnut> 自己帶，Tooltip 與 Legend 則刻意不註冊 ——
// 資料全在下面的文字明細裡，tooltip 在手機上要 touch 才出得來，
// legend 也顯示不了金額，兩個都是白背的體積。
ChartJS.register(ArcElement)

// 金額、百分比、顏色、排序都在 utils/stats.js 算好了，這裡只負責畫。
// 沿用其他元件的做法：收 props、不碰資料層。
const props = defineProps({
  stats: { type: Array, required: true },
})

// 從 props 推導，不在元件裡另存一份副本 —— vue-chartjs 收到新的 data 物件才會重畫，
// 「新增一筆後統計同步更新」就是靠這條路徑成立的。
const chartData = computed(() => ({
  labels: props.stats.map((item) => item.name),
  datasets: [
    {
      data: props.stats.map((item) => item.amount),
      backgroundColor: props.stats.map((item) => item.color),
      // 用卡片的紙色把相鄰扇形切開，不必靠色差硬分。
      borderColor: '#FFFDF8',
      borderWidth: 2,
    },
  ],
}))

// 圖畫在 canvas 上，CSS 的 prefers-reduced-motion 管不到，要自己問一次。
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// maintainAspectRatio 關掉、由外層容器決定高度，否則 canvas 會照著寬度長高，
// 375px 的手機上會佔掉整個畫面。
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  animation: prefersReducedMotion ? false : { duration: 200 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}

// 跟 RecordList 同一套欄位骨架：色塊、名稱、金額、佔比，
// 金額與佔比各自帶一條左框，湊成帳冊的直欄線。
const COLUMNS = 'grid-cols-[0.625rem_minmax(0,1fr)_5.5rem_3.25rem] gap-x-2'
</script>

<template>
  <div class="rounded-sm border border-rule bg-card px-4 py-5">
    <!--
      canvas 對螢幕閱讀器是空的、文字也選不起來，所以整塊標成 aria-hidden，
      真正的資料來源是下面那張明細表。圖只是幫忙一眼看出比例。
    -->
    <div class="mx-auto h-44 w-44 md:h-56 md:w-56" aria-hidden="true">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <div class="mt-6">
      <div
        :class="COLUMNS"
        class="grid items-end border-b border-rule pb-1.5 text-[0.6875rem] tracking-wider text-ink-soft"
      >
        <span class="col-span-2">分類</span>
        <span class="border-l border-rule pl-3 text-right">金額</span>
        <span class="border-l border-rule pl-3 text-right">佔比</span>
      </div>

      <ul>
        <li
          v-for="item in stats"
          :key="item.id"
          :class="COLUMNS"
          class="grid items-stretch border-b border-rule-soft"
        >
          <!-- 方塊像帳冊上蓋的印色。顏色只是輔助，右邊三欄全部有文字。 -->
          <span class="flex items-center" aria-hidden="true">
            <span class="h-2.5 w-2.5" :style="{ backgroundColor: item.color }"></span>
          </span>

          <span class="min-w-0 truncate py-3 text-sm">{{ item.name }}</span>

          <span
            class="flex items-center justify-end border-l border-rule py-3 pl-3 font-mono text-sm tabular-nums"
          >
            {{ formatAmount(item.amount) }}
          </span>

          <span
            class="flex items-center justify-end border-l border-rule py-3 pl-3 font-mono text-xs tabular-nums text-ink-soft"
          >
            {{ item.percent }}%
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
