import { describe, it, expect, beforeEach } from 'vitest'
import { useLayout } from '@/composables/useLayout'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = val },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('useLayout', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('默认方向为 horizontal', () => {
    const { direction } = useLayout()
    expect(direction.value).toBe('horizontal')
  })

  it('toggleDirection 从 horizontal 切换到 vertical', () => {
    const { direction, toggleDirection } = useLayout()
    toggleDirection()
    expect(direction.value).toBe('vertical')
  })

  it('toggleDirection 从 vertical 切换回 horizontal', () => {
    const { direction, toggleDirection } = useLayout()
    toggleDirection()
    toggleDirection()
    expect(direction.value).toBe('horizontal')
  })

  it('toggleDirection 持久化到 localStorage', () => {
    const { toggleDirection } = useLayout()
    toggleDirection()
    expect(localStorage.getItem('playground:layout:direction')).toBe('vertical')
  })

  it('setDirection 设置指定方向', () => {
    const { direction, setDirection } = useLayout()
    setDirection('vertical')
    expect(direction.value).toBe('vertical')
  })

  it('setDirection 持久化到 localStorage', () => {
    const { setDirection } = useLayout()
    setDirection('vertical')
    expect(localStorage.getItem('playground:layout:direction')).toBe('vertical')
  })

  it('从 localStorage 读取已保存的方向', () => {
    localStorageMock.setItem('playground:layout:direction', 'vertical')
    const { direction } = useLayout()
    expect(direction.value).toBe('vertical')
  })
})
