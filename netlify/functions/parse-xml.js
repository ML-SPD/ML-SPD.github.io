const { XMLParser } = require("fast-xml-parser");

exports.handler = async (event) => {
    try {
        // 獲取 POST 傳入的資料
        const data = event.body;

        // 定義 XML 的起始和結束標誌
        const plistBegin = '<?xml version="1.0"';
        const plistEnd = '</plist>';

        // 提取 XML 部分
        const pos1 = data.indexOf(plistBegin);
        const pos2 = data.indexOf(plistEnd) + plistEnd.length;
        const data2 = data.substring(pos1, pos2);

        // 解析 XML
        const parser = new XMLParser();
        const jsonObj = parser.parse(data2);

        // 提取所需數據
        const dict = jsonObj.plist.dict || {};
        const keys = dict.key || [];
        const values = dict.string || [];

        const params = {};
        for (let i = 0; i < keys.length; i++) {
            params[keys[i]] = values[i] || "";
        }

        const UDID = params["UDID"] || "";
        const DEVICE_PRODUCT = params["PRODUCT"] || "";
        const DEVICE_VERSION = params["VERSION"] || "";
        const DEVICE_NAME = params["DEVICE_NAME"] || "";

        // 建立跳轉 URL
        const redirectURL = `https://e-link.goldenvoice.com.tw/app/udid/show_detail.php?UDID=${UDID}&DEVICE_PRODUCT=${DEVICE_PRODUCT}&DEVICE_VERSION=${DEVICE_VERSION}&DEVICE_NAME=${DEVICE_NAME}`;

        return {
            statusCode: 301,
            headers: {
                Location: redirectURL,
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error processing the request: ${error.message}`,
        };
    }
};

