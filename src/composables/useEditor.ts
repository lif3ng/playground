import { ref } from 'vue'

export type SupportedLanguage = 'html' | 'css' | 'javascript' | 'typescript' | 'vue'
export type EditorType = 'monaco' | 'codemirror'

const STORAGE_KEY_LANG = 'playground:editor:language'
const STORAGE_KEY_TYPE = 'playground:editor:type'
const STORAGE_KEY_CODE = 'playground:editor:code'

const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  html: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>`,
  css: `body {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  margin: 0;\n  color: white;\n  font-family: sans-serif;\n}\n\nh1 {\n  font-size: 3rem;\n}`,
  javascript: `// Hello, Playground!\nconst greet = (name) => {\n  console.log(\`Hello, \${name}!\`)\n  document.body.innerHTML = \`<h1>Hello, \${name}!</h1>\`\n}\n\ngreet('World')`,
  typescript: `// TypeScript Playground\nconst greet = (name: string): string => {\n  return \`Hello, \${name}!\`\n}\n\ndocument.body.innerHTML = \`<h1>\${greet('World')}</h1>\``,
  vue: `<template>\n  <div class="app">\n    <h1>{{ message }}</h1>\n    <button @click="count++">Count: {{ count }}</button>\n  </div>\n</template>\n\n<script setup>\nimport { ref } from 'vue'\nconst message = ref('Hello, Vue!')\nconst count = ref(0)\n<\/script>\n\n<style>\n.app {\n  font-family: sans-serif;\n  text-align: center;\n  padding: 2rem;\n}\nbutton {\n  margin-top: 1rem;\n  padding: 0.5rem 1rem;\n  font-size: 1rem;\n}\n<\/style>`,
}

export function useEditor() {
  const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as SupportedLanguage | null
  const savedType = localStorage.getItem(STORAGE_KEY_TYPE) as EditorType | null

  const language = ref<SupportedLanguage>(savedLang ?? 'html')
  const editorType = ref<EditorType>(savedType ?? 'monaco')
  const code = ref<string>(
    localStorage.getItem(STORAGE_KEY_CODE) ?? DEFAULT_CODE[language.value]
  )

  function setLanguage(lang: SupportedLanguage) {
    language.value = lang
    code.value = DEFAULT_CODE[lang]
    localStorage.setItem(STORAGE_KEY_LANG, lang)
    localStorage.removeItem(STORAGE_KEY_CODE)
  }

  function setEditorType(type: EditorType) {
    editorType.value = type
    localStorage.setItem(STORAGE_KEY_TYPE, type)
  }

  function saveCode(c: string) {
    code.value = c
    localStorage.setItem(STORAGE_KEY_CODE, c)
  }

  return {
    code,
    language,
    editorType,
    setLanguage,
    setEditorType,
    saveCode,
    defaultCode: DEFAULT_CODE,
  }
}
