import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useEditor } from '@/composables/useEditor'

// Mock localStorage
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

describe('useEditor', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('默认语言为 html', () => {
    const { language } = useEditor()
    expect(language.value).toBe('html')
  })

  it('默认编辑器类型为 monaco', () => {
    const { editorType } = useEditor()
    expect(editorType.value).toBe('monaco')
  })

  it('切换语言后 language 更新', () => {
    const { language, setLanguage } = useEditor()
    setLanguage('css')
    expect(language.value).toBe('css')
  })

  it('切换语言后代码变为该语言默认代码', () => {
    const { code, language, setLanguage, defaultCode } = useEditor()
    setLanguage('css')
    expect(language.value).toBe('css')
    expect(code.value).toBe(defaultCode['css'])
  })

  it('切换语言后再切回，保留之前编辑的代码', () => {
    const { code, setLanguage, saveCode } = useEditor()
    setLanguage('html')
    saveCode('<h1>Custom</h1>')
    setLanguage('css')
    setLanguage('html')
    expect(code.value).toBe('<h1>Custom</h1>')
  })

  it('saveCode 更新 code 并持久化', () => {
    const { code, saveCode, language } = useEditor()
    saveCode('<p>test</p>')
    expect(code.value).toBe('<p>test</p>')
    expect(localStorage.getItem(`playground:editor:code:${language.value}`)).toBe('<p>test</p>')
  })

  it('setEditorType 更新 editorType 并持久化', () => {
    const { editorType, setEditorType } = useEditor()
    setEditorType('codemirror')
    expect(editorType.value).toBe('codemirror')
    expect(localStorage.getItem('playground:editor:type')).toBe('codemirror')
  })

  it('非法 localStorage 值会被忽略，使用默认值', () => {
    localStorage.setItem('playground:editor:language', 'invalid-lang')
    localStorage.setItem('playground:editor:type', 'invalid-type')
    const { language, editorType } = useEditor()
    expect(language.value).toBe('html')
    expect(editorType.value).toBe('monaco')
  })
})
