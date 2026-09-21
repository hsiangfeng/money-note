<script setup>
import CategoryPieChart from './CategoryPieChart.vue'

// 統計頁的內容。
//
// 總支出與記帳筆數不在這裡 —— 頁首摘要兩個分頁共用，那兩個數字就在正上方，
// 這裡再列一次是同一個畫面上的兩份相同資料（2026-08-22 翻掉 08-16「不去重」那條）。
defineProps({
  stats: { type: Array, required: true },
})
</script>

<template>
  <section>
    <h2 class="font-title text-base">分類佔比</h2>

    <!--
      空資料丟給 Chart.js 會畫出一個沒有任何扇形的空白圓，看起來像壞掉，
      所以這裡擋在元件外面，跟記帳頁的空狀態同一個取向。
    -->
    <CategoryPieChart v-if="stats.length" class="mt-3" :stats="stats" />
    <p
      v-else
      class="mt-3 rounded-sm border border-rule bg-card px-6 py-14 text-center text-sm text-ink-soft"
    >
      這個月還沒有支出可以統計
    </p>
  </section>
</template>
