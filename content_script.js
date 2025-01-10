chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SHOW_FLOWER_RESULT") {
      const { labels } = message.payload;
  
      let overlay = document.getElementById("flower-detector-overlay");
      if (overlay) {
        overlay.remove();
      }
  
      // オーバーレイ
      overlay = document.createElement("div");
      overlay.id = "flower-detector-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "10px";
      overlay.style.right = "10px";
      overlay.style.padding = "10px";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      overlay.style.color = "#fff";
      overlay.style.zIndex = 999999;
  
      const text = labels.map(label => 
        `${label.description} (${(label.score * 100).toFixed(1)}%)`
      ).join("\n");
  
      overlay.innerText = text;
  
      document.body.appendChild(overlay);

      setTimeout(() => overlay.remove(), 5000);
    }
  });
  