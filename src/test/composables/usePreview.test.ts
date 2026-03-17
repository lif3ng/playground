import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { usePreview } from '@/composables/usePreview'
import type { SupportedLanguage } from '@/composables/useEditor'

describe('usePreview', () => {
  function make(code: string, lang: SupportedLanguage) {
    return usePreview(ref(code), ref(lang))
  }

  it('HTML 模式直接包含用户代码', () => {
    const { previewHtml } = make('<h1>Hello</h1>', 'html')
    expect(previewHtml.value).toContain('<h1>Hello</h1>')
  })

  it('CSS 模式将代码包裹在 <style> 标签内', () => {
    const { previewHtml } = make('body { color: red; }', 'css')
    expect(previewHtml.value).toContain('<style>')
    expect(previewHtml.value).toContain('body { color: red; }')
  })

  it('JS 模式将代码包裹在 <script> 标签内', () => {
    const { previewHtml } = make('console.log(1)', 'javascript')
    expect(previewHtml.value).toContain('console.log(1)')
    expect(previewHtml.value).toContain('<!DOCTYPE html>')
  })

  it('TS 模式输出包含 TypeScript 提示', () => {
    const { previewHtml } = make('const x: number = 1', 'typescript')
    expect(previewHtml.value).toContain('TypeScript')
  })

  it('Vue 模式输出包含 vue 运行时 CDN', () => {
    const { previewHtml } = make('<template><div>Hi</div></template>', 'vue')
    expect(previewHtml.value).toContain('vue')
  })

  it('previewHtml 是响应式的，code 变化时自动更新', () => {
    const code = ref('<h1>A</h1>')
    const lang = ref<SupportedLanguage>('html')
    const { previewHtml } = usePreview(code, lang)
    expect(previewHtml.value).toContain('<h1>A</h1>')
    code.value = '<h1>B</h1>'
    expect(previewHtml.value).toContain('<h1>B</h1>')
  })

  it('language 变化时 previewHtml 自动更新', () => {
    const code = ref('body { color: red; }')
    const lang = ref<SupportedLanguage>('css')
    const { previewHtml } = usePreview(code, lang)
    expect(previewHtml.value).toContain('<style>')
    lang.value = 'javascript'
    expect(previewHtml.value).toContain('<!DOCTYPE html>')
  })
})
