const { XMLParser } = require("fast-xml-parser");

exports.handler = async (event) => {
    try {
        // 紀錄請求的相關資訊
//         console.log("Event body received:", event.body);

        // 確認 event.body 是否存在
        if (!event.body) {
            throw new Error("Event body is missing.");
        }

        // 對 Base64 資料進行解碼
        const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
        console.log("Decoded body:", decodedBody);

        // 提取 XML 資料
        const plistStart = '<?xml version="1.0"';
        const plistEnd = '</plist>';

        const startIndex = decodedBody.indexOf(plistStart);
        const endIndex = decodedBody.indexOf(plistEnd);

        if (startIndex === -1 || endIndex === -1) {
            throw new Error("XML not found in the decoded body.");
        }

        const xmlData = decodedBody.substring(startIndex, endIndex + plistEnd.length).trim();
        console.log("Extracted XML data:", xmlData);

        // 清除 DTD 定義（fast-xml-parser 無法處理 DTD）
        const cleanedXmlData = xmlData.replace(/<!DOCTYPE[^>]*>/g, '').trim();
        console.log("Cleaned XML data:", cleanedXmlData);

        // 解析 XML
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseTagValue: true,
        });
        const parsedData = parser.parse(cleanedXmlData);
        console.log("Parsed data:", parsedData);

        // 提取必要的資訊
        const { plist } = parsedData;
        const dict = plist?.dict;
        if (!dict) {
            throw new Error("Invalid XML structure: Missing <dict> element.");
        }

        const keys = dict.key;
        const values = dict.string;

        // 確保解析結果正確
        if (!keys || !values || keys.length !== values.length) {
            throw new Error("Invalid XML structure: Keys and values do not match.");
        }

        const result = {};
        keys.forEach((key, index) => {
            result[key] = values[index];
        });

        console.log("Final parsed result:", result);
        
        // 從 Apple_mobile_device_types.txt 讀取設備名稱
        const filePath = path.resolve(__dirname, "Apple_mobile_device_types.txt");
        let deviceName = deviceProduct;

        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, "utf8");

            // 使用正則表達式查找
            const pattern = new RegExp(`^.*${deviceProduct}.*$`, "m");
            const match = fileContents.match(pattern);

            if (match && match[0]) {
                deviceName = match[0].substring(deviceProduct.length + 3).trim();
            }
        } else {
            console.warn(`File not found: ${filePath}`);
        }        

        // 建立重新導向的 URL
        const params = new URLSearchParams({
            UDID: result.UDID || "",
            IMEI: result.IMEI || "",
            DEVICE_PRODUCT: result.PRODUCT || "",
            DEVICE_VERSION: result.VERSION || "",
            DEVICE_NAME: deviceName || "",
        });
        const redirectUrl = `https://ml-webservice.netlify.app/udid/result.html?${params.toString()}`;
        console.log("Redirect URL:", redirectUrl);

        // 回傳 301 狀態碼和 Location 標頭
        return {
            statusCode: 301,
            headers: {
                Location: redirectUrl,
            },
            body: "",
        };
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error processing request.",
                error: error.message,
            }),
        };
    }
};
