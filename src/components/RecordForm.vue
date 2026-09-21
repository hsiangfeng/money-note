<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { CATEGORIES } from '../constants/categories.js'
import { today } from '../utils/format.js'

const props = defineProps({
  // null 就是新增模式。表單常駐在頁面上，取消編輯或存完檔父層就會把它清成 null。
  record: { type: Object, default: null },
  // 父層每存一次檔就 +1。新增模式下存檔前後 record 都是 null，
  // 光靠 record 的 watch 認不出「又存了一筆」，表單不會清空，所以要有這個訊號。
  resetKey: { type: Number, default: 0 },
})

const emit = defineEmits(['save', 'delete', 'cancel-edit'])

const amount = ref('')
const category = ref('')
const date = ref(today())
const note = ref('')
const amountInput = ref(null)

// 表單常駐、沒有收合動畫要等，所以直接從 props 推導就好，不必像 bottom sheet 版那樣存快照。
const isEditing = computed(() => props.record !== null)
const isConfirmingDelete = ref(false)

// 金額只收正整數，所以在輸入的當下就把非數字濾掉，不要讓使用者打完才發現存不了。
// 前導零去掉，但單獨一個 "0" 要留著 —— 讓存檔按鈕維持禁用，使用者才看得懂為什麼按不下去。
function onAmountInput(event) {
  amount.value = event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
}

// SPEC 只寫了金額為空或 0 要禁用，但分類同樣必填且沒有預設值，
// 不一起擋的話會存進 category 是空字串的記錄。
const canSave = computed(() => Number(amount.value) > 0 && category.value !== '')

// 重載表單：有 record 就帶入原值，沒有就清空。
//
// 不加 immediate 是刻意的 —— 首次掛載不跑，手機一開頁才不會因為自動聚焦金額欄
// 就把鍵盤頂上來。之後每次「點清單某列」「取消編輯」「存完一筆」都會觸發。
watch([() => props.record, () => props.resetKey], async () => {
  const record = props.record
  // 不重設的話，展開確認後改點別筆，會直接看到紅色的刪除鈕。
  isConfirmingDelete.value = false
  // 金額這條路徑上一律是字串（onAmountInput 產出的就是），帶入時也要轉。
  amount.value = record ? String(record.amount) : ''
  category.value = record?.category ?? ''
  date.value = record?.date ?? today()
  note.value = record?.note ?? ''
  await nextTick()
  // 存完一筆直接接著記下一筆，游標已經在金額欄了。
  amountInput.value?.focus()
})

function onSubmit() {
  if (!canSave.value) return
  emit('save', {
    amount: Number(amount.value),
    category: category.value,
    date: date.value,
    note: note.value.trim(),
  })
}
</script>

<template>
  <form class="rounded-sm border border-rule bg-card px-4 py-4" @submit.prevent="onSubmit">
    <!-- 高度固定成 44px：編輯時右邊多一顆按鈕，不固定的話切換模式整張卡會抽動。 -->
    <div class="flex min-h-11 items-center justify-between">
      <div>
        <!-- 區塊標籤沿用帳冊欄頭的字級（11px ＋ 0.05em 字距），不另外開一套小字。 -->
        <p class="text-[0.6875rem] tracking-wider text-ink-soft">
          {{ isEditing ? '編輯紀錄' : '新增紀錄' }}
        </p>
        <h2 class="mt-1 font-title text-base">{{ isEditing ? '編輯這筆' : '記一筆' }}</h2>
      </div>
      <button
        v-if="isEditing"
        type="button"
        class="-mr-2 min-h-11 rounded-sm px-2 text-sm text-ink-soft"
        @click="emit('cancel-edit')"
      >
        取消編輯
      </button>
    </div>

    <div class="mt-3">
      <label for="record-amount" class="block text-xs text-ink-soft">金額</label>
      <!--
        輸入框本身沒有邊框，全域的 focus ring 直接套上去會沿著整條裸線畫一圈，
        所以把 ring 與變色都掛在外層 wrapper 上，輸入框自己 outline-none。
      -->
      <div
        class="mt-1.5 flex items-baseline gap-2 border-b-2 border-rule pb-1.5 transition-colors focus-within:border-ledger focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ledger"
      >
        <span class="font-mono text-xl text-ink-soft">$</span>
        <input
          id="record-amount"
          ref="amountInput"
          :value="amount"
          type="text"
          inputmode="numeric"
          placeholder="0"
          class="h-11 w-full bg-transparent font-mono text-3xl font-bold tabular-nums text-ink outline-none placeholder:text-rule"
          @input="onAmountInput"
        />
      </div>
    </div>

    <!-- 按鈕組不是單一控制項，label 綁不上去，要用 fieldset + legend 才報得出「分類」。 -->
    <fieldset class="mt-5">
      <legend class="text-xs text-ink-soft">分類</legend>
      <div class="mt-1.5 grid grid-cols-3 gap-2">
        <button
          v-for="item in CATEGORIES"
          :key="item.id"
          type="button"
          class="min-h-11 rounded-sm border text-sm transition-colors"
          :class="
            category === item.id
              ? 'border-ledger bg-ledger font-medium text-card'
              : 'border-rule text-ink active:bg-rule-soft'
          "
          :aria-pressed="category === item.id"
          @click="category = item.id"
        >
          {{ item.name }}
        </button>
      </div>
    </fieldset>

    <div class="mt-5 md:grid md:grid-cols-2 md:gap-4">
      <div>
        <label for="record-date" class="block text-xs text-ink-soft">日期</label>
        <input
          id="record-date"
          v-model="date"
          type="date"
          class="mt-1.5 min-h-11 w-full rounded-sm border border-rule bg-card px-3 font-mono text-sm tabular-nums text-ink"
        />
      </div>

      <div class="mt-5 md:mt-0">
        <label for="record-note" class="block text-xs text-ink-soft">備註（選填）</label>
        <input
          id="record-note"
          v-model="note"
          type="text"
          maxlength="50"
          placeholder="例如：全家咖啡"
          class="mt-1.5 min-h-11 w-full rounded-sm border border-rule bg-card px-3 text-sm text-ink placeholder:text-ink-soft/60"
        />
      </div>
    </div>

    <!--
      按鈕變灰但不說為什麼，使用者只會一直戳。這行固定佔位，
      能存的時候留白 —— 有字沒字都是一樣高，不會把按鈕推上推下。
    -->
    <p id="record-save-hint" class="mt-5 min-h-5 text-xs text-ink-soft">
      {{ canSave ? '' : '填金額、選分類後就能存檔' }}
    </p>

    <button
      type="submit"
      :disabled="!canSave"
      aria-describedby="record-save-hint"
      class="min-h-13 w-full rounded-sm bg-ledger text-base font-medium text-card transition-colors disabled:border disabled:border-rule disabled:bg-transparent disabled:text-ink-soft"
    >
      存檔
    </button>

    <!--
      二次確認就地展開，不用 window.confirm() —— 系統對話框在 iOS 上樣式突兀、
      會強制收鍵盤，而且會阻塞瀏覽器自動化。就地確認讓拇指不用移動位置。
      裡面每一顆都要寫 type="button"，在 <form> 裡預設是 submit，漏寫會變成按刪除卻存檔。
    -->
    <div v-if="isEditing" class="mt-3 border-t border-rule pt-3">
      <!--
        這顆只是入口，按下去還有一道確認才會真的刪，所以平常維持次要文字的灰
        —— 常駐的紅字會變成整頁最吵的東西。碰到才轉成警告紅。
        觸控沒有 hover，補一個 active 讓手機按下去也有同樣的回饋。
      -->
      <button
        v-if="!isConfirmingDelete"
        type="button"
        class="min-h-11 w-full rounded-sm text-sm text-ink-soft transition-colors hover:text-alert focus-visible:text-alert active:text-alert"
        @click="isConfirmingDelete = true"
      >
        刪除這筆
      </button>
      <div v-else>
        <p class="mb-2 text-center text-sm text-ink-soft">確定要刪除這筆嗎？</p>
        <div class="flex gap-2">
          <button
            type="button"
            class="min-h-11 flex-1 rounded-sm border border-rule text-sm"
            @click="isConfirmingDelete = false"
          >
            取消
          </button>
          <button
            type="button"
            class="min-h-11 flex-1 rounded-sm bg-alert text-sm font-medium text-card"
            @click="emit('delete')"
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
