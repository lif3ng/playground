<script setup lang="ts">
import type { LayoutDirection } from '@/composables/useLayout'
import type { SupportedLanguage, EditorType } from '@/composables/useEditor'

defineProps<{
  direction: LayoutDirection
  language: SupportedLanguage
  editorType: EditorType
}>()

const emit = defineEmits<{
  toggleDirection: []
  setLanguage: [lang: SupportedLanguage]
  setEditorType: [type: EditorType]
}>()

const languages: { value: SupportedLanguage; label: string }[] = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'vue', label: 'Vue SFC' },
]

const editors: { value: EditorType; label: string }[] = [
  { value: 'monaco', label: 'Monaco (VSCode)' },
  { value: 'codemirror', label: 'CodeMirror' },
]
</script>

<template>
  <header class="toolbar">
    <div class="toolbar-left">
      <span class="logo">⚡ Playground</span>
    </div>
    <div class="toolbar-center">
      <div class="btn-group">
        <button
          v-for="lang in languages"
          :key="lang.value"
          :class="['btn', language === lang.value ? 'btn-active' : 'btn-ghost']"
          @click="emit('setLanguage', lang.value)"
        >
          {{ lang.label }}
        </button>
      </div>
    </div>
    <div class="toolbar-right">
      <select
        class="select"
        :value="editorType"
        @change="emit('setEditorType', ($event.target as HTMLSelectElement).value as EditorType)"
      >
        <option v-for="e in editors" :key="e.value" :value="e.value">{{ e.label }}</option>
      </select>
      <button class="btn btn-icon" :title="direction === 'horizontal' ? '切换为上下布局' : '切换为左右布局'" @click="emit('toggleDirection')">
        <span v-if="direction === 'horizontal'">⬆⬇</span>
        <span v-else>⬅➡</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 44px;
  background: #1e1e2e;
  border-bottom: 1px solid #313244;
  flex-shrink: 0;
  gap: 12px;
}
.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.toolbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.logo {
  color: #cdd6f4;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}
.btn-group {
  display: flex;
  gap: 2px;
  background: #313244;
  border-radius: 6px;
  padding: 2px;
}
.btn {
  padding: 3px 10px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.btn-active {
  background: #6366f1;
  color: #fff;
}
.btn-ghost {
  background: transparent;
  color: #a6adc8;
}
.btn-ghost:hover {
  background: #45475a;
  color: #cdd6f4;
}
.btn-icon {
  background: #313244;
  color: #cdd6f4;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.75rem;
}
.btn-icon:hover {
  background: #45475a;
}
.select {
  background: #313244;
  color: #cdd6f4;
  border: 1px solid #45475a;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  outline: none;
}
.select:hover {
  border-color: #6366f1;
}
</style>
