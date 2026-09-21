<script setup>
// 分頁。兩個分頁而已，不裝 Vue Router —— 目前在哪一頁是 App.vue 的一個 ref。
defineProps({
  active: { type: String, required: true },
})

const emit = defineEmits(['change'])

const TABS = [
  { id: 'records', label: '記帳' },
  { id: 'stats', label: '統計' },
]
</script>

<template>
  <!--
    帳冊的索引標籤：跟著頁面捲動，不固定在畫面底部。
    刻意不用 role="tablist" —— 那套要配 roving tabindex 與方向鍵才算完整，
    兩顆按鈕留在自然的 Tab 順序裡更單純，可見標籤與鍵盤焦點一樣都有。
  -->
  <nav aria-label="分頁" class="border-b border-rule">
    <ul class="-mb-px flex">
      <li v-for="tab in TABS" :key="tab.id">
        <button
          type="button"
          class="min-h-11 border-b-2 px-5 text-sm transition-colors"
          :class="
            active === tab.id
              ? 'border-ledger font-medium text-ink'
              : 'border-transparent text-ink-soft active:bg-rule-soft'
          "
          :aria-current="active === tab.id ? 'page' : undefined"
          @click="emit('change', tab.id)"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>
