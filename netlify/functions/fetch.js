let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();


exports.handler = async () => {
  try {
    const response = await fetch("https://ml-webservice.netlify.app/udid/Apple_mobile_device_types.txt");
//     const response = await fetch("http://localhost:8888/udid/apple_mobile_device_types.txt");
    const fileContents = await response.text();
    console.log("fileContents:",fileContents)
    const deviceProduct = "iPhone14,5";
    let deviceName = deviceProduct;

    // 使用正則表達式查找對應的行
    const pattern = new RegExp(`^${deviceProduct}\\s*:\\s*(.+)$`, "m");
    const match = fileContents.match(pattern);

	if (match && match[1]) {
        deviceName = match[1].trim(); // 提取冒號後的名稱部分
    } else {
        console.warn(`Device product "${deviceProduct}" not found in file.`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "檔案內容已讀取", deviceName }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "檔案讀取失敗", details: err.message }),
    };
  }
};
