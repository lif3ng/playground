import { describe, it, expect, beforeEach, vi } from 'vitest'
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

describe('SplitLayout', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('水平方向渲染两个 pane 和分隔条', () => {
    const wrapper = mount(SplitLayout, {
      props: { direction: 'horizontal' },
      slots: {
        left: '<div class="left-content">Left</div>',
        right: '<div class="right-content">Right</div>',
      },
    })
    expect(wrapper.findAll('.split-pane').length).toBe(2)
    expect(wrapper.find('.split-divider').exists()).toBe(true)
    expect(wrapper.find('.left-content').exists()).toBe(true)
    expect(wrapper.find('.right-content').exists()).toBe(true)
  })

  it('水平方向分隔条带 divider-h 类', () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    expect(wrapper.find('.split-divider').classes()).toContain('divider-h')
  })

  it('垂直方向分隔条带 divider-v 类', () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'vertical' } })
    expect(wrapper.find('.split-divider').classes()).toContain('divider-v')
  })

  it('默认 splitPercent 为 50', () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const panes = wrapper.findAll('.split-pane')
    expect((panes[0].element as HTMLElement).style.width).toBe('50%')
    expect((panes[1].element as HTMLElement).style.width).toBe('50%')
  })

  it('从 localStorage 读取已保存的分隔比例', () => {
    localStorageMock.setItem('playground:layout:split', '70')
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const panes = wrapper.findAll('.split-pane')
    expect((panes[0].element as HTMLElement).style.width).toBe('70%')
    expect((panes[1].element as HTMLElement).style.width).toBe('30%')
  })

  it('垂直方向 pane 使用 height 而非 width', () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'vertical' } })
    const panes = wrapper.findAll('.split-pane')
    expect((panes[0].element as HTMLElement).style.height).toBe('50%')
    expect((panes[1].element as HTMLElement).style.height).toBe('50%')
    expect((panes[0].element as HTMLElement).style.width).toBe('')
  })

  it('mousedown 在分隔条上不抛出错误', async () => {
    const wrapper = mount(SplitLayout, { props: { direction: 'horizontal' } })
    const divider = wrapper.find('.split-divider')
    // mock getBoundingClientRect
    vi.spyOn(divider.element.parentElement!, 'getBoundingClientRect').mockReturnValue({
      width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => {},
    })
    await divider.trigger('mousedown', { clientX: 500, clientY: 0 })
    // 没有抛错即通过
    expect(true).toBe(true)
  })
})
