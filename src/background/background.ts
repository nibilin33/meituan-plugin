// 使用 chrome.alarms API 设置周期任务
// 在 background.js 中监听 onAlarm，对所有 meituan.com 页面执行 content.js
// 插件安装时自动启动定时器

chrome.runtime.onInstalled.addListener(() => {
    //chrome.alarms.create("periodicScrape", { periodInMinutes: 30 }); // 每 30 分钟触发一次
    console.log("插件已安装");
});
/*
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
*/ 
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
    if(msg.type === "COLLECT_DATA") {
      console.log("收集数据：", msg.data);
      // 处理收集的数据
      // 例如发送到服务器或存储在本地存储中
      chrome.storage.local.set({ collectedData: msg.data });
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId && changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
    // await injectBuildDomTree(tabId);
    chrome.debugger.attach({ tabId }, '1.3', () => {
      chrome.debugger.sendCommand({ tabId }, 'Network.enable');
      chrome.debugger.onEvent.addListener(async (source, method, params:any) => {
        // Network.requestWillBeSent params.request.url  params.request.requestId  Network.dataReceived  Network.responseReceived 
        // console.log('Debugger event:', method, params,source);
        if (method === 'Network.responseReceived') {
          const requestId = params.requestId; // 确保路径正确
          const isTargeturl = params.response.url.startsWith('https://xczdkt200.xc.yuntaitec.com/xingchengedu/coursesignup/findall');
          console.log("目标请求",isTargeturl,params.response.url,params)
          if (!requestId) {
            console.error('Request ID not found in response params',params);
            return;
          }
          if(!isTargeturl) {
            return;
          }
          // 获取响应的具体内容
          chrome.debugger.sendCommand(
            { tabId },
            'Network.getResponseBody',
            { requestId },
            (response:any) => {
              if (chrome.runtime.lastError) {
                console.error('Failed to get response body:', chrome.runtime.lastError.message);
              } else {
                console.log('Response body:', response.body); // 响应内容
              }
            }
          );
        }
      });
    });
  }
});
