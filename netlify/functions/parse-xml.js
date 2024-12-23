const { XMLParser } = require("fast-xml-parser");
const fs = require("fs");
const path = require("path");

// let fetch;
// (async () => {
//   fetch = (await import('node-fetch')).default;
// })();

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
//         console.log("Decoded body:", decodedBody);

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
        
        const deviceProduct = result.PRODUCT || "";
        const udid = result.UDID || "";
        const deviceVersion = result.VERSION || "";
        
        let deviceName = deviceProduct;
        
        // 從 Apple_mobile_device_types.txt 讀取設備名稱
	    const filePath = path.join(process.cwd(), 'udid/Apple_mobile_device_types.txt');	    
        console.log("deviceProduct:", deviceProduct);

        if (fs.existsSync(filePath)) {
			const fileContents = fs.readFileSync(filePath, "utf8");
			console.log("fileContents:",fileContents);		
		
			// 使用正則表達式查找對應的行
			const pattern = new RegExp(`^${deviceProduct}\\s*:\\s*(.+)$`, "m");
			const match = fileContents.match(pattern);
		
			if (match && match[1]) {
				deviceName = match[1].trim(); // 提取冒號後的名稱部分
			} else {
				console.warn(`Device product "${deviceProduct}" not found in file.`);
			}
		} else {
			console.warn(`File not found: ${filePath}`);
		} 
		
		
// 		exports.handler = async () => {
// 			try {
// 				const response = await fetch("https://ml-webservice.netlify.app/udid/Apple_mobile_device_types.txt");
// 				const fileContents = await response.text();
// 				console.log("fileContents:",fileContents)
// 	
// 				let deviceName = deviceProduct;
// 		
// 				// 使用正則表達式查找對應的行
// 				const pattern = new RegExp(`^${deviceProduct}\\s*:\\s*(.+)$`, "m");
// 				const match = fileContents.match(pattern);
// 			
// 				if (match && match[1]) {
// 					deviceName = match[1].trim(); // 提取冒號後的名稱部分
// 				} else {
// 					console.warn(`Device product "${deviceProduct}" not found in file.`);
// 				}
// 		
// 				return {
// 			  		statusCode: 200,
// 			  		body: JSON.stringify({ message: "檔案內容已讀取", deviceName }),
// 				};
// 		  	} catch (err) {
// 				return {
// 			  		statusCode: 500,
// 			  		body: JSON.stringify({ error: "檔案讀取失敗", details: err.message }),
// 				};
// 		  	}
// 		};

		

        // 建立重新導向的 URL
        const params = new URLSearchParams({
            UDID: udid,
            IMEI: result.IMEI || "",
            DEVICE_PRODUCT: deviceProduct,
            DEVICE_VERSION: deviceVersion,
            DEVICE_NAME: deviceName,
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
