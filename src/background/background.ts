console.log("Hello world from bakground script");

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SHOP_STATS") {
      console.log("商家数据：", msg.data);
      chrome.storage.local.set({ todayStats: msg.data });
      // 或者发送到你的后端 API
    }
});