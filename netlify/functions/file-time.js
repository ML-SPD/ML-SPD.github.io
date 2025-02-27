const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // 取得查詢參數中的 filename
    const params = new URLSearchParams(event.queryStringParameters);
    const filename = params.get('filename');

    if (!filename) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing filename parameter' }),
        };
    }

    // 限制檔名，防止任意路徑讀取（安全性考量）
    const allowedFiles = ['mlcontrol.plist', 'app-release.apk', 'Apple_mobile_device_types.txt'];
    if (!allowedFiles.includes(filename)) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'File access not allowed' }),
        };
    }

    // 組合檔案路徑（根據 Netlify 部署的資料夾結構調整）
    const filePath = path.join(process.cwd(), 'udid', filename);

    try {
        const stats = fs.statSync(filePath); // 取得檔案的統計信息
        const lastModified = stats.mtime.toISOString(); // 轉換為 ISO 格式的時間

        return {
            statusCode: 200,
            body: JSON.stringify({ lastModified }), // 返回 JSON 格式
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error reading file' }),
        };
    }
};
