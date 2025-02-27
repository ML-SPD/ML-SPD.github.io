const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
// const response = await fetch("https://ml-webservice.netlify.app/udid/Apple_mobile_device_types.txt");
// const filePath = path.join(process.cwd(), 'udid/Apple_mobile_device_types.txt');
//     const filePath = path.join(__dirname, '../../public/file/mlcontrol/mlcontrol.plist');  // 檔案的實際路徑
    const filePath = path.join(process.cwd(), 'file/mlcontrol/app-release.apk');

    try {
        const stats = fs.statSync(filePath);  // 同步讀取檔案的統計信息
        const lastModified = stats.mtime.toISOString();  // 取得修改時間並格式化為 ISO 字符串

        return {
            statusCode: 200,
            body: JSON.stringify({ lastModified }),  // 返回 JSON 格式的時間
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error reading file' }),
        };
    }
};
