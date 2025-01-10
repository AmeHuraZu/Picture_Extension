import { API_KEY } from "./apikey.js";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "visionMenu",
    title: "この画像をVision APIで解析",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "visionMenu") {

    const imageUrl = info.srcUrl;

    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;


    const requestBody = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl
            }
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 5
            }
          ]
        }
      ]
    };

    try {

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();

      const labelAnnotations = data?.responses?.[0]?.labelAnnotations || [];
      if (labelAnnotations.length === 0) {

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("解析結果がありませんでした。")
        });
        return;
      }


      const resultText = labelAnnotations
        .map(label => `${label.description} (${(label.score * 100).toFixed(1)}%)`)
        .join("\n");


      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => alert(text),
        args: [resultText]
      });

    } catch (error) {
      console.error("Vision API error:", error);

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => alert("Vision API呼び出し時にエラーが発生しました。")
      });
    }
  }
});
