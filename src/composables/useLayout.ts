import { ref } from 'vue'

export type LayoutDirection = 'horizontal' | 'vertical'

const STORAGE_KEY = 'playground:layout:direction'

export function useLayout() {
  const saved = localStorage.getItem(STORAGE_KEY) as LayoutDirection | null
  const direction = ref<LayoutDirection>(saved ?? 'horizontal')

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
