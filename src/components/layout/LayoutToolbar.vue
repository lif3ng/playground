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
  resetCode: []
}>()

const languages: { value: SupportedLanguage; label: string; shortLabel: string }[] = [
  { value: 'html', label: 'HTML', shortLabel: 'HTML' },
  { value: 'css', label: 'CSS', shortLabel: 'CSS' },
  { value: 'javascript', label: 'JavaScript', shortLabel: 'JS' },
  { value: 'typescript', label: 'TypeScript', shortLabel: 'TS' },
  { value: 'vue', label: 'Vue SFC', shortLabel: 'Vue' },
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
          :title="lang.label"
          @click="emit('setLanguage', lang.value)"
        >
          <span class="label-full">{{ lang.label }}</span>
          <span class="label-short">{{ lang.shortLabel }}</span>
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
      <button
        class="btn btn-icon"
        title="重置代码为默认"
        @click="emit('resetCode')"
      >
        ↺
      </button>
      <button
        class="btn btn-icon"
        :title="direction === 'horizontal' ? '切换为上下布局' : '切换为左右布局'"
        @click="emit('toggleDirection')"
      >
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
  gap: 8px;
  min-width: 0;
}
.toolbar-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.toolbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
}
.logo {
  color: #cdd6f4;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.btn-group {
  display: flex;
  gap: 2px;
  background: #313244;
  border-radius: 6px;
  padding: 2px;
  overflow: hidden;
}
.btn {
  padding: 3px 10px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
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
  flex-shrink: 0;
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
  max-width: 130px;
}
.select:hover {
  border-color: #6366f1;
}
/* 移动端：隐藏 logo 和完整标签，显示短标签 */
.label-short { display: none; }
.label-full { display: inline; }

@media (max-width: 600px) {
  .toolbar {
    padding: 0 8px;
    height: 40px;
  }
  .logo {
    display: none;
  }
  .select {
    max-width: 90px;
    font-size: 0.72rem;
  }
  .btn {
    padding: 3px 7px;
    font-size: 0.75rem;
  }
  .label-full { display: none; }
  .label-short { display: inline; }
}

@media (max-width: 400px) {
  .select {
    display: none;
  }
}
</style>
