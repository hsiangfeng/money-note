// 分類清單的唯一真實來源。
//
// 記錄裡存的是 id 不是顯示名稱，所以「已經用過的 id 不可以刪除或改名」——
// 改了舊記錄就對不到分類。要加分類就直接補一組新的 id。
//
// color 給統計頁的圓餅圖用。顏色只是輔助，名稱、金額、百分比一律另外有文字，
// 不靠顏色傳達任何資訊 —— canvas 讀不出來，色覺障礙也看不出差別。
//
// 六色全部從全站同一組墨水裡調（赭石與墨綠就是畫面上的重點色與主要動作色），
// 圓餅圖才不會引進外來色相把暖色紙面拉回藍白後台。明度也刻意拉開，
// 印成灰階或色覺障礙者看，靠深淺一樣分得出來。
export const CATEGORIES = [
  { id: 'food', name: '飲食', color: '#9A4F20' }, // 赭石
  { id: 'transport', name: '交通', color: '#245C4A' }, // 墨綠
  { id: 'daily', name: '日用', color: '#6B7A52' }, // 苔綠
  { id: 'entertainment', name: '娛樂', color: '#5D5480' }, // 靛
  { id: 'medical', name: '醫療', color: '#8E3B4A' }, // 玫瑰
  { id: 'other', name: '其他', color: '#8A8377' }, // 暖灰
]

const NAME_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category.name]))
const COLOR_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category.color]))

// 對不到的 id 回傳原字串，讓那一列還是顯示得出來，不要整個畫面壞掉。
export function getCategoryName(id) {
  return NAME_BY_ID.get(id) ?? id
}

// 同樣要有 fallback：對不到就給暖灰，圓餅圖才不會缺一塊沒顏色的扇形。
export function getCategoryColor(id) {
  return COLOR_BY_ID.get(id) ?? '#B8AFA0'
}
