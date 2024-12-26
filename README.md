# Meiloon 智能產品開發部測試網站

此專案是由 **Meiloon 智能產品開發部** 開發的測試網站，主要用於測試人員下載應用程式以及設備資料的收集和處理。該網站基於 HTML 和 JavaScript 開發，並使用 Netlify 部署和管理。

## 技術架構

- **前端**：使用純 HTML 和 JavaScript 開發，用於顯示設備資料及進行互動。
- **後端**：使用 [Netlify Functions](https://www.netlify.com/products/functions) 開發後端功能，進行設備資料的處理與儲存。
- **部署平台**：使用 Netlify 進行自動化部署。

## Netlify Functions 開發模式

在本專案中，我們使用 Netlify 提供的 **Serverless Functions** 來處理一些後端邏輯。這些函數在 **Netlify 設定中自動運行**，並且每次當有變更推送到 GitHub 上時，Netlify 會自動重建並部署最新版本的網站及功能。

### 開發流程

1. **編寫函數**：
   Netlify Functions 允許開發者直接在專案目錄中創建 JavaScript 或 Go 檔案，並且這些檔案會自動作為雲端函數運行。這些函數可以處理 API 請求，操作資料，並返回結果。

2. **部署與測試**：
   將函數存放在 `netlify/functions/` 目錄下，並與網站其他資源一同進行部署。當你推送代碼到 GitHub 時，Netlify 會自動偵測到變更並重新部署專案。

3. **測試與調試**：
   可以使用本地 Netlify 開發環境進行測試。在本地開發時，Netlify 提供了 `netlify dev` 命令來啟動本地伺服器，並模擬 Netlify Functions 的運行。

## UDID 開發模式

在本專案中，我們主要處理設備的 **UDID** (設備唯一識別碼)，並將其與其他設備資料一起進行顯示與處理。以下是該部分開發的架構與流程：

### 架構

1. **設備資料收集**：
   使用 HTML 表單將設備資料（例如 UDID、IMEI、設備型號等）傳送給網站。這些資料會被作為 URL 查詢參數傳遞到網站頁面。

2. **資料顯示**：
   透過 JavaScript 解析 URL 查詢參數，並將設備資料顯示在頁面中。這包括了 **UDID**、**IMEI**、**設備型號** 等信息。

3. **裝置持有者輸入**：
   用戶可以在頁面上填寫裝置持有者名稱，並將此資料與設備資料一起發送給後端進行處理。

4. **資料處理**：
   在後端，設備資料將被進一步處理，並儲存或發送給開發者進行分析。

### 流程

1. **設備資料收集**：用戶通過頁面上的輸入框填寫 UDID 和其他設備資料，並在填寫完成後點擊「發送」按鈕。
2. **資料驗證**：當用戶按下「發送」按鈕時，會檢查「裝置持有者」字段是否已填寫，如果未填寫，會顯示提示信息要求用戶輸入。
3. **資料發送**：如果所有欄位都正確填寫，資料將被傳送給後端處理函數，並作進一步操作。
4. **回應處理**：後端會處理發送過來的資料，並根據業務邏輯進行相應的處理（例如，儲存資料、發送郵件或回應其他動作）。

## 如何使用

1. 克隆或下載此專案：
   ```bash
   git clone https://github.com/ML-SPD/ML-SPD.github.io.git

2. 本地測試：
   安裝並啟動 Netlify 開發伺服器：
   ```bash
   npm install -g netlify-cli
   netlify dev
   
3. 推送更新： 當您推送代碼到 GitHub 時，Netlify 會自動進行部署。
4. 訪問網站： 部署完成後，您可以通過 Netlify 提供的 URL 訪問您的網站。
5. 因已經做了連結，協作者應該只需要git commit & push即會自動部署網站。
6. Git流程如下：
   初始化 Git 儲存庫
   若尚未初始化 Git 儲存庫，請執行以下命令：
   ```bash
   git init
   ```

   檢查是否連結到遠端儲存庫：
   ```bash
   git remote -v
   ```

   若未連結，請執行以下命令：
   ```bash
   git remote add origin https://github.com/ML-SPD/ML-SPD.github.io.git
   ```

   可檢查專案變更資訊：
   ```bash
   git status
   ```

   新增檔案到暫存區（將所有檔案新增，請記得cd到程式目錄下）：
   ```bash
   git add .
   ```

   提交變更（提交暫存區的檔案並添加提交訊息）：
   ```bash
   git commit -m "message..."
   ```

   推送變更到 GitHub：
   ```bash
   git push origin main
   ```
