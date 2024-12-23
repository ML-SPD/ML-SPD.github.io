const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    // 指向 public 資料夾中的檔案
    const filePath = path.join(process.cwd(), 'udid/Apple_mobile_device_types.txt');
    
    // 讀取檔案內容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ content: fileContent }), // 返回檔案內容
    };
  } catch (error) {
    console.error('Error reading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read file' }),
    };
  }
};
