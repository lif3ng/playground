<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'
import type { SupportedLanguage, EditorType } from '@/composables/useEditor'

const FILE_NAME: Record<SupportedLanguage, string> = {
  html: 'index.html',
  css: 'style.css',
  javascript: 'index.js',
  typescript: 'index.ts',
  vue: 'App.vue',
}

const props = defineProps<{
  code: string
  language: SupportedLanguage
  editorType: EditorType
}>()

const emit = defineEmits<{
  'update:code': [code: string]
}>()

// 模块级定义，避免每次组件实例化重建 async component
const MonacoEditor = defineAsyncComponent(() => import('./MonacoEditor.vue'))
const CodeMirrorEditor = defineAsyncComponent(() => import('./CodeMirrorEditor.vue'))

const currentEditor = computed(() =>
  props.editorType === 'monaco' ? MonacoEditor : CodeMirrorEditor
)
</script>

<template>
  <div class="editor-container">
    <div class="editor-header">
      <span class="editor-label">{{ FILE_NAME[language] }}</span>
      <span class="editor-type-badge">{{ editorType === 'monaco' ? 'Monaco' : 'CodeMirror' }}</span>
    </div>
    <div class="editor-body">
      <Suspense>
        <component
          :is="currentEditor"
          :code="code"
          :language="language"
          @update:code="emit('update:code', $event)"
        />
        <template #fallback>
          <div class="editor-loading">编辑器加载中...</div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #1e1e2e;
}
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  background: #181825;
  border-bottom: 1px solid #313244;
  font-size: 0.78rem;
  flex-shrink: 0;
  height: 28px;
}
.editor-label {
  font-weight: 600;
  color: #cdd6f4;
}
.editor-type-badge {
  color: #6c7086;
  font-size: 0.72rem;
}
.editor-body {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.editor-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c7086;
  font-size: 0.875rem;
}
</style>
