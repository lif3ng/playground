import { ref } from 'vue'

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}

export type SupportedLanguage = 'html' | 'css' | 'javascript' | 'typescript' | 'vue'
export type EditorType = 'monaco' | 'codemirror'

const VALID_LANGUAGES: SupportedLanguage[] = ['html', 'css', 'javascript', 'typescript', 'vue']
const VALID_EDITOR_TYPES: EditorType[] = ['monaco', 'codemirror']

const STORAGE_KEY_LANG = 'playground:editor:language'
const STORAGE_KEY_TYPE = 'playground:editor:type'
const STORAGE_KEY_CODE_PREFIX = 'playground:editor:code:'

export const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  html: `<!DOCTYPE html>
<html>
<head>
  <title>Hello</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>`,
  css: `body {
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  color: white;
  font-family: sans-serif;
}

h1 {
  font-size: 3rem;
}`,
  javascript: `// Hello, Playground!
const greet = (name) => {
  console.log(\`Hello, \${name}!\`)
  document.body.innerHTML = \`<h1>Hello, \${name}!</h1>\`
}

greet('World')`,
  typescript: `// TypeScript Playground
const greet = (name: string): string => {
  return \`Hello, \${name}!\`
}

document.body.innerHTML = \`<h1>\${greet('World')}</h1>\``,
  vue: `<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const message = ref('Hello, Vue!')
const count = ref(0)
<\/script>

<style>
.app {
  font-family: sans-serif;
  text-align: center;
  padding: 2rem;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
<\/style>`,
}

function safeReadLang(): SupportedLanguage {
  const val = localStorage.getItem(STORAGE_KEY_LANG)
  return VALID_LANGUAGES.includes(val as SupportedLanguage)
    ? (val as SupportedLanguage)
    : 'html'
}

function safeReadEditorType(): EditorType {
  const val = localStorage.getItem(STORAGE_KEY_TYPE)
  return VALID_EDITOR_TYPES.includes(val as EditorType)
    ? (val as EditorType)
    : 'monaco'
}

function loadCodeForLang(lang: SupportedLanguage): string {
  return localStorage.getItem(STORAGE_KEY_CODE_PREFIX + lang) ?? DEFAULT_CODE[lang]
}

export function useEditor() {
  const language = ref<SupportedLanguage>(safeReadLang())
  const editorType = ref<EditorType>(safeReadEditorType())
  const code = ref<string>(loadCodeForLang(language.value))

  function setLanguage(lang: SupportedLanguage) {
    // Save current code before switching
    localStorage.setItem(STORAGE_KEY_CODE_PREFIX + language.value, code.value)
    language.value = lang
    // Restore saved code for the new language, or fall back to default
    code.value = loadCodeForLang(lang)
    localStorage.setItem(STORAGE_KEY_LANG, lang)
  }

  function setEditorType(type: EditorType) {
    editorType.value = type
    localStorage.setItem(STORAGE_KEY_TYPE, type)
  }

  // localStorage 写入防抖，避免每次按键都触发 IO
  const persistCode = debounce((lang: SupportedLanguage, c: string) => {
    localStorage.setItem(STORAGE_KEY_CODE_PREFIX + lang, c)
  }, 500)

  function saveCode(c: string) {
    code.value = c
    persistCode(language.value, c)
  }

  function resetCode() {
    const defaultCode = DEFAULT_CODE[language.value]
    saveCode(defaultCode)
  }

  return {
    code,
    language,
    editorType,
    setLanguage,
    setEditorType,
    saveCode,
    resetCode,
    defaultCode: DEFAULT_CODE,
  }
}
