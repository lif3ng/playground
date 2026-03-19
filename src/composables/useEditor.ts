import { ref, computed } from 'vue'

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}

export type SupportedLanguage = 'html' | 'css' | 'javascript' | 'typescript' | 'vue'
export type EditorType = 'monaco' | 'codemirror'

export interface EditorFile {
  id: string
  name: string
  language: SupportedLanguage
  code: string
}

const VALID_LANGUAGES: SupportedLanguage[] = ['html', 'css', 'javascript', 'typescript', 'vue']
const VALID_EDITOR_TYPES: EditorType[] = ['monaco', 'codemirror']

const STORAGE_KEY_FILES = 'playground:editor:files'
const STORAGE_KEY_ACTIVE_FILE = 'playground:editor:activeFile'
const STORAGE_KEY_TYPE = 'playground:editor:type'

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

// 默认文件列表
const DEFAULT_FILES: EditorFile[] = [
  { id: 'html', name: 'index.html', language: 'html', code: DEFAULT_CODE.html },
  { id: 'css', name: 'style.css', language: 'css', code: DEFAULT_CODE.css },
  { id: 'javascript', name: 'main.js', language: 'javascript', code: DEFAULT_CODE.javascript },
]

function safeReadEditorType(): EditorType {
  const val = localStorage.getItem(STORAGE_KEY_TYPE)
  return VALID_EDITOR_TYPES.includes(val as EditorType)
    ? (val as EditorType)
    : 'monaco'
}

function loadFiles(): EditorFile[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FILES)
    if (saved) {
      const files = JSON.parse(saved) as EditorFile[]
      // 确保至少有 html/css/js 三个文件
      const hasHtml = files.some(f => f.language === 'html')
      const hasCss = files.some(f => f.language === 'css')
      const hasJs = files.some(f => f.language === 'javascript')
      if (!hasHtml) files.push({ ...DEFAULT_FILES[0] })
      if (!hasCss) files.push({ ...DEFAULT_FILES[1] })
      if (!hasJs) files.push({ ...DEFAULT_FILES[2] })
      return files
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_FILES.map(f => ({ ...f }))
}

function loadActiveFileId(): string {
  const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_FILE)
  if (saved) return saved
  return 'html' // 默认选中 html
}

export function useEditor() {
  const files = ref<EditorFile[]>(loadFiles())
  const activeFileId = ref<string>(loadActiveFileId())
  const editorType = ref<EditorType>(safeReadEditorType())

  // 当前激活的文件
  const activeFile = computed(() => {
    return files.value.find(f => f.id === activeFileId.value) ?? files.value[0]
  })

  // 当前代码（为了向后兼容，提供 code 和 language）
  const code = computed({
    get: () => activeFile.value?.code ?? '',
    set: (val: string) => {
      const file = files.value.find(f => f.id === activeFileId.value)
      if (file) file.code = val
    }
  })

  const language = computed(() => activeFile.value?.language ?? 'html')

  // 切换激活文件
  function setActiveFile(fileId: string) {
    activeFileId.value = fileId
    localStorage.setItem(STORAGE_KEY_ACTIVE_FILE, fileId)
  }

  // 添加新文件
  function addFile(language: SupportedLanguage, name?: string): string {
    const id = `${language}-${Date.now()}`
    const fileName = name ?? getDefaultFileName(language)
    const newFile: EditorFile = {
      id,
      name: fileName,
      language,
      code: DEFAULT_CODE[language],
    }
    files.value.push(newFile)
    persistFiles()
    return id
  }

  // 删除文件（至少保留一个）
  function removeFile(fileId: string) {
    if (files.value.length <= 1) return
    const index = files.value.findIndex(f => f.id === fileId)
    if (index === -1) return
    files.value.splice(index, 1)
    // 如果删除的是当前激活文件，切换到第一个
    if (activeFileId.value === fileId) {
      activeFileId.value = files.value[0].id
      localStorage.setItem(STORAGE_KEY_ACTIVE_FILE, activeFileId.value)
    }
    persistFiles()
  }

  function setEditorType(type: EditorType) {
    editorType.value = type
    localStorage.setItem(STORAGE_KEY_TYPE, type)
  }

  // localStorage 写入防抖，避免每次按键都触发 IO
  const persistFiles = debounce(() => {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files.value))
  }, 500)

  function saveCode(c: string) {
    code.value = c
    persistFiles()
  }

  function resetCode() {
    const file = files.value.find(f => f.id === activeFileId.value)
    if (file) {
      file.code = DEFAULT_CODE[file.language]
      persistFiles()
    }
  }

  // 重置所有文件到默认
  function resetAllFiles() {
    files.value = DEFAULT_FILES.map(f => ({ ...f }))
    activeFileId.value = 'html'
    persistFiles()
    localStorage.setItem(STORAGE_KEY_ACTIVE_FILE, 'html')
  }

  // 设置所有文件（用于从 URL 分享恢复）
  function setFiles(newFiles: EditorFile[]) {
    files.value = newFiles
    activeFileId.value = newFiles[0]?.id ?? 'html'
    persistFiles()
    localStorage.setItem(STORAGE_KEY_ACTIVE_FILE, activeFileId.value)
  }

  return {
    files,
    activeFileId,
    activeFile,
    code,
    language,
    editorType,
    setActiveFile,
    addFile,
    removeFile,
    setEditorType,
    saveCode,
    resetCode,
    resetAllFiles,
    setFiles,
    defaultCode: DEFAULT_CODE,
  }
}

function getDefaultFileName(lang: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    html: 'index.html',
    css: 'style.css',
    javascript: 'main.js',
    typescript: 'main.ts',
    vue: 'App.vue',
  }
  return names[lang]
}
