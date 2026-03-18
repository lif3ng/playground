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

  it('默认激活文件为第一个文件（html）', () => {
    const { activeFile, language } = useEditor()
    expect(activeFile.value?.language).toBe('html')
    expect(language.value).toBe('html')
  })

  it('默认编辑器类型为 monaco', () => {
    const { editorType } = useEditor()
    expect(editorType.value).toBe('monaco')
  })

  it('切换文件后 language 更新', () => {
    const { files, activeFileId, language, setActiveFile } = useEditor()
    const cssFile = files.value.find(f => f.language === 'css')
    expect(cssFile).toBeDefined()
    setActiveFile(cssFile!.id)
    expect(activeFileId.value).toBe(cssFile!.id)
    expect(language.value).toBe('css')
  })

  it('切换文件后代码变为该文件的代码', () => {
    const { files, code, setActiveFile } = useEditor()
    const cssFile = files.value.find(f => f.language === 'css')
    setActiveFile(cssFile!.id)
    expect(code.value).toBe(cssFile!.code)
  })

  it('切换文件后再切回，保留之前编辑的代码', () => {
    const { files, code, saveCode, setActiveFile } = useEditor()
    const htmlFile = files.value.find(f => f.language === 'html')
    const cssFile = files.value.find(f => f.language === 'css')
    
    setActiveFile(htmlFile!.id)
    saveCode('<h1>Custom</h1>')
    setActiveFile(cssFile!.id)
    setActiveFile(htmlFile!.id)
    expect(code.value).toBe('<h1>Custom</h1>')
  })

  it('saveCode 更新 code 并持久化', () => {
    vi.useFakeTimers()
    const { code, saveCode, activeFileId } = useEditor()
    saveCode('<p>test</p>')
    expect(code.value).toBe('<p>test</p>')
    // localStorage 写入有防抖，需要推进定时器
    vi.runAllTimers()
    const saved = localStorage.getItem('playground:editor:files')
    expect(saved).toBeTruthy()
    const files = JSON.parse(saved!)
    const activeFile = files.find((f: any) => f.id === activeFileId.value)
    expect(activeFile?.code).toBe('<p>test</p>')
    vi.useRealTimers()
  })

  it('setEditorType 更新 editorType 并持久化', () => {
    const { editorType, setEditorType } = useEditor()
    setEditorType('codemirror')
    expect(editorType.value).toBe('codemirror')
    expect(localStorage.getItem('playground:editor:type')).toBe('codemirror')
  })

  it('addFile 添加新文件', () => {
    const { files, addFile, setActiveFile } = useEditor()
    const initialCount = files.value.length
    const newId = addFile('vue', 'Test.vue')
    expect(files.value.length).toBe(initialCount + 1)
    const newFile = files.value.find(f => f.id === newId)
    expect(newFile).toBeDefined()
    expect(newFile?.name).toBe('Test.vue')
    expect(newFile?.language).toBe('vue')
  })

  it('removeFile 删除文件', () => {
    const { files, addFile, removeFile } = useEditor()
    const newId = addFile('typescript', 'test.ts')
    const initialCount = files.value.length
    removeFile(newId)
    expect(files.value.length).toBe(initialCount - 1)
    expect(files.value.find(f => f.id === newId)).toBeUndefined()
  })

  it('删除当前激活文件时自动切换到第一个文件', () => {
    const { files, activeFileId, addFile, removeFile, setActiveFile } = useEditor()
    const newId = addFile('typescript', 'test.ts')
    setActiveFile(newId)
    expect(activeFileId.value).toBe(newId)
    removeFile(newId)
    expect(activeFileId.value).toBe(files.value[0].id)
  })

  it('至少保留一个文件', () => {
    const { files, removeFile } = useEditor()
    const initialCount = files.value.length
    // 尝试删除所有文件
    for (let i = 0; i < initialCount; i++) {
      removeFile(files.value[0].id)
    }
    expect(files.value.length).toBeGreaterThanOrEqual(1)
  })

  it('resetCode 重置当前文件代码', () => {
    const { code, saveCode, resetCode, defaultCode, language } = useEditor()
    saveCode('modified code')
    resetCode()
    expect(code.value).toBe(defaultCode[language.value])
  })

  it('非法 localStorage 值会被忽略，使用默认值', () => {
    localStorage.setItem('playground:editor:type', 'invalid-type')
    const { editorType } = useEditor()
    expect(editorType.value).toBe('monaco')
  })
})
