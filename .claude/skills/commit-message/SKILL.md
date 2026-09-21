---
name: commit-message
description: 當使用者要求 commit、提交或存檔變更時使用。先檢查變更範圍，依本專案格式提出繁體中文 commit 訊息，取得使用者確認後才提交。
---

# commit 訊息規範

格式：`<型別>: <一句話描述做了什麼>`

## 型別

- feat：新功能
- fix：修 bug
- style：視覺調整（不動邏輯）
- docs：文件（SPEC、DESIGN、CLAUDE.md 等）
- refactor：重構（行為不變）
- test：測試
- chore：雜務（設定、套件等）

## 規則

- 先讀 git status 與 diff，列出預計提交的檔案；不要自動把所有未追蹤檔加入
- 看到 `.env`、金鑰、憑證或無法判斷的檔案就停下來提醒
- 先提出 commit 訊息與範圍，取得使用者確認後才執行 git add 與 git commit
- 描述用繁體中文，講「做了什麼」，不是「改了哪個檔案」
- fix 的描述要帶出原因，方便日後翻歷史
- 一次 commit 對應一件事，混了就先拆

## 範例

- feat: 新增支出統計頁與圓餅圖
- fix: 刪除改用 id 避免排序後 index 錯位