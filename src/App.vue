<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import StatsPanel from './components/StatsPanel.vue'
import TabBar from './components/TabBar.vue'
import { useRecords } from './composables/useRecords.js'

const {
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
} = useRecords()

// 目前在哪一個分頁。純粹的畫面狀態，不進 useRecords（那裡只管資料）。
// 標題與摘要在兩個分頁之上、不隨分頁重置，切到三月看記帳、切過去統計也還是三月。
const activeTab = ref('records')

// null 代表新增模式，有值就是正在編輯的那筆記錄的 id。
// 用 id 而不是畫面 index：清單是篩過、排過的，index 對不回儲存陣列。
const editingId = ref(null)

// 每存一次檔就 +1。新增模式下 editingId 存檔前後都是 null，
// 表單光看 record 認不出「又存了一筆」，要靠這個訊號才會清空重來。
const formResetKey = ref(0)

const formSection = ref(null)

const editingRecord = computed(() =>
  editingId.value === null
    ? null
    : (monthRecords.value.find((record) => record.id === editingId.value) ?? null),
)

// 切月份就退出編輯 —— 那一筆已經不在畫面上的清單裡，表單還停在編輯模式會對不上。
watch(monthKey, () => {
  editingId.value = null
})

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

async function openEdit(id) {
  editingId.value = id
  // 表單在清單上方，捲過去使用者才看得到自己正在改哪一筆。
  await nextTick()
  formSection.value?.scrollIntoView({
    behavior: reducedMotion.matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

function cancelEdit() {
  editingId.value = null
}

function onSave(payload) {
  if (editingId.value === null) {
    addRecord(payload)
  } else {
    updateRecord(editingId.value, payload)
    editingId.value = null
  }
  formResetKey.value += 1
}

function onDelete() {
  if (editingId.value === null) return
  deleteRecord(editingId.value)
  editingId.value = null
  formResetKey.value += 1
}
</script>

<template>
  <!--
    紙頁本身：手機滿版、桌機置中限寬 780px，不另外設計桌機版面。
    底色由 body 給，這裡只管欄寬與內距。
  -->
  <div
    class="mx-auto min-h-dvh w-full max-w-[780px] px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] md:px-8"
  >
    <AppHeader
      :month-key="monthKey"
      :total="monthTotal"
      :count="monthCount"
      :is-current-month="isCurrentMonth"
      @prev="shiftMonth(-1)"
      @next="shiftMonth(1)"
      @current="goToCurrentMonth"
    />

    <div class="mt-6">
      <TabBar :active="activeTab" @change="activeTab = $event" />
    </div>

    <main class="mt-6">
      <!-- v-show 不是 v-if：切去統計頁再切回來，表單裡打到一半的內容要還在。 -->
      <div v-show="activeTab === 'records'" class="space-y-8">
        <section ref="formSection" class="scroll-mt-4">
          <RecordForm
            :record="editingRecord"
            :reset-key="formResetKey"
            @save="onSave"
            @delete="onDelete"
            @cancel-edit="cancelEdit"
          />
        </section>

        <section>
          <!-- 區塊標籤沿用帳冊欄頭的字級（11px ＋ 0.05em 字距），不另外開一套小字。 -->
          <p class="text-[0.6875rem] tracking-wider text-ink-soft">最近紀錄</p>
          <h2 class="mt-1 font-title text-base">支出明細</h2>

          <RecordList
            v-if="monthRecords.length"
            class="mt-3"
            :records="monthRecords"
            :editing-id="editingId"
            @select="openEdit"
          />
          <p
            v-else
            class="mt-3 rounded-sm border border-rule bg-card px-6 py-14 text-center text-sm text-ink-soft"
          >
            這個月還沒有記錄，用上面的表單記下第一筆支出。
          </p>
        </section>
      </div>

      <!--
        統計頁用 v-if：圓餅圖在 display: none 的容器裡量不到寬高，
        用 v-show 藏起來再切回去，Chart.js 有機會算出 0 尺寸。
      -->
      <StatsPanel v-if="activeTab === 'stats'" :stats="categoryStats" />
    </main>
  </div>
</template>
