# 03 — 预览沙盒设计

## 方案：iframe + srcdoc

使用 `<iframe srcdoc="...">` 实现安全隔离的代码预览沙盒。

优点：
- 与主应用完全隔离（CSS/JS 不污染）
- 不需要后端，纯浏览器端运行
- 安全：可通过 `sandbox` 属性限制权限

## iframe 属性配置

```html
<iframe
  :srcdoc="previewHtml"
  sandbox="allow-scripts allow-same-origin"
  frameborder="0"
  style="width:100%;height:100%;"
/>
```

> `allow-scripts`：允许运行 JavaScript  
> `allow-same-origin`：允许访问 localStorage 等 API（可按需去掉）

## 预览 HTML 生成逻辑

根据当前语言类型，将代码包装成完整 HTML 文档注入 iframe：

### HTML 模式

直接将编辑器内容作为完整 HTML 注入：

```
{userCode}
```

### CSS 模式

自动包裹成 HTML + `<style>` 标签：

```html
<!DOCTYPE html>
<html>
<head><style>{userCode}</style></head>
<body>
  <p>CSS 预览示例文本</p>
  <div class="box">Box</div>
</body>
</html>
```

### JavaScript / TypeScript 模式

包裹成 HTML + `<script>` 标签，`console.log` 输出重定向到页面：

```html
<!DOCTYPE html>
<html>
<head><style>body { font-family: monospace; }</style></head>
<body>
<div id="output"></div>
<script>
const output = document.getElementById('output');
const _log = console.log;
console.log = (...args) => {
  output.innerHTML += args.map(String).join(' ') + '<br>';
  _log(...args);
};
// 用户代码
{userCode}
</script>
</body>
</html>
```

### Vue SFC 模式（后续扩展）

通过 `@vue/compiler-sfc` 在浏览器端编译 Vue SFC，生成可执行 JS 后注入。

## 实时刷新

- 监听代码变化（`watch` on `code`）
- 使用 **debounce 300ms** 延迟刷新，避免输入时频繁重绘
- 提供手动刷新按钮（强制立即刷新）

## 错误处理

- 捕获 iframe 内 `window.onerror`，通过 `postMessage` 将错误信息传递给主应用
- 主应用在预览区底部显示错误提示条（红色）
- 运行时错误不影响编辑器正常使用

## 组件接口

```vue
<!-- PreviewFrame.vue -->
<PreviewFrame
  :code="code"
  :language="currentLanguage"
/>
```

## 测试要求

- [ ] 单元测试：`usePreview` — 不同语言类型生成正确的 HTML 包装
- [ ] 单元测试：`usePreview` — debounce 逻辑正确
- [ ] 单元测试：错误捕获与 postMessage 通信
- [ ] 组件测试：`PreviewFrame` 渲染 iframe 且 srcdoc 更新正确
