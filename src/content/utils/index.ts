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

async function scrapeData() {
  try {
    await waitForElement(".overview-index-card");
    const data = {};

    chrome.runtime.sendMessage({ type: "SHOP_STATS", data });
  } catch (e) {
    console.warn(e);
  }
}
