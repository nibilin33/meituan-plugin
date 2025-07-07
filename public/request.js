// 注入的脚本函数
(function () {
  window.initinjectRequestInterceptor = {
    id: "initinjectRequestInterceptor1.0.0",
  };
  const injectStr = `
            var originalXhrSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function (...args) {
             if(args.length > 2){
                this._url = args[1];
              }
              this.addEventListener("load", function () {
                window.parent.postMessage(
                  { type: "XHR_SEND", url: this._url, data: this.responseText },
                  "*"
                );
              });
              return originalXhrSend.apply(this, args);
            };
            var originalXhrOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (...args) {
              if(args.length > 2){
                this._url = args[1];
              }
              this.addEventListener("load", function () {
                window.parent.postMessage({ type: 'XHR_SEND', data: this.responseText, url: this._url }, '*'); // 发送消息到内容脚本
              });
              originalXhrOpen.apply(this, args);
            };
            // 拦截 fetch 请求
            var originalFetch = window.fetch;
            window.fetch = async (...args) => {
              const response = await originalFetch(...args);
              const clonedResponse = response.clone();
              const url = args[0];
              clonedResponse.text().then((body) => {
                window.parent.postMessage({ type: 'XHR_SEND', url: url, data:body }, '*');
              });
              return response;
            };
          `;
  // 定义注入逻辑
  const injectScript = (iframe) => {
    try {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        // 检查是否已经注入过脚本
        if (
          iframeWindow.document.getElementById(
            window.initinjectRequestInterceptor.id
          )
        ) {
          console.log("脚本已存在，跳过注入");
          return;
        }
        // 在 iframe 的上下文中执行脚本
        const script = iframeWindow.document.createElement("script");
        script.id = window.initinjectRequestInterceptor.id;
        script.textContent = injectStr;
        // 将脚本插入到 iframe 的 <head>
        iframeWindow.document.head.appendChild(script);
        console.log("脚本已成功注入到 iframe 的 <head>:", iframe.src);
      } else {
        // 检查是否已经注入过脚本
        if (document.getElementById(window.initinjectRequestInterceptor.id)) {
          console.log("脚本已存在，跳过注入到主文档");
          return;
        }
        const scriptbody = document.createElement("script");
        scriptbody.id = window.initinjectRequestInterceptor.id;
        scriptbody.textContent = injectStr;
        // 将脚本插入到目标节点
        document.head.appendChild(scriptbody);
      }
    } catch (err) {
      console.error("无法注入脚本到 iframe:", err);
    }
  };

  // 检查是否有 iframe
  const iframes = document.querySelectorAll("iframe");
  if (iframes.length === 0) {
    injectScript(document);
    return;
  }
  // 创建 MutationObserver 实例
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.target.tagName === "IFRAME"
      ) {
        if (mutation.attributeName === "src") {
          injectScript(iframe);
        }
      }
    });
  });
  // 开始监听 iframe 的属性变化
  iframes.forEach((iframe) => {
    iframe.addEventListener("load", () => {
      injectScript(iframe);
    });
    observer.observe(iframe, {
      attributes: true,
    });
  });
  console.log("已开始监听 iframe 的变化");
})();
