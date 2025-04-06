// 使用 chrome.alarms API 设置周期任务
// 在 background.js 中监听 onAlarm，对所有 meituan.com 页面执行 content.js
// 插件安装时自动启动定时器

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("periodicScrape", { periodInMinutes: 30 }); // 每 30 分钟触发一次
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "periodicScrape") {
      chrome.tabs.query({ url: "*://*.meituan.com/*" }, (tabs) => {
        for (const tab of tabs) {
          if (tab.id !== undefined) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["content.js"]
            });
          }
        }
      });
    }
  });
  
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SHOP_STATS") {
      console.log("商家数据：", msg.data);
      // chrome.storage.local.set({ todayStats: msg.data });
      chrome.storage.local.get({ history: [] }, (res) => {
        const updated = [...res.history, msg.data];
        chrome.storage.local.set({ todayStats: msg.data, history: updated });
      });
      // 或者发送到你的后端 API
    }
});