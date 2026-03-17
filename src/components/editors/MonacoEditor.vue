<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import loader from '@monaco-editor/loader'
import type { SupportedLanguage } from '@/composables/useEditor'

const props = defineProps<{
  code: string
  language: SupportedLanguage
}>()

const emit = defineEmits<{
  'update:code': [code: string]
}>()

const containerRef = ref<HTMLDivElement | null>(null)
let editor: any = null
let monaco: any = null
let isInternalChange = false

// Map our language types to Monaco language IDs
const LANG_MAP: Record<SupportedLanguage, string> = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
  typescript: 'typescript',
  vue: 'html',
}

onMounted(async () => {
  // Use loader which handles workers via CDN by default
  monaco = await loader.init()

  if (!containerRef.value) return

  editor = monaco.editor.create(containerRef.value, {
    value: props.code,
    language: LANG_MAP[props.language],
    theme: 'vs-dark',
    fontSize: 14,
    fontFamily: '"Cascadia Code", "Fira Code", Menlo, Monaco, Consolas, monospace',
    fontLigatures: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    renderLineHighlight: 'line',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    padding: { top: 12, bottom: 12 },
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  })

  editor.onDidChangeModelContent(() => {
    if (!isInternalChange) {
      emit('update:code', editor.getValue())
    }
  })
})

// Sync code from parent
watch(() => props.code, (newCode) => {
  if (editor && editor.getValue() !== newCode) {
    isInternalChange = true
    editor.setValue(newCode)
    isInternalChange = false
  }
})

// Sync language
watch(() => props.language, (lang) => {
  if (editor && monaco) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, LANG_MAP[lang])
    }
  }
})

onBeforeUnmount(() => {
  editor?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="monaco-container" />
</template>

<style scoped>
.monaco-container {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
