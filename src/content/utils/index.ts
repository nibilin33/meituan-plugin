function waitForElement(selector: string, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      }
    }, 300);
    setTimeout(() => {
      clearInterval(timer);
      reject("Timeout waiting for element: " + selector);
    }, timeout);
  });
}

// 轻量网络请求函数
export async function fetchData(url: string, data: any) {
  try {
    await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return data;
  } catch (error) {
    console.error("网络请求失败:", error);
  }
}
async function scrapeData() {
  try {
    await waitForElement(".overview-index-card");
    const data = {};

    chrome.runtime.sendMessage({ type: "SHOP_STATS", data });
  } catch (e) {
    console.warn(e);
  }
}
