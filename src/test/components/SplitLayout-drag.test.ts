import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SplitLayout from '@/components/layout/SplitLayout.vue'

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

describe('SplitLayout 拖动问题测试', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  afterEach(() => {
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  })

  it('鼠标拖动：完整流程测试', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    
    await divider.trigger('mousedown', { clientX: 500, clientY: 300 })
    
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 600, clientY: 300 }))
    await wrapper.vm.$nextTick()
    
    const panes = wrapper.findAll('.split-pane')
    
    document.dispatchEvent(new MouseEvent('mouseup'))
    await wrapper.vm.$nextTick()
    
    expect((panes[0].element as HTMLElement).style.width).not.toBe('50%')
  })

  it('Touch 拖动：完整流程测试', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    
    await divider.trigger('touchstart', { touches: [{ clientX: 500, clientY: 300 }] })
    
    const touchMoveEvent = new TouchEvent('touchmove', {
      touches: [{ clientX: 600, clientY: 300 } as any],
      cancelable: true,
    })
    document.dispatchEvent(touchMoveEvent)
    await wrapper.vm.$nextTick()
    
    const panes = wrapper.findAll('.split-pane')
    
    document.dispatchEvent(new TouchEvent('touchend'))
    await wrapper.vm.$nextTick()
    
    expect((panes[0].element as HTMLElement).style.width).not.toBe('50%')
  })

  it('拖动结束时 body 样式应该清除', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    
    await divider.trigger('mousedown', { clientX: 500, clientY: 300 })
    document.dispatchEvent(new MouseEvent('mouseup'))
    await wrapper.vm.$nextTick()
    
    expect(document.body.style.userSelect).toBe('')
    expect(document.body.style.cursor).toBe('')
  })

  it('按 Escape 键应该取消拖动并恢复原始位置', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    
    await divider.trigger('mousedown', { clientX: 500, clientY: 300 })
    
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 700, clientY: 300 }))
    await wrapper.vm.$nextTick()
    
    const panes = wrapper.findAll('.split-pane')
    const movedWidth = (panes[0].element as HTMLElement).style.width
    expect(movedWidth).not.toBe('50%')
    
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    
    expect((panes[0].element as HTMLElement).style.width).toBe('50%')
    expect(document.body.style.userSelect).toBe('')
    expect(document.body.style.cursor).toBe('')
  })

  it('窗口失焦(blur)时应该清理拖动状态', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    
    await divider.trigger('mousedown', { clientX: 500, clientY: 300 })
    
    expect(document.body.style.userSelect).toBe('none')
    expect(document.body.style.cursor).toBe('col-resize')
    
    window.dispatchEvent(new Event('blur'))
    await wrapper.vm.$nextTick()
    
    expect(document.body.style.userSelect).toBe('')
    expect(document.body.style.cursor).toBe('')
  })

  it('touchcancel 时应该恢复原始位置', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    
    await divider.trigger('touchstart', { touches: [{ clientX: 500, clientY: 300 }] })
    
    const touchMoveEvent = new TouchEvent('touchmove', {
      touches: [{ clientX: 700, clientY: 300 } as any],
      cancelable: true,
    })
    document.dispatchEvent(touchMoveEvent)
    await wrapper.vm.$nextTick()
    
    const panes = wrapper.findAll('.split-pane')
    expect((panes[0].element as HTMLElement).style.width).not.toBe('50%')
    
    document.dispatchEvent(new TouchEvent('touchcancel'))
    await wrapper.vm.$nextTick()
    
    expect((panes[0].element as HTMLElement).style.width).toBe('50%')
    expect(document.body.style.userSelect).toBe('')
  })

  it('touch 拖动也应该设置 body 样式防止文字选中', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    
    await divider.trigger('touchstart', { touches: [{ clientX: 500, clientY: 300 }] })
    
    expect(document.body.style.userSelect).toBe('none')
    expect(document.body.style.cursor).toBe('col-resize')
    
    document.dispatchEvent(new TouchEvent('touchend'))
    await wrapper.vm.$nextTick()
    
    expect(document.body.style.userSelect).toBe('')
    expect(document.body.style.cursor).toBe('')
  })

  it('重复 mousedown 不应该导致状态混乱', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    
    await divider.trigger('mousedown', { clientX: 500, clientY: 300 })
    await divider.trigger('mousedown', { clientX: 500, clientY: 300 })
    
    document.dispatchEvent(new MouseEvent('mouseup'))
    await wrapper.vm.$nextTick()
    
    expect(document.body.style.userSelect).toBe('')
    expect(document.body.style.cursor).toBe('')
  })
})
