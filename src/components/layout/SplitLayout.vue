<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LayoutDirection } from '@/composables/useLayout'

const props = defineProps<{
  direction: LayoutDirection
}>()

const STORAGE_KEY = 'playground:layout:split'
const savedSplit = Number(localStorage.getItem(STORAGE_KEY)) || 50
const splitPercent = ref(Math.min(90, Math.max(10, savedSplit)))

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

function startDrag(pos: number, e: { target: EventTarget | null }) {
  dragging = true
  startPos = pos
  startSplit = splitPercent.value
  const container = (e.target as HTMLElement).parentElement!
  const rect = container.getBoundingClientRect()
  containerSize = isHorizontal.value ? rect.width : rect.height
}

function updateDrag(pos: number) {
  if (!dragging) return
  const delta = pos - startPos
  const deltaPercent = (delta / containerSize) * 100
  splitPercent.value = Math.round(Math.min(90, Math.max(10, startSplit + deltaPercent)) * 10) / 10
}

function endDrag() {
  if (!dragging) return
  dragging = false
  localStorage.setItem(STORAGE_KEY, String(splitPercent.value))
}

// Mouse
function onDividerMousedown(e: MouseEvent) {
  startDrag(isHorizontal.value ? e.clientX : e.clientY, e)
  document.body.style.userSelect = 'none'
  document.body.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  updateDrag(isHorizontal.value ? e.clientX : e.clientY)
}

function onMouseUp() {
  endDrag()
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

// Touch
function onDividerTouchstart(e: TouchEvent) {
  const touch = e.touches[0]
  startDrag(isHorizontal.value ? touch.clientX : touch.clientY, e)
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  const touch = e.touches[0]
  updateDrag(isHorizontal.value ? touch.clientX : touch.clientY)
}

function onTouchEnd() {
  endDrag()
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
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
      @touchstart.passive="onDividerTouchstart"
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
  background: #313244;
  transition: background 0.15s;
  flex-shrink: 0;
  z-index: 10;
  position: relative;
}
.split-divider::after {
  content: '';
  position: absolute;
  background: transparent;
}
.divider-h {
  width: 4px;
  cursor: col-resize;
}
.divider-h::after {
  top: 0; bottom: 0;
  left: -4px; right: -4px;
}
.divider-v {
  height: 4px;
  cursor: row-resize;
}
.divider-v::after {
  left: 0; right: 0;
  top: -4px; bottom: -4px;
}
.split-divider:hover,
.split-divider:active {
  background: #6366f1;
}
</style>
