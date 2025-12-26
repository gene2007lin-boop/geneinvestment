# 個人網站（靜態） — 範例

這是一個純前端的個人網站範本，包含一個 client-side 的「AI 助手」（本地文字相似度匹配）。無需後端或資料庫，適合透過 GitHub Pages 部署並公開瀏覽。

網站結構 (主要檔案)
- index.html
- assets/css/styles.css
- assets/js/app.js
- data/content.json

快速部署（GitHub Pages）
1. 建立一個新的 GitHub 儲存庫（或使用現有 repo）。
2. 將上述檔案與資料夾推到 repo 的 `main` branch（或預設分支）。
3. 到 GitHub 項目的 Settings -> Pages：
   - 在 "Source" 選擇 Branch: `main`，Folder: `/ (root)`，然後 Save。
4. 幾分鐘後，網站會在 GitHub Pages 上啟用。預期的 URL（若 repo 名稱為 `geneinvestment` 且使用者為 `gene2007lin-boop`）為：
   - https://gene2007lin-boop.github.io/geneinvestment/

請在完成部署、確認可公網訪問後，把實際網址放在此 README 對應位置（上面那列），以便訪客直接打開。

如何編輯個人資訊
- 打開 `data/content.json` 編輯你的姓名（`name`）、標語（`tagline`）、About、Projects、Skills、Contact 與 FAQ。儲存並推送到 GitHub，Pages 會自動更新。

AI 助手說明（本地）
- 助手在瀏覽器內用簡單的斷詞 + 詞頻（TF）與 cosine similarity 計算相似度，並回傳最相關的段落。可用於回答關於 About / Projects / FAQ 的問題。
- 功能：文字對話、語音輸入（若瀏覽器支援）、將回答轉成 Email 範本、摘要回答（簡單摘取前兩句）。

常見問題
- Q: 需要 API Key 或外部服務嗎？  
  A: 不需要。現有實作全部在 client 端運行，沒有任何外部呼叫。

- Q: 我要讓 AI 更強大怎麼辦？  
  A: 若你希望使用 OpenAI 或其他 LLM，可以透過 GitHub Actions 在建置階段產生內容（需要把 API Key 存為 GitHub Secrets），或設計一個後端代理（但目前範例避免後端以符合你的需求）。

授權
- 你可以自由修改此範例並放到自己的 repo / 部署到 Pages。

如需我替你把檔案打包成一個 ZIP，或產生一個可直接 push 的 GitHub commit 範例，我可以繼續幫你準備。