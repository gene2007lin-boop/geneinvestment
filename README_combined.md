# 個人網站（靜態）

這個儲存庫是一個純前端的個人網站範本，包含一個 client-side 的「AI 助手」（本地文字相似度匹配）。無需後端或資料庫，適合透過 GitHub Pages 部署並公開瀏覽。

- Deployed URL: https://gene2007lin-boop.github.io/geneinvestment/

主要功能
- 首頁（自我介紹）
- 專案清單展示
- 技能（Resume）
- 聯絡資訊（可 mailto）
- 本地 AI 助手：語音/文字輸入、簡易搜尋、生成 Email 範本、摘要

主要檔案
- `index.html` — 站點主檔
- `assets/css/styles.css` — 樣式
- `assets/js/app.js` — 前端互動與本地助手邏輯
- `data/content.json` — 個人資料與專案清單（可編輯）

快速部署（GitHub Pages）
1. 建立或使用現有 GitHub 儲存庫，將此專案推到 `main` 分支：

```bash
git add .
git commit -m "Add static personal website"
git push origin main
```

2. 在 GitHub 專案 Settings → Pages：
   - Source 選擇 Branch: `main`，Folder: `/ (root)`，然後 Save。數分鐘後站點會啟用。

3. 若需本地測試：

```bash
# Python 3
python -m http.server 8000
# 然後開啟 http://localhost:8000
```

如何編輯個人資訊
- 編輯 `data/content.json` 的 `name`、`tagline`、`about`、`projects`、`skills`、`contact`、`faq`。
- 儲存並 push 到 GitHub，Pages 會自動更新。

進階說明（AI 助手）
- 助手在瀏覽器內以簡單的斷詞 + 詞頻（TF）與 cosine similarity 計算相似度，並回傳最相關的段落。此實作為本地運行，不會將資料傳送到外部服務。

需要我代為處理的項目（可選）
- 幫你把個人內容（名字、Email、專案敘述）更新到 `data/content.json` 並 push。
- 幫你啟用 GitHub Pages（需要你在 GitHub 上授權或我可提供指令）。
