import React from "react";
import ReactDOM from "react-dom/client";
import "./content.css";
import ContentApp from "./ContentApp";
import {
  fetchData
} from './utils/index';

const collectUrls = ['coursesignup/findall','doudianorder/findall']
const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);
// 监听来自注入脚本的消息
window.addEventListener("message", (event) => {
  // 根据消息类型处理
  if (event.data.type === "XHR_SEND") {
    if(!collectUrls.some((url) => event.data.url.startsWith(url))) {
      console.log("不需要收集的请求",event.data.url);
      return;
    }
    console.log("收到注入脚本的 XHR 请求数据:", event.data.data);
    console.log("XHR 请求url:", event.data.url);
    // todo 上报数据 fetchData
    fetchData('https://example.com/api', event.data.data)
  }
});
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ContentApp />
  </React.StrictMode>
);
