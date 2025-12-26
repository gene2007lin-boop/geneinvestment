# Personal website (static front-end)

這個儲存庫包含一個純前端的個人網站，部署在 GitHub Pages（不需要後端或資料庫）。

- Deployed URL: https://gene2007lin-boop.github.io/geneinvestment/

網站功能：
- 首頁（自我介紹）
- 專案清單展示
- 技能（Resume）
- 聯絡資訊（mailto）
- 簡單本地「助理」互動（純客戶端範例）

部署說明：
1. 將本專案推上 GitHub（若尚未推送）：

```bash
git add .
git commit -m "Add static personal website"
git push origin main
```

2. 在 GitHub 上啟用 GitHub Pages：
   - 到專案 Settings → Pages，選擇 Branch 為 `main` 並選擇 `/ (root)`，儲存。
   - 幾分鐘後，站點會在上方的網址顯示（或使用上面的預期 URL）。

3. 站點內容位於 repository 根目錄的 `index.html`，如需變更內容，編輯 `index.html` 與 `assets/` 下的檔案，然後重新 push。

快速測試（本地）：可使用簡易靜態伺服器來測試：

```bash
# Python 3
python -m http.server 8000
# 然後開啟 http://localhost:8000
```

檔案列表要點：
- `index.html` — 站點主檔
- `assets/css/styles.css` — 樣式
- `assets/js/app.js` — 前端互動與小型本地助手邏輯
- `data/content.json` — 個人資料與專案清單

如果你要我幫你：
- 將變更 commit + push 到 GitHub（我可以執行）
- 幫你自訂內容（名字、專案、聯絡資訊）

已完成：新增靜態網站檔案並更新 README。
