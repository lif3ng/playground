import { computed, type Ref } from 'vue'
import type { SupportedLanguage } from './useEditor'

// Console intercept via postMessage — safer than DOM injection
const CONSOLE_INTERCEPT = `<script>
(function() {
  const _log = console.log.bind(console);
  const _warn = console.warn.bind(console);
  const _error = console.error.bind(console);
  function send(type, args) {
    try {
      window.parent.postMessage({
        source: 'playground-preview',
        type: 'console',
        payload: {
          type: type,
          args: args.map(a => {
            try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
            catch(e) { return String(a); }
          }).join(' ')
        }
      }, '*');
    } catch(e) {}
  }
  console.log = (...a) => { _log(...a); send('log', a); };
  console.warn = (...a) => { _warn(...a); send('warn', a); };
  console.error = (...a) => { _error(...a); send('error', a); };
  window.addEventListener('error', e => send('error', [e.message]));
  window.addEventListener('unhandledrejection', e => send('error', [String(e.reason)]));
})();
<\/script>`

const BASE_HEAD = `<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">`

function wrapHtml(code: string): string {
  // Inject console intercept before closing body
  if (code.includes('</body>')) {
    return code.replace('</body>', `${CONSOLE_INTERCEPT}\n</body>`)
  }
  return `${code}\n${CONSOLE_INTERCEPT}`
}

function wrapCss(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
${BASE_HEAD}
<style>${code}</style>
</head>
<body>
${CONSOLE_INTERCEPT}
<div style="padding:1rem;font-family:sans-serif">
  <p style="color:#6b7280;font-size:0.875rem">CSS 预览 — 在代码中添加 HTML 元素来查看效果</p>
  <h1>标题 Heading 1</h1>
  <h2>标题 Heading 2</h2>
  <p>段落文字 Paragraph text</p>
  <a href="#">链接 Link</a>
  <button>按钮 Button</button>
  <ul><li>列表项 1</li><li>列表项 2</li></ul>
</div>
</body>
</html>`
}

function wrapJs(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
${BASE_HEAD}
</head>
<body>
${CONSOLE_INTERCEPT}
<script>
try {
${code}
} catch(e) {
  console.error(e.message);
}
<\/script>
</body>
</html>`
}

function wrapTs(_code: string): string {
  return `<!DOCTYPE html>
<html>
<head>${BASE_HEAD}</head>
<body>
${CONSOLE_INTERCEPT}
<div style="padding:2rem;font-family:sans-serif;color:#6b7280;text-align:center">
  <h2 style="color:#f59e0b">⚠️ TypeScript</h2>
  <p>TypeScript 需要编译后才能在浏览器中运行。</p>
  <p>当前预览模式不支持 TS 编译，请使用 JavaScript 模式。</p>
</div>
</body>
</html>`
}

function wrapVue(src: string): string {
  return `<!DOCTYPE html>
<html>
<head>
${BASE_HEAD}
<script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
</head>
<body>
${CONSOLE_INTERCEPT}
<div id="app"></div>
<script type="module">
try {
  const { createApp, ref, reactive, computed, onMounted, watch, nextTick } = Vue;
  const src = ${JSON.stringify(src)};
  const templateMatch = src.match(/<template>([\\s\\S]*?)<\/template>/);
  const scriptMatch = src.match(/<script[^>]*setup[^>]*>([\\s\\S]*?)<\/script>/) ||
                      src.match(/<script[^>]*>([\\s\\S]*?)<\/script>/);
  const styleMatch = src.match(/<style[^>]*>([\\s\\S]*?)<\/style>/);

  if (styleMatch) {
    const style = document.createElement('style');
    style.textContent = styleMatch[1];
    document.head.appendChild(style);
  }

  const template = templateMatch ? templateMatch[1].trim() : '<div>No template</div>';
  let setupFn = () => ({});

  if (scriptMatch) {
    const scriptBody = scriptMatch[1]
      .replace(/import\s+.*?from\s+['"]vue['"];?/g, '')
      .replace(/import\s+.*?;?/g, '');
    try {
      setupFn = new Function('ref', 'reactive', 'computed', 'onMounted', 'watch', 'nextTick', scriptBody + '\nreturn typeof setup !== "undefined" ? setup() : {};')(ref, reactive, computed, onMounted, watch, nextTick);
      if (typeof setupFn !== 'function') {
        const result = setupFn;
        setupFn = () => result || {};
      }
    } catch(e) {
      console.warn('Script parse warning:', e.message);
    }
  }

  createApp({ template, setup: setupFn }).mount('#app');
} catch(e) {
  console.error('Vue error: ' + e.message);
  document.getElementById('app').innerHTML = '<p style="color:red">Error: ' + e.message + '</p>';
}
<\/script>
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
