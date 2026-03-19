<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps<{
  html: string
  previewWidth?: number | '100%'
  previewHeight?: number | '100%'
  isResponsiveMode?: boolean
}>()

export interface ConsoleLog {
  type: 'log' | 'warn' | 'error'
  args: string
  timestamp: number
}

const iframeRef = ref<HTMLIFrameElement | null>(null)
const loading = ref(false)
const consoleLogs = ref<ConsoleLog[]>([])
const showConsole = ref(true)
const error = ref<string | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

// 计算预览区样式
const previewContainerStyle = computed(() => {
  if (!props.isResponsiveMode) {
    return {}
  }

  const w = props.previewWidth
  const h = props.previewHeight

  return {
    width: typeof w === 'number' ? `${w}px` : w,
    height: typeof h === 'number' ? `${h}px` : h,
    maxWidth: '100%',
    margin: '0 auto',
  }
})

const isFixedSizeMode = computed(() => {
  return props.isResponsiveMode && 
    typeof props.previewWidth === 'number' && 
    typeof props.previewHeight === 'number'
})

const displaySizeText = computed(() => {
  if (!props.isResponsiveMode) return ''
  const w = props.previewWidth
  const h = props.previewHeight
  if (w === '100%' && h === '100%') return '100%'
  return `${w}×${h}`
})

// Handle postMessage from iframe
// srcdoc iframe without allow-same-origin has origin 'null'
function onMessage(event: MessageEvent) {
  // srcdoc iframe without allow-same-origin has origin 'null' (string) or '' in jsdom
  const allowedOrigins = ['null', '', window.location.origin]
  if (!allowedOrigins.includes(event.origin)) return
  if (!event.data || event.data.source !== 'playground-preview') return
  const { type, payload } = event.data
  if (type === 'console') {
    consoleLogs.value.push({
      type: payload.type,
      args: payload.args,
      timestamp: Date.now(),
    })
    // Keep max 200 lines
    if (consoleLogs.value.length > 200) {
      consoleLogs.value.splice(0, consoleLogs.value.length - 200)
    }
  } else if (type === 'error') {
    error.value = payload.message
  } else if (type === 'clear') {
    consoleLogs.value = []
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  if (debounceTimer) clearTimeout(debounceTimer)
})

watch(() => props.html, (html) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  loading.value = true
  error.value = null
  debounceTimer = setTimeout(() => {
    consoleLogs.value = []
    if (iframeRef.value) {
      iframeRef.value.srcdoc = html
    }
    loading.value = false
  }, 350)
}, { immediate: true })

function refresh() {
  consoleLogs.value = []
  error.value = null
  if (iframeRef.value) {
    iframeRef.value.srcdoc = props.html
  }
}

function clearConsole() {
  consoleLogs.value = []
}
</script>

<template>
  <div class="preview-wrap">
    <!-- Header -->
    <div class="preview-header">
      <span class="preview-label">预览</span>
      <span v-if="displaySizeText" class="preview-size">{{ displaySizeText }}</span>
      <div class="preview-actions">
        <span v-if="loading" class="preview-loading">刷新中...</span>
        <button class="action-btn" title="刷新" @click="refresh">↺</button>
        <button
          class="action-btn"
          :class="{ active: showConsole }"
          title="切换控制台"
          @click="showConsole = !showConsole"
        >
          >\_
        </button>
      </div>
    </div>

    <!-- Error banner -->
    <div v-if="error" class="preview-error">
      <span class="error-icon">⚠</span> {{ error }}
    </div>

    <!-- Preview area with responsive container -->
    <div class="preview-body" :class="{ 'responsive-mode': isResponsiveMode }">
      <div class="preview-container" :style="previewContainerStyle">
        <iframe
          ref="iframeRef"
          class="preview-frame"
          :class="{ 'with-console': showConsole && consoleLogs.length > 0, 'fixed-size': isFixedSizeMode }"
          sandbox="allow-scripts allow-modals allow-popups"
          frameborder="0"
          title="Code Preview"
        />
      </div>
    </div>

    <!-- Console panel -->
    <Transition name="console-slide">
      <div v-if="showConsole && consoleLogs.length > 0" class="console-panel">
        <div class="console-header">
          <span>控制台 ({{ consoleLogs.length }})</span>
          <button class="clear-btn" @click="clearConsole">清空</button>
        </div>
        <div class="console-body">
          <div
            v-for="(log, i) in consoleLogs"
            :key="i"
            class="console-line"
            :class="`console-${log.type}`"
          >
            <span class="console-type">{{ log.type === 'log' ? '▸' : log.type === 'warn' ? '⚠' : '✕' }}</span>
            <span class="console-text">{{ log.args }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.preview-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #fff;
  overflow: hidden;
}
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.78rem;
  color: #6b7280;
  flex-shrink: 0;
  height: 32px;
}
.preview-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.8rem;
}
.preview-size {
  font-family: monospace;
  font-size: 0.72rem;
  color: #6366f1;
  background: #ede9fe;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 8px;
}
.preview-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.preview-loading {
  color: #6366f1;
  font-size: 0.75rem;
}
.action-btn {
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 1px 7px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s;
}
.action-btn:hover {
  background: #e5e7eb;
  color: #374151;
}
.action-btn.active {
  background: #ede9fe;
  border-color: #a78bfa;
  color: #7c3aed;
}
.preview-error {
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.78rem;
  padding: 4px 12px;
  flex-shrink: 0;
}
.error-icon {
  margin-right: 4px;
}

/* Preview body - supports responsive mode */
.preview-body {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.preview-body.responsive-mode {
  background: #f9fafb;
  padding: 16px;
}

.preview-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.preview-body.responsive-mode .preview-container {
  flex: none;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.preview-frame {
  flex: 1;
  width: 100%;
  border: none;
  background: #fff;
  min-height: 0;
}

.preview-frame.fixed-size {
  flex: none;
  height: 100%;
}

/* Console panel */
.console-panel {
  flex-shrink: 0;
  max-height: 180px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e7eb;
  background: #1e1e2e;
}
.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;
  background: #2a2a3e;
  color: #9ca3af;
  font-size: 0.72rem;
  font-family: monospace;
  flex-shrink: 0;
}
.clear-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.7rem;
  cursor: pointer;
  padding: 1px 4px;
}
.clear-btn:hover { color: #e5e7eb; }
.console-body {
  overflow-y: auto;
  flex: 1;
  padding: 4px 0;
}
.console-line {
  display: flex;
  gap: 6px;
  padding: 1px 10px;
  font-size: 0.75rem;
  font-family: monospace;
  line-height: 1.5;
}
.console-log { color: #d4d4d4; }
.console-warn { color: #fbbf24; background: rgba(251,191,36,0.05); }
.console-error { color: #f87171; background: rgba(248,113,113,0.05); }
.console-type { opacity: 0.6; flex-shrink: 0; width: 12px; }
.console-text { word-break: break-all; }
/* Transition */
.console-slide-enter-active,
.console-slide-leave-active {
  transition: max-height 0.2s ease, opacity 0.2s ease;
}
.console-slide-enter-from,
.console-slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
