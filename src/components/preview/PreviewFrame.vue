<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  html: string
}>()

const iframeRef = ref<HTMLIFrameElement | null>(null)
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.html, (html) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  loading.value = true
  debounceTimer = setTimeout(() => {
    if (iframeRef.value) {
      iframeRef.value.srcdoc = html
    }
    loading.value = false
  }, 300)
}, { immediate: true })
</script>

<template>
  <div class="preview-wrap">
    <div class="preview-header">
      <span class="preview-label">预览</span>
      <span v-if="loading" class="preview-loading">刷新中...</span>
    </div>
    <iframe
      ref="iframeRef"
      class="preview-frame"
      sandbox="allow-scripts allow-same-origin allow-modals"
      frameborder="0"
      title="Code Preview"
    />
  </div>
</template>

<style scoped>
.preview-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #fff;
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
  height: 28px;
}
.preview-label {
  font-weight: 600;
  color: #374151;
}
.preview-loading {
  color: #6366f1;
}
.preview-frame {
  flex: 1;
  width: 100%;
  border: none;
  background: #fff;
}
</style>
