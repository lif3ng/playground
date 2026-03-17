import { computed, type Ref } from 'vue'
import type { SupportedLanguage } from './useEditor'

const CONSOLE_INTERCEPT = `
<script>
(function() {
  const _log = console.log.bind(console);
  const _warn = console.warn.bind(console);
  const _error = console.error.bind(console);
  function appendLog(type, args) {
    const el = document.getElementById('__console');
    if (!el) return;
    const line = document.createElement('div');
    line.className = 'log-' + type;
    line.textContent = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    el.appendChild(line);
  }
  console.log = (...a) => { _log(...a); appendLog('log', a); };
  console.warn = (...a) => { _warn(...a); appendLog('warn', a); };
  console.error = (...a) => { _error(...a); appendLog('error', a); };
  window.addEventListener('error', e => appendLog('error', [e.message]));
})();
<\/script>
`

const CONSOLE_STYLES = `
<style>
#__console {
  position: fixed; bottom: 0; left: 0; right: 0;
  max-height: 120px; overflow-y: auto;
  background: #1e1e1e; color: #d4d4d4;
  font-family: monospace; font-size: 12px;
  padding: 4px 8px; border-top: 1px solid #333;
}
.log-log { color: #d4d4d4; }
.log-warn { color: #f59e0b; }
.log-error { color: #ef4444; }
</style>
`

const CONSOLE_DOM = `<div id="__console"></div>`

function wrapHtml(code: string): string {
  return `${code}\n${CONSOLE_INTERCEPT}${CONSOLE_STYLES}${CONSOLE_DOM}`
}

function wrapCss(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>${code}</style>
${CONSOLE_STYLES}
</head>
<body>
<div style="padding:1rem;font-family:sans-serif">
  <p style="color:#6b7280;font-size:0.875rem">CSS 预览 — 在代码中添加 HTML 元素来查看效果</p>
  <h1>标题 Heading 1</h1>
  <h2>标题 Heading 2</h2>
  <p>段落文字 Paragraph text</p>
  <a href="#">链接 Link</a>
  <button>按钮 Button</button>
  <ul><li>列表项 1</li><li>列表项 2</li></ul>
</div>
${CONSOLE_DOM}
</body>
</html>`
}

function wrapJs(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
${CONSOLE_STYLES}
</head>
<body>
${CONSOLE_INTERCEPT}
<script>
try {
${code}
} catch(e) {
  console.error(e.message)
}
<\/script>
${CONSOLE_DOM}
</body>
</html>`
}

function wrapTs(code: string): string {
  // TypeScript 在浏览器中无法直接运行，提示需要构建
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">${CONSOLE_STYLES}</head>
<body>
${CONSOLE_INTERCEPT}
<div style="padding:2rem;font-family:monospace;background:#1e1e1e;color:#d4d4d4;min-height:100vh">
  <p style="color:#f59e0b;margin-bottom:1rem">⚠ TypeScript 需要编译后才能运行，以下为源码预览：</p>
  <pre style="white-space:pre-wrap">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</div>
${CONSOLE_DOM}
</body>
</html>`
}

function wrapVue(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
${CONSOLE_STYLES}
</head>
<body>
${CONSOLE_INTERCEPT}
<div id="app"></div>
<script type="module">
try {
  // Simple Vue SFC runner — handles basic <template>/<script setup>/<style>
  const src = ${JSON.stringify(code)};
  const templateMatch = src.match(/<template>([\\s\\S]*?)<\/template>/);
  const scriptMatch = src.match(/<script[^>]*>([\\s\\S]*?)<\/script>/);
  const styleMatch = src.match(/<style[^>]*>([\\s\\S]*?)<\/style>/);

  if (styleMatch) {
    const style = document.createElement('style');
    style.textContent = styleMatch[1];
    document.head.appendChild(style);
  }

  const template = templateMatch ? templateMatch[1].trim() : '<div>No template found</div>';
  const scriptSrc = scriptMatch ? scriptMatch[1] : '';

  // Execute setup script in module context
  const blob = new Blob([
    scriptSrc + '\n; const __setup = typeof setup !== "undefined" ? setup : () => ({}); window.__vueSetup = __setup;'
  ], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const mod = await import(url);
  URL.revokeObjectURL(url);

  const { createApp, ref, reactive, computed, onMounted } = Vue;
  const app = createApp({ template, setup: mod.default ?? (() => ({})) });
  app.mount('#app');
} catch(e) {
  console.error('Vue error: ' + e.message);
  document.getElementById('app').innerHTML = '<p style="color:red">Error: ' + e.message + '</p>';
}
<\/script>
${CONSOLE_DOM}
</body>
</html>`
}

export function usePreview(code: Ref<string>, language: Ref<SupportedLanguage>) {
  const previewHtml = computed(() => {
    const c = code.value
    switch (language.value) {
      case 'html': return wrapHtml(c)
      case 'css': return wrapCss(c)
      case 'javascript': return wrapJs(c)
      case 'typescript': return wrapTs(c)
      case 'vue': return wrapVue(c)
      default: return wrapHtml(c)
    }
  })

  return { previewHtml }
}
