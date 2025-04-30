// 注入的脚本函数
(function () {
  window.initinjectRequestInterceptor = {
    version: "1.0.0",
  };
  console.log("initinjectRequestInterceptor 版本:", window.initinjectRequestInterceptor.version);
  // 拦截 fetch 请求
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    console.log("拦截到 fetch 请求:", args);
    const response = await originalFetch(...args);
    const clonedResponse = response.clone();
    clonedResponse.text().then((body) => {
      console.log("fetch 响应内容:", body);
    });
    return response;
  };
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM 内容加载完成");
  });
  document.addEventListener("readystatechange", function () {
    if (document.readyState === "complete") {
      console.log("DOM 完全加载和解析完成");
    }
  });
  document.body.style.backgroundColor = "lightblue";
  console.log("页面背景颜色已更改为浅蓝色");
  // 拦截 XMLHttpRequest 请求
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (...args) {
    console.log("拦截到 XMLHttpRequest 请求:", args);
    this.addEventListener("load", function () {
      console.log("XMLHttpRequest 响应内容:", this.responseText);
    });
    originalXhrOpen.apply(this, args);
  };
})();
