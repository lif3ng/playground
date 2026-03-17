<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LayoutDirection } from '@/composables/useLayout'

const props = defineProps<{
  direction: LayoutDirection
}>()

const STORAGE_KEY = 'playground:layout:split'
const savedSplit = Number(localStorage.getItem(STORAGE_KEY)) || 50
const splitPercent = ref(savedSplit)

const isHorizontal = computed(() => props.direction === 'horizontal')

const containerStyle = computed(() => ({
  display: 'flex',
  flexDirection: isHorizontal.value ? 'row' : 'column',
  flex: '1',
  overflow: 'hidden',
  minHeight: 0,
}))

const firstPaneStyle = computed(() => isHorizontal.value
  ? { width: `${splitPercent.value}%`, minWidth: '10%' }
  : { height: `${splitPercent.value}%`, minHeight: '10%' }
)

const secondPaneStyle = computed(() => isHorizontal.value
  ? { width: `${100 - splitPercent.value}%`, minWidth: '10%' }
  : { height: `${100 - splitPercent.value}%`, minHeight: '10%' }
)

let dragging = false
let startPos = 0
let startSplit = 0
let containerSize = 0

function onDividerMousedown(e: MouseEvent) {
  dragging = true
  startPos = isHorizontal.value ? e.clientX : e.clientY
  startSplit = splitPercent.value
  const container = (e.target as HTMLElement).parentElement!
  const rect = container.getBoundingClientRect()
  containerSize = isHorizontal.value ? rect.width : rect.height
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.body.style.userSelect = 'none'
  document.body.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
}

function onMouseMove(e: MouseEvent) {
  if (!dragging) return
  const pos = isHorizontal.value ? e.clientX : e.clientY
  const delta = pos - startPos
  const deltaPercent = (delta / containerSize) * 100
  const newSplit = Math.min(90, Math.max(10, startSplit + deltaPercent))
  splitPercent.value = Math.round(newSplit * 10) / 10
}

function onMouseUp() {
  dragging = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
  localStorage.setItem(STORAGE_KEY, String(splitPercent.value))
}
</script>

<template>
  <div :style="containerStyle" class="split-layout">
    <div :style="firstPaneStyle" class="split-pane">
      <slot name="left" />
    </div>
    <div
      class="split-divider"
      :class="isHorizontal ? 'divider-h' : 'divider-v'"
      @mousedown="onDividerMousedown"
    />
    <div :style="secondPaneStyle" class="split-pane">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.split-layout {
  width: 100%;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
.split-pane {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.split-divider {
  background: #e5e7eb;
  transition: background 0.15s;
  flex-shrink: 0;
  z-index: 10;
}
.split-divider:hover, .split-divider:active {
  background: #6366f1;
}
.divider-h {
  width: 4px;
  cursor: col-resize;
}
.divider-v {
  height: 4px;
  cursor: row-resize;
}
</style>
