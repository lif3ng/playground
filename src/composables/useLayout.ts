import { ref } from 'vue'

export type LayoutDirection = 'horizontal' | 'vertical'

const STORAGE_KEY = 'playground:layout:direction'

function getDefaultDirection(): LayoutDirection {
  const saved = localStorage.getItem(STORAGE_KEY) as LayoutDirection | null
  if (saved === 'horizontal' || saved === 'vertical') return saved
  // 移动端默认垂直布局
  return window.innerWidth < 600 ? 'vertical' : 'horizontal'
}

export function useLayout() {
  const direction = ref<LayoutDirection>(getDefaultDirection())

  function toggleDirection() {
    direction.value = direction.value === 'horizontal' ? 'vertical' : 'horizontal'
    localStorage.setItem(STORAGE_KEY, direction.value)
  }

  function setDirection(d: LayoutDirection) {
    direction.value = d
    localStorage.setItem(STORAGE_KEY, d)
  }

  return { direction, toggleDirection, setDirection }
}
