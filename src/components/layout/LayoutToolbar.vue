<script setup lang="ts">
import type { LayoutDirection } from '@/composables/useLayout'
import type { EditorType, EditorFile } from '@/composables/useEditor'
import DeviceSelector from '@/components/preview/DeviceSelector.vue'

defineProps<{
  direction: LayoutDirection
  files: EditorFile[]
  activeFileId: string
  editorType: EditorType
  isResponsiveMode?: boolean
  selectedDeviceId?: string
  isLandscape?: boolean
  customWidth?: number
  customHeight?: number
}>()

const emit = defineEmits<{
  toggleDirection: []
  setActiveFile: [fileId: string]
  addFile: [language: 'html' | 'css' | 'javascript' | 'typescript' | 'vue']
  removeFile: [fileId: string]
  setEditorType: [type: EditorType]
  resetCode: []
  toggleResponsiveMode: []
  selectDevice: [deviceId: string]
  toggleLandscape: []
  setCustomSize: [width: number, height: number]
}>()

const editors: { value: EditorType; label: string }[] = [
  { value: 'monaco', label: 'Monaco (VSCode)' },
  { value: 'codemirror', label: 'CodeMirror' },
]

const addFileOptions: { value: 'html' | 'css' | 'javascript' | 'typescript' | 'vue'; label: string }[] = [
  { value: 'html', label: '+ HTML' },
  { value: 'css', label: '+ CSS' },
  { value: 'javascript', label: '+ JS' },
  { value: 'typescript', label: '+ TS' },
  { value: 'vue', label: '+ Vue' },
]

function getFileIcon(language: string): string {
  const icons: Record<string, string> = {
    html: '📄',
    css: '🎨',
    javascript: '📜',
    typescript: '📘',
    vue: '💚',
  }
  return icons[language] ?? '📄'
}
</script>

<template>
  <header class="toolbar">
    <div class="toolbar-left">
      <span class="logo">⚡ Playground</span>
    </div>
    <div class="toolbar-center">
      <div class="file-tabs">
        <div
          v-for="file in files"
          :key="file.id"
          :class="['file-tab', { active: file.id === activeFileId }]"
          @click="emit('setActiveFile', file.id)"
        >
          <span class="file-icon">{{ getFileIcon(file.language) }}</span>
          <span class="file-name">{{ file.name }}</span>
          <button
            v-if="files.length > 1"
            class="file-close"
            title="关闭文件"
            @click.stop="emit('removeFile', file.id)"
          >
            ×
          </button>
        </div>
        <div class="file-add">
          <select
            class="add-select"
            @change="emit('addFile', ($event.target as HTMLSelectElement).value as any)"
          >
            <option value="" disabled selected>+</option>
            <option v-for="opt in addFileOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="toolbar-right">
      <DeviceSelector
        :is-responsive-mode="isResponsiveMode ?? false"
        :selected-device-id="selectedDeviceId ?? 'desktop'"
        :is-landscape="isLandscape ?? false"
        :custom-width="customWidth ?? 375"
        :custom-height="customHeight ?? 667"
        @toggle-responsive-mode="emit('toggleResponsiveMode')"
        @select-device="emit('selectDevice', $event)"
        @toggle-landscape="emit('toggleLandscape')"
        @set-custom-size="emit('setCustomSize', $event[0], $event[1])"
      />
      <select
        class="select"
        :value="editorType"
        @change="emit('setEditorType', ($event.target as HTMLSelectElement).value as EditorType)"
      >
        <option v-for="e in editors" :key="e.value" :value="e.value">{{ e.label }}</option>
      </select>
      <button
        class="btn btn-icon"
        title="重置当前文件为默认"
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
  overflow-x: auto;
}
.logo {
  color: #cdd6f4;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

/* File tabs */
.file-tabs {
  display: flex;
  gap: 2px;
  align-items: center;
  padding: 4px 0;
}
.file-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #313244;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-size: 0.8rem;
  color: #a6adc8;
  transition: all 0.15s;
  white-space: nowrap;
  max-width: 120px;
}
.file-tab:hover {
  background: #45475a;
  color: #cdd6f4;
}
.file-tab.active {
  background: #6366f1;
  color: #fff;
}
.file-icon {
  font-size: 0.7rem;
}
.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-close {
  display: none;
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  margin-left: 2px;
}
.file-tab:hover .file-close,
.file-tab.active .file-close {
  display: block;
}
.file-close:hover {
  color: #f38ba8;
}

/* Add file button */
.file-add {
  margin-left: 2px;
}
.add-select {
  appearance: none;
  background: #313244;
  border: none;
  border-radius: 4px;
  color: #a6adc8;
  font-size: 0.9rem;
  font-weight: bold;
  width: 28px;
  height: 28px;
  cursor: pointer;
  text-align: center;
  padding: 0;
}
.add-select:hover {
  background: #45475a;
  color: #cdd6f4;
}
.add-select option {
  background: #1e1e2e;
  color: #cdd6f4;
  font-size: 0.8rem;
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

/* 移动端 */
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
  .file-tab {
    padding: 3px 8px;
    font-size: 0.75rem;
    max-width: 80px;
  }
  .file-icon {
    display: none;
  }
}

@media (max-width: 400px) {
  .select {
    display: none;
  }
}
</style>
